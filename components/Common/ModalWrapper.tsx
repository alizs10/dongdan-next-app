function ModalWrapper({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
            {children}
        </div>
    );
}

export default ModalWrapper;