import NavbarButton from "./NavbarButton.tsx";

function Navbar() {

    return (
        <div className="flex h-12 w-screen bg-blue-950 px-16">
            <NavbarButton href={"/"} name={"Homepage"} />
            <NavbarButton href={"/example1"} name={"Example 1"} />
            <NavbarButton href={"/example2"} name={"Example 2"} />
            <NavbarButton href={"/example3"} name={"Example 3"} />
            <NavbarButton href={"/example4"} name={"Example 4"} />
            <NavbarButton href={"/example5"} name={"Example 5"} />
        </div>
    );
}

export default Navbar;
