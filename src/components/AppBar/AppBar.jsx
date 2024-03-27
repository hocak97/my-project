import { useState } from 'react';
import ModeSelect from '~/components/ModeSelect/ModeSelect';
import Box from '@mui/material/Box';
import AppsIcon from '@mui/icons-material/Apps';
import { ReactComponent as logoIcon } from '../../assets/logo.svg';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Workspace from './Menus/Workspaces';
import Recent from './Menus/Recent';
import Starred from './Menus/Starred';
import Profiles from './Menus/Profiles';
import Templates from './Menus/Templates';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Badge from '@mui/material/Badge';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
// import { mockDataTest } from '~/apis/mock-data-copy';

function AppBar() {
  const [searchValue, setSearchValue] = useState('');
  return (
    <Box px={2} sx={{
      // backgroundColor: 'primary.light',
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      backgroundColor: (theme) => (
        theme.palette.mode === 'dark'?'#2c3e50' : '#1565c0')
    }}>
      {/* <Box>
        {Object.entries(mockDataTest).forEach((key, value) => {
          console.log(`${key} ${value}`);
        })}
      </Box> */}

      <Box sx={{ display:'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'white' }}/>
        <Box sx={{ display:'flex', alignItems: 'center', gap: 0.5, color: 'white' }}>
          <SvgIcon component={logoIcon} inheritViewBox fontSize='small'/>
          <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
            MY PROJECT
          </Typography>
        </Box>
        <Box sx={{ display:{ xs: 'none', md: 'flex'}, alignItems: 'center', gap: 2 }}>
          <Workspace />
          <Recent />
          <Starred />
          <Templates />
          <Button
            sx={{
              color: 'white',
              border: 'none',
              '&:hover': {
                border: 'none',
              }
            }}
            variant="outlined"
            startIcon={<LibraryAddIcon/>}
          >
            Create
          </Button>
        </Box>

      </Box>
      <Box sx={{ display:'flex', alignItems: 'center', gap: 2, }}>
        <TextField
          id="outlined-search"
          label="Search ..."
          type="text"
          size='small'
          value={searchValue}
          onChange = {(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }}/>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <CloseIcon
                  fontSize='small'
                  sx={{ color: searchValue ? 'white' : 'transparent', cursor: 'pointer'}}
                  onClick={() => setSearchValue('')}
                />
              </InputAdornment>
            )
          }}
          sx= {{
            minWidth: '120px',
            maxWidth: '180px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#bdc3c7',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              }
            },
          }}
        />
        <ModeSelect />
        <Tooltip title="Notifications">
          <Badge color="warning" variant="dot" sx={{ cursor:'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'white' }}/>
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <Badge color="secondary" sx={{ cursor:'pointer' }}>
            <HelpOutlineIcon sx={{ color: 'white' }}/>
          </Badge>
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar;
