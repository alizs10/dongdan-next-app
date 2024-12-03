import Auth from "@/components/Auth/Auth";

async function AuthPage({
    searchParams,
}: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {

    const form = (await searchParams).form;
    console.log('form:', form)

    return (
        <Auth form={form} />
    );
}

export default AuthPage;