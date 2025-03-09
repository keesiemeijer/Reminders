export const isValidJSON = (value: string): boolean => {
    if (typeof value !== "string" || !value) {
        return false;
    }

    try {
        value = JSON.parse(value);
    } catch (e) {
        return false;
    }

    // True if value is array or object.
    return typeof value === "object" && value !== null;
};

export const isObject = (item: any) => {
    return typeof item === "object" && !Array.isArray(item) && item !== null && item !== undefined;
};

export const removeTrailingSlashes = (value: string): string => {
    return value.replace(/\/+$/, "");
};

export const getIDs = <Type extends { id: any }>(items: Type[]): number[] => {
    const ids: number[] = [];
    if (!Array.isArray(items)) {
        return ids;
    }

    return items.map((item) => Number(item.id));
};

const matcher = /^#?([0-9A-F]{3,8})$/i;

export const isValidHex = (value: string, alpha?: boolean): boolean => {
    const match = matcher.exec(value);
    const length = match ? match[1].length : 0;

    return (
        length === 3 || // '#rgb' format
        length === 6 || // '#rrggbb' format
        (!!alpha && length === 4) || // '#rgba' format
        (!!alpha && length === 8) // '#rrggbbaa' format
    );
};
