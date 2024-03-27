import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Cloud from '@mui/icons-material/Cloud';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import AddCardIcon from '@mui/icons-material/AddCard';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ListCards from './ListCards/ListCards';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'react-toastify';
import { useConfirm } from "material-ui-confirm";

function Column({ column, createNewCard, deleteColumnDetails }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data:{ ...column }
  });
  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
    // touchAction: 'none',
  };

  const orderedCards = column.cards;

  const [newCard, setNewCard] = React.useState(false);
  const toggleNewCard = () => setNewCard(!newCard);
  const [cardTitle, setCardTitle] = React.useState('');

  const addNewCard = async () => {
    if (!cardTitle) {
      toast.error('Please provide a title', {
        position: "bottom-right",
      });
      return;
    }

    const newCardData = {
      title: cardTitle,
      columnId: column._id
    };

    createNewCard(newCardData);

    toggleNewCard();
    setCardTitle('');
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const confirmDeleteColumn = useConfirm();
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Xóa Cột',
      description: 'Bạn có muốn xóa cột này?',
      confirmationText: 'Đồng Ý',
      cancellationText: 'Hủy',
    })
      .then(() => {
        deleteColumnDetails(column._id);
      })
      .catch(() => {
      });

  };
  return (
    <div
      ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
    >
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          MaxWidth: '300px',
          backgroundColor: (theme) => (
            theme.palette.mode === 'dark'?'#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`

        }}>
        <Box sx={{
          height: (theme) => theme.trello.columnHeaderHeight,
          p:2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Typography
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
            variant='h6'
          >
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title='More options'>
              <ExpandMoreIcon
                sx={{
                  color: 'text.primary', cursor: 'pointer',
                }}
                id='basic-column-dropdown'
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id='basic-menu-column-dropdown'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby':'basic-column-dropdown'
              }}
            >
              <MenuItem
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': {
                      color: 'success.light',
                    }
                  }
                }}
                onClick={toggleNewCard}
              >
                <ListItemIcon>
                  <AddCardIcon className='add-card-icon' fontSize='small' />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize='small' />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize='small' />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize='small' />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider/>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize='small' />
                </ListItemIcon>
                <ListItemText>
                  Archive this column
                </ListItemText>
              </MenuItem>
              <MenuItem
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': {
                      color: 'warning.dark',
                    }
                  }
                }}
                onClick={handleDeleteColumn}
              >
                <ListItemIcon>
                  <DeleteForeverIcon className='delete-forever-icon' fontSize='small' />
                </ListItemIcon>
                <ListItemText>
                  Delete this column
                </ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        <ListCards cards={orderedCards}/>
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p:2
        }}>
          {!newCard?
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Button
                startIcon={<AddCardIcon/>}
                onClick={toggleNewCard}
              >
                Add new card
              </Button>
              <Tooltip title='Drag card'>
                <DragHandleIcon sx={{ cursor: 'pointer' }}/>
              </Tooltip>
            </Box>
            :
            <Box
              sx={{
                height:'100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
              <TextField
                label="Enter card title"
                type="text"
                size='small'
                variant="outlined"
                autoFocus
                data-no-dnd='true'
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                sx= {{
                  '& label': { color: 'text.primary' },
                  '& input': { color: (theme) => theme.palette.primary.main,
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#333643' : 'white' },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main, },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box
                data-no-dnd='true'
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                <Button
                  variant='contained'
                  color='success'
                  size='small'
                  sx={{
                    boxShadow: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { backgroundColor: (theme) =>
                      theme.palette.success.main, boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',}
                  }}
                  onClick={addNewCard}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: (theme) => theme.palette.warning.main,
                    cursor: 'pointer',
                  }}
                  onClick={toggleNewCard}
                />
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </div>
  );}

export default Column;
