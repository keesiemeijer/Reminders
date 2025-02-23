import { type RefObject, type RefCallback } from "react";

type MutableRefList<T> = Array<RefCallback<T> | RefObject<T> | undefined | null>;

// To merge refs https://stackoverflow.com/a/76441059
export function mergeRefs<T>(...refs: MutableRefList<T>): RefCallback<T> {
    return (val: T) => {
        setRef(val, ...refs);
    };
}

export function setRef<T>(val: T, ...refs: MutableRefList<T>): void {
    refs.forEach((ref) => {
        if (typeof ref === "function") {
            ref(val);
        } else if (ref != null) {
            ref.current = val;
        }
    });
}
