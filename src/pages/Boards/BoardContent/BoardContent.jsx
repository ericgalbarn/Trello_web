import ListColumns from "./ListColumns/ListColumns";
import Box from "@mui/material/Box";
import { mapOrder } from "~/utils/sorts";

const COLUMN_HEADER_HEIGHT = "50px";
const COLUMN_FOOTER_HEIGHT = "56px";

function BoardContent({ board }) {
  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, "_id");
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
      <ListColumns columns={orderedColumns} />
    </Box>
  );
}

export default BoardContent;
