'use client'

import Link from 'next/link';
import { Award, BadgeCheck, Calendar, Key, Loader, LoaderCircle, Mail, MoveRight, RefreshCw, Shield, Trash, Upload, User, UserCheck, UserPen, UserX } from 'lucide-react';
import Button from '@/components/Common/Button';
import { useRef, useState } from 'react';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';
import { type User as TypeUser } from '@/types/user';
import moment from 'jalali-moment';
import { sendEmailVerificationReq } from '@/app/actions/auth';
import DeleteAccountModal from './DeleteAccountModal';
import useStore from '@/store/store';
import { deleteAvatarReq, uploadAvatarReq } from '@/app/actions/profile';
import Image from 'next/image';

function Profile({ data }: { data: TypeUser }) {

    const { setUser: syncUser, user, openDialog, addToast } = useStore()
    const [profile, setProfile] = useState<TypeUser>(data);

    console.log("profile.avatar", profile.avatar)

    const [loading, setLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [deletingAvatar, setDeletingAvatar] = useState(false)

    const [editProfileModalVis, setEditProfileModalVis] = useState(false);
    const [changePasswordModalVis, setChangePasswordModalVis] = useState(false);
    const [deleteAccountModalVis, setDeleteAccountModalVis] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null)

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


    async function handleUploadAvatar(avatar: File) {

        if (uploadingAvatar) return
        if (!fileInputRef.current?.files?.[0]) return;
        setUploadingAvatar(true)

        const response = await uploadAvatarReq({ avatar })
        console.log(response)

        if (response.success && response.avatar) {
            addToast({
                message: response.message,
                type: 'success' as const
            })
            syncUser({ ...user as TypeUser, avatar: response.avatar })
            setProfile(prev => ({ ...prev, avatar: response.avatar }))
            setUploadingAvatar(false)
            return
        }

        addToast({
            message: response.message,
            type: 'danger' as const
        })
        setUploadingAvatar(false)
    }

    async function handleDeleteAvatar() {
        if (deletingAvatar || profile.avatar === null) return;
        setDeletingAvatar(true);

        const response = await deleteAvatarReq();

        if (response.success) {
            addToast({
                message: response.message,
                type: 'success' as const
            });
            syncUser({ ...user as TypeUser, avatar: null });
            setProfile(prev => ({ ...prev, avatar: null }));
        } else {
            addToast({
                message: response.message,
                type: 'danger' as const
            });
        }

        setDeletingAvatar(false);
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


            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-20">

                <div className="col-span-1 py-10 md:border-l app_border_color flex flex-col items-center gap-y-8">
                    <div className={`size-36 relative flex flex-row justify-center items-center aspect-square select-none cursor-pointer gap-x-4 ${profile.avatar ? '' : `border user_avatar_${profile.scheme}_text user_avatar_${profile.scheme}_border user_avatar_${profile.scheme}_bg`} transition-all duration-300 rounded-full`}>
                        {profile.avatar ? (

                            <Image
                                height={100}
                                width={100}
                                src={profile.avatar}
                                alt='user_avatar'
                                className='object-cover border app_border_color rounded-full size-36 object-center'
                            />

                        ) : (
                            <User className="size-24" />
                        )}

                        <div className="flex flex-row gap-x-1 items-center absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2">

                            <button
                                onClick={() => fileInputRef?.current?.click()}
                                className="text-gray-500 dark:text-gray-400 text-nowrap px-3 py-1.5 flex flex-row gap-x-1 backdrop-blur-lg bg-gray-200/30 rounded-xl dark:bg-gray-700/30">
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleUploadAvatar(file)
                                        }
                                    }}
                                />
                                <Upload className='size-5' />
                                <span className='text-sm'>انتخاب آواتار</span>
                            </button>
                            {profile.avatar && (
                                <button onClick={handleDeleteAvatar} className="p-1.5 flex flex-row gap-x-1 bg-red-500/30 backdrop-blur-lg rounded-xl">
                                    <Trash className='size-5 text-red-500' />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2 items-center">
                        <span className="text-base md:text-xl">{profile.name}</span>
                        <div className="px-3 py-1.5 gap-x-1 bg-indigo-800/10 dark:bg-indigo-600/10 primary_text_color rounded-xl flex flex-row items-center">
                            <Award className='size-4' />
                            <span className='text-xs'>تازه وارد</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 py-10 md:border-l app_border_color flex flex-coljustify-center items-center">
                    <div className="flex flex-col items-start gap-y-6">
                        <div className="flex text-gray-700 dark:text-gray-300 flex-row items-center gap-x-4 text-base">
                            <div className="flex flex-row gap-x-1.5 items-center">
                                <Mail className='size-5' />
                                <h1>ایمیل:</h1>
                            </div>
                            <span className='text-gray-500 dark:text-gray-400'>{profile.email}</span>
                        </div>

                        <div className="flex flex-row items-center gap-x-4 text-base text-gray-700 dark:text-gray-300">
                            <div className="flex flex-row gap-x-1.5 items-center">
                                <Calendar className='size-5' />
                                <h1>تاریخ عضویت:</h1>
                            </div>
                            <span className='text-gray-500 dark:text-gray-400'>{moment(profile.created_at).locale('fa').format("DD MMM، YYYY")}</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 py-10 flex flex-col gap-y-2 justify-center items-start">

                    <div className="flex flex-col items-start gap-y-6">
                        <div className="flex flex-row items-center gap-x-4 text-base text-gray-700 dark:text-gray-300">
                            <div className="flex flex-row gap-x-1.5 items-center">
                                <Shield className='size-5' />
                                <h1>تایید حساب کاربری:</h1>
                            </div>
                            {profile.email_verified_at ?
                                <div className="flex flex-row gap-x-2 rounded-xl px-3 py-1.5 bg-emerald-400/10 border border-emerald-400 items-center text-base text-green-500 dark:text-green-400">
                                    <UserCheck className='size-4' />
                                    <span>تایید شده</span>
                                </div>
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

                        <div className="flex flex-row col-span-1 items-center gap-x-4 text-base text-gray-700 dark:text-gray-300">
                            <div className="flex flex-row gap-x-1.5 items-center">
                                <RefreshCw className='size-5' />
                                <h1>آخرین بروزرسانی:</h1>
                            </div>
                            <span className='text-gray-500 dark:text-gray-400'>{moment(profile.updated_at).locale('fa').format("DD MMM، YYYY")}</span>
                        </div>
                    </div>
                </div>
            </div>


            <div className="border-t app_border_color p-5 flex flex-row justify-end col-span-1 md:col-span-3 items-center gap-x-4 text-base">
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


            {editProfileModalVis && (<EditProfileModal profile={profile} updateProfile={updateProfile} onClose={toggleEditProfileModal} />)}
            {changePasswordModalVis && (<ChangePasswordModal onClose={toggleChangePasswordModal} />)}
            {deleteAccountModalVis && (<DeleteAccountModal onClose={toggleDeleteAccountModal} />)}


            {uploadingAvatar && (
                <div className="fixed px-3 py-1.5 z-[9999] bottom-16 right-8 rounded-full flex flex-row items-center gap-x-1 bg-gray-300/30 dark:bg-gray-700/30 backdrop-blur-lg">
                    <Loader className='size-4 animate-spin' />
                    <span className='text-xs text-gray-500 dark:text-gray-400'>در حال آپلود آواتار...</span>
                </div>
            )}
            {deletingAvatar && (
                <div className="fixed px-3 py-1.5 z-[9999] bottom-16 right-8 rounded-full flex flex-row items-center gap-x-1 bg-gray-300/30 dark:bg-gray-700/30 backdrop-blur-lg">
                    <Loader className='size-4 animate-spin' />
                    <span className='text-xs text-gray-500 dark:text-gray-400'>در حال حذف آواتار...</span>
                </div>
            )}

        </div>
    );
}

export default Profile;