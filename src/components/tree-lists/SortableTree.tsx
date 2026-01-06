import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    Announcements,
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverlay,
    DragMoveEvent,
    DragEndEvent,
    DragOverEvent,
    MeasuringStrategy,
    DropAnimation,
    Modifier,
    defaultDropAnimation,
    UniqueIdentifier,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { FlattenedItem, SensorContext, TreeItems } from "./types";
import { buildTree, flattenTree, getProjection, getChildCount, removeChildrenOf, setProperty, getChildrenByID } from "./utils/tree";
import { getTopLevelID, setDepthToZero } from "./utils/navigation";
import { sortableTreeKeyboardCoordinates } from "./keyboardCoordinates";
import { SortableTreeItem } from "./components/TreeItem";
import TreeFooterNav from "./tree-footer-nav";

import { useAppDispatch } from "../../app/hooks";
import { removeListItems } from "../../features/lists-slice";
import { getIDs } from "../../utils/utils";

const measuring = {
    droppable: {
        strategy: MeasuringStrategy.Always,
    },
};

const dropAnimationConfig: DropAnimation = {
    keyframes({ transform }) {
        return [
            { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
            {
                opacity: 0,
                transform: CSS.Transform.toString({
                    ...transform.final,
                    x: transform.final.x + 5,
                    y: transform.final.y + 5,
                }),
            },
        ];
    },
    easing: "ease-out",
    sideEffects({ active }) {
        active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: defaultDropAnimation.duration,
            easing: defaultDropAnimation.easing,
        });
    },
};

interface Props {
    treeItems: TreeItems;
    type: string;
    collapsible?: boolean;
    indentationWidth?: number;
    indicator?: boolean;
    removable?: boolean;
    newListItem: React.RefObject<HTMLLIElement | null> | null;
    latestListItemID: number;
    handleDragUpdate: (items: FlattenedItem[]) => void;
    handleNavigate: () => void;
}

