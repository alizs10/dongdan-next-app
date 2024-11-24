import { MutableRefObject } from "react";

type PropsTypes = {
    name: string;
    label: string;
    inpRef?: MutableRefObject<null>;
    value: boolean;
    handleChange: () => void;
}

function ToggleInput({ name, label, inpRef, value, handleChange }: PropsTypes) {

    return (

        <div className={`flex justify-between items-center w-full  max-w-[400px]`}>
            <label className="text-base">{label}</label>
            <label className="inline-flex items-center cursor-pointer">
                <input name={name} ref={inpRef} checked={value ?? false} onChange={handleChange} type="checkbox" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:app_bg_color after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-800"></div>
            </label>
        </div>
    );
}

export default ToggleInput;