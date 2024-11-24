import Link from 'next/link';
import styles from '../../../styles/dashboard/dashboard-styles.module.css';
import { Hash, MoveLeft, MoveRight } from 'lucide-react';

function Guide() {
    return (
        <div className={styles.container}>
            <div className={styles.header_container}>

                <div className={styles.header_right}>
                    <Link href={'/dashboard/events'} className={styles.back_button}>
                        <MoveRight className={styles.back_button_icon} />
                    </Link>
                    <h1 className={styles.header_title}>راهنمای استفاده</h1>
                </div>
            </div>

            <div className='py-5 px-5 flex flex-col gap-y-6'>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>ایجاد رویداد</h1>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>1- برای ایجاد یک رویداد جدید مسیر زیر رو دنبال میکنی:</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>منوی دسترسی سریع</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>رویداد ها</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>افزودن رویداد</span>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>2- فرم ایجاد رویداد را با اطلاعات زیر تکمیل میکنی:</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>نام رویداد</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>تاریخ شروع رویداد</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>برچسب رویداد</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>انتخاب اشخاص گروه از لیست دوستان</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>ثبت</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>ویرایش/حذف رویداد</h1>
                </div>


                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>برای حذف یا ویرایش یک رویداد، از لیست رویداد ها رویداد مورد نظر را پیدا کن و روی دکمه سه نقطه کلیک کن:</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>منوی دسترسی سریع</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>رویداد ها</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>رویداد مورد نظر</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دکمه سه نقطه</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>گزینه حذف یا ویرایش</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>مشاهده جزییات رویداد</h1>
                </div>


                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>برای مشاهده یک رویداد، از لیست رویداد ها رویداد مورد نظر را پیدا کن و روی دکمه مشاهده جزییات کلیک کن:</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>منوی دسترسی سریع</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>رویداد ها</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>رویداد مورد نظر</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دکمه مشاهده جزییات</span>

                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>تعریف اعضای گروه در رویداد(ایجاد عضو)</h1>
                </div>


                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>1- پس از ساخت رویداد جدید، ابتدا باید اعضای گروه آن را تعریف کرد. برای این منظور به صورت زیر عمل میکنیم:</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">

                    <span className='text-sm md:text-base lg:text-lg'>رویداد مورد نظر</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>مشاهده جزییات</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>از منوی سمت راست</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>اعضای گروه</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>افزودن عضو جدید</span>

                </div>


                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>1.1- در ادامه فرم عضو جدید را با اطلاعات زیر تکمیل میکنیم:</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>نام شخص</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>انتخاب آواتار</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>ثبت</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>ویرایش/حذف عضو از گروه</h1>
                </div>


                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>برای حذف یا ویرایش یک شخص از گروه، از صفحه رویداد و منوی سمت راست، اعضای گروه را پیدا میکنیم و بصورت زیر عمل میکنیم:</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>در صفحه رویداد</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>از منوی سمت راست</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>اعضای گروه</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>شخص مورد نظر</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دکمه سه نقطه</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>گزینه حذف یا ویرایش</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>ثبت هزینه یا جابجایی پول</h1>
                </div>


                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>پس از ساخت رویداد و تعریف اعضای گروه، سومین قدم ثبت هزینه ها یا جابجایی های پولی است. هزینه، مقدار پولی است که یک شخص برای گروه هزینه کرده است. جابجایی پول هم به معنی انتقال پول بین دو نفر از اعضا می باشد.</p>

                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>در صفحه رویداد</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>از سربرگ</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دکمه ثبت هزینه/جابجایی پول</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>ویرایش/حذف هزینه یا جابجایی پول</h1>
                </div>


                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>برای حذف یا ویرایش هزینه/جابجایی پول، از صفحه رویداد و لیست هزینه ها، هزینه/جابجایی پول مورد نظر را پیدا میکنیم و بصورت زیر عمل میکنیم:</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>در صفحه رویداد</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>از لیست هزینه ها</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>هزینه مورد نظر</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دکمه سه نقطه</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>گزینه حذف یا ویرایش</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>فیلتر هزینه ها</h1>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>فیلتر هزینه ها شامل نوع هزینه، حداقل و حداکثر مبلغ، بازه ی تاریخی و افراد گروه می باشد.</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>در صفحه رویداد</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>از سربرگ</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دکمه فیلتر</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>سهم اعضا</h1>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>در صفحه رویداد و منوی سمت راست آن بخشی به نام سهم اعضا وجود دارد که سهم هریک از اعضا و وضعیت آنان(بدهکار/طلبکار) را نشان میدهد. در سربرگ آن نیز دکمه ای با عنوان راهنمای تسویه وجود دارد که سریع ترین راه برای تسویه حساب اعضا با یکدیگر را به شما نشان خواهد داد.</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>در صفحه رویداد</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>از منوی سمت راست</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>تسویه اعضا</span>

                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>اطلاعات و وضعیت رویداد</h1>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>در صفحه رویداد و منوی سمت راست آن، بخشی با عنوان اطلاعات رویداد وجود دارد که اطلاعات جامع رویداد را به شما نشان خواهد داد. همچنین در این بخش میتوانید مشخص کنید که رویداد شما به پایان رسیده یا در جریان است.</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>در صفحه رویداد</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>از منوی سمت راست</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>اطلاعات رویداد</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دکمه پایان/بازکردن رویداد</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>محاسبات رویداد</h1>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>در صفحه رویداد و منوی سمت راست میتوانید محاسبات مربوط به رویداد را در قسمت محاسبات مشاهده کنید.</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>در صفحه رویداد</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>از منوی سمت راست</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>محاسبات رویداد</span>
                </div>


                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>لیست دوستان</h1>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>برای بهبود تجربه کاربری و سهولت استفاده، یکبار دوستان خود را ثبت کنید تا در هنگام ساخت رویدادهایتان بتوانید آن ها را به سرعت و راحتی در رویداد مشارکت دهید.</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>منوی دسترسی سریع</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دوستان</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>ایجاد دوست</h1>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>1- برای ساخت دوست جدید به روش زیر عمل میکنیم:</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>منوی دسترسی سریع</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دوستان</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>از سربرگ</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دکمه افزودن دوست</span>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>2- فرم افزودن دوست را با اطلاعات زیر تکمیل میکنیم:</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>نام دوست</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>انتخاب آواتار</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>ثبت</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>ویرایش/حذف دوست</h1>
                </div>


                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>برای حذف یا ویرایش یک دوست، از لیست دوستان شخص مورد نظر را پیدا میکنیم و روی دکمه سه نقطه کلیک میکنیم:</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>منوی دسترسی سریع</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دوستان</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>شخص مورد نظر</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دکمه سه نقطه</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>گزینه حذف یا ویرایش</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>سطل زباله</h1>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>به منظور حفظ داده های کاربر، رویداد ها و دوستان شما پس از حذف کاملا حذف نمی شوند و فقط به سطل زباله منتقل می شوند. برای حذف دائمی آن ها کافیست به سطل زباله رفته و آن ها را حذف دائم کنید یا اینکه آن ها را بازیابی کنید.</p>


                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>سطل زباله رویداد ها</h1>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>برای دسترسی به سطل زباله رویداد ها کافی ست ابتدا به بخش رویداد ها رفته سپس از منوی سریع سطل زباله را انتخاب کنید.</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>منوی دسترسی سریع</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>رویداد ها</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>منوی دسترسی سریع</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>سطل زباله</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>سطل زباله دوستان</h1>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>برای دسترسی به سطل زباله دوستان کافی ست ابتدا به بخش دوستان رفته سپس از منوی سریع سطل زباله را انتخاب کنید.</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>منوی دسترسی سریع</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دوستان</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>منوی دسترسی سریع</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>سطل زباله</span>
                </div>

                <div className="text-indigo-800">
                    <Hash className='size-5 md:size-6 lg:size-7 float-right ml-2' />
                    <h1 className='text-lg md:text-xl lg:text-2xl font-bold'>بازیابی یا حذف دائم رویداد/دوست</h1>
                </div>

                <p className='text-base md:text-lg lg:text-xl text-gray-700 font-semibold'>برای بازیابی یا حذف دائم رویداد/دوست، کافی ست از سطل زباله مربوط به هرکدام اقدام کنید.</p>
                <div className="flex flex-wrap items-center gap-2 text-gray-500 mx-auto px-10 lg:px-5 py-5 lg:py-2 rounded-full border border-gray-300">
                    <span className='text-sm md:text-base lg:text-lg'>منوی دسترسی سریع</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>رویداد/دوستان</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>سطل زباله</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>رویداد/دوست مورد نظر</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>دکمه سه نقطه</span>
                    <MoveLeft className='size-5 text-gray-300' />
                    <span className='text-sm md:text-base lg:text-lg'>بازیابی/حذف دائم</span>
                </div>

            </div>
        </div>
    );
}

export default Guide;