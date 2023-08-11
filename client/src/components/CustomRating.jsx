import { Rating } from '@mui/material'
import React from 'react'

export default function CustomRating({value, ...other}) {
  return (
    <Rating precision={0.5} value={value / 2} {...other}/>
  )
}
