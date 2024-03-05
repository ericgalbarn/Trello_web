import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
// import { cyan, deepOrange, orange, teal } from "@mui/material/colors";
import { AirplayOutlined } from "@mui/icons-material";
// Create a theme instance.
const theme = extendTheme({
  trelloCustoms: {
    navBarHeight: "58px",
    boardBarHeight: "60px",
  },
  palette: {
    mode: "light", // You can set the default mode if needed
    background: {
      default: "#fff", // Set the default background color
    },
  },
  colorSchemes: {
    light: {},
    dark: {},
  },
  components: {
    // Name of the component

    // Scrollbar adjustment
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#dcdde1",
            borderRadius: "8px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "white",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontSize: "1rem",
          textTransform: "none",
          borderWidth: "0.5px",
          "&:hover": { borderWidth: "0.5px" },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        // Name of the slot
        root: { fontSize: "0.875rem" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          "& fieldset": { borderWidth: "0.5px !important" },
          "&:hover fieldset": { borderWidth: "1px !important" },
          "&.Mui-focused fieldset": { borderWidth: "1px !important" },
        },
      },
    },
  },
  // ...other properties
});

export default theme;
