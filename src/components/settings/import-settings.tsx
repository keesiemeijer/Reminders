import React, { useRef, useContext } from "react";
import { useTranslation } from "react-i18next";

import { toast } from "react-toastify";

import { useAppDispatch } from "../../app/hooks";
import { TypeSettingContext } from "../../contexts/type-setting-context";
import { importDateListItems, importTreeListItems } from "../../features/lists-slice";
import { isValidJSON } from "../../utils/utils";

const ImportSettings = () => {
    const dispatch = useAppDispatch();
    const typeSettings = useContext(TypeSettingContext);
    const importInput = useRef<HTMLTextAreaElement>(null);
    const { t } = useTranslation("settings");

    const submitImport = (e: React.FormEvent<HTMLFormElement>) => {
        // Form was submitted
        e.preventDefault();
        let json = "";

        // current' is possibly 'null'
        if (importInput.current !== null) {
            json = importInput.current.value;
        }

        const items = json && isValidJSON(json) ? JSON.parse(json) : false;

        if (items && Array.isArray(items)) {
            const payload = {
                type: typeSettings["type"],
                items: items,
            };

            if (typeSettings.orderByDate) {
                dispatch(importDateListItems(payload));
            } else {
                dispatch(importTreeListItems(payload));
            }

            toast.info(t("list-items-imported"));
        } else {
            toast.error(t("no-list-items-imported-data-invalid"));
        }
    };

    return (
        <div className="import-settings">
            <h3>{t("import-list-items")}</h3>
            <p>{t("import-list-items-from-other-devices")}</p>
            <form className="app-form" onSubmit={submitImport}>
                <div className="form-section">
                    <label htmlFor="importListItems" className="form-label">
                        {t("list-item-data")}
                    </label>
                    <textarea className="form-control" ref={importInput} id="importListItems" rows={6} />
                </div>
                <div className="form-section">
                    <button type="submit" className="btn btn-outline-secondary" aria-label={t("import-list-items")}>
                        {t("import-list-item-data")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ImportSettings;
