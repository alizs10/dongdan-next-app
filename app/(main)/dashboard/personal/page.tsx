'use server'

import { fetchInitData } from "@/app/actions/personal/init";
import PersonalMain from "@/components/Dashboard/Personal/PersonalMain";


const getInitData = async () => {
    const result = await fetchInitData();
    if (result.success) {
        return result.data
    } else {
        // Handle error
        console.error(result.message);
    }
};



export default async function PersonalPage() {
    const data = await getInitData();

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-screen app_text_color">
                <h2 className="text-2xl font-bold mb-4">خطا در بارگذاری اطلاعات</h2>
                <p className="text-gray-600 dark:text-gray-400">متأسفانه اطلاعات مورد نیاز قابل دریافت نیست.</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.</p>
            </div>
        );
    }

    return (
        <PersonalMain data={data} />
    )
}
