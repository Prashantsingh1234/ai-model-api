from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import os

# ------------------------
# CONFIG
# ------------------------
HF_MODEL_ID = "PrashantKumarSingh/my-finetuned-model"
HF_TOKEN = os.getenv("HF_TOKEN")

# ------------------------
# FASTAPI APP
# ------------------------
app = FastAPI(
    title="Fine-Tuned LLM API",
    description="Inference API for a fine-tuned language model",
    version="1.0"
)

# ------------------------
# MIDDLEWARE
# ------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------
# REQUEST SCHEMA
# ------------------------
class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 100

# ------------------------
# LOAD MODEL (CPU SAFE)
# ------------------------
tokenizer = AutoTokenizer.from_pretrained(
    HF_MODEL_ID,
    token=HF_TOKEN
)

model = AutoModelForCausalLM.from_pretrained(
    HF_MODEL_ID,
    token=HF_TOKEN,
    torch_dtype=torch.float32,   # CPU-safe
    device_map="cpu"             # force CPU
)

model.eval()

# ------------------------
# ROUTES
# ------------------------
@app.get("/")
def health_check():
    return {
        "status": "running",
        "model": HF_MODEL_ID
    }

@app.post("/generate")
def generate_text(request: GenerateRequest):
    try:
        inputs = tokenizer(
            request.prompt,
            return_tensors="pt"
        )
        inputs = inputs.to(model.device)

        with torch.no_grad():
            output = model.generate(
                **inputs,
                max_new_tokens=request.max_tokens,
                temperature=0.7,
                do_sample=True
            )

        response = tokenizer.decode(
            output[0],
            skip_special_tokens=True
        )

        return {
            "prompt": request.prompt,
            "response": response
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
