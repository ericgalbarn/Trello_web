
import ListColumns from "./ListColumns/ListColumns";
import Box from "@mui/material/Box";
import Box from "@mui/material/Box";
import ListColumns from "./ListColumn/ListColumns";


const COLUMN_HEADER_HEIGHT = "50px";
const COLUMN_FOOTER_HEIGHT = "56px";

function BoardContent() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
        width: "100%",
        height: (theme) => theme.trelloCustoms.boardContentHeight,
        padding: "10px 0",
      }}
    >
      <ListColumns />
    </Box>
  );
}

export default BoardContent;
