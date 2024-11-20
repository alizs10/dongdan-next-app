'use client'

import Link from 'next/link';
import styles from '../../../styles/dashboard/dashboard-styles.module.css';
import { Key, MoveRight, UserPen } from 'lucide-react';
import Button from '@/components/Common/Button';
import { useDialogStore } from '@/store/dialog-store';
import { Toast, useToastStore } from '@/store/toast-store';
import { generateUID } from '@/helpers/helpers';
import { useState } from 'react';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';

function Profile() {

    let profile = {
        name: 'محمد علی عبداللهی',
        email: 'm.aliali@gmail.com',
        scheme: 'gray' as const
    }

    const openDialog = useDialogStore(state => state.openDialog)
    const addToast = useToastStore(state => state.addToast)

    const [editProfileModalVis, setEditProfileModalVis] = useState(false);
    const [changePasswordModalVis, setChangePasswordModalVis] = useState(false);

    function toggleEditProfileModal() {
        setEditProfileModalVis(prev => !prev);
    }
    function toggleChangePasswordModal() {
        setChangePasswordModalVis(prev => !prev);
    }

    function onDeleteAccClick() {
        console.log('delete account');

        let okToast: Toast = {
            id: generateUID(),
            message: 'اکانت شما با موفقیت حذف شد',
            type: 'success'
        }
        let cancelToast: Toast = {
            id: generateUID(),
            message: 'انصراف',
            type: 'info'
        }

        openDialog(
            'حذف حساب کاربری'
            ,
            'آیا از حذف حساب کاربری خود اطمینان دارید؟ تمام داده های شما حذف خواهد شد و قابل برگشت نمی باشد.'
            ,
            {
                ok: {
                    text: 'حذف حساب',
                    onClick: () => {
                        console.log('delete account');
                        addToast(okToast)
                    }
                },
                cancel: {
                    text: 'انصراف',
                    onClick: () => {
                        console.log('cancel delete account');
                        addToast(cancelToast)
                    }
                }

            }
        )

    }

    return (
        <div className={styles.container}>
            <div className={styles.header_container}>

                <div className={styles.header_right}>
                    <Link href={'/dashboard/events'} className={styles.back_button}>
                        <MoveRight className={styles.back_button_icon} />
                    </Link>
                    <h1 className={styles.header_title}>پروفایل کاربری</h1>
                </div>

                <div className={styles.header_left}>
                    <Button
                        text='ویرایش پروفایل'
                        icon={<UserPen className='size-4' />}
                        onClick={toggleEditProfileModal}
                        color='warning'
                        size='small'
                    />
                </div>
            </div>


            <div className="flex flex-col gap-y-2 p-5">

                <div className="flex flex-row w-full max-w-[400px] justify-between items-center gap-x-4 text-base">
                    <h1 className='text-gray-700'>نام:</h1>
                    <span className='text-gray-500 text-right w-full'>{'-'}</span>
                </div>
                <div className="flex flex-row w-full max-w-[400px] justify-between items-center gap-x-4 text-base">
                    <h1 className='text-gray-700'>ایمیل:</h1>
                    <span className='text-gray-500 text-right  w-full'>{'example@example.com'}</span>
                </div>
                <div className="mt-10 flex flex-row w-full max-w-[400px] justify-between items-center gap-x-4 text-base">
                    <Button
                        text='تغییر رمز عبور'
                        icon={<Key className='size-4' />}
                        onClick={toggleChangePasswordModal}
                        color='gray'
                        size='small'
                    />
                </div>
                <div className="flex flex-row w-full max-w-[400px] justify-between items-center gap-x-4 text-base">
                    <Button
                        text='حذف حساب کاربری'
                        icon={<Key className='size-4' />}
                        onClick={onDeleteAccClick}
                        color='danger'
                        size='small'
                    />
                </div>

            </div>

            {editProfileModalVis && (<EditProfileModal profile={profile} onClose={toggleEditProfileModal} />)}
            {changePasswordModalVis && (<ChangePasswordModal onClose={toggleChangePasswordModal} />)}
        </div>
    );
}

export default Profile;