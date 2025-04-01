import Link from "next/link";
import Logo from "../Common/Logo";
import ThemeToggle from "./ThemeToggle";
import ProfileHeader from "./ProfileHeader";

function Header() {
    return (
        <header className="header">
            <div className="header_right">
                <Link
                    href={'/'}
                    className="flex flex-wrap items-center gap-x-2">
                    <Logo />
                    <h1 className="header_title">دنگ دان</h1>
                </Link>
            </div>

            <div className="header_left">
                <ProfileHeader />
                <ThemeToggle />
            </div>

        </header>
    );
}

export default Header;