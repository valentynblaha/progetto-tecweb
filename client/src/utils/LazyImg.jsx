import { Skeleton } from "@mui/material";
import React, { useState } from "react";

export default function LazyImg({
  onLoad = () => null,
  objectFit = "contain",
  width = "auto",
  height = "auto",
  src=""
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <img
        loading="lazy"
        onLoad={(e) => {
          setLoaded(true);
          onLoad(e);
        }}
        src={src}
        width={100}
        height={200}
        style={{ objectFit, width, height }}
        onError={(e) => {
          console.log(e);
          this.src = "/public/placeholder.svg";
        }}
      />
      {!loaded && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={200}
          sx={{ position: "absolute", zIndex: 1000, top: 0 }}
          width="100%"
        />
      )}
    </div>
  );
}
