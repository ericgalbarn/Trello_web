import Box from "@mui/material/Box";
import Column from "./Column/Column";
import Button from "@mui/material/Button";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

function ListColumns({ columns }) {
  /**
   * SortableContext requires items to be in an array state ['id-1','id-2'] not [{id: 'id-1'},{id: 'id-2'}]
   * If it's wrongly executed, chances are it's drag-n-droppable but doesn't display the animation we expect
   */
  return (
    <SortableContext
      items={columns?.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          backgroundColor: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          "&::-webkit-scrollbar-track": {
            margin: "16px",
          },
        }}
      >
        {columns?.map((column) => (
          <Column key={column._id} column={column} />
        ))}
        {/* Box Add New Column CTA */}
        <Box
          sx={{
            minWidth: "200px",
            maxWidth: "200px",
            mx: "16px",
            borderRadius: "6px",
            height: "fit-content",
            backgroundColor: "#ffffff3d",
          }}
        >
          <Button
            startIcon={<NoteAddIcon />}
            sx={{
              color: "white",
              width: "100%",
              justifyContent: "flex-start",
              pl: "20px",
              py: "8px",
            }}
          >
            Add New Column
          </Button>
        </Box>
      </Box>
    </SortableContext>
  );
}

export default ListColumns;
