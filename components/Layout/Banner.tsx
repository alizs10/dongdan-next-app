import { Quote } from "lucide-react";

function Banner() {
    return (
        <div className="bg-gray-100 border-2 border-dashed primary_border_color dark:bg-gray-900 mx-auto w-fit max-w-[90%] px-10 py-5 md:px-20 md:py-10 xl:px-20 xl:py-14 rounded-3xl my-10">
            <Quote className="primary_text_color size-5 xl:size-10 float-right ml-3 md:ml-7" />
            <h1 className="leading-7 xl:leading-10 app_text_color w-fit text-sm md:text-base xl:text-2xl font-bold">دیگه از مادرخرج شدن نترس! با دنگ دان، دنگ هرکی رو بدان.</h1>
        </div>
    );
}

export default Banner;