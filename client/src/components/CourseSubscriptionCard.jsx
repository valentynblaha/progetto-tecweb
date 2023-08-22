import { Grid, Card, CardActionArea, CardContent, Typography, Button } from '@mui/material'
import dayjs from "../api/format"
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CourseSubscriptionCard({subscription}) {
  const navigate = useNavigate()
  const course = subscription.course

  return (
    <Grid item xs={3}>
      <Card sx={{ cursor: "pointer" }}>
        <CardActionArea onClick={() => navigate("/courses/" + String(course.id))} component="div">
          <CardContent>
            <div>
              <Typography fontWeight="bold">{course.name}</Typography>
            </div>
            <div>
              <Typography>{`Iscritto da ${dayjs(subscription.created_at).format("DD/MM/YYYY")}`}</Typography>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}
