import Box from "@mui/material/Box";
import theme from "~/theme";

function BoardContent() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
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
