import React from 'react'

const SelectBox = ({roomSelected, changeRoom}) => {
  return (
    <form>
      <select selected={roomSelected} onChange={(e)=>changeRoom(e.target.value)} className="select-box">
        <option value='0'>Auditório 1</option>
        <option value='1'>Auditório 2</option>
      </select>
    </form>
  )
}

export default SelectBox
