import { ListSettings } from "../../features/lists-slice";
import { GeneralSettingsRefs } from "./utils/general-settings";
import { useTranslation } from "react-i18next";

export const GeneralSettingsInputElements = (props: { settings: ListSettings; refs: GeneralSettingsRefs; newSetting: boolean }) => {
    const { t } = useTranslation("settings");
    let titleInfo = t("the-title-cant-be-edited");
    let disabled = true;
    let orderByDateInfo;
    let newInfo = "";

    if (props.settings.orderByDate) {
        orderByDateInfo = t("date-ordered-lists-cant-be-changed-to-manual-ordered-lists");
    } else {
        orderByDateInfo = t("manual-ordereded-lists-cant-be-changed-to-date-ordered-lists");
    }

    if (props.newSetting) {
        titleInfo = "";
        newInfo = t("more-list-settings-can-be-found-in-the-individual-setting-pages-for-lists");
        orderByDateInfo = "";
        disabled = false;
    }

    return (
        <div className="general-settings">
            <div className="form-section">
                <label htmlFor="title" className="form-label">
                    {t("title")}
                </label>
                <input
                    ref={props.refs.titleInput}
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={props.settings.title}
                    className="form-control"
                    aria-describedby="titleHelp"
                    disabled={disabled}
                    pattern=".*\S+.*"
                    onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t("please-provide-a-title"))}
                    onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                    required={true}
                />
                <small id="titleHelp" className="form-text text-muted">
                    {titleInfo}
                </small>
            </div>
            <div className="form-section">
                <label htmlFor="description" className="form-label">
                    {t("description")}
                </label>
                <textarea className="form-control" ref={props.refs.descInput} id="description" rows={3} defaultValue={props.settings.description} />
            </div>
            <div className="form-section">
                <p className="form-label">{t("list-style")}</p>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        defaultChecked={props.settings.orderByDate}
                        type="radio"
                        name="listorder"
                        ref={props.refs.orderInput}
                        id="orderedbydate"
                        disabled={disabled}
                    />
                    <label className="form-check-label" htmlFor="orderedbydate">
                        {t("date-ordered-list")}
                    </label>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        defaultChecked={!props.settings.orderByDate}
                        name="listorder"
                        id="orderedmanually"
                        disabled={disabled}
                    />
                    <label className="form-check-label" htmlFor="orderedmanually">
                        {t("manual-ordered-list")}
                    </label>
                </div>
                {orderByDateInfo && (
                    <small id="titleHelp" className="form-text text-muted">
                        {orderByDateInfo}
                    </small>
                )}
            </div>
            {newInfo && <p>{newInfo}</p>}
        </div>
    );
};
