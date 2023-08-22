import { Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import api from "../api/api";
import "./MuiFileInput.css";

export default function MuiFileInput({ children, accept, id, url, style, name, onChange, required = false }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgPath, setImgPath] = useState("");

  const config = {
    onUploadProgress: (e) => {
      setProgress(e.progress * 100);
    },
  };

  return (
    <>
      <input
        accept={accept}
        style={{ display: "none" }}
        id={id}
        type="file"
        disabled={loading}
        required={required}
        onChange={(e) => {
          setLoading(true);
          const formData = new FormData();
          formData.append("image", e.target.files[0]);
          api
            .post(url, formData, config)
            .then((response) => {
              if (response.status === 200) {
                setImgPath(response.data.file);
                if (onChange) onChange(response.data.file);
              }
            })
            .catch((error) => {
              setLoading(false);
              setProgress(0)
              console.log("An error has occured: " + error);
            });
        }}
      />
      <input readOnly value={imgPath} name={name} type="hidden" />
      <label htmlFor={id}>
        {/* <Button variant="outlined" component="span" disabled={loading}>
          {children}
        </Button> */}
        <div className="image-upload-input" style={style}>
          {imgPath && (
            <img
              src={"http://127.0.0.1:8000/media/" + imgPath}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onLoad={() => {
                setLoading(false);
                setProgress(0)
              }}
            />
          )}
          {loading && (
            <div className="upload-loading-container">
              <CircularProgress variant="determinate" value={progress} sx={{}} />
            </div>
          )}
        </div>
      </label>
    </>
  );
}
