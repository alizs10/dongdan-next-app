'use client'

import Link from 'next/link';
import { Key, MoveRight, UserPen } from 'lucide-react';
import Button from '@/components/Common/Button';
import { useDialogStore } from '@/store/dialog-store';
import { Toast, useToastStore } from '@/store/toast-store';
import { generateUID } from '@/helpers/helpers';
import { useState } from 'react';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';
import { User } from '@/types/user-types';

function Profile({ data }: { data: User }) {

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

        const okToast: Toast = {
            id: generateUID(),
            message: 'اکانت شما با موفقیت حذف شد',
            type: 'success'
        }
        const cancelToast: Toast = {
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
        <div className="events_container">
            <div className="event_header_container">

                <div className="event_header_right">
                    <Link href={'/dashboard/events'} className="event_back_button">
                        <MoveRight className="event_back_button_icon" />
                    </Link>
                    <h1 className="event_header_title">پروفایل کاربری</h1>
                </div>

                <div className="event_header_left">
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
                    <h1 className='text-gray-700 dark:text-gray-300'>نام:</h1>
                    <span className='text-gray-500 dark:text-gray-400 text-right w-full'>{data.name}</span>
                </div>
                <div className="flex flex-row w-full max-w-[400px] justify-between items-center gap-x-4 text-base">
                    <h1 className='text-gray-700 dark:text-gray-300'>ایمیل:</h1>
                    <span className='text-gray-500 dark:text-gray-400 text-right  w-full'>{data.email}</span>
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

            {editProfileModalVis && (<EditProfileModal profile={data} onClose={toggleEditProfileModal} />)}
            {changePasswordModalVis && (<ChangePasswordModal onClose={toggleChangePasswordModal} />)}
        </div>
    );
}

export default Profile;