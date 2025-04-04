'use client'

import Button from '@/components/Common/Button';
import TextInput from '@/components/Common/Form/TextInput';
import ModalHeader from '@/components/Common/ModalHeader';
import ModalWrapper from '@/components/Common/ModalWrapper';
import { createCategorySchema } from '@/database/validations/personal/category-validations';
import { zValidate } from '@/helpers/validation-helper';
import useStore from '@/store/store';
import { Category } from '@/types/personal/category-types';
import { Save } from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function EditCategoryModal({ onClose, category }: { onClose: () => void, category: Category }) {
    const { addToast } = useStore();
    const [loading, setLoading] = useState(false);

    const [inputs, setInputs] = useState({
        name: category.name,
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({
        name: '',
    });

    async function formActionHandler() {
        if (loading) return;

        setLoading(true);

        const { hasError, errors } = zValidate(createCategorySchema, inputs);

        if (hasError) {
            addToast({
                message: 'فرم نامعتبر است',
                type: 'danger',
            });
            setFormErrors(errors as Record<string, string>);
            setLoading(false);
            return;
        }

        setFormErrors({ name: '' });

        // For now just simulate a successful update since we don't have an API endpoint
        // This would be replaced with an actual API call
        setTimeout(() => {
            // Update the category in the store (this would be handled by the API response)
            useStore.getState().addCategory({
                ...category,
                name: inputs.name,
                updated_at: new Date()
            });

            addToast({
                message: 'برچسب با موفقیت بروزرسانی شد',
                type: 'success',
            });
            setLoading(false);
            onClose();
        }, 500);
    }

    if (typeof window === 'object') {
        return createPortal(
            <ModalWrapper onClose={onClose}>
                <form
                    action={formActionHandler}
                    onClick={(e) => e.stopPropagation()}
                    className="modal_container"
                >
                    <ModalHeader title="ویرایش برچسب" onClose={onClose} />
                    <div className="p-5 flex flex-col gap-y-4">
                        <TextInput
                            name="name"
                            value={inputs.name}
                            error={formErrors.name}
                            label="نام برچسب"
                            handleChange={(e) =>
                                setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                            }
                        />
                        <div className="flex justify-end">
                            <Button
                                text={loading ? 'در حال ثبت' : 'ثبت تغییرات'}
                                icon={<Save className="size-4" />}
                                onClick={() => { }}
                                size="medium"
                                color="accent"
                                type="submit"
                            />
                        </div>
                    </div>
                </form>
            </ModalWrapper>,
            document.getElementById('modal-portal') as HTMLElement
        );
    }

    return null;
} 