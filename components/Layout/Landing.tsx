import { Zap } from "lucide-react";
import styles from '../../styles/landing-styles.module.css';
import Link from "next/link";

function Landing() {

    return (
        <div className={styles.container}>

            <div className={styles.title_container}>
                <h2 className={styles.title}>رایگان،</h2>
                <h2 className={styles.title_gray}>آسان،</h2>
                <h2 className={styles.title}>سریع،</h2>
                <h2 className={styles.title_gray}>جذاب!</h2>
            </div>

            <p className={styles.text}>دیگه چی میخوای؟ همین الان شروع کن.</p>

            <Link href={'/dashboard/events'} className={styles.button}>
                <p className={styles.button_text}>بزن بریم!</p>
                <Zap className={styles.button_icon} />
            </Link>
        </div>
    );
}

export default Landing;