import Link from 'next/link';
import styles from '../../../styles/dashboard/dashboard-styles.module.css';
import { Check, CheckCheck, MoveRight } from 'lucide-react';

function About() {
    return (
        <div className={styles.container}>
            <div className={styles.header_container}>

                <div className={styles.header_right}>
                    <Link href={'/dashboard/events'} className={styles.back_button}>
                        <MoveRight className={styles.back_button_icon} />
                    </Link>
                    <h1 className={styles.header_title}>درباره</h1>
                </div>
            </div>

            <div className="px-5 py-5 flex flex-col gap-y-8">
                <p className="font-bold text-indigo-800 text-3xl">"دیگه از مادرخرج شدن نترس! با دنگ دان، دنگ هرکی رو بدان."</p>
                <p className="text-xl text-gray-700 leading-10">دنگ دان یک اپلیکیشن محاسبه ی دنگ هست که کاملا رایگانه و شما رو از هر ابزار محاسبه ی دیگه ای بی نیاز میکنه. واسه ی یه دو دوتا، چهارتای ساده که نیاز نیست خرج بکنی؛ فقط کافیه از دنگ دان استفاده کنی.</p>


                <div className="flex flex-col gap-y-4">

                    <p className="font-bold text-2xl text-gray-700">
                        در دنگ دان:
                    </p>

                    <div className="flex flex-row item-center gap-x-2">
                        <CheckCheck className='text-green-500 size-7' />
                        <p className="font-semibold text-xl text-gray-500">
                            نیاز نیست هزینه ی اضافه ای بکنی و کاملا رایگانه
                        </p>
                    </div>
                    <div className="flex flex-row item-center gap-x-2">
                        <CheckCheck className='text-green-500 size-7' />
                        <p className="font-semibold text-xl text-gray-500">
                            از اطلاعات شما محافظت میشه
                        </p>
                    </div>
                    <div className="flex flex-row item-center gap-x-2">
                        <CheckCheck className='text-green-500 size-7' />
                        <p className="font-semibold text-xl text-gray-500">
                            مستقیما با سازنده ش در ارتباطی
                        </p>
                    </div>
                    <div className="flex flex-row item-center gap-x-2">
                        <CheckCheck className='text-green-500 size-7' />
                        <p className="font-semibold text-xl text-gray-500">
                            نظرات، انتقادات و پیشنهادات شما اهمیت داره
                        </p>
                    </div>
                    <div className="flex flex-row item-center gap-x-2">
                        <CheckCheck className='text-green-500 size-7' />
                        <p className="font-semibold text-xl text-gray-500">
                            انتظار بهبود، پیشرفت و امکانات بیشتر رو داری
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;