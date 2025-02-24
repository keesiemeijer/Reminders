import { useSearchParams } from "react-router-dom";
import slugify from "@sindresorhus/slugify";

import { removeTrailingSlashes } from "./utils";

export const sanitizePathname = (value: string): string => {
    // removes multiple slashes in path (//path// to path)
    const path = removeTrailingSlashes(value.replace(/(\/)\1+/g, "/")).trim();
    return "" === path ? "/" : path;
};

export const getTypeFromUrlParams = (): string => {
    const [searchParams] = useSearchParams();

    if (!searchParams.has("type")) {
        return "";
    }

    const listType = searchParams.get("type");

    if (typeof listType === "string") {
        return slugify(listType).trim();
    }

    return "";
};
