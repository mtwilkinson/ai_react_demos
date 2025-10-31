from langchain.tools import StructuredTool
from pydantic import BaseModel, Field
import os

base_file_path = "../Frontend/src/examples"

class SaveFileArgs(BaseModel):
    file_name: str = Field(description="The name of the file")
    code: str = Field(description="The code to store in the file")

def save_to_py(file_name: str, code: str) -> str:
    os.makedirs("base_file_path", exist_ok=True)  # Ensure directory exists
    file_path = f"{base_file_path}/{file_name}"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(code)
    return f"Data successfully saved to {file_name}"

save_tool = StructuredTool.from_function(
    func=save_to_py,
    name="save_to_file",
    description="Saves code to a file. Takes the file name and code as input.",
    args_schema=SaveFileArgs
)

class ReadFileArgs(BaseModel):
    file_name: str = Field(description="The name of the file to read")

def read_file(file_name: str) -> str:
    try:
        with open(f"{base_file_path}/{file_name}", "r", encoding="utf-8") as f:
            content = f.read()
        return content
    except FileNotFoundError:
        return f"Error: File {file_name} not found."
    except Exception as e:
        return f"Error reading file: {str(e)}"

read_file_tool = StructuredTool.from_function(
    func=read_file,
    name="read_file",
    description="Get the code from a file. Takes the file name as input.",
    args_schema=ReadFileArgs
)
