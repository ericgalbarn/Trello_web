import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import ModeSelect from "~/components/ModeSelect";
import AppBar from "~/components/AppBar";
import theme from "~/theme";
import BoardBar from "~/pages/Boards/BoardBar";
import BoardContent from "~/pages/Boards/BoardContent";
function Board() {
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: "100vh", backgroundColor: "primary.main" }}
    >
      <AppBar />
      <BoardBar />
      <BoardContent />
    </Container>
  );
}

export default Board;
