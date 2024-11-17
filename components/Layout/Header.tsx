import { Settings } from "lucide-react";

function Header() {

    return (
        <header className="header">
            <div className="header_right">
                <h1 className="header_title">دنگ دان</h1>
            </div>

            <div className="header_left">
                <button className="header_left_button">
                    <Settings size={30} />
                </button>
            </div>

        </header>
    );
}

export default Header;