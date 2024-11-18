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
                <p className="font-bold text-indigo-800 text-3xl">"در دنگ دان مستقیما با سازنده در ارتباطی!"</p>



                <div className="flex flex-col gap-y-4">

                    <p className="font-bold text-2xl text-gray-700">
                        راه های ارتباطی ما:
                    </p>

                    <div className="footer_socials_container">

                        <Link className="footer_social_link" href={'#'}>
                            <Mail size={18} />
                            <p className="footer_social_link_text">ایمیل</p>
                        </Link>
                        <Link className="footer_social_link" href={'#'}>
                            <Instagram size={18} />
                            <p className="footer_social_link_text">اینستاگرام</p>
                        </Link>
                        <Link className="footer_social_link" href={'#'}>
                            <Send size={18} />
                            <p className="footer_social_link_text">تلگرام</p>
                        </Link>
                        <Link className="footer_social_link" href={'#'}>
                            <Github size={18} />
                            <p className="footer_social_link_text">گیت هاب</p>
                        </Link>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Contact;