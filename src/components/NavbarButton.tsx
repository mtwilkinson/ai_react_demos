type Props = {
    href: string
    name: string
}

function Navbar(props: Props) {
    return (
        <a className={`navButton ${props.href === window.location.pathname ? "border-b-blue-300" : "border-b-blue-950"}`} href={props.href}>
            <p>{props.name}</p>
        </a>
    );
}

export default Navbar;
