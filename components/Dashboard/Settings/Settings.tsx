'use client'

import Link from 'next/link';
import styles from '../../../styles/dashboard/dashboard-styles.module.css';
import { MoveRight, Save } from 'lucide-react';
import ToggleInput from '@/components/Common/Form/ToggleInput';
import Button from '@/components/Common/Button';
import { useSettingsStore } from '@/store/settings-store';

function Settings() {

    const { calcAccuracy, selfIncluding, toggleSelfIncluding, toggleCalcAccuracy } = useSettingsStore(state => state);

    return (
        <div className={styles.container}>
            <div className={styles.header_container}>

                <div className={styles.header_right}>
                    <Link href={'/dashboard/events'} className={styles.back_button}>
                        <MoveRight className={styles.back_button_icon} />
                    </Link>
                    <h1 className={styles.header_title}>تنظیمات</h1>
                </div>

                <div className={styles.header_left}>
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
                <h1 className='text-base text-gray-500'>تنظیمات رویداد ها</h1>


                <div className="mt-4 text-gray-700">
                    <ToggleInput label='دقت محاسبات 1000 تومان باشد' name='calc_accuracy' value={calcAccuracy} handleChange={toggleCalcAccuracy} />
                </div>
                <div className="mt-4 text-gray-700">
                    <ToggleInput label='لیست اشخال شامل شما باشد' name='calc_accuracy' value={selfIncluding} handleChange={toggleSelfIncluding} />
                </div>



            </div>

        </div>
    );
}

export default Settings;