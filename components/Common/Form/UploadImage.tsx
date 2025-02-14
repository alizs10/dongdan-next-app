import { File, Trash, Upload } from "lucide-react";
import { useRef } from "react";
import Button from "../Button";

type UploadImageProps = {
    disabled?: Boolean;
    value: File | null;
    onChange: (file: File) => void;
    onDelete: () => void;
}

export default function UploadImage({ disabled = false, value, onChange, onDelete }: UploadImageProps) {

    function handleDeleteImage(event: React.MouseEvent) {
        event.stopPropagation();
        if (fileRef.current) {
            fileRef.current.value = '';
        }
        onDelete()
    }

    function handleChangeFile() {
        if (fileRef && fileRef.current && fileRef.current.files && fileRef.current.files[0]) {
            onChange(fileRef.current.files[0])
        }
    }

    const fileRef = useRef<HTMLInputElement | null>(null)

    return (
        <div onClick={() => {
            if (disabled) return;
            fileRef.current?.click()
        }} className={`flex flex-col gap-y-3 justify-center items-center border py-10 border-dashed app_border_color rounded-xl ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <div className="flex flex-row gap-x-2 text-gray-300 dark:text-gray-600 items-center">

                {value ? <File className="size-4" /> : <Upload className="size-4" />}
                <span className="text-base">
                    {value ? value.name : 'آپلود آواتار'}
                </span>
            </div>

            {value && (
                <Button
                    text="حذف"
                    onClick={handleDeleteImage}
                    color="danger"
                    icon={<Trash className="size-4" />}
                    size="small"

                />
            )}
            <input
                ref={fileRef}
                onChange={handleChangeFile}
                type="file"
                className="hidden"
                name="avatar_file"
            />
        </div>

    )
}
