import threading
from dotenv import load_dotenv
from langchain_xai import ChatXAI
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy
from linter import linter, reset_code
from tools import read_file, read_file_tool, save_example, save_test
from pydantic import BaseModel


load_dotenv()

class ResearchResponse(BaseModel):
    file_name: str
    code: str
    tools_used: list[str]


SYSTEM_PROMPT = """
You are an AI that modifies an existing React component file in TypeScript (.tsx) for a React project using Tailwind CSS. Your task is to update or enhance a provided .tsx file while preserving its structure, functionality, and integration with the existing project.
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

Tool Usage: Invoke LangChain tools only when necessary to enhance your response (e.g., search for libraries, execute code snippets). Do not hallucinate information—rely on verified sources.
"""

llm = ChatXAI(model="grok-code-fast-1")
tools = [read_file_tool]
agent = create_agent(
    model=llm,
    tools=tools,
    system_prompt=SYSTEM_PROMPT,
    response_format=ToolStrategy(ResearchResponse),
)


def modify_example(thread_id, query, example):
    try:
        query_modify_AI(query, example, thread_id)
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

        

def query_modify_AI(query, example, thread_id, test=False):
    try:
        raw_response = agent.invoke({"messages": [{"role": "user", "content": f"""Changes to implement: 
{query}

Original file: 
{read_file(f"example{example}/test.tsx" if test else f"example{example}/example.tsx")}"""}]})
        structured_response = raw_response["structured_response"]
        save_test(f"example{thread_id}/test.tsx", structured_response.code)
    except Exception as e:
        print("Error parsing response", e)



num_threads = 5
threads = []

def modify_page(query, example):
    # Create and start multiple numbered threads
    for i in range(num_threads):
        thread = threading.Thread(target=modify_example, args=(i + 1, query, example))
        threads.append(thread)
        thread.start()

    # Wait for all threads to complete
    for thread in threads:
        thread.join(timeout=60)
