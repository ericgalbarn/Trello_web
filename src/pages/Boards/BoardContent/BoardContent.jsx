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
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors
  //  Require at least a 10px move out from the default position to activate drga and drop functionality

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

          // Reupdate cardOrderIds array for the expected data
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id
          );
        }
        console.log("nextColumns", nextColumns);
        return nextColumns;
      });
    }
  };
  // Trigger when you finish dragging an element => dropping
  const handleDragEnd = (event) => {
    // console.log("handleDragEnd: ", event);

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log("Card drag and drop - Not doing anything");
      return;
    }
    const { active, over } = event;

    // Check if 'over' doesn't exist (drag elsewhere then get return right away in case of any possible bugs)
    if (!over) return;

    // The assigned arrangement is different from the initial position
    if (active.id !== over.id) {
      //Take the prior position (from active)
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      //Take the new position (from over)
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);

      // ArrayMove of dnd-kit is used to arrange the initial Columns array
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);

      // 2 console.logs below will be used for future API call

      // console.log("dndOrderedColumns", dndOrderedColumns);
      // console.log("dndOrderedColumnsIds", dndOrderedColumnsIds);

      // Reupdate the original state columns after drag and drop
      setOrderedColumns(dndOrderedColumns);
    }

    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
  };
  // Animation when dropping elements
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
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
