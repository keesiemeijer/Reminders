import { useEffect } from "react";

interface useClickOutsideProps {
    ref: React.RefObject<HTMLDivElement | null>;
    handler: (event: MouseEvent) => void;
}

// Improved version of https://usehooks.com/useOnClickOutside/
const useClickOutside = (props: useClickOutsideProps) => {
    useEffect(() => {
        let startedInside = false;
        let startedWhenMounted = false;

        const listener = (event: MouseEvent) => {
            // Do nothing if `mousedown` or `touchstart` started inside ref element
            if (startedInside || !startedWhenMounted) return;
            // Do nothing if clicking ref's element or descendent elements
            if (!props.ref.current || props.ref.current.contains(event.target as Node)) return;

            props.handler(event);
        };

        const validateEventStart = (event: TouchEvent | MouseEvent) => {
            startedWhenMounted = Boolean(props.ref.current);
            startedInside = Boolean(props.ref.current && props.ref.current.contains(event.target as Node));
        };

        document.addEventListener("mousedown", validateEventStart);
        document.addEventListener("touchstart", validateEventStart);
        document.addEventListener("click", listener);

        return () => {
            document.removeEventListener("mousedown", validateEventStart);
            document.removeEventListener("touchstart", validateEventStart);
            document.removeEventListener("click", listener);
        };
    }, [props.ref, props.handler]);
};

export default useClickOutside;
