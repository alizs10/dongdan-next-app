function ModalWrapper({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
    return (
        <section onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            {children}
        </section>
    );
}

export default ModalWrapper;