import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { boardService } from '../services/board.service.local'
import { usePopover } from '../customHooks/usePopover'
import { Popover } from './popover'
import { ShowMembersLabels } from './task-details/show-members-labels'
import { HiXMark } from 'react-icons/hi2'
import { TaskCover } from './task-details/task-cover'
import { TaskDetailsHeader } from './task-details/task-details-header'
import { ActionsList } from './task-details/actions-list'
import { saveTask, updateBoard } from '../store/board.actions'
import { activityService, createActivity } from '../services/activity.service'

import { TaskAttachments } from './task-details/task-attachments'
import UploadAndDisplayImage from './task-details/test'
import { ChecklistIndex } from './task-details/checklist/checklist-index'
import { utilService } from '../services/util.service'

export function TaskDetails() {
  const board = useSelector((storeState) => storeState.boardModule.currBoard)
  const user = useSelector((storeState) => storeState.userModule.user)
  const { taskId, boardId } = useParams()
  const [task, setTask] = useState(boardService.getEmptyTask())
  const [addedProps, setAddedProps] = useState({})
  const [popoverProps, onTogglePopover] = usePopover()
  const taskDetails = useRef()

  const navigate = useNavigate()

  useEffect(() => {
    if (board) {
      setTask(boardService.getTaskById(board ? board : [], taskId))
    }
  }, [board])

  // useEffect(() => {
  //   console.log('reload')
  //   if (boards.length !== 0) {
  //     // setBoard(...boards.filter((board) => board._id === boardId))
  //     console.log('boardService.getTaskById(board ? board : [], taskId)', boardService.getTaskById(board ? board : [], taskId))
  //     setTask(boardService.getTaskById(board ? board : [], taskId))
  //   }
  // }, [boards])

  function onOpenPopover(e, props, type) {
    props.refElement = taskDetails.current
    setAddedProps(props)
    onTogglePopover(e, type)
  }

  async function onHandleTaskMembers(activityType, member) {
    try {
      let activity = activityService.createActivity(activityType, user, member, task)
      const updatedTask = boardService.toggleMemberOnTask(task, member, activityType)
      await saveTask(board, updatedTask, activity)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function onAddChecklist(title) {

    try {
      const activity = activityService.createActivity('add-checklist', user, task)
      const newChecklist = { _id: utilService.makeId(), title, todos: [] }
      const newChecklists = [...task.checklists, newChecklist]
      const updatedTask = { ...task, checklists: newChecklists }
      await saveTask(board, updatedTask, activity)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function onDeleteChecklist(checklistId) {
    try {
      const checklistIdx = task.checklists.findIndex(checklist => checklistId === checklist._id)
      const updatedTask = task.checklists.splice(checklistIdx, 1)
      const activity = activityService.createActivity('delete-checklist', user, task)
      await saveTask(board, updatedTask, activity)
    } catch (err) {
      console.error('err', err)
    }
  }

  async function onEditChecklist(checklistId, title) {
    try {
      const checklistIdx = task.checklists.findIndex(checklist => checklistId === checklist._id)
      if (task.checklists[checklistIdx].title === title) return
      const updatedChecklist = { ...task.checklists[checklistIdx], title }
      const updatedChecklists = [...task.checklists]
      updatedChecklists[checklistIdx] = updatedChecklist
      const updatedTask = { ...task, checklists: updatedChecklists }
      console.log(updatedTask)
      const activity = activityService.createActivity('updated-checklist', user, task)
      await saveTask(board, updatedTask, activity)
    } catch (err) {
      console.error('err', err)
    }
  }

  async function onStyleChange(newStyle) {
    try {
      const updatedTask = { ...task, style: newStyle }
      await saveTask(board, updatedTask)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function onAttachmentAdded(attachments) {
    try {
      const updatedTask = { ...task, attachments }
      const activity = activityService.createActivity('add-attachment', user, task)
      await saveTask(board, updatedTask, activity)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function onDeleteAttachment(attachId) {
    try {
      const attachIdx = task.attachments.findIndex(attachment => attachId === attachment._id)
      const updatedTask = task.attachments.splice(attachIdx, 1)
      const activity = activityService.createActivity('delete-attachment', user, task)
      await saveTask(board, updatedTask, activity)
    } catch (err) {
      console.error('err', err)
    }
  }

  async function onEditAttachment(attachId, title) {
    try {
      const attachmentIdx = task.attachments.findIndex(attachment => attachId === attachment._id)
      if (task.attachments[attachmentIdx].title === title) return
      const updatedAttachment = { ...task.attachments[attachmentIdx], title }
      const updatedAttachments = [...task.attachments]
      updatedAttachments[attachmentIdx] = updatedAttachment
      const updatedTask = { ...task, attachments: updatedAttachments }

      console.log(updatedTask)
      await saveTask(board, updatedTask)
    } catch (err) {
      console.error('err', err)
    }
  }

  async function onLabelDelete(editedBoardLabels, labelToDelete) {
    try {
      let newBoard = { ...board, labels: editedBoardLabels }
      newBoard = boardService.removeLabelFromTasks(newBoard, labelToDelete._id)
      await updateBoard(newBoard)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function onLabelChange(board, newLabelIds) {
    try {
      console.log('newLabelIds', newLabelIds)
      const updatedTask = { ...task, labelIds: newLabelIds }
      await saveTask(board, updatedTask)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function onLabelEdit(editedBoardLabels) {
    try {
      const newBoard = { ...board, labels: editedBoardLabels }
      await updateBoard(newBoard)
    } catch (err) {
      console.log('err', err)
    }
  }

  async function onLabelDelete(editedBoardLabels, labelToDelete) {
    try {
      let newBoard = { ...board, labels: editedBoardLabels }
      newBoard = boardService.removeLabelFromTasks(newBoard, labelToDelete._id)
      await updateBoard(newBoard)
    } catch (err) {
      console.log('err', err)
    }
  }

  return (
    <section className="task-details-screen">
      {/* <div className="backdrop"></div> */}
      <article ref={taskDetails} className="task-details">
        <button onClick={() => navigate(`/board/${boardId}`)} className="close-btn">
          <HiXMark className="close-icon" />
        </button>
        <TaskCover task={task} taskDetails={taskDetails} onStyleChange={onStyleChange} />
        <TaskDetailsHeader task={task} board={board} />
        <section className="task-details-container">
          <section className="card-details-container flex column">
            <ShowMembersLabels task={task} board={board} onOpenPopover={onOpenPopover} onLabelChange={onLabelChange} onLabelEdit={onLabelEdit} onLabelDelete={onLabelDelete} />
            <TaskAttachments task={task} onAttachmentAdded={onAttachmentAdded} onDeleteAttachment={onDeleteAttachment} onEditAttachment={onEditAttachment} onOpenPopover={onOpenPopover} />
            <ChecklistIndex task={task} onDeleteChecklist={onDeleteChecklist} onOpenPopover={onOpenPopover} onEditChecklist={onEditChecklist} />
          </section>
          <ActionsList
            task={task}
            onHandleTaskMembers={onHandleTaskMembers}
            onOpenPopover={onOpenPopover}
            board={board}
            onAttachmentAdded={onAttachmentAdded}
            onLabelChange={onLabelChange}
            onLabelEdit={onLabelEdit}
            onLabelDelete={onLabelDelete}
            onAddChecklist={onAddChecklist}
          // colors={colors}
          // coverStyle={coverStyle}
          // onStyleChange={onStyleChange}
          />
        </section>
        <Popover {...popoverProps} addedProps={addedProps} onClose={onTogglePopover} />
      </article>
    </section>
  )
}
