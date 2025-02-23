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
