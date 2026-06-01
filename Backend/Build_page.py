import threading
from dotenv import load_dotenv
from langchain_xai import ChatXAI
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from tools import read_file_tool, save_example, save_test, retry_number
from pydantic import BaseModel, Field
from linter import linter, reset_code
from Modify_page import modify_example, query_modify_AI


load_dotenv()

class ResearchResponse(BaseModel):
    file_name: str = Field(description="Always 'test.tsx'.")
    code: str = Field(
        description=(
            "Complete runnable TypeScript/TSX for one React component: imports, "
            "interfaces/types as needed, the component, and export default. "
            "Executable source only—never research notes, suggestions, markdown fences, "
            "or a restatement of the user prompt."
        )
    )
    tools_used: list[str] = Field(description="Tool names invoked, or an empty list.")


SYSTEM_PROMPT = """
You are an AI that creates a single React component file in TypeScript (`.tsx`) for an existing React project that uses Tailwind CSS for styling. The component should represent a fully functional webpage with the following requirements:

1. **File Structure**: Generate a single `.tsx` file containing a React functional component.
2. **TypeScript**: Use TypeScript with proper interfaces for props, state, and event handlers to ensure type safety.
3. **Tailwind CSS**: Apply Tailwind CSS utility classes for responsive, modern, and clean styling, assuming Tailwind is already configured in the project.
4. **React Best Practices**: Write a reusable, modular functional component using JSX, with proper hooks (e.g., `useState`, `useEffect`) for dynamic behavior.
5. **No Forms**: Avoid `<form>` elements with `onSubmit` due to potential sandbox restrictions; use buttons or other interactive elements for user input.
6. **Class Names**: Use `className` instead of `class` for JSX attributes.
7. **Functionality**: Include an interactive feature (e.g., a counter, todo list, or data display) with clear user interaction and state management.
8. **Export**: Ensure the component is exported as the default export for use in an existing React project.
9. **Import**: Ensure all necessary imports are included.
10. **API Calls**: use placeholder functions for the API calls. For get requests, return a hardcoded json object. For post requests, return a hardcoded json object.
11. **size**: Ensure that the page is not scrollable. Do not use h-screen, w-screen, h-full, or w-full. On the outer most div, use flex-grow.

## Structured output (required)
- `file_name`: always `test.tsx`
- `code`: the full `.tsx` file as plain source text—no markdown code fences, no bullet lists, no "suggestions" or research summaries. Implement the design directly in TSX.
- `tools_used`: tools you called, or `[]`

If the user asks you to research patterns or styles, use that only as guidance while writing real component code in `code`. Never put the user's request or your research notes into `code`.

Tool Usage: Invoke LangChain tools only when necessary to enhance your response (e.g., read reference files). Do not hallucinate information—rely on verified sources.
"""


def build_user_message(query: str) -> str:
    return f"""Implement the following as a complete React TypeScript component and put the full `.tsx` source in the structured `code` field:

{query}

The `code` field must be runnable TSX (imports, component with JSX/Tailwind, placeholder API helpers if needed, `export default`)—not a description or comment about what to build."""


def extract_tsx_code(raw: str) -> str:
    text = raw.strip()
    if not text.startswith("```"):
        return text
    lines = text.split("\n")
    if lines[0].startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].strip() == "```":
        lines = lines[:-1]
    return "\n".join(lines).strip()


def is_valid_tsx(code: str) -> bool:
    stripped = code.strip()
    if len(stripped) < 80:
        return False
    lines = [line.strip() for line in stripped.splitlines() if line.strip()]
    if lines and all(line.startswith("//") for line in lines):
        return False
    return any(
        marker in stripped
        for marker in ("import ", "export default", "export ", "<", "React")
    )

llm = ChatXAI(model="grok-code-fast-1")
tools = [read_file_tool]
agent = create_agent(
    model=llm,
    tools=tools,
    system_prompt=SYSTEM_PROMPT,
    response_format=ToolStrategy(ResearchResponse),
)


def Query_AI(thread_id, query):
    user_message = build_user_message(query)
    try:
        for attempt in range(2):
            raw_response = agent.invoke(
                {"messages": [{"role": "user", "content": user_message}]}
            )
            structured_response = raw_response["structured_response"]
            code = extract_tsx_code(structured_response.code)
            if is_valid_tsx(code):
                break
            if attempt == 0:
                user_message = (
                    "Your previous response did not include valid TSX source in `code`. "
                    "Return a complete React component file (imports, JSX, hooks, "
                    "`export default`)—not comments or research text.\n\n"
                    + build_user_message(query)
                )
                continue
            print(f"Thread {thread_id}: agent returned non-TSX content")
            return

        print(code)
        save_test(f"example{thread_id}/test.tsx", code)
        success, message = linter(thread_id)
        if not success:
            print(f"Thread {thread_id}:")
            print(message)
            query_modify_AI(f"Fix the following errors: {message}", thread_id, thread_id, test=True)
            success, message = linter(thread_id)
        if not success:
            print(f"Thread {thread_id} Failed to generate the page")
            print(message)
            reset_code(thread_id)
        else:
            save_example(thread_id)
    except Exception as e:
        print("Error parsing response", e)



num_threads = 5
threads = []

def build_page(query):
    # Create and start multiple numbered threads
    for i in range(num_threads):
        thread = threading.Thread(target=Query_AI, args=(i + 1, query))
        threads.append(thread)
        thread.start()

    # Wait for all threads to complete
    for thread in threads:
        thread.join()

