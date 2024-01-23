import Box from "@mui/material/Box";
import theme from "../../../theme";

function BoardContent() {
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        width: "100%",
        height: `calc(100vh - ${theme.trelloCustoms.navBarHeight} - ${theme.trelloCustoms.boardBarHeight})`,
        display: "flex",
        alignItems: "center",
      }}
    >
      Board Content
    </Box>
  );
}

export default BoardContent;
