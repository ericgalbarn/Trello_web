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

const MENU_STYLE = {
  color: "primary.main",
  backgroundColor: "background.default",
  border: "none",
  paddingX: "5px",
  borderRadius: "4px",
  "& .MuiSvgIcon-root": {
    color: "primary.main",
  },
  "&:hover": {
    backgroundColor: "primary.50",
  },
};

function BoardBar() {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        width: "100%",
        height: (theme) => theme.trelloCustoms.boardBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        overflowX: "auto",
        borderTop: "1px solid #00bfa5",
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
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
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
        <Button variant="outlined" startIcon={<PersonAddIcon />}>
          Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            "& .MuiAvatar-root": {
              width: "34px",
              height: "34px",
              fontSize: "16px",
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
