from langchain.tools import StructuredTool
from pydantic import BaseModel, Field
import os

retry_number = 1


base_file_path = "../Frontend/src/examples"
backup_file_path = "../Frontend/src/Backups"

class SaveFileArgs(BaseModel):
    file_name: str = Field(description="The name of the file")
    code: str = Field(description="The code to store in the file")

def save_example(thread_id: int, code='') -> str:
    example_path = f"example{thread_id}"
    # Save backup file
    try:
        with open(f"{base_file_path}/{example_path}/Example.tsx", "r", encoding="utf-8") as f:
            content = f.read()
            with open(f"{backup_file_path}/{example_path}/Example.tsx", "w", encoding="utf-8") as g:
                g.write(content)
    except Exception as e:
        print(f"Error reading file: {str(e)}")
    # Update the React file
    if code == '':
        try:
            with open(f"{base_file_path}/{example_path}/test.tsx", "r", encoding="utf-8") as f:
                content = f.read()
                with open(f"{base_file_path}/{example_path}/Example.tsx", "w", encoding="utf-8") as g:
                    g.write(content)
        except Exception as e:
            print(f"Error reading file: {str(e)}")
        return f"Data successfully saved to {example_path}/Example.tsx"
    else:
        with open(f"{base_file_path}/{example_path}/Example.tsx", "w", encoding="utf-8") as f:
            f.write(code)
        return f"Data successfully saved to {example_path}/Example.tsx"

def save_test(file_name: str, code: str) -> str:
    file_path = f"{base_file_path}/{file_name}"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(code)
    return f"Data successfully saved to {file_name}"

def undo_prompt() -> str:
    try:
        for i in range(1, 5):
        # Save backup file
            with open(f"{base_file_path}/example{i}/Example.tsx", "r", encoding="utf-8") as e, open(f"{backup_file_path}/example{i}/Example.tsx", "r", encoding="utf-8") as b:
                backup = b.read()
                example = e.read()
            with open(f"{base_file_path}/example{i}/Example.tsx", "w", encoding="utf-8") as e, open(f"{backup_file_path}/example{i}/Example.tsx", "w", encoding="utf-8") as b:
                e.write(backup)
                b.write(example)
    except Exception as e:
        print(f"Error reading file: {str(e)}")
        return f"Error reading file: {str(e)}"
    return f"successfully reverted the most recent prompt"


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
