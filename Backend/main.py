from fastapi import FastAPI
from pydantic import BaseModel
from AI import prompt_ai
import uvicorn


class Prompt(BaseModel):
    prompt: str


app = FastAPI()


@app.get("/")
def root():
    return {"message": "Hello World"}


@app.post("/api/prompt")
def prompt(prompt: Prompt):
    try:
        prompt_ai(prompt.prompt)
        return {"message": "Prompt sent to AI"}
    except Exception as e:
        return {"message": f"Error: {e}"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001)
