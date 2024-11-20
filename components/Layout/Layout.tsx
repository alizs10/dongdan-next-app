import { AnimatePresence } from "framer-motion";
import DialogContainer from "../Common/Dialog/DialogContainer";
import ToastsContainer from "../Common/Toast/ToastsContainer";
import Footer from "./Footer";
import Header from "./Header";

function Layout({ children }: { children: React.ReactNode }) {

    // const { toasts } = useToastStore(state => state);

    // if (toasts.length === 0) return null;


    return (
        <section>
            <Header />

            <main className="w-full">
                {children}
            </main>

            <Footer />

            <DialogContainer />
            <AnimatePresence mode="wait">
                <ToastsContainer />
            </AnimatePresence>
        </section>
    );
}

export default Layout;