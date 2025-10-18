import './App.css';
import {Outlet, RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import Example1 from "./examples/example1/Example.tsx";
import Example2 from "./examples/example2/Example.tsx";
import Example3 from "./examples/example3/Example.tsx";
import Example4 from "./examples/example4/Example.tsx";
import Example5 from "./examples/example5/Example.tsx";
import Homepage from "./Homepage.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {
    const router = createBrowserRouter([

        {
            path: "/",
            errorElement: <h2>Something went wrong!</h2>,
            element: <Root />,
            children: [
                {
                    path: "/",
                    errorElement: <h2>Something went wrong!</h2>,
                    element: <Homepage />,
                },
                {
                    path: "/example1",
                    errorElement: <h2>Something went wrong!</h2>,
                    element: <Example1 />,
                },
                {
                    path: "/example2",
                    errorElement: <h2>Something went wrong!</h2>,
                    element: <Example2 />,
                },
                {
                    path: "/example3",
                    errorElement: <h2>Something went wrong!</h2>,
                    element: <Example3 />,
                },
                {
                    path: "/example4",
                    errorElement: <h2>Something went wrong!</h2>,
                    element: <Example4 />,
                },
                {
                    path: "/example5",
                    errorElement: <h2>Something went wrong!</h2>,
                    element: <Example5 />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;

    function Root() {
        return (
            <div className={"h-screen w-screen bg-white flex flex-col items-stretch justify-items-stretch"}>
                <Navbar />
                <Outlet />
            </div>
        );
    }
}

export default App;
