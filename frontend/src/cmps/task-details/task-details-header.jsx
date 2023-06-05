import { BsFillCreditCardFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { boardService } from '../../services/board.service.local'
import { useEffect, useState } from 'react'

export function TaskDetailsHeader({ board, task }) {
  const [group, setGroup] = useState()

  useEffect(() => {
    if (board) {
      setGroup(boardService.getGroupByTaskId(board, task._id))
    }
  }, [task])

  console.log('task', task)

  return (
    <header className="task-header flex">
      <div className="title-img">
        <BsFillCreditCardFill className="card-title-img" />
      </div>
      <div className="task-title">
        <h1>{task.title}</h1>
        {group && (
          <p>
            in list <Link>{group.title}</Link>
          </p>
        )}
      </div>
    </header>
  )
}
