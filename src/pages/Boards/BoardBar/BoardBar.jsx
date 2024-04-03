import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { capitalizeFirstLetter } from "~/utils/formatters";

const MENU_STYLE = {
  color: "white",
  backgroundColor: "transparent",
  border: "none",
  paddingX: "5px",
  borderRadius: "4px",
  ".MuiSvgIcon-root": {
    color: "white",
  },
  "&:hover": {
    backgroundColor: "primary.50",
  },
};

function BoardBar({ board }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trelloCustoms.boardBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        overflowX: "auto",
        borderBottom: "1px solid #00bfa5",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
        "&::-webkit-scrollbar-track": {
          margin: "16px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          paddingX: "16px",
          gap: "16px",
        }}
      >
        <Chip
          sx={MENU_STYLE}
          icon={<DashboardIcon />}
          label="Eric Galbarn's Board"
          label={board?.title}
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label="Filter"
          clickable
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": { borderColor: "white" },
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: "10px",
            "& .MuiAvatar-root": {
              width: "34px",
              height: "34px",
              fontSize: "16px",
              border: "none",
              color: "white",
              cursor: "pointer",
              "&:first-of-type": { backgroundColor: "#a4b0be" },
            },
          }}
        >
          <Tooltip title="Alain Delon">
            <Avatar
              alt="Alain Delon"
              src="https://royalbooks.cdn.bibliopolis.com/pictures/135548d.jpg?auto=webp&v=1418082390"
            />
          </Tooltip>
          <Tooltip title="Alain Delon">
            <Avatar
              alt="Alain Delon"
              src="https://royalbooks.cdn.bibliopolis.com/pictures/135548d.jpg?auto=webp&v=1418082390"
            />
          </Tooltip>
          <Tooltip title="Alain Delon">
            <Avatar
              alt="Alain Delon"
              src="https://royalbooks.cdn.bibliopolis.com/pictures/135548d.jpg?auto=webp&v=1418082390"
            />
          </Tooltip>
          <Tooltip title="Alain Delon">
            <Avatar
              alt="Alain Delon"
              src="https://royalbooks.cdn.bibliopolis.com/pictures/135548d.jpg?auto=webp&v=1418082390"
            />
          </Tooltip>
          <Tooltip title="Alain Delon">
            <Avatar
              alt="Alain Delon"
              src="https://royalbooks.cdn.bibliopolis.com/pictures/135548d.jpg?auto=webp&v=1418082390"
            />
          </Tooltip>
          <Tooltip title="Alain Delon">
            <Avatar
              alt="Alain Delon"
              src="https://royalbooks.cdn.bibliopolis.com/pictures/135548d.jpg?auto=webp&v=1418082390"
            />
          </Tooltip>
          <Tooltip title="Alain Delon">
            <Avatar
              alt="Alain Delon"
              src="https://royalbooks.cdn.bibliopolis.com/pictures/135548d.jpg?auto=webp&v=1418082390"
            />
          </Tooltip>
          <Tooltip title="Alain Delon">
            <Avatar
              alt="Alain Delon"
              src="https://royalbooks.cdn.bibliopolis.com/pictures/135548d.jpg?auto=webp&v=1418082390"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
}

export default BoardBar;
