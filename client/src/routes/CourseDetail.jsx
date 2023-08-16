import React from 'react'
import api from '../api/api';
import { Box, Button, Divider, Grid, Paper, Rating, Typography } from "@mui/material";
import { useLoaderData } from 'react-router-dom';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';


export const courseLoader = async ({ params }) => {
  const responseCourse = await api.get("api/course/course/" + params.courseId)
  const responseCategories = await api.get("api/course/fitnessCategory");
  const idInstructor = (await responseCourse).data.instructor
  const responseInstructor = await api.get("api/course/register_instructor/" + idInstructor)
  return { course: responseCourse.data, instructor: responseInstructor.data, categories: responseCategories.data };
};


export default function CourseDetail() {
  const {course , instructor} = useLoaderData()
  
  return (

    <Box>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={4}>
          <img src={course.image} alt="Course image" className="w-100" />
        </Grid>
        <Grid item xs={8} flexDirection="column">
          <div>
            <h1>{course.name}</h1>
          </div>
          <Typography>Da: {instructor.first_name + ' ' + instructor.last_name}</Typography>
          <Typography>Email: {instructor.email}</Typography>

          <Paper sx={{ p: 1, my: 1 }}>
            {course.description ? (
              <Typography>{course.description}</Typography>
            ) : (
              <Typography color="#808080" fontStyle="italic">
                Non c&apos;è una descrizione per questo corso
              </Typography>
            )}
          </Paper>
          <Typography color="#808080" fontSize="0.8rem">
            Prezzo:
          </Typography>
          <Typography fontSize="2rem" fontWeight="bold" sx={{ my: 2 }}>
            € {course.price}
          </Typography>
          <Paper sx={{ p: 1, my: 1 }}>
            <Typography color="#808080">Dettagli:</Typography>
            <table className="product-details-table">
              <tbody>
                <tr>
                  <td>Giorni:</td>
                </tr>
                <div className="schedule">
                    {course.schedule.map((schedule) => (
                       <div className="schedule: ">
                         <Typography color="#808080" fontSize="0.8rem">
                         {schedule.week_day + ' : '}  
                         </Typography>
                         {schedule.start1 != null && schedule.end1 != null &&
                         <Typography color="#808080" fontSize="0.8rem">
                            {'dalle ' + schedule.start1 + ' alle ' + schedule.end1}  
                         </Typography>
                         }
                         {schedule.start2 != null && schedule.end2 != null &&
                         <Typography color="#808080" fontSize="0.8rem">
                           {'dalle ' + schedule.start2 + ' alle ' + schedule.end2}  
                         </Typography> 
                         }
                       </div>
                  ))}
                </div>
                <tr>
                  <td>Indirizzo palestra : </td>
                </tr>
                <Typography color="#808080" fontSize="1rem" >
                      {instructor.gym_address}
                </Typography>
              </tbody>
              
            </table>
          </Paper>
          <Button size="large" startIcon={<PlaylistAddCheckCircleIcon />} variant="outlined">
            iscrivimi
          </Button>
        </Grid>
      </Grid>
      <Divider />
    </Box>
  )
}
