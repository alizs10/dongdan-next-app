import Footer from "./Footer";
import Header from "./Header";

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section>

            <Header />
            <main className="w-full xl:px-72 px-5">
                {children}
            </main>

            <Footer />
        </section>
    );
}

export default Layout;