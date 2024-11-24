import { Zap } from "lucide-react";
import Link from "next/link";

function Landing() {

    return (
        <div className='landing_container'>

            <div className='landing_title_container'>
                <h2 className='primary_text_color text-4xl font-bold'>رایگان،</h2>
                <h2 className='app_text_color text-4xl font-bold'>آسان،</h2>
                <h2 className='primary_text_color text-4xl font-bold'>سریع،</h2>
                <h2 className='app_text_color text-4xl font-bold'>جذاب!</h2>
            </div>

            <p className='app_text_color text-xl mx-auto'>دیگه چی میخوای؟ همین الان شروع کن.</p>

            <Link href={'/dashboard/events'} className='landing_button'>
                <p className='landing_button_text'>بزن بریم!</p>
                <Zap className='landing_button_icon' />
            </Link>
        </div>
    );
}

export default Landing;