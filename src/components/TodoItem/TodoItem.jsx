import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faTrash,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

const TodoItem = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(todo.text)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedText.trim()) {
      onUpdate({ ...todo, text: editedText.trim() })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditedText(todo.text)
    setIsEditing(false)
  }

  return (
    <li className={`todo-item ${todo.done ? 'completed' : ''}`}>
      {isEditing ? (
        <div className='todo-edit-container'>
          <input
            type='text'
            value={editedText}
            onChange={e => setEditedText(e.target.value)}
            className='todo-edit-input'
            autoFocus
          />
          <div className='edit-buttons'>
            <button onClick={handleSave} className='save-button'>
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button onClick={handleCancel} className='cancel-button'>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className='todo-content'>
            <input
              type='checkbox'
              checked={todo.done}
              onChange={() => onToggle(todo)}
              className='todo-checkbox'
            />
            <span className='todo-text'>{todo.text}</span>
          </div>
          <div className='todo-actions'>
            <button onClick={handleEdit} className='edit-button'>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button onClick={() => onDelete(todo.id)} className='delete-button'>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </>
      )}
    </li>
  )
}

export default TodoItem
