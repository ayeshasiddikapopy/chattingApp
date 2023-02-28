import React from 'react'
import TextField from '@mui/material/TextField';

const InputBox = ({label, variant , className , textChange, type , name}) => {
  return (
    <>
        <TextField label={label} variant={variant} className={className} onChange={textChange} type={type} name={name}/>
    </>
  )
}

export default InputBox