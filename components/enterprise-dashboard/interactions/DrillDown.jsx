'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'

export const DrillDownProvider = ({ children, data }) => {
  const [drillPath, setDrillPath] = useState([])
  const [currentLevel, setCurrentLevel] = useState(data)

  const drillDown = (key, value, newData) => {
    setDrillPath(prev => [...prev, { key, value, data: currentLevel }])
    setCurrentLevel(newData)
  }

  const drillUp = (levels = 1) => {
    if (drillPath.length === 0) return

    const newPath = drillPath.slice(0, -levels)
    if (newPath.length === 0) {
      setCurrentLevel(data)
      setDrillPath([])
    } else {
      const lastLevel = newPath[newPath.length - 1]
      setCurrentLevel(lastLevel.data)
      setDrillPath(newPath)
    }
  }

  const drillToRoot = () => {
    setDrillPath([])
    setCurrentLevel(data)
  }

  return (
    <div className="space-y-4">
      <DrillDownBreadcrumb 
        path={drillPath}
        onDrillUp={drillUp}
        onDrillToRoot={drillToRoot}
      />
      {children({ 
        currentLevel, 
        drillDown, 
        drillUp, 
        drillToRoot, 
        drillPath,
        canDrillUp: drillPath.length > 0 
      })}
    </div>
  )
}

export const DrillDownBreadcrumb = ({ path, onDrillUp, onDrillToRoot }) => {
  if (path.length === 0) return null

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 
                    rounded-lg border border-gray-200 dark:border-gray-700">
      <button
        onClick={onDrillToRoot}
        className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 dark:text-blue-400 
                   hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
      >
        <Home size={14} />
        Root
      </button>
      
      {path.map((level, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight size={14} className="text-gray-400" />
          <button
            onClick={() => onDrillUp(path.length - index)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded transition-colors"
          >
            <span className="font-medium">{level.key}:</span>
            <span>{level.value}</span>
          </button>
        </div>
      ))}

      <button
        onClick={() => onDrillUp(1)}
        className="ml-auto flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white 
                   hover:bg-blue-700 rounded transition-colors"
      >
        <ChevronLeft size={14} />
        Back
      </button>
    </div>
  )
}

export const DrillDownChart = ({ 
  data, 
  renderChart, 
  getDrillDownData, 
  getDrillDownKey,
  className = "" 
}) => {
  return (
    <DrillDownProvider data={data}>
      {({ currentLevel, drillDown, drillPath, canDrillUp }) => (
        <div className={`space-y-4 ${className}`}>
          <div 
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={(event) => {
              const target = event.target.closest('[data-drill-value]')
              if (target && getDrillDownData) {
                const value = target.dataset.drillValue
                const key = getDrillDownKey ? getDrillDownKey(currentLevel) : 'category'
                const newData = getDrillDownData(currentLevel, value)
                if (newData) {
                  drillDown(key, value, newData)
                }
              }
            }}
          >
            {renderChart(currentLevel, { canDrillUp, drillPath })}
          </div>
        </div>
      )}
    </DrillDownProvider>
  )
}

export default DrillDownProvider