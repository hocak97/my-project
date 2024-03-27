import Container from '@mui/material/Container';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import { mockData } from '~/apis/mock-data';
import React from 'react';
import { mapOrder } from '~/utils/sorts';
import {
  fetchBoardDetailsAPI,
  createColumnAPI,
  createCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis';
import { generatePlaceholderCard } from '~/utils/formatters';
import { isEmpty } from 'lodash';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';


function Board() {

  const [board, setBoard] = React.useState(null);
  React.useEffect(() => {
    const boardId ='660168096261b0011c2a054c';

    fetchBoardDetailsAPI(boardId).then(board => {
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id');
      board.columns.forEach(column => {

        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id');
        }
      });

      setBoard(board);
    });
  }, []);


  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createColumnAPI(
      {
        ...newColumnData,
        boardId: board._id
      }
    );

    createdColumn.cards = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

    const newBoard = { ...board };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    setBoard(newBoard);
  };

  const createNewCard = async (newCardData) => {
    const createdCard = await createCardAPI(
      {
        ...newCardData,
        boardId: board._id
      }
    );
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId);
    if (columnToUpdate) {
      // if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
      //   columnToUpdate.cards = createdCard;
      //   columnToUpdate.cardOrderIds = [createdCard._id];
      // }
      // else {
      //   columnToUpdate.cards.push(createdCard);
      //   columnToUpdate.cardOrderIds.push(createdCard._id);
      // }
      columnToUpdate.cards.push(createdCard);
      columnToUpdate.cardOrderIds.push(createdCard._id);
    }
    setBoard(newBoard);
  };

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map(column => column._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnIds;
    setBoard(newBoard);
    updateBoardDetailsAPI(newBoard._id, {columnOrderIds: dndOrderedColumnIds });
  };

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId);
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    setBoard(newBoard);

    updateColumnDetailsAPI(columnId, {
      
      cardOrderIds: dndOrderedCardIds
    });
  };
  const moveCardToDifferentColumn = (currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnIds = dndOrderedColumns.map(column => column._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnIds;
    setBoard(newBoard);

    let prevCardOrderIds = dndOrderedColumns.find(column => column._id === prevColumnId)?.cardOrderIds;
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = [];

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(column => column._id === nextColumnId)?.cardOrderIds,
    });
  };

  const deleteColumnDetails = (columnId) => {
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.filter(column => column._id !== columnId);
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId);
    setBoard(newBoard);
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult);
    });
  };

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh' }}>
        <CircularProgress />
        <Typography>
          Loading...
        </Typography>
      </Box>
    );
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BoardBar board={board}/>
      <BoardContent
        board={board}

        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}

      />
    </Container>
  );
}

export default Board;
