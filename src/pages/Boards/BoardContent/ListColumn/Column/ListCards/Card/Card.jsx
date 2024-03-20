import { Card as MuiCard } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import GroupIcon from "@mui/icons-material/Group";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import AttachmentIcon from "@mui/icons-material/Attachment";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function Card({ temporaryHideMedia }) {
  if (temporaryHideMedia) {
    return (
      <MuiCard
        sx={{
          cursor: "pointer",
          boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
          overflow: "unset",
        }}
      >
        <CardContent
          sx={{
            padding: "12px",
            "&:last-child": { padding: "12px" },
          }}
        >
          <Typography>Test Card 01</Typography>
        </CardContent>
      </MuiCard>
    );
  }
  return (
    <MuiCard
      sx={{
        cursor: "pointer",
        boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
        overflow: "unset",
      }}
    >
      <CardMedia
        sx={{ height: 140 }}
        image="https://i0.wp.com/screenagewasteland.com/wp-content/uploads/2022/10/shaunofthedeadreview.jpg?resize=730%2C411&ssl=1"
        title="green iguana"
      />
      <CardContent
        sx={{
          padding: "12px",
          "&:last-child": { padding: "12px" },
        }}
      >
        <Typography>Eric Galbarn</Typography>
      </CardContent>
      <CardActions
        sx={{
          padding: "0 4px 8px 4px",
        }}
      >
        <Button size="small" startIcon={<GroupIcon />}>
          20
        </Button>
        <Button size="small" startIcon={<ModeCommentIcon />}>
          15
        </Button>
        <Button size="small" startIcon={<AttachmentIcon />}>
          10
        </Button>
      </CardActions>
    </MuiCard>
  );
}

export default Card;
