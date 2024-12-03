'use client';

import { SessionProvider } from "next-auth/react";
import DialogContainer from "../Common/Dialog/DialogContainer";
import ToastsContainer from "../Common/Toast/ToastsContainer";
import Footer from "./Footer";
import Header from "./Header";

function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <SessionProvider>
            <section>
                <Header />

                <main className="w-full">
                    {children}
                </main>

                <Footer />

                <DialogContainer />
                <ToastsContainer />
            </section>
        </SessionProvider>
    );
}

export default DashboardLayout;