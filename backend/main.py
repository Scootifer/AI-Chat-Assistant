from fastapi import FastAPI, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
OLLAMA_API = "http://ollama:11434/api/generate"  # Docker internal hostname
N8N_WEBHOOK = "http://n8n:5678"  # Docker internal hostname

# Request body format for chat
class PromptRequest(BaseModel):
    prompt: str
    system: str = "You are an assistant."

@app.post("/api/chat")
def chat(req: PromptRequest):
    def stream_llama3():
        try:
            with requests.post(OLLAMA_API, json={
                "model": "llama3",
                "prompt": req.prompt,
                "system": req.system,
                "stream": True
            }, stream=True) as response:
                response.raise_for_status()
                for line in response.iter_lines():
                    if not line:
                        continue
                    try:
                        data = json.loads(line.decode("utf-8"))
                        if data.get("done"):
                            break
                        token = data.get("response", "")
                        yield token
                    except Exception as e:
                        yield f"[ParseError] {e}\n"
        except Exception as e:
            yield f"[StreamError] {e}\n"

    return StreamingResponse(stream_llama3(), media_type="text/plain")
