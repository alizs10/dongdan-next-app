'use client'

import Link from 'next/link';
import { Key, MoveRight, User, UserPen } from 'lucide-react';
import Button from '@/components/Common/Button';
import { useDialogStore } from '@/store/dialog-store';
import { useToastStore } from '@/store/toast-store';
import { useState } from 'react';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';
import { type User as TypeUser } from '@/types/user-types';
import moment from 'jalali-moment';
import { useAppStore } from '@/store/app-store';

function Profile({ data }: { data: TypeUser }) {

    const syncUser = useAppStore(state => state.setUser)
    const [profile, setProfile] = useState<TypeUser>(data);

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

    function updateProfile(updatedProfile: TypeUser) {
        syncUser(updatedProfile)
        setProfile(updatedProfile)
    }

    function onDeleteAccClick() {


        openDialog(
            'حذف حساب کاربری'
            ,
            'آیا از حذف حساب کاربری خود اطمینان دارید؟ تمام داده های شما حذف خواهد شد و قابل برگشت نمی باشد.'
            ,
            {
                ok: {
                    text: 'حذف حساب',
                    onClick: () => {
                        const okToast = {
                            message: 'اکانت شما با موفقیت حذف شد',
                            type: 'success' as const,
                        }

                        console.log('delete account');
                        addToast(okToast)
                    }
                },
                cancel: {
                    text: 'انصراف',
                    onClick: () => {
                        const cancelToast = {
                            message: 'انصراف',
                            type: 'info' as const
                        }
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


            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-5">

                <div className="col-span-1 md:col-span-2">
                    <div className="w-fit flex flex-col items-center gap-y-2">
                        <div className={`w-fit p-3 select-none cursor-pointer flex flex-row gap-x-4 items-center border user_avatar_${profile.scheme}_text user_avatar_${profile.scheme}_border user_avatar_${profile.scheme}_bg transition-all duration-300 rounded-full`}>
                            <div className="">
                                <User className="size-7" />
                            </div>

                        </div>
                        <span className="text-base">{profile.name}</span>
                    </div>
                </div>

                <div className="col-span-1 flex flex-row items-center gap-x-4 text-base">
                    <h1 className='text-gray-700 dark:text-gray-300'>ایمیل:</h1>
                    <span className='text-gray-500 dark:text-gray-400'>{profile.email}</span>
                </div>
                <div className="flex flex-row col-span-1 items-center gap-x-4 text-base">
                    <h1 className='text-gray-700 dark:text-gray-300'>تایید حساب کاربری:</h1>
                    <span className='text-gray-500 dark:text-gray-400'>{profile.email_verified_at ? moment(profile.updated_at).locale('fa').format("DD MMM، YYYY") : 'تایید نشده'}</span>
                </div>
                <div className="flex flex-row col-span-1 items-center gap-x-4 text-base">
                    <h1 className='text-gray-700 dark:text-gray-300'>آخرین بروزرسانی:</h1>
                    <span className='text-gray-500 dark:text-gray-400'>{moment(profile.updated_at).locale('fa').format("DD MMM، YYYY")}</span>
                </div>
                <div className="flex flex-row col-span-1 items-center gap-x-4 text-base">
                    <h1 className='text-gray-700 dark:text-gray-300'>تاریخ عضویت:</h1>
                    <span className='text-gray-500 dark:text-gray-400'>{moment(profile.created_at).locale('fa').format("DD MMM، YYYY")}</span>
                </div>
                <div className="mt-10 flex flex-row col-span-1 md:col-span-2 items-center gap-x-4 text-base">
                    <Button
                        text='تغییر رمز عبور'
                        icon={<Key className='size-4' />}
                        onClick={toggleChangePasswordModal}
                        color='gray'
                        size='small'
                    />
                    <Button
                        text='حذف حساب کاربری'
                        icon={<Key className='size-4' />}
                        onClick={onDeleteAccClick}
                        color='danger'
                        size='small'
                    />
                </div>

            </div>

            {editProfileModalVis && (<EditProfileModal profile={profile} updateProfile={updateProfile} onClose={toggleEditProfileModal} />)}
            {changePasswordModalVis && (<ChangePasswordModal onClose={toggleChangePasswordModal} />)}
        </div>
    );
}

export default Profile;