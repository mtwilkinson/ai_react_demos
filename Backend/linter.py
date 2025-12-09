import subprocess
import os
from tools import save_to_py

def linter(example_number: int):
    try:
        # Get the path to the Frontend folder (relative to Backend folder)
        frontend_path = os.path.join(os.path.dirname(__file__), "..", "Frontend")
        frontend_path = os.path.abspath(frontend_path)

        # On Windows, use shell=True to access PATH properly
        # Use shell=True so that the command can find npx in the PATH
        result = subprocess.run(
            f"npx eslint ./src/examples/example{example_number}/Example.tsx",
            shell=True,
            capture_output=True,
            text=True,
            check=False,
            cwd=frontend_path
        )
        
        print(result.stdout.strip())
        if result.returncode != 0:
            print("Failed")
            return 0, result.stdout.strip()
        print("success")
        return 1, result.stdout.strip()
    except Exception as e:
        print(e)
        return 0, f"Error: {e}"

def reset_code(example_number: int):
    save_to_py(f"example{example_number}/example.tsx", placeholder_code)

placeholder_code = f"""
import React from 'react';

const Example: React.FC = () => {'{'}
  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-gray-100 p-4">
      <h1>Failed to generate the page</h1>
    </div>
  );
{'}'}

export default Example;
"""