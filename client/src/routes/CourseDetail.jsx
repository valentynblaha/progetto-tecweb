import React, { useState  } from 'react'
import api from '../api/api';
import { Box, Button, Divider, Grid, Paper, Typography , Snackbar, Alert} from "@mui/material";
import { useLoaderData, useNavigate } from 'react-router-dom';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import LazyImg from '../utils/LazyImg';
import useAuth from "../hooks/useAuth"
import '../api/format';

export const courseLoader = async ({ params }) => {
  const responseCourse = await api.get("api/course/course/" + params.courseId)
  const responseCategories = await api.get("api/course/fitnessCategory");
  const idInstructor = responseCourse.data.instructor
  const responseInstructor = await api.get("api/course/register_instructor/" + idInstructor)
  return { course: responseCourse.data, instructor: responseInstructor.data, categories: responseCategories.data };
};


export default function CourseDetail() {
  const {course , instructor} = useLoaderData()
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "info",
    open: false
  })
  var conflictingCourse = null  
  const [auth] = useAuth()
  const navigate = useNavigate()
  const postData = async () => {
    try {
      await api.post("api/course/subscriptions/",  {course: course.id} );
    } catch (error) {
      if (error.response?.data.detail === "Subscription already exists") {
        setSnackbar({...snackbar, message: "sei gia iscritto al corso", open: true})
      }else if(error.response?.data.detail === "Authentication credentials were not provided.") {
              navigate('/login')
      }
    }
  };
  
  const getSubscriptions = async () =>{
    const id1 = auth.id
    const response = await Promise.all([
     await api.get("api/course/subscriptions/", {id:id1}),
     await api.get("api/course/course/"),
     await api.get("api/course/course/" ,course.courseid),
    ]);
    console.log(response[0].data)
    console.log(response[1].data)
    console.log(response[2].data)

    return { subscriptions: response[0].data, schedule: response[1].data.schedule, newSchedule: response[2].data.schedule };
  }
  
  const handleSubscription = () =>{
    const {subscriptions , schedule , newSchedule} = getSubscriptions()
    /**
     * Checks if 2 Schedule days overlap
     * @param {ScheduleDay} a
     * @param {ScheduleDay} b
     * 
     */

  }

  const handleSubmit = (e) => {
   // handleSubscription();
    if (conflictingCourse != null){
       console.log("gia fatto")
    }
    postData()
   
  };
  
  return (

    <Box>
       <Snackbar open={snackbar.open}  autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{vertical: "top", horizontal: "center"}}>
        <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity="error" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={4}>
          <LazyImg src={course.image} alt="Course image" width="100%"/>
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
                       <div key={schedule.week_day} className="schedule: ">
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
          <Button variant="contained" onClick={handleSubmit} startIcon={<PlaylistAddCheckCircleIcon />}> iscrivimi</Button>
        </Grid>
      </Grid>
      <Divider />
    </Box>
  )
}
