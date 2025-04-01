import { Zap } from "lucide-react";
import Link from "next/link";
import Banner from "./Banner";
import YourComments from "../Main/YourComments";

function Landing() {

    return (

        <div className="grid grid-cols-2 my-20 mb-20 md:mb-44 xl:mb-60">


            <div className="col-span-2 xl:col-span-1 xl:order-1 order-2 mt-20 mx-auto w-full relative">
                <Banner />
            </div>

            <div className='landing_container col-span-2 xl:col-span-1 order-1'>
                <div className='landing_title_container'>
                    <h2 className='primary_text_color text-4xl font-bold'>رایگان،</h2>
                    <h2 className='app_text_color text-4xl font-bold'>آسان،</h2>
                    <h2 className='primary_text_color text-4xl font-bold'>سریع،</h2>
                    <h2 className='app_text_color text-4xl font-bold'>جذاب!</h2>
                </div>

                <p className='app_text_color text-xl mx-auto'>دیگه چی میخوای؟ همین الان شروع کن.</p>

                <Link href={'/dashboard'} className='landing_button'>
                    <p className='landing_button_text'>بزن بریم!</p>
                    <Zap className='landing_button_icon' />
                </Link>
            </div>

            <YourComments />

        </div>
    );
}

export default Landing;