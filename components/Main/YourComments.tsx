'use client'

import { MessagesSquare, MoveLeft, MoveRight, User } from "lucide-react";
import { useState } from "react";

import { AnimatePresence, motion } from 'framer-motion';

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



    const [currentIndex, setCurrentIndex] = useState(0);
    const sliceLength = 3;

    const showNextComment = () => {
        setCurrentIndex((currentIndex + 1) % comments.length);
    };

    const showPreviousComment = () => {
        setCurrentIndex((currentIndex - 1 + comments.length) % comments.length);
    };

    const getCurrentComments = () => {

        const endIndex = currentIndex + sliceLength;
        if (endIndex <= comments.length) {
            const arr = comments.slice(currentIndex, endIndex);
            console.log(arr.length)
            return arr;
        } else {
            const arr = [...comments.slice(currentIndex), ...comments.slice(0, endIndex % comments.length)];
            console.log(arr.length)
            return arr;
        }
    };



    return (
        <div className="w-full my-20 flex flex-col gap-x-0 col-span-2">
            <div className="px-20 primary_text_color flex flex-row gap-x-4 items-center">
                <MessagesSquare className="size-10" />
                <h2 className="font-bold text-3xl">نظرات شما</h2>
            </div>

            <div className="mx-auto mt-20 w-[1240px] h-[400px] flex flex-col gap-y-4">

                <ul className="relative w-full py-10">
                    <AnimatePresence mode="sync">
                        {getCurrentComments().map((comment, index) => (
                            <motion.li
                                key={comment.id}
                                initial={{ scale: 0.5, opacity: 0, right: index * 400 + index * 20, top: 0 }}
                                animate={{
                                    scale: index === 1 ? 1.2 : 0.8,
                                    opacity: 1,
                                    right: index * 400 + index * 20,
                                    top: 0,
                                    transition: {
                                        type: "spring",
                                        duration: 0.1,
                                        stiffness: 150,
                                        damping: 15
                                    }
                                }}
                                exit={{
                                    scale: 0.5,
                                    opacity: 0,
                                    right: 0,
                                    top: 0,
                                    transition: {
                                        duration: 0.1,
                                        ease: "easeInOut"
                                    }
                                }} className="absolute rounded-[3rem] primary_bg_color w-[400px] h-[300px] p-7 flex flex-col z-40 shadow-lg hover:shadow-xl transition-shadow">
                                <p className="text-justify line-clamp-4 leading-7 text-white font-light text-sm">
                                    {comment.body}
                                </p>

                                <div className="mt-auto text-sm font-semibold text-white mr-auto flex flex-row items-center gap-x-2">
                                    <User className="size-5" />
                                    <p className="text-base">{comment.author.trim()}</p>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
                <div className="flex flex-row gap-x-2 items-center mt-auto mr-auto">

                    <button onClick={showPreviousComment}>
                        <MoveRight className="size-6 primary_text_color" />
                    </button>

                    <button onClick={showNextComment}>
                        <MoveLeft className="size-6 primary_text_color" />
                    </button>

                </div>
            </div>
        </div>
    )
}