import { Button } from "@mui/material";
import React, { useState } from "react";
import api from "../api/api";
import "./MuiFileInput.css";

export default function MuiFileInput({ children, accept, id, url, style }) {
  const [loading, setLoading] = useState(false);
  const [imgPath, setImgPath] = useState("");

  const config = {
    onUploadProgress: (e) => {
      console.log(e.loaded);
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
        onChange={(e) => {
          setLoading(true);
          const formData = new FormData();
          formData.append("image", e.target.files[0]);

          api
            .post(url, formData, config)
            .then((response) => {
              if (response.status === 200) {
                setImgPath(response.data.file);
                console.log("File uploaded");
              }
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
              console.log("An error has occured: " + error);
            });
        }}
      />
      <label htmlFor={id}>
        {/* <Button variant="outlined" component="span" disabled={loading}>
          {children}
        </Button> */}
        <div className="image-upload-input" style={style}>
          {imgPath && (
            <img
              src={"http://127.0.0.1:8000/media/" + imgPath}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            ></img>
          )}
        </div>
      </label>
    </>
  );
}
