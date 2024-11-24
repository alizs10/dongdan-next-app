import ThemeToggle from "./ThemeToggle";

function Header() {
    return (
        <header className="header">
            <div className="header_right">
                <h1 className="header_title">دنگ دان</h1>
            </div>

            <div className="header_left">
                <ThemeToggle />
            </div>

        </header>
    );
}

export default Header;