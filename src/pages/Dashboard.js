import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import { useContext, useEffect, useState } from "react";
import { MainContainer } from "../styled/templates/MainContainer";
import { useMediaQuery } from "@mui/material";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { MainPage } from "../styled/templates/MainPage";
import CircularLoader from "../styled/loaders/CircularLoader";
import { context } from "../context/context";
import Toast from "../hooks/Toast";

const Dashboard = () => {
  const mobile = useMediaQuery("(max-width: 768px)");

  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);

  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [loader, setLoader] = useState(true);

  const { userData } = useContext(context);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  useEffect(() => {
    if (!loading && user && userData) {
      setLoader(false);
    }
  
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, userData, navigate]);

  return (
    <MainContainer>
      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      {loader ? (
        <MainPage>
          <CircularLoader
            bg="rgba(12, 108, 243, 0.2)"
            size="44"
            color="#0C6CF2"
          />
        </MainPage>
      ) : (
        <>
          <Sidebar
            selected="Dashboard"
            hidden={{ sidebarHidden, setSidebarHidden }}
          />
          <Main sidebar={{ sidebarHidden, setSidebarHidden }} />
        </>
      )}
    </MainContainer>
  );
};

export default Dashboard;
