import React, { useState } from "react";
import api from "../api/api";
import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
  Stack,
  Chip,
  colors,
} from "@mui/material";
import { useLoaderData, useNavigate } from "react-router-dom";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import LazyImg from "../utils/LazyImg";
import useAuth from "../hooks/useAuth";
import useSnackbar from "../hooks/useSnackbar";
import "../api/format";
import { overlap } from "../api/format";
import { AccessTime, Delete, Done, Edit } from "@mui/icons-material";
import LinkBehavior from "../utils/LinkBehaviour";

export const courseLoader = async ({ params }) => {
  const responseCourse = await api.get("api/course/course/" + params.courseId);
  const responseCategories = await api.get("api/course/fitnessCategory");
  const idInstructor = responseCourse.data.instructor;
  const responseInstructor = await api.get("api/course/register_instructor/" + idInstructor);
  let responseSubs;
  try {
    responseSubs = await api.get("api/course/subscriptions/");
  } catch (error) {
    if (error.response?.status === 401) {
      responseSubs = { data: [] };
    } else {
      throw error;
    }
  }
  return {
    course: responseCourse.data,
    instructor: responseInstructor.data,
    categories: responseCategories.data,
    subs: responseSubs.data,
  };
};

export default function CourseDetail() {
  const { course, instructor, subs } = useLoaderData();
  const [auth] = useAuth();
  const [dialog, setDialog] = useState({
    title: "Attenzione",
    msg: "",
    open: false,
    action: () => null,
  });
  const setSnackbar = useSnackbar();
  const navigate = useNavigate();
  const postData = async () => {
    try {
      const response = await api.post("api/course/subscriptions/", { course: course.id });
      if (response.status === 201) {
        setSnackbar({ severity: "success", message: "Iscrizione avvenuta con successo", open: true });
      }
    } catch (error) {
      if (error.response?.data.detail === "Subscription already exists") {
        setSnackbar({ severity: "error", message: "Sei gia iscritto al corso", open: true });
      } else if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setSnackbar({ severity: "error", message: String(error), open: true });
      }
    }
  };

  const handleSubscription = async () => {
    let msg = {};
    let overlaps = false;
    for (const sub of subs) {
      const schedule = sub.course.schedule;
      for (const day of course.schedule) {
        if (
          overlap(
            day,
            schedule.find((d) => d.week_day === day.week_day)
          )
        ) {
          overlaps = true;
          const name = sub.course.name;
          if (!msg[name]) msg[name] = [];
          msg[name].push(day.week_day);
        }
      }
    }
    if (overlaps) {
      const message = (
        <>
          <Typography>Ci sono sovvrapposizioni con i seguenti corsi:</Typography>
          <ul>
            {Object.keys(msg).map((key) => (
              <li style={{ paddingTop: 0, paddingBottom: 0 }} key={key}>{`${key}: ${msg[key].join(" ,")}`}</li>
            ))}
          </ul>
          <Typography>Sei sicuro di voler continuare?</Typography>
        </>
      );
      setDialog({ msg: message, title: "Vuoi continuare?", open: true, action: () => postData() });
    } else {
      postData();
    }
  };

  const handleUnsubscribe = async (e) => {
    const sub = subs.find((s) => s.course.id === course.id);
    if (!sub) return;
    setDialog({
      title: "Sei sicuro?",
      msg: "Sei sicuro di voler cancellare l'scrizione?",
      open: true,
      action: async () => {
        try {
          const response = await api.delete("api/course/subscriptions/" + sub.id + "/");
          if (response.status === 200) {
            setSnackbar({ severity: "success", message: "Iscrizione cancellata", open: true });
            navigate(0);
          }
        } catch (error) {
          setSnackbar({ severity: "error", message: String(error), open: true });
        }
      },
    });
  };

  const handleDelete = () => {
    setDialog({
      title: "Sei sicuro?",
      msg: "Sei sicuro di voler cancellare il corso?",
      open: true,
      action: async () => {
        try {
          const response = await api.delete("api/course/course/" + course.id + "/");
          if (response.status === 204) {
            setSnackbar({ severity: "success", message: "Corso eliminato con successo", open: true });
            navigate("/courses");
          }
        } catch (error) {
          setSnackbar({ severity: "error", message: String(error), open: true });
        }
      },
    });
  };

  const renderButtons = () => {
    if (auth.is_instructor && course.instructor === auth.id) {
      return (
        <>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<Edit />} component={LinkBehavior} to={`edit`}>
              Modifica
            </Button>
            <Button variant="contained" startIcon={<Delete />} color="error" onClick={() => handleDelete()}>
              Elimina
            </Button>
          </Stack>
        </>
      );
    }

    if (subs.find((s) => s.course.id === course.id)) {
      return (
        <Button variant="contained" color="error" onClick={() => handleUnsubscribe()}>
          Disiscrivimi
        </Button>
      );
    }
    return (
      <Button variant="contained" onClick={() => handleSubscription()} startIcon={<PlaylistAddCheckCircleIcon />}>
        Iscrivimi
      </Button>
    );
  };

  return (
    <Box>
      <Dialog sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }} maxWidth="xs" open={dialog.open}>
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent dividers>{dialog.msg}</DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setDialog({ ...dialog, open: false })}>
            Annulla
          </Button>
          <Button
            onClick={(e) => {
              setDialog({ ...dialog, open: false });
              dialog.action(e);
            }}
          >
            Sì
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={4}>
          <LazyImg src={course.image} alt="Course image" width="100%" />
        </Grid>
        <Grid item xs={8} flexDirection="column">
          <div>
            <h1>{course.name}</h1>
          </div>
          <Typography>Da: {instructor.first_name + " " + instructor.last_name}</Typography>
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
          {auth.is_instructor && course.instructor === auth.id && (
            <Stack direction="row" spacing={1} my={2} alignItems="center">
              <Typography>Stato: </Typography>
              {course.approved ? (
                <Chip label="Approvato" icon={<Done />} color="success" />
              ) : (
                <Chip label="In attesa di approvazione" icon={<AccessTime />} color="warning" />
              )}
            </Stack>
          )}
          <Typography color="#808080" fontSize="0.8rem">
            Prezzo:
          </Typography>
          <Typography fontSize="2rem" fontWeight="bold" sx={{ my: 2 }}>
            € {course.price}
          </Typography>
          <Paper sx={{ p: 1, my: 1 }}>
            <Typography color="#808080">Dettagli:</Typography>
            <div className="product-details-table">
              <Typography>Orari:</Typography>
              <div className="schedule">
                {course.schedule.map((schedule) => (
                  <div key={schedule.week_day} className="schedule: ">
                    <Typography fontSize="0.8rem">{schedule.week_day + " : "}</Typography>
                    {schedule.start1 != null && schedule.end1 != null && (
                      <Typography color="#808080" fontSize="0.8rem">
                        {"dalle " + schedule.start1 + " alle " + schedule.end1}
                      </Typography>
                    )}
                    {schedule.start2 != null && schedule.end2 != null && (
                      <Typography color="#808080" fontSize="0.8rem">
                        {"dalle " + schedule.start2 + " alle " + schedule.end2}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
              <tr>
                <td>Indirizzo palestra : </td>
              </tr>
              <Typography color="#808080" fontSize="1rem">
                {instructor.gym_address}
              </Typography>
            </div>
          </Paper>
          {renderButtons()}
        </Grid>
      </Grid>
      <Divider />
    </Box>
  );
}
