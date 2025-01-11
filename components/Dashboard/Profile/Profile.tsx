'use client'

import Link from 'next/link';
import { BadgeCheck, Key, LoaderCircle, MoveRight, User, UserPen, UserX } from 'lucide-react';
import Button from '@/components/Common/Button';
import { useDialogStore } from '@/store/dialog-store';
import { useToastStore } from '@/store/toast-store';
import { useState } from 'react';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';
import { type User as TypeUser } from '@/types/user';
import moment from 'jalali-moment';
import { useAppStore } from '@/store/app-store';
import { sendEmailVerificationReq } from '@/app/actions/auth';
import DeleteAccountModal from './DeleteAccountModal';

function Profile({ data }: { data: TypeUser }) {

    const syncUser = useAppStore(state => state.setUser)
    const [profile, setProfile] = useState<TypeUser>(data);

    const openDialog = useDialogStore(state => state.openDialog)
    const addToast = useToastStore(state => state.addToast)
    const [loading, setLoading] = useState(false);

    const [editProfileModalVis, setEditProfileModalVis] = useState(false);
    const [changePasswordModalVis, setChangePasswordModalVis] = useState(false);
    const [deleteAccountModalVis, setDeleteAccountModalVis] = useState(false);

    function toggleEditProfileModal() {
        setEditProfileModalVis(prev => !prev);
    }
    function toggleChangePasswordModal() {
        setChangePasswordModalVis(prev => !prev);
    }
    function toggleDeleteAccountModal() {
        setDeleteAccountModalVis(prev => !prev);
    }

    function updateProfile(updatedProfile: TypeUser) {
        syncUser(updatedProfile)
        setProfile(updatedProfile)
    }

    async function handleVerifyEmailButton() {

        if (loading || profile.email_verified_at) return
        setLoading(true)

        const res = await sendEmailVerificationReq()

        if (!res.success) {
            setLoading(false)
            addToast({
                message: res.message,
                type: 'danger' as const,
            })
            return
        }

        setLoading(false)
        addToast({
            message: res.message,
            type: 'success' as const,
        })

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
                    {profile.email_verified_at ?
                        <span className='text-green-500 dark:text-green-400'>تایید شده</span>
                        :
                        <div className='flex flex-row items-center gap-x-2'>
                            <span className='text-red-500 dark:text-red-400'>تایید نشده</span>
                            <Button
                                text={loading ? 'در حال ارسال' : 'تایید حساب'}
                                icon={loading ? <LoaderCircle className='size-4 animate-spin' /> : <BadgeCheck className='size-4' />}
                                onClick={handleVerifyEmailButton}
                                color='gray'
                                size='small'
                            />
                        </div>
                    }
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
                        icon={<UserX className='size-4' />}
                        onClick={toggleDeleteAccountModal}
                        color='danger'
                        size='small'
                    />
                </div>

            </div>

            {editProfileModalVis && (<EditProfileModal profile={profile} updateProfile={updateProfile} onClose={toggleEditProfileModal} />)}
            {changePasswordModalVis && (<ChangePasswordModal onClose={toggleChangePasswordModal} />)}
            {deleteAccountModalVis && (<DeleteAccountModal onClose={toggleDeleteAccountModal} />)}
        </div>
    );
}

export default Profile;