import { PersonalTransaction } from "@/types/personal-types";

export async function createTransactionReq(data: Partial<PersonalTransaction>) {
    const res = await fetch('http://localhost:8000/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${yourToken}`, // Replace with auth logic
        },
        body: JSON.stringify(data),
    });
    return res.json();
}