import { Zap } from "lucide-react";
import Link from "next/link";

function Landing() {

    return (
        <div className="landing">

            <div className="landing_title_container">
                <h2 className="landing_title">رایگان،</h2>
                <h2 className="landing_title_gray">آسان،</h2>
                <h2 className="landing_title">سریع،</h2>
                <h2 className="landing_title_gray">جذاب!</h2>
            </div>

            <p className="landing_text">دیگه چی میخوای؟ همین الان شروع کن.</p>

            <Link href={'/dashboard/events'} className="landing_button">
                <p className="landing_button_text">بزن بریم!</p>
                <Zap className="size-7" />
            </Link>
        </div>
    );
}

export default Landing;