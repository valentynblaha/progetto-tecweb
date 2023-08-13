import React from 'react'
import {useRouteError} from "react-router-dom"

export default function ErrorPage() {
  const error = useRouteError()
  console.log(error);
  return (
    <div className='d-flex align-items-center justify-content-center w-100 flex-column' style={{height: "100vh"}}>
      <div><span style={{fontSize: "5rem"}}>{error.status || error.response?.status}</span></div>
      <div style={{color: '#b0b0b0'}}>{error.response?.statusText || error.code || error.statusText}</div>
      <div>Si è verificato un errore!</div>
    </div>
  )
}
