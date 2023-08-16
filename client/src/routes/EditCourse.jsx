import React, { useEffect, useRef, useState } from "react";
import api from "../api/api";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Clear, Delete, Save } from "@mui/icons-material";
import MuiFileInput from "../utils/MuiFileInput";
import { dayjsTimeToStr, strTimeToDayjs } from "../api/format";

export const courseEditAction = async ({ request, params }) => {
  const formData = await request.formData();
  console.log(formData);
  const updates = Object.fromEntries(formData);
  updates.schedule = JSON.parse(updates.schedule);
  await api.put("api/course/course/" + params.courseId + "/", updates);
  return redirect(`/courses/${params.courseId}`);
};

export const courseCreateAction = async ({ request, params }) => {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  updates.schedule = JSON.parse(updates.schedule);
  const response = await api.post("api/course/course/", updates);
  if (response.data?.id) return redirect(`/courses/${response.data.id}`);
  else return redirect("/courses");
};

export const newCourseLoader = async () => {
  const response = await api.get("api/course/fitnessCategory");
  const categories = response.data;
  const course = {
    id: 7,
    name: "",
    description: "",
    image: null,
    category: categories[0].id,
    price: "10.00",
    max_subs: 15,
    schedule: [],
  };
  return { course, categories };
};

const DAY_OPTIONS = [
  ["Mon", "Lunedì"],
  ["Tue", "Martedì"],
  ["Wed", "Mercoledì"],
  ["Thu", "Giovedì"],
  ["Fri", "Venerdì"],
  ["Sat", "Sabato"],
  ["Sun", "Domenica"],
];