export function SortableTree(props: Props) {
    // Setting defaults for optional arguments.
    const collapsible = props?.collapsible || false;
    const indicator = props?.indicator || false;
    //const removable = props?.removable || false;
    const indentationWidth = props?.indentationWidth || 50;

    const [items, setItems] = useState(props.treeItems);
    const [activeID, setActiveID] = useState<UniqueIdentifier | null>(null);
    const [overID, setOverID] = useState<UniqueIdentifier | null>(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [currentPosition, setCurrentPosition] = useState<{
        parentID: UniqueIdentifier | null;
        overID: UniqueIdentifier;
    } | null>(null);

    const dispatch = useAppDispatch();
    const topLevelID = getTopLevelID(flattenTree(items));
    const listClass = topLevelID > 0 ? " parent-list" : "";

    const flattenedItems = useMemo(() => {
        let flattenedTree = flattenTree(items);

        if (topLevelID > 0) {
            const topLevelChildren = getIDs<FlattenedItem>(getChildrenByID(flattenedTree, topLevelID));
            flattenedTree = flattenedTree.filter((item) => topLevelChildren.includes(+item.id));

            // Set depth to zero
            flattenedTree = setDepthToZero(flattenedTree);
        }

        let collapsedItems = flattenedTree.filter((item) => {
            return item.collapsed && item.hasChildren;
        });

        const collapsedItemIDs: UniqueIdentifier[] = collapsedItems.map((item) => item.id);

        // Removes collapsed and active id children
        return removeChildrenOf(flattenedTree, activeID != null ? [activeID, ...collapsedItemIDs] : collapsedItemIDs);
    }, [activeID, items, topLevelID]);

    const projected = activeID && overID ? getProjection(flattenedItems, activeID, overID, offsetLeft, indentationWidth) : null;
    const sensorContext: SensorContext = useRef({
        items: flattenedItems,
        offset: offsetLeft,
    });
    const [coordinateGetter] = useState(() => sortableTreeKeyboardCoordinates(sensorContext, indicator, indentationWidth));
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter,
        })
    );

    const sortedIDs = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);
    const activeItem = activeID ? flattenedItems.find(({ id }) => id === activeID) : null;

    useEffect(() => {
        sensorContext.current = {
            items: flattenedItems,
            offset: offsetLeft,
        };
    }, [flattenedItems, offsetLeft]);

    const announcements: Announcements = {
        onDragStart({ active }) {
            return `Picked up ${active.id}.`;
        },
        onDragMove({ active, over }) {
            return getMovementAnnouncement("onDragMove", active.id, over?.id);
        },
        onDragOver({ active, over }) {
            return getMovementAnnouncement("onDragOver", active.id, over?.id);
        },
        onDragEnd({ active, over }) {
            return getMovementAnnouncement("onDragEnd", active.id, over?.id);
        },
        onDragCancel({ active }) {
            return `Moving was cancelled. ${active.id} was dropped in its original position.`;
        },
    };

    return (
        <DndContext
            accessibility={{ announcements }}
            sensors={sensors}
            collisionDetection={closestCenter}
            measuring={measuring}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            {flattenedItems.length > 0 && (
                <ul className={"tree-list-tree list-group list-group-flush" + listClass}>
                    <SortableContext items={sortedIDs} strategy={verticalListSortingStrategy}>
                        {flattenedItems.map(({ id, text, textFormat, collapsed, hasChildren, depth }) => (
                            <SortableTreeItem
                                key={id}
                                id={id}
                                type={props.type}
                                newListItem={id === props.latestListItemID ? props.newListItem : null}
                                value={text}
                                textFormat={textFormat}
                                depth={id === activeID && projected ? projected.depth : depth}
                                indentationWidth={indentationWidth}
                                indicator={indicator}
                                collapsed={Boolean(collapsed && hasChildren)}
                                onCollapse={collapsible && hasChildren ? () => handleCollapse(id) : undefined}
                                onRemove={() => handleRemove(id)}
                                onNavigate={props.handleNavigate}
                            />
                        ))}
                        {createPortal(
                            <DragOverlay dropAnimation={dropAnimationConfig} modifiers={indicator ? [adjustTranslate] : undefined}>
                                {activeID && activeItem ? (
                                    <SortableTreeItem
                                        id={activeID}
                                        type={props.type}
                                        newListItem={null}
                                        depth={activeItem.depth}
                                        clone
                                        childCount={getChildCount(items, activeID) + 1}
                                        value={activeItem.text.toString()}
                                        textFormat={Number(activeItem.textFormat)}
                                        indentationWidth={indentationWidth}
                                    />
                                ) : null}
                            </DragOverlay>,
                            document.body
                        )}
                    </SortableContext>
                </ul>
            )}
            {!flattenedItems.length && <TreeFooterNav type={props.type} id={topLevelID} />}
        </DndContext>
    );

    function handleDragStart({ active: { id: activeID } }: DragStartEvent) {
        setActiveID(activeID);
        setOverID(activeID);

        const activeItem = flattenedItems.find(({ id }) => id === activeID);

        if (activeItem) {
            setCurrentPosition({
                parentID: activeItem.parentID,
                overID: activeID,
            });
        }

        document.body.style.setProperty("cursor", "grabbing");
    }

    function handleDragMove({ delta }: DragMoveEvent) {
        setOffsetLeft(delta.x);
    }

    function handleDragOver({ over }: DragOverEvent) {
        setOverID(over?.id ?? null);
    }

    function handleDragEnd({ active, over }: DragEndEvent) {
        resetState();

        if (projected && over) {
            let { depth, parentID } = projected;
            const clonedItems: FlattenedItem[] = flattenTree(items);
            const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
            const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
            const activeTreeItem = clonedItems[activeIndex];

            if (topLevelID > 0 && parentID === null) {
                parentID = topLevelID;
            }

            clonedItems[activeIndex] = { ...activeTreeItem, depth, parentID };

            const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
            const newItems = buildTree(sortedItems);
            setItems(newItems);

            props.handleDragUpdate(flattenTree(newItems));
        }
    }

    function handleDragCancel() {
        resetState();
    }

    function resetState() {
        setOverID(null);
        setActiveID(null);
        setOffsetLeft(0);
        setCurrentPosition(null);

        document.body.style.setProperty("cursor", "");
    }

    function handleRemove(id: UniqueIdentifier) {
        const children = getChildrenByID(flattenedItems, id);
        const childIDs = children.map((item) => Number(item.id));
        const ids = [...childIDs, Number(id)];

        dispatch(removeListItems({ ids: ids, type: props.type }));
    }

    function handleCollapse(id: UniqueIdentifier) {
        const newItems = setProperty([...items], id, "collapsed", (value) => {
            return !value;
        });
        setItems(newItems);
    }

    function getMovementAnnouncement(eventName: string, activeID: UniqueIdentifier, overID?: UniqueIdentifier) {
        if (overID && projected) {
            if (eventName !== "onDragEnd") {
                if (currentPosition && projected.parentID === currentPosition.parentID && overID === currentPosition.overID) {
                    return;
                } else {
                    setCurrentPosition({
                        parentID: projected.parentID,
                        overID,
                    });
                }
            }

            const clonedItems: FlattenedItem[] = JSON.parse(JSON.stringify(flattenTree(items)));
            const overIndex = clonedItems.findIndex(({ id }) => id === overID);
            const activeIndex = clonedItems.findIndex(({ id }) => id === activeID);
            const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

            const previousItem = sortedItems[overIndex - 1];

            let announcement;
            const movedVerb = eventName === "onDragEnd" ? "dropped" : "moved";
            const nestedVerb = eventName === "onDragEnd" ? "dropped" : "nested";

            if (!previousItem) {
                const nextItem = sortedItems[overIndex + 1];
                if (nextItem) {
                    announcement = `${activeID} was ${movedVerb} before ${nextItem.id}.`;
                }
            } else {
                if (projected.depth > previousItem.depth) {
                    announcement = `${activeID} was ${nestedVerb} under ${previousItem.id}.`;
                } else {
                    let previousSibling: FlattenedItem | undefined = previousItem;
                    while (previousSibling && projected.depth < previousSibling.depth) {
                        const parentID: UniqueIdentifier | null = previousSibling.parentID;
                        previousSibling = sortedItems.find(({ id }) => id === parentID);
                    }

                    if (previousSibling) {
                        announcement = `${activeID} was ${movedVerb} after ${previousSibling.id}.`;
                    }
                }
            }

            return announcement;
        }

        return;
    }
}

const adjustTranslate: Modifier = ({ transform }) => {
    return {
        ...transform,
        y: transform.y - 25,
    };
};
