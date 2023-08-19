import { Alert, Snackbar } from "@mui/material";
import React, { createContext, useState } from "react";

/**
 * @type {React.Context<React.Dispatch<React.SetStateAction<
 * {open: boolean, msg: string, severity: "warning" | "info" | "error" | "success"}>>>}
 */
const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: "",
    severity: "info",
  });

  return (
    <SnackbarContext.Provider value={setSnackbar}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
}

export default SnackbarContext;
