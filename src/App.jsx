import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Typography variant="body2" color="text.secondary">
        How many balls does Hoàng Anh have?
      </Typography>
      <br />
      <Button variant="text">1 ball</Button>
      <Button variant="contained">2 balls</Button>
      <Button variant="outlined">None</Button>
      <br />
      <Slider></Slider>
    </>
  );
}

export default App;
