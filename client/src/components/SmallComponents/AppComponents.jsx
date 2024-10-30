/* eslint-disable react/prop-types */
import { Alert, Snackbar, TextField } from "@mui/material";

export function ToastNotify({ alertState, setAlertState }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={alertState.open}
      autoHideDuration={10000}
      key={"top center"}
      onClose={() => setAlertState({ ...alertState, open: false })}
    >
      <Alert
        onClose={() => setAlertState({ ...alertState, open: false })}
        severity={alertState.severity}
      >
        {alertState.message}
      </Alert>
    </Snackbar>
  );
}

export const StyledInput = ({ ...props }) => {
  return (
    <TextField
      {...props}
      sx={{
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid rgb(133, 133, 133)",
        width: "100%",
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          "& fieldset": {
            border: "none",
          },
          "&:hover fieldset": {
            border: "none",
          },
          "&.Mui-focused fieldset": {
            border: "none",
          },
        },

        input: {
          "&::placeholder": {
            color: "#383838 !important",
            opacity: 1,
          },
          padding: { xs: "16px 16px", sm: "12px 18px" },
          color: "#383838",
          fontSize: "16px",
          fontWeight: "400",
          // fontFamily: "Poppins",
        },
      }}
    />
  );
};
