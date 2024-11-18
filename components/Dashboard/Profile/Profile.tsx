import Link from 'next/link';
import styles from '../../../styles/dashboard/dashboard-styles.module.css';
import { MoveRight } from 'lucide-react';

function Profile() {
    return (
        <div className={styles.container}>
            <div className={styles.header_container}>

                <div className={styles.header_right}>
                    <Link href={'/dashboard/events'} className={styles.back_button}>
                        <MoveRight className={styles.back_button_icon} />
                    </Link>
                    <h1 className={styles.header_title}>پروفایل کاربری</h1>
                </div>
            </div>
        </div>
    );
}

export default Profile;