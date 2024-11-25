
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
    const colorClasses = color === 'accent' ? 'bg-indigo-50 dark:bg-indigo-600/10 border-indigo-50 dark:border-indigo-600/10 hover:border-indigo-800 dark:hover:border-indigo-600 text-indigo-800 dark:text-indigo-600' : color === 'gray' ? 'bg-gray-100 dark:bg-dark-gray text-gray-700 dark:text-gray-300 border-gray-100 dark:border-dark-gray hover:border-gray-700 dark:hover:border-gray-300' : color === 'success' ? 'bg-green-50 dark:bg-dark-green text-green-600 dark:text-green-400 border-green-50 dark:border-dark-green hover:border-green-600 dark:hover:border-green-400' : color === 'warning' ? 'bg-yellow-50 dark:bg-dark-yellow text-yellow-600 dark:text-yellow-200 border-yellow-50 dark:border-dark-yellow hover:border-yellow-600 dark:hover:border-yellow-400' : 'bg-red-50 dark:bg-dark-red text-red-600 dark:text-red-400 border-red-50 dark:border-dark-red hover:border-red-600 dark:hover:border-red-400';
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