import { useEffect, useRef } from "react"

export default function useClickOutside<T>(handler: () => void) {

    const domRef = useRef<HTMLDivElement & T>(null)


    useEffect(() => {

        function handleClickOutside(event: TouchEvent | MouseEvent) {

            if (domRef && domRef.current && !domRef.current.contains(event.target as Node)) {
                handler()
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    return domRef
}