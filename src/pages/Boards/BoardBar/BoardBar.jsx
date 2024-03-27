import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import HdrAutoIcon from '@mui/icons-material/HdrAuto';
import FilterListIcon from '@mui/icons-material/FilterList';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { capitalizeFirstLetter } from '~/utils/formatters';

const MENU_STYLES = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    backgroundColor: 'primary.50',
  }
};
function BoarBar({ board }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        borderBottom: '1px solid white',
        backgroundColor: (theme) => (
          theme.palette.mode === 'dark'?'#34495e' : '#1976d2')

      }}>
      <Box sx={{ display:'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label={board?.title}
          variant="outlined"
          onClick={() => { }}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<LockPersonIcon />}
          label={capitalizeFirstLetter(board?.type)}
          variant="outlined"
          onClick={() => { }}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Driver"
          variant="outlined"
          onClick={() => { }}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<HdrAutoIcon />}
          label="Automation"
          variant="outlined"
          onClick={() => { }}
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          variant="outlined"
          onClick={() => { }}
        />
      </Box>
      <Box sx={{ display:'flex', alignItems: 'center', gap: 2 }}>
        <Button
          sx={{
            color: 'white',
            borderColor: '#bdc3c7',
            '&:hover': {
              borderColor: 'white',
              borderWidth: '1px',

            }
          }}
          variant="outlined"
          startIcon={<PersonAddIcon/>}
        >
        Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: '32px',
              height: '32px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '̃first-of-type': {
                backgroundColor: '#a4b0be'
              }

            }
          }}
        >
          <Tooltip title='Avatar'>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='Avatar'>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoarBar;
