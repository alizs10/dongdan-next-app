'use client'

import { MessagesSquare, MoveLeft, MoveRight, User } from "lucide-react";
import { useState } from "react";

import { AnimatePresence, motion } from 'framer-motion';
import useWidth from "@/hooks/useWidth";

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
            return arr;
        } else {
            const arr = [...comments.slice(currentIndex), ...comments.slice(0, endIndex % comments.length)];
            return arr;
        }
    };

    const { width, breakPKey } = useWidth()
    const gap = breakPKey === 'xs' ? 15 : breakPKey === 'md' ? 20 : breakPKey === 'xl' ? 30 : 40;
    const padding = width < 640 ? 40 : 80;

    const commentWidth = (width - padding - (2 * gap)) / 3;  // Total width minus padding minus gaps divided by 3
    const sideCommentWidth = commentWidth - (1 / 3 * commentWidth);  // Total width minus padding minus gaps divided by 3
    const mainCommentWidth = commentWidth + (2 / 3 * commentWidth);  // Total width minus padding minus gaps divided by 3

    const firstCommentRightP = 0;
    const mainCommentRightP = sideCommentWidth + gap;
    const lastCommentRightP = sideCommentWidth + gap + mainCommentWidth + gap;

    return (
        <div className="w-full my-20 flex flex-col gap-x-0 col-span-2 order-3">
            <div className="px-5 xl:px-20 primary_text_color flex flex-row gap-x-4 items-center">
                <MessagesSquare className="size-10" />
                <h2 className="font-bold text-3xl">نظرات شما</h2>
            </div>

            <div className="px-5 md:px-10 mt-5 md:mt-20 max-w-full overflow-hidden h-[300px] md:h-[400px] w-full mx-auto flex flex-col gap-y-4">
                <ul className="relative h-full w-full">
                    <AnimatePresence mode="sync">
                        {getCurrentComments().map((comment, index) => (
                            <motion.li
                                key={comment.id}
                                initial={{ scale: 0.5, opacity: 0, right: index === 0 ? firstCommentRightP : index === 1 ? mainCommentRightP : lastCommentRightP, top: 30 }}
                                animate={{
                                    scale: index === 1 ? 1.1 : 1,
                                    opacity: 1,
                                    right: index === 0 ? firstCommentRightP : index === 1 ? mainCommentRightP : lastCommentRightP,
                                    top: 30,
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
                                    top: 30,
                                    transition: {
                                        duration: 0.1,
                                        ease: "easeInOut"
                                    }
                                }}
                                style={{ width: index === 1 ? mainCommentWidth : sideCommentWidth }}
                                className="absolute rounded-xl md:rounded-2xl xl:rounded-[3rem] primary_bg_color h-[200px] md:h-[250px] p-2 md:p-3 xl:p-7 flex flex-col z-40 shadow-lg hover:shadow-xl transition-shadow">
                                <p className="text-justify line-clamp-[8] leading-5 md:leading-7 text-white font-light text-sm xl:text-sm">
                                    {comment.body}
                                </p>

                                {index === 1 && (
                                    <div className="mt-auto text-xs xl:text-sm font-semibold text-white mr-auto flex flex-row items-center gap-x-2">
                                        <User className="size-3 xl:size-5" />
                                        <p className="text-xs xl:text-base">{comment.author.trim()}</p>
                                    </div>
                                )}
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