import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Column from './Column/Column';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';


function ListColumns({
  columns,
  createNewColumn,
  createNewCard,
  deleteColumnDetails
}) {
  const [newColumn, setNewColumn] = React.useState(false);
  const toggleNewColumn = () => setNewColumn(!newColumn);
  const [columnTitle, setColumnTitle] = React.useState('');

  const addNewColumn = async () => {
    if (!columnTitle) {
      toast.error('Please provide a title');
      // toggleNewColumn();
      return;
    }

    const newColumnData = {
      title: columnTitle,
    };
    createNewColumn(newColumnData);
    toggleNewColumn();
    setColumnTitle('');
  };
  return (
    <SortableContext items={columns?.map(column => column._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        backgroundColor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 },
      }}>
        {columns?.map(column => (
          <Column
            key={column._id}
            column={column}
            createNewCard={createNewCard}
            deleteColumnDetails={deleteColumnDetails}
          />)
        )}
        {!newColumn
          ?
          <Box
            onClick = {toggleNewColumn}
            sx={{
              color: 'white',
              minWidth: '250px',
              MaxWidth: '250px',
              backgroundColor: '#ffffff3d',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
            }}
          >
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1,
              }}
            >
              Add new column
            </Button>
          </Box>
          :
          <Box
            sx={{
              minWidth: '250px',
              MaxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              gap: 1,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff3d'

            }}>
            <TextField
              label="Enter column title"
              type="text"
              size='small'
              variant="outlined"
              autoFocus
              value={columnTitle}
              onChange = {(e) => setColumnTitle(e.target.value)}
              sx= {{
                // minWidth: '250px',
                // maxWidth: '250px',
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
            <Box
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
                onClick={addNewColumn}
              >
                Add Column
              </Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) =>
                    theme.palette.success.light }
                }}
                onClick={toggleNewColumn}
              />
            </Box>
          </Box>
        }

      </Box>
    </SortableContext>
  );}

export default ListColumns;
