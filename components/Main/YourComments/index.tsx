'use client'

import { MessagesSquare, User } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Grid } from "swiper/modules";

import styles from './index.module.css'

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/grid';
import { useEffect, useState } from "react";

function YourCommentsSkeleton() {

    return <div className="flex flex-row flex-nowrap overflow-x-scroll hide-scrollbar gap-x-5">

        {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse opacity-50 h-[250px] min-w-[320px] bg-gray-200 dark:bg-gray-700 p-5 rounded-3xl w-full"></div>
        ))}

    </div>
}

export default function YourComments() {

    const comments = [
        { id: 1, body: "استفاده از دونگ دان کار من رو تو حساب کتاب‌ها خیلی راحت کرده. دیگه لازم نیست نگران تقسیم هزینه‌ها بین دوستان و خانواده باشم. هر کس سهم خودش رو می‌دونه و این فوق‌العاده است.", author: "رضا صادقی" },
        { id: 2, body: "این اپلیکیشن واقعا بی‌نظیره! حالا راحت‌تر می‌تونم با دوستانم سفر کنم بدون اینکه نگران باشیم چه کسی چه مقدار باید پرداخت کنه. همه چیز شفاف و ساده.", author: "سارا احمدی" },
        { id: 3, body: "دونگ دان یکی از بهترین اپ‌های مدیریت هزینه است که تا حالا استفاده کردم. همه چیز رو دقیق و سریع محاسبه می‌کنه و تجربه‌ای بدون دردسر رو برای من فراهم میاره.", author: "علی رضایی" },
        { id: 4, body: "خیلی سریع و ساده می‌شه هزینه‌ها رو بین افراد تقسیم کرد. مرسی از دونگ دان! دیگه لازم نیست خودم محاسبات پیچیده انجام بدم، این اپ همه چیز رو مدیریت می‌کنه.", author: "نرگس کریمی" },
        { id: 5, body: "این اپلیکیشن تو دورهمی‌ها واقعا به درد می‌خوره. عالیه! دوستانم همگی ازش استفاده می‌کنیم و همه راضی هستیم.", author: "آرش نیک‌نام" },
        { id: 6, body: "تقسیم هزینه‌ها هیچ وقت اینقدر راحت نبوده. عاشق دونگ دان شدم چون همه چیز رو خودکار و دقیق انجام می‌ده.", author: "مهسا شکوهی" },
        { id: 7, body: "با این اپلیکیشن دیگه نیازی به محاسبات پیچیده نداریم. همه چیز خودکار انجام می‌شه و هیچ اختلافی بین اعضای گروه پیش نمیاد.", author: "محمد حسینی" },
        { id: 8, body: "دونگ دان تو مدیریت هزینه‌های گروهی فوق‌العاده است. پیشنهادش می‌کنم به همه کسانی که می‌خوان بدون دردسر هزینه‌ها رو مدیریت کنن.", author: "الهام کاظمی" },
        { id: 9, body: "خیلی خوبه که می‌تونم با استفاده از این اپ هزینه‌ها رو بدون دردسر مدیریت کنم. همیشه نگران محاسبه سهم هر کس بودم ولی حالا دیگه نیستم.", author: "حسین قادری" },
        { id: 10, body: "استفاده از دونگ دان تجربه خرید دسته‌جمعی رو خیلی راحت‌تر کرده. می‌تونیم به راحتی هزینه‌ها رو تقسیم کنیم بدون هیچ مشکلی.", author: "زهرا عباسی" }
    ];

    const [loading, setLoading] = useState(true)

    useEffect(() => {

        if (loading)
            setLoading(false)

    }, [])

    return (
        <div className="w-full my-20 flex flex-col gap-y-8 col-span-2 order-3">
            <div className="px-5 xl:px-20 primary_text_color flex flex-row gap-x-4 items-center">
                <MessagesSquare className="size-10" />
                <h2 className="font-bold text-3xl">نظرات شما</h2>
            </div>

            <div className="flex flex-col gap-y-4">

                {!loading ? (

                    <Swiper
                        modules={[Grid, Autoplay]}
                        className="w-full"
                        spaceBetween={20}
                        slidesPerView={3}
                        loop={true}
                        speed={1000}
                        dir="rtl"
                        autoplay={{
                            delay: 1000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        grid={{
                            rows: 1,
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1.5,
                                spaceBetween: 20
                            },
                            480: {
                                slidesPerView: 2.5,
                                spaceBetween: 20
                            },
                            768: {
                                slidesPerView: 4.5,
                                spaceBetween: 20
                            }
                        }}
                        scrollbar={{ draggable: true }}
                    >
                        {comments.map((comment, index) => (
                            <SwiperSlide
                                key={comment.id}
                                className="primary_bg_color rounded-3xl"
                            >
                                <div className={styles.slide}>

                                    <p className="text-justify line-clamp-[8] leading-5 md:leading-7 text-white font-light text-sm xl:text-sm">
                                        {comment.body}
                                    </p>

                                    <div className="mt-auto text-xs xl:text-sm font-semibold text-white mr-auto flex flex-row items-center gap-x-2">
                                        <User className="size-3 xl:size-5" />
                                        <p className="text-xs xl:text-base">{comment.author.trim()}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (<YourCommentsSkeleton />)}

                {/* <div className="px-5 md:px-20 flex flex-row gap-x-2 items-center mt-auto mr-auto">
                    <button
                    // onClick={() => slidePrev()}
                    >
                        <MoveRight className="size-6 primary_text_color" />
                    </button>
                    <button
                    // onClick={() => swiper.slideNext()}
                    >
                        <MoveLeft className="size-6 primary_text_color" />
                    </button>
                </div> */}
            </div>
        </div>
    )
}