import Link from 'next/link';
import { Github, Instagram, Mail, MoveRight, Send } from 'lucide-react';

function Contact() {
    return (
        <div className="events_container">
            <div className="event_header_container">

                <div className="event_header_right">
                    <Link href={'/dashboard/events'} className="event_back_button">
                        <MoveRight className="event_back_button_icon" />
                    </Link>
                    <h1 className="event_header_title">ارتباط با ما</h1>
                </div>
            </div>


            <div className="px-5 py-5 flex flex-col gap-y-8">
                <p className="font-bold primary_text_color text-xl md:text-2xl lg:text-3xl">{"در دنگ دان مستقیما با سازنده در ارتباطی!"}</p>



                <div className="flex flex-col gap-y-4">

                    <p className="font-bold text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300">
                        راه های ارتباطی ما:
                    </p>

                    <div className="flex flex-wrap gap-2 lg:gap-4">

                        <Link className="flex flex-row gap-x-2 items-center px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 border border-transparent hover:border-indigo-800 dark:hover:border-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-600 transition-all duration-300" href={'#'}>
                            <Mail className='size-5 lg:size-6' />
                            <p className="text-base lg:text-lg">ایمیل</p>
                        </Link>
                        <Link className="flex flex-row gap-x-2 items-center px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 border border-transparent hover:border-indigo-800 dark:hover:border-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-600 transition-all duration-300" href={'#'}>
                            <Instagram className='size-5 lg:size-6' />
                            <p className="text-base lg:text-lg">اینستاگرام</p>
                        </Link>
                        <Link className="flex flex-row gap-x-2 items-center px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 border border-transparent hover:border-indigo-800 dark:hover:border-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-600 transition-all duration-300" href={'#'}>
                            <Send className='size-5 lg:size-6' />
                            <p className="text-base lg:text-lg">تلگرام</p>
                        </Link>
                        <Link className="flex flex-row gap-x-2 items-center px-4 py-2 rounded-full text-gray-700 dark:text-gray-300 border border-transparent hover:border-indigo-800 dark:hover:border-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-600 transition-all duration-300" href={'#'}>
                            <Github className='size-5 lg:size-6' />
                            <p className="text-base lg:text-lg">گیت هاب</p>
                        </Link>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Contact;