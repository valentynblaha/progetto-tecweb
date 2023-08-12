import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Form, redirect, useLoaderData } from "react-router-dom";
import {
  Button,
  FormControl,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Clear, Save } from "@mui/icons-material";

export const courseEditAction = async ({ request, params }) => {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await api.put("api/course/course/" + params.courseId + "/", updates);
  return redirect(`/courses/${params.courseId}`);
};

export default function EditCourse() {
  const { course } = useLoaderData();
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const response = await api.get("api/course/fitnessCategory");
      setCategories(response.data);
    } catch (error) {
      throw new Error("Could not load categories!");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Form method="post" id="course-edit">
      <Grid container spacing={4} p={4}>
        <Grid item xs={12}>
          <TextField name="name" variant="outlined" defaultValue={course.name} label="Nome" fullWidth />
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
          <Button variant="contained" startIcon={<Save/>} size="large" sx={{marginRight: 2}}>
                Salva
          </Button>
          <Button variant="contained" color="error" startIcon={<Clear/>} size="large">Annulla</Button>
        </Grid>
      </Grid>
    </Form>
  );
}
