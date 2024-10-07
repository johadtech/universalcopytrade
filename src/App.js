import * as ReactDOM from "react-router-dom";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Login, Questionnaire, Register, Dashboard } from "./pages/index";
import RealEstate from "./pages/RealEstate";
import Settings from "./pages/Settings";
import Stake from "./pages/Stake";
import Manage from "./pages/Manage";
import Markets from "./pages/Markets";
import Trade from "./pages/Trade";
import ForgotPassword from "./pages/ForgotPassword";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import CopyExperts from "./pages/CopyExperts";
import Subscribe from "./pages/Subscribe";
import Signals from "./pages/Signals";
import Project from "./pages/Project";
import Assets from "./pages/Assets";
//import AssetsPage from "./pages/AssetsPage";
//import NewDeposit from "./pages/NewDeposit";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import { context } from "./context/context";
import { styled } from "styled-components";
import Verification from "./pages/Verification";
import Wallet from "./pages/Wallet";

function App() {
  const [user, loading] = useAuthState(auth);
  const { userData } = useContext(context);
  const [hasPopup, setHasPopup] = useState(false);
  const [text, setText] = useState(null);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    if (!loading && user && userData) {
      // console.log("data is", userData);
      if (userData.popup) {
        // console.log("yh");
        setHasPopup(true);
        const { title, text } = userData.popup;
        setText(text);
        setTitle(title);
      }
    }
  }, [user, loading, userData]);

  return (
    <>
      {hasPopup && (
        <div className="bottom">
          <div
            style={{
              zIndex: "100000",
              position: "absolute",
              bottom: "80px",
              left: "30px",
            }}
          >
            <PopupCardStandard>
              <div className="wrapper">
                <div className="item">
                  <span>
                    <p className="title">{title}</p>
                  </span>
                </div>
                <div className="item">
                  <span>
                    <p className="text">{text}</p>
                  </span>
                </div>
              </div>
            </PopupCardStandard>
          </div>
        </div>
      )}
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/user-assets" element={<Assets />} />
          <Route path="/project" element={<Project />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/stake" element={<Stake />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/signals" element={<Signals />} />
          <Route path="/copy-experts" element={<CopyExperts />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/realestate" element={<RealEstate />} />
          <Route path="/walletconnect" element={<Wallet />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/verify" element={<Verification />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
      {/* <Toast /> */}
    </>
  );
}

const PopupCardStandard = styled.div`
  background-color: rgba(27, 31, 45);
  border-radius: 12px;
  border: 1px solid #222739;
  min-width: 180px;

  .wrapper {
    padding: 24px 0px;
  }

  .item {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 0px 24px;
    margin-top: 16px;
    color: #bac2de;
    cursor: pointer;
  }

  .title {
    color: white;
    font-size: 16px;
    font-weight: 600;
  }

  .text {
    color: #bac2de;
    font-size: 14px;
    font-weight: 500;
  }

  .item:hover {
    color: #939bb8;
  }

  .item:hover svg {
    fill: #939bb8;
  }

  .item:nth-child(1) {
    margin-top: 0px;
  }

  .item svg {
    width: 24px;
  }

  .item img {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    object-fit: cover;
  }

  /* .item p {
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
  } */
`;

export default App;
