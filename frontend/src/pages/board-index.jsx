import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'

import { GroupList } from '../cmps/group-list'
import { BoardHeader } from '../cmps/board-header'
import { loadBoards, setCurrBoard, updateBoard } from '../store/board.actions'
import { boardService } from '../services/board.service'
import { Loader } from '../cmps/loader'
import { BoardMenu } from '../cmps/board-menu'
import { loadActivities } from '../store/activity.actions'

export function BoardIndex() {
  const boards = useSelector((storeState) => storeState.boardModule.boards)
  const activities = useSelector((storeState) => storeState.activityModule.activities)
  const board = useSelector((storeState) => storeState.boardModule.currBoard)
  const { boardId } = useParams()
  // const [board, setBoard] = useState(boardService.getEmptyBoard())
  const [isMenuHidden, setIsMenuHidden] = useState(false)
  const showMenuClass = isMenuHidden ? 'is-show-menu' : ''

  useEffect(() => {
    loadBoards()
  }, [])

  useEffect(() => {
    if (boards.length !== 0) {
      const newBoard = boards.filter((board) => board._id === boardId)[0]

      setCurrBoard(newBoard)
      loadActivities({ boardId: newBoard._id })
    }
  }, [boards])

  async function onUpdateGroupTitle(groupId, newTitle) {
    const groupIdx = board.groups.findIndex((group) => group._id === groupId)

    const newGroups = [...board.groups]
    newGroups[groupIdx].title = newTitle

    const newBoard = { ...board, groups: newGroups }
    // setBoard(newBoard)

    try {
      await updateBoard(newBoard)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function onMoveTask(sourceGroupId, destGroupId, taskSourceIdx, taskDestIdx) {
    const newBoard = boardService.move('task', board, sourceGroupId, destGroupId, taskSourceIdx, taskDestIdx)
    // setBoard(newBoard)
    try {
      await updateBoard(newBoard)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function onMoveGroup(sourceGroupId, destGroupId) {
    const newBoard = boardService.move('group', board, sourceGroupId, destGroupId)
    // setBoard(newBoard)
    try {
      await updateBoard(newBoard)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function onAddGroup(group) {
    const newBoard = { ...board }
    newBoard.groups.push(group)
    // setBoard(newBoard)

    try {
      await updateBoard(newBoard)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function onChangeTitle(title) {
    const newBoard = { ...board, title }
    console.log(newBoard)
    try {
      await updateBoard(newBoard)
    } catch (err) {
      console.log('err', err)
    }
  }

  let boardStyle = {}
  if (board && board.style) {
    if (board.style.type === 'bgColor') {
      boardStyle = { backgroundColor: board.style.bgColor }
    } else if (board.style.type === 'img') {
      boardStyle = {
        backgroundImage: `url(${board.style.imgUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
  }
  if (!board) return <Loader />

  return (
    <section style={boardStyle} className="board-index flex column">
      <Outlet />
      <BoardHeader board={board} onChangeTitle={onChangeTitle} showMenuClass={showMenuClass} setIsMenuHidden={setIsMenuHidden} />
      <GroupList
        board={board}
        onDndTask={onMoveTask}
        onDndGroup={onMoveGroup}
        onUpdateGroupTitle={onUpdateGroupTitle}
        onAddGroup={onAddGroup}
        showMenuClass={showMenuClass}
      />
      <BoardMenu board={board} setIsMenuHidden={setIsMenuHidden} showMenuClass={showMenuClass} />
    </section>
  )
}
