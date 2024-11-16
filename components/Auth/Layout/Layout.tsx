type PropsTypes = {
    children: React.ReactNode;
}

function Layout({ children }: PropsTypes) {
    return (
        <main className="fixed inset-0 bg-[url('./auth-bg.jpg')] overflow-y-scroll bg-fixed bg-cover bg-center">
            <div className="w-full h-full min-h-fit py-20 flex justify-center items-center backdrop-blur-md">
                {children}
            </div>
        </main>
    );
}

export default Layout;