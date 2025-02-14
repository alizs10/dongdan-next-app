import { useState, useEffect, ReactNode } from "react";

type TooltipProps = {
    children: ReactNode;
    text: string;
    position?: "top" | "bottom" | "left" | "right";
};

const Tooltip: React.FC<TooltipProps> = ({ children, text, position = "top" }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (visible) {
            timeout = setTimeout(() => setShowTooltip(true), 100); // Delay of 300ms
        } else {
            setShowTooltip(false);
        }
        return () => clearTimeout(timeout);
    }, [visible]);

    return (
        <div
            className="relative w-full inline-block"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {showTooltip && (
                <div
                    className={`absolute z-10 p-2 text-sm app_text_color bg-gray-200 dark:bg-gray-900 rounded shadow-lg whitespace-nowrap transition-opacity duration-200 ${position === "top" ? "bottom-full mb-2 left-1/2 transform -translate-x-1/2" : ""
                        } ${position === "bottom" ? "top-full mt-2 left-1/2 transform -translate-x-1/2" : ""
                        } ${position === "left" ? "right-full mr-2 top-1/2 transform -translate-y-1/2" : ""} ${position === "right" ? "left-full ml-2 top-1/2 transform -translate-y-1/2" : ""
                        }`}
                >
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
