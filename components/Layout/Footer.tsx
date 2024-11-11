import { Github, Globe, Headset, Info, Instagram, Mail, MapPin, Phone, Send } from "lucide-react";
import Link from "next/link";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer_info">
                <div className="footer_info_title">
                    <Info className="size-5 md:size-7 xl:size-6" fontWeight={'bold'} />
                    <h1 className="footer_title">درباره ما</h1>
                </div>
                <p className="footer_about_quote">"دیگه از مادرخرج شدن نترس! با دنگ دان، دنگ هرکی رو بدان."</p>
                <p className="footer_about_desc">دنگ دان یک اپلیکیشن محاسبه ی دنگ هست که کاملا رایگانه و شما رو از هر ابزار محاسبه ی دیگه ای بی نیاز میکنه. واسه ی یه دو دوتا، چهارتای ساده که نیاز نیست خرج بکنی؛ فقط کافیه از دنگ دان استفاده کنی.</p>
            </div>

            <div className="footer_info">
                <div className="footer_info_title">
                    <Headset className="size-5 md:size-7 xl:size-6" fontWeight={'bold'} />
                    <h1 className="footer_title">تماس با ما</h1>
                </div>

                <div className="footer_info_contact_desc">
                    <div className="footer_info_contact_item">
                        <div className="flex items-center gap-x-2">
                            <MapPin size={20} />
                            <p className="footer_desc_title">آدرس:</p>
                        </div>
                        <p className="footer_desc">تهران</p>
                    </div>
                    <div className="footer_info_contact_item">
                        <div className="flex items-center gap-x-2">
                            <Mail size={20} />
                            <p className="footer_desc_title">ایمیل:</p>
                        </div>
                        <p className="footer_desc">dongdan@mail.com</p>
                    </div>
                    <div className="footer_info_contact_item">
                        <div className="flex items-center gap-x-2">
                            <Phone size={20} />
                            <p className="footer_desc_title">تلفن تماس:</p>
                        </div>
                        <p className="footer_desc">0912-345-6789</p>
                    </div>

                </div>

            </div>

            <div className="footer_info">
                <div className="footer_info_title">
                    <Globe className="size-5 md:size-7 xl:size-6" fontWeight={'bold'} />
                    <h1 className="footer_title">ما را در شبکه های اجتماعی دنبال کنید</h1>
                </div>
                <div className="footer_socials_container">

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

            <p className="footer_copyright">تمامی حقوق این وب اپلیکیشن متعلق به دنگ دان می باشد و هرگونه کپی برداری پیگرد قانونی دارد.</p>
        </footer>
    );
}

export default Footer;