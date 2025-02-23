import { useRef, useContext } from "react";
import { Modal } from "bootstrap";
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
        hideModal();
        toast.info("Deleted list: " + listTitle);
        navigate(navigateTo);
    };

    const showModal = () => {
        const modalElement = modalRef.current;
        if (modalElement) {
            const bootstrapModal = new Modal(modalElement, {
                backdrop: true,
                keyboard: true,
            });
            bootstrapModal.show();
        }
    };

    const hideModal = () => {
        const modalElement = modalRef.current;
        if (modalElement) {
            const bootstrapModal = Modal.getInstance(modalElement);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
        }
    };

    return (
        <div className="delete-settings">
            <h3>Danger Zone</h3>
            <div>
                <p>
                    Delete this list (<Link to={"/?type=" + typeSettings["type"]}>{typeSettings["title"]}</Link>.) This will delete the list and all it's items
                </p>

                <div className="delete-modal">
                    <button type="button" className="btn btn-outline-danger" aria-label="Delete list" onClick={showModal}>
                        Delete List
                    </button>
                    <div className="modal fade" ref={modalRef} tabIndex={-1}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">
                                        Delete List
                                    </h5>
                                    <button type="button" className="btn-close" onClick={hideModal} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    Are you sure you want to delete the list: {typeSettings["title"]}? This action will delete this list and all its items.
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={hideModal}>
                                        Close
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={deleteList}>
                                        Delete List
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
