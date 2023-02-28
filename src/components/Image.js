import React from 'react'

const Image = ({imgsrc , className, onClick}) => {
  return (
    <img onClick={onClick} className={className} src={imgsrc} alt='img'/>
  )
}

export default Image