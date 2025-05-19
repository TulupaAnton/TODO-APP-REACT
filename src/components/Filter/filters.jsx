import React from 'react'
import './Filters.css'

const Filters = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' }
  ]

  return (
    <div className='filters'>
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`filter-button ${
            currentFilter === filter.id ? 'active' : ''
          }`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

export default Filters
