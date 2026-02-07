from fastapi import FastAPI, HTTPException
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import os

# Hugging Face model repo (YOUR MODEL)
HF_MODEL_ID = "PrashantKumarSingh/my-finetuned-model"

# Create FastAPI app
app = FastAPI(
    title="Fine-Tuned LLM API",
    description="Developing Inference API for a fine-tuned language model",
    version="1.0"
)

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(HF_MODEL_ID)

# Load model
model = AutoModelForCausalLM.from_pretrained(
    HF_MODEL_ID,
    torch_dtype=torch.float16,
    device_map="auto"
)

# Set evaluation mode
model.eval()

@app.get("/")
def health_check():
    return {
        "status": "running",
        "model": HF_MODEL_ID
    }

@app.post("/generate")
def generate(prompt: str, max_tokens: int = 100):
    try:
        inputs = tokenizer(prompt, return_tensors="pt")
        inputs = inputs.to(model.device)

        with torch.no_grad():
            output = model.generate(
                **inputs,
                max_new_tokens=max_tokens,
                temperature=0.7,
                do_sample=True
            )

        response = tokenizer.decode(
            output[0],
            skip_special_tokens=True
        )

        return {
            "prompt": prompt,
            "response": response
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
