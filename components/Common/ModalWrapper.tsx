function ModalWrapper({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
    return (
        <section onClick={onClose} className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            {children}
        </section>
    );
}

export default ModalWrapper;