import React from 'react';
import Box from '@mui/material/Box';
import ListColumns from './ListColumns/ListColumns';
import { arrayMove } from '@dnd-kit/sortable';
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
};
import {
  DndContext,
  useSensor,
  useSensors,
  // MouseSensor,
  // TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  // closestCenter,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
  // collisionDetectionStrategy,
} from '@dnd-kit/core';
import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/ListCards/ThisCard/ThisCard';
import { cloneDeep, isEmpty } from 'lodash';
import { generatePlaceholderCard } from '~/utils/formatters';
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensor';

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn,
  deleteColumnDetails
}) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, tolerance: 5
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);


  const [orderedColumns, setOrderedColumns] = React.useState([]);
  const [activeDragItemId, setActiveDragItemId] = React.useState(null);
  const [activeDragItemType, setActiveDragItemType] = React.useState(null);
  const [activeDragItemData, setActiveDragItemData] = React.useState(null);
  const [oldColumn, setOldColumn] = React.useState(null);

  const lastOverId = React.useRef(null);

  React.useEffect(() => {setOrderedColumns(board.columns);
  }, [board]);


  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId));
  };

  const moveCardsBetweenTwoColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom,
  ) => {
    setOrderedColumns(prevColumns => {
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId);
      let newCardIndex;
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBelowOverItem ? 1 : 0;

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;

      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id);
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id);

      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId);
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id);
      }

      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId);
        const rebuildActiveDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuildActiveDraggingCardData);
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard);
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id);
      }
      if (triggerFrom === 'handleDragEnd') {
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumn._id,
          nextOverColumn._id,
          nextColumns
        );
      }
      return nextColumns;
    });
  };

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId ?
        ACTIVE_DRAG_ITEM_TYPE.CARD :
        ACTIVE_DRAG_ITEM_TYPE.COLUMN);
    setActiveDragItemData(event?.active?.data?.current);
    if (event?.active?.data?.current?.columnId) {
      setOldColumn(findColumnByCardId(event?.active?.id));
    }
  };

  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) {
      return;
    }
    const { active, over } = event;

    if (!active || !over) return;

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active;
    const { id: overCardId } = over;

    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);
    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      moveCardsBetweenTwoColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver');
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD ) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active;
      const { id: overCardId } = over;
      // console.log('active', activeDraggingCardId);
      // console.log('over', overCardId);
      const activeColumn = findColumnByCardId(activeDraggingCardId);
      // console.log('activeColumn', activeColumn);
      const overColumn = findColumnByCardId(overCardId);

      if (!activeColumn || !overColumn) return;

      if (oldColumn._id !== overColumn._id) {
        moveCardsBetweenTwoColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd');

      } else {
        const oldCardIndex = oldColumn?.cards?.findIndex(card => card._id === activeDragItemId);
        const newCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId);
        const dndOrderedCards = arrayMove(oldColumn.cards, oldCardIndex, newCardIndex);
        const dndOrderedCardIds = dndOrderedCards.map(card => card._id);

        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns);
          const targetColumn = nextColumns.find(column => column._id === overColumn._id);
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCardIds;
          return nextColumns;
        });

        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumn._id);
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(column => column._id === active.id);
        const newColumnIndex = orderedColumns.findIndex(column => column._id === over.id);
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex);
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id);

        setOrderedColumns(dndOrderedColumns);
        moveColumns(dndOrderedColumns);
      }
    }

    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumn(null);
  };

  const collisionDetectionStrategy = React.useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args });
    }
    const pointerIntersections = pointerWithin(args);

    if (!pointerIntersections?.length) return;

    // const intersections = !!pointerIntersections?.length ?
    //   pointerIntersections : rectIntersection(args);

    let overId = getFirstCollision(pointerIntersections, 'id');

    if (overId) {
      const checkColumn = orderedColumns.find(column => column._id === overId);
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            container => (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          )
        })[0]?.id;
      }
      lastOverId.currentOverId = overId;
      return [{ id: overId }];
    }

    return lastOverId.current? [{ id: lastOverId.current }] : [];
  }, [activeDragItemType, orderedColumns]);

  const dropAnimation = {
    sideEffects:defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  };

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        backgroundColor: (theme) => (
          theme.palette.mode === 'dark'?'#34495e' : '#1976d2'),
        width: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          deleteColumnDetails={deleteColumnDetails}
        />
        <DragOverlay dropAnimation={dropAnimation}>
          {(!activeDragItemType && null)}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData}/>)}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData}/>)}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
