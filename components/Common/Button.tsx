
type ButtonProps = {
    onClick?: () => void;
    text: string;
    icon: React.ReactNode;
    size: 'small' | 'medium' | 'large';
    color: 'accent' | 'gray' | 'danger' | 'success' | 'warning';
    shape?: 'rect' | 'square';
    type?: 'button' | 'submit';
    disabled?: boolean;
};


function Button({ onClick, text, icon, color, type = 'button', disabled = false, size, shape = 'rect' }: ButtonProps) {
    const colorClasses = color === 'accent' ? 'bg-indigo-50 dark:bg-indigo-600/10 border-indigo-50 dark:border-indigo-600/10 hover:border-indigo-800 dark:hover:border-indigo-600 text-indigo-800 dark:text-indigo-600' : color === 'gray' ? 'bg-gray-100 text-gray-700 border-gray-100 hover:border-gray-700' : color === 'success' ? 'bg-green-50 text-green-600 border-green-50 hover:border-green-600' : color === 'warning' ? 'bg-yellow-50 text-yellow-600 border-yellow-50 hover:border-yellow-600' : 'bg-red-50 text-red-600 border-red-50 hover:border-red-600';
    const sizeClasses = size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg';
    const shapeClasses = shape === 'square' ? 'p-1 rounded-full' : 'px-4 py-2 rounded-xl';

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick} className={`flex gap-x-2 justify-center items-center transition-all duration-300 border ${shapeClasses} ${colorClasses} ${sizeClasses}`}>
            {icon && icon}
            {text && <span>{text}</span>}
        </button>
    );
}

export default Button;