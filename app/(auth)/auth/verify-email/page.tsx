import VerifyEmail from "@/components/Auth/VerifyEmail";

async function verifyEmailReq(id: string, hash: string, expires: string, signature: string) {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;

    const res = await fetch(url, {
        headers: {
            // Authorization: `Bearer ${token?.value}`
            'Accept': 'application/json',
        }
    });


    const data = await res.json()

    if (!res.ok || !data.status) {
        return { message: data.message || res.statusText, success: false };
    }

    return { success: true, message: data.message };

}

async function VerifyEmailPage({
    searchParams
}: { searchParams: Promise<{ id: string, hash: string, expires: string, signature: string }> }) {

    const { id, hash, expires, signature } = await searchParams;

    const result = await verifyEmailReq(id, hash, expires, signature);

    return (
        <VerifyEmail result={result} />
    );
}

export default VerifyEmailPage;