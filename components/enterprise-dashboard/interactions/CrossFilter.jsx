'use client'

import { useState, useEffect, createContext, useContext } from 'react'

const CrossFilterContext = createContext({
  filters: {},
  setFilter: () => {},
  clearFilter: () => {},
  clearAllFilters: () => {}
})

export const CrossFilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({})

  const setFilter = (filterKey, filterValue) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: filterValue
    }))
  }

  const clearFilter = (filterKey) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[filterKey]
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setFilters({})
  }

  return (
    <CrossFilterContext.Provider value={{ 
      filters, 
      setFilter, 
      clearFilter, 
      clearAllFilters 
    }}>
      {children}
    </CrossFilterContext.Provider>
  )
}

export const useCrossFilter = () => {
  const context = useContext(CrossFilterContext)
  if (!context) {
    throw new Error('useCrossFilter must be used within a CrossFilterProvider')
  }
  return context
}

export const FilterBadge = ({ filterKey, filterValue, onRemove }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 
                  text-blue-800 dark:text-blue-300 rounded-full text-sm">
    <span className="font-medium">{filterKey}:</span>
    <span>{Array.isArray(filterValue) ? filterValue.join(', ') : filterValue}</span>
    <button 
      onClick={() => onRemove(filterKey)}
      className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
    >
      ×
    </button>
  </div>
)

export const FilterDisplay = () => {
  const { filters, clearFilter, clearAllFilters } = useCrossFilter()
  const hasFilters = Object.keys(filters).length > 0

  if (!hasFilters) return null

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800/50 
                    border-b border-gray-200 dark:border-gray-700">
      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Active Filters:</span>
      {Object.entries(filters).map(([key, value]) => (
        <FilterBadge 
          key={key} 
          filterKey={key} 
          filterValue={value} 
          onRemove={clearFilter} 
        />
      ))}
      <button
        onClick={clearAllFilters}
        className="ml-4 text-sm text-red-600 dark:text-red-400 hover:text-red-800 
                   dark:hover:text-red-300 underline"
      >
        Clear All
      </button>
    </div>
  )
}

export default CrossFilterProvider