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
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

const COLUMN_HEADER_HEIGHT = "50px";
const COLUMN_FOOTER_HEIGHT = "56px";

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

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const handleDragEnd = (event) => {
    // console.log("handleDragEnd: ", event);
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
  };
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
      </Box>
    </DndContext>
  );
}

export default BoardContent;
