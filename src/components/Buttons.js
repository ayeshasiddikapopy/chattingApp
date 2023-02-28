import React from 'react'

const Buttons = (props) => {
  return (
    <>
    <props.bname onClick = {props.click} variant="contained" disableRipple>
    {props.title}
      </props.bname>
    </>
  )
}

export default Buttons;