import React from 'react'

const Time = ({isActive, sessionTime,hide}) => {
  return (
    <div className={!isActive?(hide?"timer-hide":"session-time timer-off"):("session-time")}>
      {sessionTime}
    </div>
  )
}

export default Time
