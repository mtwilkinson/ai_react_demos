from fastapi import FastAPI
from pydantic import BaseModel
from tools import undo_prompt
from Build_page import build_page
from Modify_page import modify_page
import uvicorn


class Prompt(BaseModel):
    prompt: str
    example: int

class Response(BaseModel):
    status: str
    message: str

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Hello World"}


@app.post("/api/prompt", response_model=Response)
def prompt(prompt: Prompt):
    print(prompt)
    try:
        if prompt.example == 0:
            build_page(prompt.prompt)
            return {"status":"Success", "message": "Prompt sent to AI"}
        else:
            modify_page(prompt.prompt, prompt.example)
            return {"status":"Success", "message": "Prompt sent to AI"}
    except Exception as e:
        return {"status":"Failed", "message": f"Error: {e}"}

@app.get("/api/undo")
def undo():
    return {"status":"Success", "message": undo_prompt()}



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3001)
