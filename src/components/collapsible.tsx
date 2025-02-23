import { useState, useEffect, useRef } from "react";
import { Collapse } from "bootstrap";

const Collapsible = () => {
    const [toggle, setToggle] = useState<boolean>(false);
    const collapseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const collapseElement = collapseRef.current;
        if (collapseElement) {
            //const bootstrapCollapse = new Collapse(collapseElement, { toggle: false });
        }
    });

    const collapseTarget = () => {
        console.log("i was clicked");
        const collapseElement = collapseRef.current;
        if (collapseElement) {
            console.log("element exists");
            const bootstrapCollapse = Collapse.getInstance(collapseElement);
            setToggle(!toggle);
            if (bootstrapCollapse) {
                bootstrapCollapse.toggle();
            }
        }
    };

    return (
        <div className="py-2">
            <button className="btn btn-primary" onClick={collapseTarget}>
                Toggle collapse
            </button>
            <div className="collapse" id="collapseTarget" ref={collapseRef}>
                This is the collapsible content!
            </div>
        </div>
    );
};

export default Collapsible;
