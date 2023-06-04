import React, { useEffect, useState } from 'react'
import { UserImg } from '../user-img'
import { BsCheckLg } from 'react-icons/bs'
import { useSelector } from 'react-redux'

export function PopoverMembers({ members, taskMembers, onHandleTaskMembers }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [updatedMembers, setUpdatedMembers] = useState(
    members.map((member) => {
      const isOnBoard = false
      return { ...member, isOnBoard }
    })
  )

  useEffect(() => {
    if (taskMembers && taskMembers.length > 0) {
      const newMembers = members.map((member) => {
        const isOnBoard = taskMembers.some((taskMember) => taskMember._id === member._id)
        return { ...member, isOnBoard }
      })
      setUpdatedMembers(newMembers)
    }
  }, [taskMembers])

  useEffect(() => {
    if (taskMembers && taskMembers.length > 0) {
      const newMembers = members.map((member) => {
        const isOnBoard = taskMembers.some((taskMember) => {
          console.log('taskMember._id', taskMember._id)
          console.log('member._id', member._id)
          return taskMember._id === member._id
        })
        return { ...member, isOnBoard }
      })
      setUpdatedMembers(newMembers)
    }
  }, [taskMembers])

  function toggleMember({ _id, fullname, imgUrl, isOnBoard }) {
    const activityType = isOnBoard ? 'remove-member' : 'add-member'
    onHandleTaskMembers(activityType, { _id, fullname, imgUrl })
  }

  console.log('taskMembers', taskMembers)
  console.log('updatedMembers', updatedMembers)

  return (
    <div className="popover-members">
      <input type="text" value={searchTerm} onChange={setSearchTerm} placeholder="Search members" />
      <h4 className="members-title">Board members</h4>
      <ul className="members-list clean-list">
        {updatedMembers.map((member) => {
          const userInfo = `${member.fullname} (${member.email ? member.email : ''})`
          return (
            <li key={member._id}>
              <button className="user-button flex align-center" onClick={() => toggleMember(member)}>
                <UserImg userImg={member.imgUrl} size="large" />
                <p className="user-info">{userInfo}</p>
                {!member.isOnBoard && (
                  <span>
                    <BsCheckLg />
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
