import React from 'react'
import api from '../api/api';
import { useLoaderData } from 'react-router-dom';

export const courseLoader = async ({ params }) => {
  const response = await api.get("api/course/course/" + params.courseId)
  return { course: response.data };
};

export default function CourseDetail() {
  const {course} = useLoaderData()
  
  return (
    <div>{course.name}</div>
  )
}
