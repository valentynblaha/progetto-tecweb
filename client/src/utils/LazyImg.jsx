import { Skeleton } from "@mui/material";
import React, { useState } from "react";

export default function LazyImg(props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <img loading="lazy" {...props} onLoad={() => setLoaded(true)} />
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
