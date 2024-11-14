
type ButtonProps = {
    onClick: () => void;
    text: string;
    icon: React.ReactNode;
    size: 'small' | 'medium' | 'large';
    color: 'accent' | 'gray' | 'danger' | 'success';
};


function Button({ onClick, text, icon, color, size }: ButtonProps) {
    const colorClasses = color === 'accent' ? 'bg-indigo-100 border-indigo-100 hover:border-indigo-900 text-indigo-900' : color === 'gray' ? 'bg-gray-200 text-gray-700 border-gray-200 hover:border-gray-700' : color === 'success' ? 'bg-green-100 text-green-600 border-green-100 hover:border-green-600' : 'bg-red-100 text-red-600 border-red-100 hover:border-red-600';

    const sizeClasses = size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg';

    return (
        <button onClick={onClick} className={`flex gap-x-2 justify-center items-center px-4 py-2 rounded-xl transition-all duration-300 border ${colorClasses} ${sizeClasses}`}>
            {icon}
            <span>{text}</span>
        </button>
    );
}

export default Button;