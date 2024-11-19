import Link from 'next/link';
import styles from '../../../styles/dashboard/dashboard-styles.module.css';
import { Github, Instagram, Mail, MoveRight, Send } from 'lucide-react';

function Contact() {
    return (
        <div className={styles.container}>
            <div className={styles.header_container}>

                <div className={styles.header_right}>
                    <Link href={'/dashboard/events'} className={styles.back_button}>
                        <MoveRight className={styles.back_button_icon} />
                    </Link>
                    <h1 className={styles.header_title}>ارتباط با ما</h1>
                </div>
            </div>


            <div className="px-5 py-5 flex flex-col gap-y-8">
                <p className="font-bold text-indigo-800 text-xl md:text-2xl lg:text-3xl">"در دنگ دان مستقیما با سازنده در ارتباطی!"</p>



                <div className="flex flex-col gap-y-4">

                    <p className="font-bold text-lg md:text-xl lg:text-2xl text-gray-700">
                        راه های ارتباطی ما:
                    </p>

                    <div className="flex flex-wrap gap-2 lg:gap-4">

                        <Link className="flex flex-row gap-x-2 items-center px-4 py-2 rounded-full text-gray-700 border border-transparent hover:border-indigo-800 hover:text-indigo-800 transition-all duration-300" href={'#'}>
                            <Mail className='size-5 lg:size-6' />
                            <p className="text-base lg:text-lg">ایمیل</p>
                        </Link>
                        <Link className="flex flex-row gap-x-2 items-center px-4 py-2 rounded-full text-gray-700 border border-transparent hover:border-indigo-800 hover:text-indigo-800 transition-all duration-300" href={'#'}>
                            <Instagram className='size-5 lg:size-6' />
                            <p className="text-base lg:text-lg">اینستاگرام</p>
                        </Link>
                        <Link className="flex flex-row gap-x-2 items-center px-4 py-2 rounded-full text-gray-700 border border-transparent hover:border-indigo-800 hover:text-indigo-800 transition-all duration-300" href={'#'}>
                            <Send className='size-5 lg:size-6' />
                            <p className="text-base lg:text-lg">تلگرام</p>
                        </Link>
                        <Link className="flex flex-row gap-x-2 items-center px-4 py-2 rounded-full text-gray-700 border border-transparent hover:border-indigo-800 hover:text-indigo-800 transition-all duration-300" href={'#'}>
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