import { useContext, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";
import { styled } from "styled-components";
import { context } from "../context/context";

const Toast = ({ open, message, type }) => {
  const { toast } = useContext(context);
  const { openToast, setOpenToast } = open;

  useEffect(() => {
    if (toast) {
      setOpenToast(true);

      setTimeout(() => {
        setOpenToast(false);
      }, 2000);
    }
  }, [toast]);

  const options = {
    vertical: "top",
    horizontal: "center",
  };

  const { vertical, horizontal } = options;

  const handleClose = () => {
    setOpenToast(false);
  };

  return (
    <ToastStandard>
      <Snackbar
        open={openToast}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={2000}
        onClose={handleClose}
        style={{ zIndex: "33333" }}
      >
        <Alert severity={type} onClose={() => handleClose()} className={type}>
          {message}
        </Alert>
      </Snackbar>
    </ToastStandard>
  );
};

const ToastStandard = styled.div`
  position: fixed;
  top: 0;
  z-index: 3333333;

  .MuiSvgIcon-root path {
    fill: white;
    z-index: 3333333;
  }

  .success {
    background-color: #2e7d32;
    color: white;
    border-radius: 12px;
    font-weight: 500;
    font-family: "Inter";
    margin-top: 32px;
  }

  .error {
    background-color: #ff3344;
    color: white;
    border-radius: 12px;
    font-weight: 500;
    font-family: "Inter";
    margin-top: 32px;
  }

  .css-wnkddu-MuiPaper-root-MuiAlert-root .MuiAlert-icon,
  .css-1hdyuqk-MuiPaper-root-MuiAlert-root .MuiAlert-icon {
    color: white;
  }
`;

export default Toast;
