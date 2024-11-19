import { Github, Globe, Headset, Info, Instagram, Mail, MapPin, Phone, Send } from "lucide-react";
import Link from "next/link";
import styles from '../../styles/footer-styles.module.css';

function Footer() {
    return (
        <footer className={styles.container}>

            <div className={styles.info}>
                <div className={styles.info_title}>
                    <Info className="size-5 md:size-7 xl:size-6" fontWeight={'bold'} />
                    <h1 className={styles.title}>درباره ما</h1>
                </div>
                <p className={styles.about_quote}>"دیگه از مادرخرج شدن نترس! با دنگ دان، دنگ هرکی رو بدان."</p>
                <p className={styles.about_desc}>دنگ دان یک اپلیکیشن محاسبه ی دنگ هست که کاملا رایگانه و شما رو از هر ابزار محاسبه ی دیگه ای بی نیاز میکنه. واسه ی یه دو دوتا، چهارتای ساده که نیاز نیست خرج بکنی؛ فقط کافیه از دنگ دان استفاده کنی.</p>
            </div>

            <div className={styles.info}>
                <div className={styles.info_title}>
                    <Headset className="size-5 md:size-7 xl:size-6" fontWeight={'bold'} />
                    <h1 className={styles.title}>تماس با ما</h1>
                </div>

                <div className={styles.info_contact_desc}>
                    <div className={styles.info_contact_item}>
                        <div className="flex items-center gap-x-2">
                            <MapPin size={20} />
                            <p className={styles.desc_title}>آدرس:</p>
                        </div>
                        <p className={styles.desc}>تهران</p>
                    </div>
                    <div className={styles.info_contact_item}>
                        <div className="flex items-center gap-x-2">
                            <Mail size={20} />
                            <p className={styles.desc_title}>ایمیل:</p>
                        </div>
                        <p className={styles.desc}>dongdan@mail.com</p>
                    </div>
                    <div className={styles.info_contact_item}>
                        <div className="flex items-center gap-x-2">
                            <Phone size={20} />
                            <p className={styles.desc_title}>تلفن تماس:</p>
                        </div>
                        <p className={styles.desc}>0912-345-6789</p>
                    </div>

                </div>

            </div>

            <div className={styles.info}>
                <div className={styles.info_title}>
                    <Globe className="size-5 md:size-7 xl:size-6" fontWeight={'bold'} />
                    <h1 className={styles.title}>شبکه های اجتماعی</h1>
                </div>
                <div className={styles.socials_container}>

                    <Link className={styles.social_link} href={'#'}>
                        <Instagram size={18} />
                        <p className={styles.social_link_text}>اینستاگرام</p>
                    </Link>
                    <Link className={styles.social_link} href={'#'}>
                        <Send size={18} />
                        <p className={styles.social_link_text}>تلگرام</p>
                    </Link>
                    <Link className={styles.social_link} href={'#'}>
                        <Github size={18} />
                        <p className={styles.social_link_text}>گیت هاب</p>
                    </Link>

                </div>
            </div>

            <p className={styles.copyright}>تمامی حقوق این وب اپلیکیشن متعلق به دنگ دان می باشد و هرگونه کپی برداری پیگرد قانونی دارد.</p>
        </footer>
    );
}

export default Footer;