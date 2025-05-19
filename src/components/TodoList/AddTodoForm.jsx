import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './AddTodoForm.css'

const AddTodoForm = ({ onAdd }) => {
  const [text, setText] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    onAdd(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className='add-todo-form'>
      <input
        type='text'
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder='What needs to be done?'
        className='todo-input'
      />
      <button type='submit' className='add-button'>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </form>
  )
}

export default AddTodoForm
