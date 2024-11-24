'use client'

import Link from 'next/link';
import { MoveRight, Save } from 'lucide-react';
import ToggleInput from '@/components/Common/Form/ToggleInput';
import Button from '@/components/Common/Button';
import { useSettingsStore } from '@/store/settings-store';

function Settings() {

    const { calcAccuracy, selfIncluding, toggleSelfIncluding, toggleCalcAccuracy } = useSettingsStore(state => state);

    return (
        <div className="events_container">
            <div className="event_header_container">

                <div className="event_header_right">
                    <Link href={'/dashboard/events'} className="event_back_button">
                        <MoveRight className="event_back_button_icon" />
                    </Link>
                    <h1 className="event_header_title">تنظیمات</h1>
                </div>

                <div className="event_header_left">
                    <Button
                        text='ذخیره تغییرات'
                        icon={<Save className='size-4' />}
                        onClick={() => { }}
                        color='accent'
                        size='small'
                    />
                </div>
            </div>


            <div className="flex flex-col gap-y-2 p-5">
                <h1 className='text-base text-gray-500 dark:text-gray-400'>تنظیمات رویداد ها</h1>


                <div className="mt-4 text-gray-700 dark:text-gray-300">
                    <ToggleInput label='دقت محاسبات 1000 تومان باشد' name='calc_accuracy' value={calcAccuracy} handleChange={toggleCalcAccuracy} />
                </div>
                <div className="mt-4 text-gray-700 dark:text-gray-300">
                    <ToggleInput label='لیست اشخال شامل شما باشد' name='calc_accuracy' value={selfIncluding} handleChange={toggleSelfIncluding} />
                </div>



            </div>

        </div>
    );
}

export default Settings;