'use client'

import Button from '@/components/Common/Button';
import ModalHeader from '@/components/Common/ModalHeader';
import ModalWrapper from '@/components/Common/ModalWrapper';
import { Trash, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ title, message, onConfirm, onCancel }: ConfirmDialogProps) {
    if (typeof window === 'object') {
        return createPortal(
            <ModalWrapper onClose={onCancel}>
                <div onClick={(e) => e.stopPropagation()} className="modal_container">
                    <ModalHeader title={title} onClose={onCancel} />
                    <div className="p-5 flex flex-col gap-y-4">
                        <p className="text-gray-700 dark:text-gray-300">{message}</p>
                        <div className="flex justify-end gap-x-3">
                            <Button
                                text="انصراف"
                                icon={<X className="size-4" />}
                                onClick={onCancel}
                                size="medium"
                                color="gray"
                            />
                            <Button
                                text="حذف"
                                icon={<Trash className="size-4" />}
                                onClick={onConfirm}
                                size="medium"
                                color="danger"
                            />
                        </div>
                    </div>
                </div>
            </ModalWrapper>,
            document.getElementById('modal-portal') as HTMLElement
        );
    }

    return null;
} 