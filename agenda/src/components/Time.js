import React from 'react'

const Time = ({isActive, sessionTime}) => {
  return (
    <div className={!isActive?"session-time timer-off":"session-time"}>
      {sessionTime}
    </div>
  )
}

export default Time