export default function EditCourse() {
  const { course, categories } = useLoaderData();
  const navigate = useNavigate();

  const scheduleInputRef = useRef(null);
  const [schedule, setSchedule] = useState(course.schedule);
  const [scheduleError, setScheduleError] = useState(course.schedule.length === 0);

  // Time dialog state
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [daySelectOptions, setDaySelectOptions] = useState(
    DAY_OPTIONS.filter((val) => !schedule.find((v) => v.week_day === val[0]))
  );
  const [dialogValues, setDialogValues] = useState({
    week_day: daySelectOptions[0][0],
    start1: "9:00:00",
    end1: "10:00:00",
    start2: "12:00:00",
    end2: "13:00:00",
  });
  const [dialogErrors, setDialogErrors] = useState({
    start1: "",
    end1: "",
    start2: "",
    end2: "",
  });
  const [part2, setPart2] = useState(false);

  const validateDialog = (dialogValues) => {
    console.log("Validate");
    const { start1, end1, start2, end2 } = dialogValues;
    const errors = { ...dialogErrors };
    if (strTimeToDayjs(end1).diff(strTimeToDayjs(start1)) <= 0) {
      errors.end1 = "L'orario di fine non può essere prima dell'inizio";
      return false;
    } else {
      errors.end1 = "";
    }
    if (strTimeToDayjs(start2).diff(strTimeToDayjs(end1)) <= 0 && part2) {
      errors.start2 = "Il secondo turno non può iniziare prima che finisca il primo";
      return false;
    } else {
      errors.start2 = "";
    }
    if (strTimeToDayjs(end2).diff(strTimeToDayjs(start2)) <= 0 && part2) {
      errors.end2 = "L'orario di fine non può essere prima dell'inizio";
      return false;
    } else {
      errors.end2 = "";
    }
    setDialogErrors(errors);
    return true;
  };

  const handleClose = () => {
    setScheduleDialogOpen(false);
  };

  return (
    <Form method="post" id="course-edit">
      <Grid container spacing={4} p={4}>
        <Grid item xs={12}>
          <TextField name="name" variant="outlined" defaultValue={course.name} label="Nome" fullWidth required />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="description"
            variant="outlined"
            defaultValue={course.description}
            label="Descrizione"
            multiline={true}
            rows={4}
          />
        </Grid>
        <Grid item xs={6}>
          <MuiFileInput
            accept="image/*"
            id="course-image"
            url="api/course/upload/"
            name="image"
            style={{ width: "200px", height: "200px" }}
          >
            Carica immagine
          </MuiFileInput>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Categoria</InputLabel>
            <Select name="category" label="Categoria" defaultValue={course.category}>
              {categories.map((val) => (
                <MenuItem key={val.id} value={val.id}>
                  {val.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="course-price">Prezzo</InputLabel>
            <OutlinedInput
              id="course-price"
              name="price"
              type="number"
              defaultValue={course.price}
              startAdornment={<InputAdornment position="start">€</InputAdornment>}
              label="Prezzo"
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="max-subs">N° massimo di iscritti</InputLabel>
            <OutlinedInput
              id="max-subs"
              name="max_subs"
              type="number"
              defaultValue={course.max_subs}
              label="N° massimo di iscritti"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <input
            id="schedule-json"
            name="schedule"
            defaultValue={JSON.stringify(schedule)}
            pattern="\[\{.+\}\]"
            required
            style={{ display: "none" }}
            ref={scheduleInputRef}
          />
          <div
            style={{
              display: scheduleError ? "block" : "none",
              background: "#ff000026",
              padding: "0.5em",
              border: "2px solid red",
              borderRadius: "0.5em",
            }}
          >
            Inserire almeno un giorno con orari
          </div>
          <Typography>Orari:</Typography>
          <List>
            {schedule
              .sort(
                (a, b) =>
                  DAY_OPTIONS.findIndex((v) => v[0] === a.week_day) - DAY_OPTIONS.findIndex((v) => v[0] === b.week_day)
              )
              .map((day) => {
                const part2 = day.start2 ? `, ${day.start2} - ${day.end2}` : "";
                return (
                  <ListItem
                    key={day.week_day}
                    secondaryAction={
                      <IconButton
                        onClick={() => {
                          const newSchedule = schedule.filter((v) => v.week_day !== day.week_day);
                          const newDaySelectOptions = DAY_OPTIONS.filter(
                            (val) => !newSchedule.find((v) => v.week_day === val[0])
                          );
                          setDialogValues({ ...dialogValues, week_day: newDaySelectOptions[0][0] });
                          setDaySelectOptions(newDaySelectOptions);
                          scheduleInputRef.current.value = JSON.stringify(newSchedule);
                          
                            setScheduleError(newSchedule.length === 0);
                          
                          setSchedule(newSchedule);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemText>{`${DAY_OPTIONS.find((v) => v[0] === day.week_day)[1]} | ${day.start1} - ${
                      day.end1
                    }${part2}`}</ListItemText>
                  </ListItem>
                );
              })}
          </List>
          <Button
            startIcon={<Add />}
            variant="outlined"
            disabled={daySelectOptions.length === 0}
            onClick={() => {
              setScheduleDialogOpen(true);
            }}
          >
            Aggiungi
          </Button>
          <Dialog
            open={scheduleDialogOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Aggiungi giorno"}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} padding={2}>
                <Grid item xs={12}>
                  <Select
                    style={{ width: "100%" }}
                    value={dialogValues.week_day}
                    onChange={(e) => {
                      setDialogValues({ ...dialogValues, week_day: e.target.value });
                    }}
                  >
                    {daySelectOptions.map((val) => (
                      <MenuItem key={val[0]} value={val[0]}>
                        {val[1]}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Inizio 1:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <MobileTimePicker
                    slotProps={{
                      textField: {
                        error: Boolean(dialogErrors.start1),
                        helperText: dialogErrors.start1,
                      },
                    }}
                    value={strTimeToDayjs(dialogValues.start1)}
                    onChange={(val) => {
                      const newValues = { ...dialogValues, start1: dayjsTimeToStr(val) };
                      setDialogValues(newValues);
                      if (dialogErrors.start1) {
                        validateDialog(newValues);
                      }
                    }}
                    ampm={false}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography>Fine 1:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <MobileTimePicker
                    slotProps={{
                      textField: {
                        error: Boolean(dialogErrors.end1),
                        helperText: dialogErrors.end1,
                      },
                    }}
                    value={strTimeToDayjs(dialogValues.end1)}
                    onChange={(val) => {
                      const newValues = { ...dialogValues, end1: dayjsTimeToStr(val) };
                      setDialogValues(newValues);
                      if (dialogErrors.end1) {
                        validateDialog(newValues);
                      }
                    }}
                    ampm={false}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox />}
                    checked={part2}
                    onChange={(e) => {
                      setPart2(e.target.checked);
                    }}
                    label="Secondo turno"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography>Inizio 2:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <MobileTimePicker
                    slotProps={{
                      textField: {
                        error: Boolean(dialogErrors.start2),
                        helperText: dialogErrors.start2,
                      },
                    }}
                    value={strTimeToDayjs(dialogValues.start2)}
                    onChange={(val) => {
                      const newValues = { ...dialogValues, start2: dayjsTimeToStr(val) };
                      setDialogValues(newValues);
                      if (dialogErrors.start2) {
                        validateDialog(newValues);
                      }
                    }}
                    ampm={false}
                    disabled={!part2}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography>Fine 2:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <MobileTimePicker
                    slotProps={{
                      textField: {
                        error: Boolean(dialogErrors.end2),
                        helperText: dialogErrors.end2,
                      },
                    }}
                    value={strTimeToDayjs(dialogValues.end2)}
                    onChange={(val) => {
                      const newValues = { ...dialogValues, end2: dayjsTimeToStr(val) };
                      setDialogValues(newValues);
                      if (dialogErrors.end2) {
                        validateDialog(newValues);
                      }
                    }}
                    ampm={false}
                    disabled={!part2}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  const newWeekDay = { ...dialogValues };
                  if (validateDialog(newWeekDay)) {
                    if (!part2) {
                      newWeekDay.start2 = null;
                      newWeekDay.end2 = null;
                    }
                    const newSchedule = [...schedule, newWeekDay];
                    const newDaySelectOptions = DAY_OPTIONS.filter(
                      (val) => !newSchedule.find((v) => v.week_day === val[0])
                    );
                    setDialogValues({ ...dialogValues, week_day: newDaySelectOptions[0][0] });
                    setDaySelectOptions(newDaySelectOptions);
                    setScheduleError(newSchedule.length === 0);
                    setSchedule(newSchedule);
                    scheduleInputRef.current.value = JSON.stringify(newSchedule);
                    handleClose();
                  }
                }}
              >
                Aggiungi
              </Button>
              <Button onClick={handleClose} autoFocus>
                Annulla
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" startIcon={<Save />} size="large" sx={{ marginRight: 2 }} type="submit">
            Salva
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Clear />}
            size="large"
            onClick={() => {
              navigate(-1);
            }}
          >
            Annulla
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
}
