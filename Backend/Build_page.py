import threading
from dotenv import load_dotenv
from langchain_xai import ChatXAI
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools import read_file_tool, save_to_py
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel
from linter import linter, reset_code
from Modify_page import Query_Modify_AI


load_dotenv() 

class ResearchResponse(BaseModel):
    file_name: str
    code: str
    tools_used: list[str]


llm = ChatXAI(model="grok-code-fast-1")
parser = PydanticOutputParser(pydantic_object=ResearchResponse)
format_instructions=parser.get_format_instructions()

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
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


Response Structure:
{format_instructions}
Tool Usage: Invoke LangChain tools only when necessary to enhance your response (e.g., search for libraries, execute code snippets). Do not hallucinate information—rely on verified sources.

            """,
        ),
        ("human", "{query}"),
        ("assistant", "{agent_scratchpad}"),
    ]
).partial(format_instructions=parser.get_format_instructions())

tools = [read_file_tool]
agent = create_tool_calling_agent(
    llm=llm,
    prompt=prompt,
    tools=tools
)

print(parser.get_format_instructions())

agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=False)


def Query_AI(thread_id, query):
    try:
        raw_response = agent_executor.invoke({"query": query})
        structured_response = parser.parse(raw_response.get("output"))
        save_to_py(f"example{thread_id}/example.tsx", structured_response.code)
        success, message = linter(thread_id)
        if not success:
            print(f"Thread {thread_id}:")
            print(message)
            Query_Modify_AI(thread_id, f"Fix the following errors: {message}", thread_id)
            success, message = linter(thread_id)
        
        if not success:
            print(f"Thread {thread_id} Failed to generate the page")
            print(message)
            reset_code(thread_id)
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

