import React, { useRef, useContext } from "react";

import { useAppDispatch } from "../app/hooks";
import { TypeSettingContext } from "../contexts/type-setting-context";
import { importReminders } from "../features/reminderSlice";
import { toast } from "react-toastify";
import { isValidJSON } from "../utils/validate";

const ImportSettings = () => {
    const dispatch = useAppDispatch();
    const typeSettings = useContext(TypeSettingContext);

    const importInput = useRef<HTMLTextAreaElement>(null);

    const submitImport = (e: React.FormEvent<HTMLFormElement>) => {
        // Form was submitted
        e.preventDefault();
        let json = "";

        // current' is possibly 'null'
        if (importInput.current !== null) {
            json = importInput.current.value;
        }

        const reminders = json && isValidJSON(json) ? JSON.parse(json) : false;

        if (reminders && Array.isArray(reminders)) {
            const payload = {
                type: typeSettings["type"],
                reminders: reminders,
            };

            dispatch(importReminders(payload));
            toast.info("Reminders imported");
        } else {
            toast.error("No reminders imported (data invalid)");
        }
    };

    return (
        <div className="import-settings">
            <h3>Import List Items</h3>
            <p>Import list items from other devices</p>
            <form className="app-form" onSubmit={submitImport}>
                <div className="form-section">
                    <label htmlFor="importReminders" className="form-label">
                        Reminder data
                    </label>
                    <textarea className="form-control" ref={importInput} id="importReminders" rows={6} />
                </div>
                <div className="form-section">
                    <button type="submit" className="btn btn-outline-secondary" aria-label="Import reminders">
                        Import Reminder Data
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ImportSettings;
