import {NavLink} from "reactstrap";
import './NavigationBar.css'

function NavigationBar() {
    const currentPath = window.location.pathname;
    const isActive = (path: string) => {
        return path === currentPath;
    };
    return (
        <div className="navbar">
            <h1 className="title">{"Aplikacija za teniske klubove".toUpperCase()}</h1>
            <nav className="nav-links">
                <NavLink className="link" href="/" active={isActive('/')}>{"Početna".toUpperCase()}</NavLink>
                <NavLink className="link" href="/clubs" active={isActive('/clubs')}>{"Klubovi".toUpperCase()}</NavLink>
                <NavLink className="link" href="/coaches" active={isActive('/coaches')}>{"Treneri".toUpperCase()}</NavLink>
                <NavLink className="link" href="/players" active={isActive('/players')}>{"Tenisači".toUpperCase()}</NavLink>
                <NavLink className="link" href="/doubles" active={isActive('/doubles')}>{"Parovi".toUpperCase()}</NavLink>
                <NavLink className="link" href="/tournaments" active={isActive('/tournaments')}>{"Turniri".toUpperCase()}</NavLink>
            </nav>
        </div>
    )
}

export default NavigationBar;