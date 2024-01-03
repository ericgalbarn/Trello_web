import { createTheme } from "@mui/material/styles";
import { blue, red } from "@mui/material/colors";
// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1DB954",
    },
    secondary: {
      main: blue[300],
    },
    error: {
      main: red.A400,
    },
    text: {
      secondary: blue[500],
    },
  },
});

export default theme;
