import { useRef, useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { DeleteListType } from "../../features/lists-slice";
import { TypeSettingContext } from "../../contexts/type-setting-context";
import { getFirstListObject } from "../../utils/type";

const DeleteSettings = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const modalRef = useRef<HTMLDivElement>(null);
    const typeSettings = useContext(TypeSettingContext);
    const { t } = useTranslation("settings");
    const listTitle = typeSettings["title"];
    const listsState = useAppSelector((state) => state.lists);

    const deleteList = () => {
        // Redirect to add new list if there are no types left after deletion
        let navigateTo = "/add-new-list";

        // Fake delete item
        const newState = listsState.filter((element) => element.type !== typeSettings["type"]);
        if (newState.length) {
            const firstItem = getFirstListObject(newState);
            if (firstItem) {
                // Redirect to first item
                navigateTo = "/?type=" + firstItem["type"];
            }
        }

        dispatch(DeleteListType(typeSettings["type"]));
        toast.info("Deleted list: " + listTitle);
        navigate(navigateTo);
    };

    return (
        <div className="delete-settings">
            <h3>{t("danger-zone")}</h3>
            <div>
                <p>
                    {/* https://stackoverflow.com/questions/72030446/react-18-react-i18next-trans-component-interpolation-issue */}
                    <Trans t={t} i18nKey="delete-this-list" values={{ list: typeSettings.title }}>
                        Delete this list (<Link to={"/?type=" + typeSettings.type}>list</Link>)
                    </Trans>{" "}
                    {t("this-will-delete-the-list-and-all-its-items")}
                </p>

                <div className="delete-modal">
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        aria-label={t("delete-list")}
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                    >
                        {t("delete-list")}
                    </button>
                    <div className="modal fade" id="exampleModal" ref={modalRef} tabIndex={-1}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">
                                        {t("delete-list")}
                                    </h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    {t("are-you-sure-you-want-to-delete-the-list", { list: typeSettings["title"] })}?{" "}
                                    {t("this-action-will-delete-this-list-and-all-its-items")}.
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        {t("close")}
                                    </button>
                                    <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteList}>
                                        {t("delete-list")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteSettings;
