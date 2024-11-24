import { Quote } from "lucide-react";

function Banner() {
    return (
        <div className="bg-gray-200 dark:bg-gray-900 w-fit mx-auto px-5 py-3 md:px-20 md:py-10 xl:px-28 xl:py-14 rounded-3xl my-10">
            <Quote className="primary_text_color size-10 float-right ml-7" />
            <h1 className="app_text_color line-clamp-1 text-2xl font-bold mt-5">دیگه از مادرخرج شدن نترس! با دنگ دان، دنگ هرکی رو بدان.</h1>
        </div>
    );
}

export default Banner;