from fastapi import FastAPI
from pydantic import BaseModel
from Build_page import build_page
from Modify_page import modify_page
import uvicorn


class Prompt(BaseModel):
    prompt: str
    example: int


app = FastAPI()


@app.get("/")
def root():
    return {"message": "Hello World"}


@app.post("/api/prompt")
def prompt(prompt: Prompt):
    print(prompt)
    try:
        if prompt.example == 0:
            build_page(prompt.prompt)
            return {"message": "Prompt sent to AI"}
        else:
            modify_page(prompt.prompt, prompt.example)
            return {"message": "Prompt sent to AI"}
    except Exception as e:
        return {"message": f"Error: {e}"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001)
