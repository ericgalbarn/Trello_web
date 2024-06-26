import ListColumns from "./ListColumns/ListColumns";
import Box from "@mui/material/Box";
import { mapOrder } from "~/utils/sorts";
import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  // closestCenter,
  // rectIntersection,
  pointerWithin,
  getFirstCollision,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useEffect, useRef, useState } from "react";
import { cloneDeep, isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formatters";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors
  //  Require at least a 10px move out from the default position to activate drag and drop functionality

  // const pointerSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 }});

  //  If using PointerSensor as default, you have to incorporate an attribute 'touch-action': none at the drag-n-drop elements - still minor bugs

  // Require to move out 10px in order to activate the event, also to fix the event's notification after clicked
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  // Press delay of 250ms, with tolerance of 5px of movement
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 5 },
  });

  // const sensors = useSensors(pointerSensor);

  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);

  // At the same time only 1 element to be dragged (card or column)
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);

  //  Last collision point before (tackling the collision detection algo)
  const lastOverId = useRef(null);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  // Find a column based on the CardId
  const findColumnByCardId = (cardId) => {
    // Caution: use c.cards instead  of c.cardOrderIds as in the handleDragOver step, we will make data for cards till it's done then create a new cardOrderIds
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    );
  };

  //  General function that reupdate the state in case moving a Card between different Column
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prevColumns) => {
      //  Find the index of the overCard in the column in which the activeCard is supposed to be dropped
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );
      // This is a computation logic for the newCardIndex (above or below overCard) from the code library
      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;
      // Clone the old OrderedColumnsStare array to a new one to process the data then return - reupdate a new OrderColumnsState
      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );
      // Old column
      if (nextActiveColumn) {
        // Remove card from the active column (in other words, initial column, the column started moving)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        //  Add the Placeholder Card if the Column is empty: The Card dragged, nothing left in the old column
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }
        // Reupdate cardOrderIds array for the expected data
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }
      // New column
      if (nextOverColumn) {
        // Check if the dragging card exists at overColumn,
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        // Next, add the dragging card into the overColumn according to the new index position
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          activeDraggingCardData
        );

        //  Delete the Placeholder Card if it exists
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        );
        // Reupdate cardOrderIds array for the expected data
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }

      return nextColumns;
    });
  };
  // Trigger when you start dragging an element
  const handleDragStart = (event) => {
    console.log("handleDragStart: ", event);
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);

    // Only when the card is dragged, will we have the oldColumn value setup action
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
  };
  // Trigger within the dragging process of an element
  const handleDragOver = (event) => {
    //  Doing nothing while dragging the Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    // If the process of dragging card needs further adjustment to drag cards among the columns
    // console.log("handleDragOver: ", event);
    const { active, over } = event;
    //  Guarantee if active or over doesn't exist (when dragging beyond the scope) then doing nothing (to avoid page crash)
    if (!active || !over) return;

    // activeDraggingCard: Cards being dragged
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    // overCard: Cards being interacted above or below in relation to the card dragged above
    const { id: overCardId } = over;

    // Find 2 columns based on cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    // Do nothing if either of 2 columns doesn't exist in case of page crashing
    if (!activeColumn || !overColumn) return;
    // Confirm that the id of the activeColumn and overColumn doesn't match each other while dragging the elements from this column to other column
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      );
    }
  };
  // Trigger when you finish dragging an element => dropping
  const handleDragEnd = (event) => {
    // console.log("handleDragEnd: ", event);
    const { active, over } = event;

    if (!active || !over) return;

    //  Cards drag and drop process
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      console.log("Card drag and drop - Not doing anything");

      // activeDraggingCard: Cards being dragged
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      // overCard: Cards being interacted above or below in relation to the card dragged above
      const { id: overCardId } = over;

      // Find 2 columns based on cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      // Do nothing if either of 2 columns doesn't exist in case of page crashing
      if (!activeColumn || !overColumn) return;

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        );
      } else {
        // console.log("Drag and drop card activity in the same column");

        //Take the prior position (from oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        );
        //Take the new position (from over)
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        );
        // Use arrayMove as dragging card inside a column is equivalent to the logic of dragging column inside a board content
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );

        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);

          //Search for the Column we are dropping
          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );
          // Reupdate 2 new value that are card and cardOrderIds in targetColumn
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);

          // Return a new state value (precise position)
          return nextColumns;
        });
      }
    }

    // Column drag and drop process
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      console.log("Column drag and drop - Not doing anything");

      // The assigned arrangement is different from the initial position
      if (active.id !== over.id) {
        //Take the prior position (from active)
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        );
        //Take the new position (from over)
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        );

        // ArrayMove of dnd-kit is used to arrange the initial Columns array
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        );
        // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);

        // 2 console.logs below will be used for future API call

        // console.log("dndOrderedColumns", dndOrderedColumns);
        // console.log("dndOrderedColumnsIds", dndOrderedColumnsIds);

        // Reupdate the original state columns after drag and drop
        setOrderedColumns(dndOrderedColumns);
      }
    }
    //  All the data after drag and drop process has to return to the default null value as initially
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
  };
  // Animation when dropping elements
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  // We will recustom the strategy/ optimized collision detection algo for dragging and dropping card among multiple columns
  // args = arguments
  const collisionDetectionStrategy = useCallback(
    (args) => {
      // It's best to use the closestCorners algo for dragging the column
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }
      // Find the intersection point collision - intersect to the pointer
      const pointerIntersections = pointerWithin(args);

      //  If pointerIntersection is an empty array, return will do nothing
      if (!pointerIntersections?.length) return;

      // Collision detection algo will return the collision array here
      // const intersections = !!pointerIntersections?.length
      //   ? pointerIntersections
      //   : rectIntersection(args);

      // The first overId in the above pointerIntersections
      let overId = getFirstCollision(pointerIntersections, "id");
      if (overId) {
        // This part is for the flickering
        //  If the over is the column then we'll find the to closest cardId inside that collision area based on either the closestCenter or closestCorners collision detection algo are fine. However, the usage of closestCorners seems more viable.
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        );
        if (checkColumn) {
          // console.log("overId before: ", overId);
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                );
              }
            ),
          })[0]?.id;
          // console.log("overId after:", overId);
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }
      // If overId is null, it will return an empty array - in case page crash
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumns]
  );
  return (
    <DndContext
      sensors={sensors}
      // Collision algorithm, use closestCorners instead of closestCenter
      // If only use closestCorners, there will be bug flickering + wrong data
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.trelloCustoms.boardContentHeight,
          padding: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemId || !activeDragItemType) && null}
          {activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
              <Column column={activeDragItemData} />
            )}
          {activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
              <Card card={activeDragItemData} />
            )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
