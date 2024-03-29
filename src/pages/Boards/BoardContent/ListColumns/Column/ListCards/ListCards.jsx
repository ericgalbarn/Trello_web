import Box from "@mui/material/Box";
import Card from "./Card/Card";

function ListCards() {
  return (
    <Box
      sx={{
        padding: "0 5px ",
        margin: "0 5px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        overflowX: "hidden",
        overflowY: "auto",
        maxHeight: (theme) =>
          `calc(${theme.trelloCustoms.boardContentHeight} - ${theme.spacing(
            5
          )} - ${theme.trelloCustoms.columnHeaderHeight} - ${
            theme.trelloCustoms.columnFooterHeight
          }) `,
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ced0da",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#bfc2cf",
        },
      }}
    >
      <Card />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
      <Card temporaryHideMedia />
    </Box>
  );
}

export default ListCards;
