'use client'

import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { Save } from "lucide-react";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import PDatePicker from "@/components/Common/Form/PDatePicker";
import { Event } from "@/types/event-types";
import { DateObject } from "react-multi-date-picker";
import Button from "@/components/Common/Button";
import useStore from "@/store/store";
import { EventContext } from "@/context/EventContext";
import { z } from "zod";

type FormInputs = {
    date: Date;
}

function EndEventModal({ onClose, event }: { onClose: () => void, event: Event }) {

    const [loading, setLoading] = useState(false)
    const { toggleEventStatus } = useContext(EventContext)

    const initInputs: FormInputs = {
        date: new Date(Date.now()),
    }
    const [inputs, setInputs] = useState(initInputs);


    const initFormErrors = {
        date: '',
    }
    const [formErrors, setFormErrors] = useState<Record<string, string>>(initFormErrors);

    function handleChangeDate(date: DateObject) {

        const selectedDate = new Date(date.toDate());
        selectedDate.setHours(0o0)
        selectedDate.setMinutes(0o0)
        selectedDate.setSeconds(0o0)
        selectedDate.setMilliseconds(1)

        setInputs((prev: FormInputs) => ({ ...prev, date: selectedDate }))
    }



    async function endEventHandler() {

        const endEventSchema = z.object({
            date: z.date().min(new Date(new Date(event.start_date).setHours(0, 0, 0, 0)), { message: 'تاریخ نمی‌تواند قبل از تاریخ شروع باشد' }).max(new Date(), { message: 'تاریخ نمی‌تواند در آینده باشد' }),
        });

        const validationResult = endEventSchema.safeParse(inputs);

        if (!validationResult.success) {
            const errors = validationResult.error.format();
            setFormErrors((prev) => ({ ...prev, date: errors.date?._errors[0] || '' }));
            return;
        }

        // Proceed with ending the event
        setLoading(true);
        let res = await toggleEventStatus(inputs.date);

        if (res) {
            onClose()
        }

    }



    if (typeof window === "object") {
        return createPortal(
            <ModalWrapper onClose={onClose}>

                <section onClick={e => e.stopPropagation()} className="modal_container">
                    <ModalHeader title={'به پایان رساندن رویداد'} onClose={onClose} />

                    <div className="p-5 flex flex-col gap-y-2">


                        <PDatePicker
                            name="date"
                            value={inputs.date}
                            label="تاریخ"
                            onChange={handleChangeDate}
                            error={formErrors.date}
                            maxDate={new Date()}
                        />



                        <div className="mt-4 flex justify-end">
                            <Button
                                text={loading ? 'در حال ثبت' : 'ثبت'}
                                icon={<Save className="size-4" />}
                                onClick={endEventHandler}
                                size="medium"
                                color="accent"
                                type="button"
                            />
                        </div>
                    </div>
                </section>

            </ModalWrapper>
            ,
            document.getElementById("modal-portal")!);
    }

    return null;
}

export default EndEventModal;