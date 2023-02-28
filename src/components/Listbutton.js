import React from 'react'


const Listbutton = (props) => {
  return (
    <props.listbutton className={props.className} onClick ={props.onClick}>{props.title}</props.listbutton>
  )
}

export default Listbutton;