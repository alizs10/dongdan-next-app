'use client'

import Link from 'next/link';
import { MoveRight, Save } from 'lucide-react';
import ToggleInput from '@/components/Common/Form/ToggleInput';
import Button from '@/components/Common/Button';
import { type Settings as TypeSettings } from '@/types/user-types';
import { useState } from 'react';
import { updateSettingsReq } from '@/app/actions/profile';
import { useToastStore } from '@/store/toast-store';
import { useAppStore } from '@/store/app-store';

function Settings({ data }: { data: TypeSettings }) {

    const [settings, setSettings] = useState(data);
    const [loading, setLoading] = useState(false);

    const addToast = useToastStore(state => state.addToast)
    const syncSettings = useAppStore(state => state.setSettings)

    async function toggleShowAsMe() {

        if (loading) return;
        setLoading(true);

        const updatedSettings = { ...settings, show_as_me: settings.show_as_me === 1 ? 0 as const : 1 as const };
        const res = await updateSettingsReq(updatedSettings)

        if (res.success) {
            setSettings(res.settings)
            syncSettings(res.settings)
            const successToast = {
                message: res.message,
                type: 'success' as const
            }
            addToast(successToast)
            setLoading(false)
            return;
        }

        const errorToast = {
            message: res.message,
            type: 'danger' as const
        }
        addToast(errorToast)
        setLoading(false)
        return;
    }


    return (
        <div className="events_container">
            <div className="event_header_container">

                <div className="event_header_right">
                    <Link href={'/dashboard/events'} className="event_back_button">
                        <MoveRight className="event_back_button_icon" />
                    </Link>
                    <h1 className="event_header_title">تنظیمات</h1>
                </div>

            </div>


            <div className="flex flex-col gap-y-2 p-5">
                <h1 className='text-base text-gray-500 dark:text-gray-400'>تنظیمات کاربر</h1>

                <div className="mt-4 text-gray-700 dark:text-gray-300">
                    <ToggleInput label='نمایش نام شما بصورت خودم/من' name='calc_accuracy' value={settings.show_as_me === 1} handleChange={toggleShowAsMe} />
                </div>



            </div>

        </div>
    );
}

export default Settings;