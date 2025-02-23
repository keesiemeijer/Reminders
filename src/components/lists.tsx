import DateLists from "./date-lists/date-lists";
import TreeLists from "./tree-lists/tree-lists";

const Lists = (props: { type: string }) => {
    return (
        <div className="lists">
            {"date" === props.type && <DateLists />}
            {"tree" === props.type && <TreeLists />}
        </div>
    );
};

export default Lists;
