import Button from '@/components/Common/Button'
import TextInput from '@/components/Common/Form/TextInput'
import ModalHeader from '@/components/Common/ModalHeader'
import ModalWrapper from '@/components/Common/ModalWrapper'
import { Save } from 'lucide-react'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'

export default function NewCategoryModal({ onClose }: { onClose: () => void }) {

    const [loading, setLoading] = useState(false)

    const [inputs, setInputs] = useState({
        name: ''
    })

    const [formErrors, setFormErrors] = useState({
        name: ''
    })

    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>
                <div
                    onClick={e => e.stopPropagation()}
                    className='modal_container'>
                    <ModalHeader title="برچسب جدید" onClose={onClose} />
                    <div className="p-5 flex flex-col gap-y-4">
                        <TextInput name="name" value={inputs.name} error={formErrors.name} label="نام برچسب" handleChange={e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))} />


                        <div className="flex justify-end">
                            <Button
                                text={loading ? 'در حال ثبت' : 'ثبت'}
                                icon={<Save className="size-4" />}
                                onClick={() => { }}
                                size="medium"
                                color="accent"
                                type="submit"
                            />
                        </div>
                    </div>
                </div>
            </ModalWrapper>
            , document.getElementById('modal-portal') as HTMLElement)
    }
}
