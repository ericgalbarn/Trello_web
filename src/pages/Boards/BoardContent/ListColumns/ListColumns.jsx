import Box from "@mui/material/Box";
import Column from "./Column/Column";
import Button from "@mui/material/Button";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

function ListColumns() {
  return (
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
      <Column />
      <Column />

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
  );
}

export default ListColumns;
