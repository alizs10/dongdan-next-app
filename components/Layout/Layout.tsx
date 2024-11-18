import DialogContainer from "../Common/Dialog/DialogContainer";
import ToastsContainer from "../Common/Toast/ToastsContainer";
import Footer from "./Footer";
import Header from "./Header";

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section>

            <Header />
            <main className="w-full">
                {children}
            </main>

            <Footer />

            <DialogContainer />
            <ToastsContainer />
        </section>
    );
}

export default Layout;