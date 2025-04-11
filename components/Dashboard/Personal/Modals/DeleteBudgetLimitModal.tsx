'use client'

import Button from '@/components/Common/Button'
import ModalHeader from '@/components/Common/ModalHeader'
import ModalWrapper from '@/components/Common/ModalWrapper'
import useStore from '@/store/store'
import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { deleteBudgetLimitReq } from '@/app/actions/personal/budget-limit'
import { BudgetLimit } from '@/types/personal/limit-types'

export default function DeleteBudgetLimitModal({ onClose, limit }: { onClose: () => void, limit: BudgetLimit }) {
    const { addToast, removeBudgetLimit } = useStore();
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        setLoading(true);

        try {
            const result = await deleteBudgetLimitReq({
                id: limit.id,
            });

            if (result.success) {
                removeBudgetLimit(limit.id);
                addToast({
                    message: result.message,
                    type: 'success',
                });
                onClose();
            } else {
                addToast({
                    message: result.message,
                    type: 'danger',
                });
            }
        } catch (error) {
            console.error('Error deleting budget limit:', error);
            addToast({
                message: 'خطای سرور',
                type: 'danger',
            });
        }

        setLoading(false);
    }

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>
                <div
                    onClick={e => e.stopPropagation()}
                    className='modal_container'>
                    <ModalHeader title="حذف محدودیت بودجه" onClose={onClose} />
                    <div className="p-5 flex flex-col gap-y-4">
                        <p className="text-center">آیا از حذف این محدودیت بودجه اطمینان دارید؟</p>

                        <div className="flex justify-end">
                            <Button
                                text={loading ? 'در حال حذف' : 'حذف'}
                                icon={<Trash2 className="size-4" />}
                                onClick={handleDelete}
                                size="medium"
                                color="danger"
                                type="button"
                            />
                        </div>
                    </div>
                </div>
            </ModalWrapper>
            , document.getElementById('modal-portal') as HTMLElement)
    }
} 