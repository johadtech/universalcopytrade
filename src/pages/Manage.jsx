import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { MainContainer } from "../styled/templates/MainContainer";
import { MainPage } from "../styled/templates/MainPage";
import UsersTable from "../tables/UsersTable";
import { styled } from "styled-components";
import SingleUser from "./SingleUser";
import PaymentsTable from "../tables/PaymentsTables";
import Overview from "./Overview";
import VerificationsTable from "../tables/VerificationsTable";
import { useMediaQuery } from "@mui/material";
import SignalsTable from "../tables/SignalsTable";
import WithdrawalsTable from "../tables/WithdrawalsTable";
import TradingsTable from "../tables/TradingsTable";
import SubscriptionsTable from "../tables/SubscriptionsTable";
import StakingsTable from "../tables/StakingsTable";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { context } from "../context/context";
import Toast from "../hooks/Toast";
import CircularLoader from "../styled/loaders/CircularLoader";
import SignalDepositsTable from "../tables/SignalDepositsTable";
import InvestmentsTable from "../tables/InvestmentsTable";
import TradesTable from "../tables/TradesTable";

const Manage = () => {
  const [selectedMenu, setSelectedMenu] = useState("Users");
  const mobile = useMediaQuery("(max-width: 768px)");

  const [isLoading, setIsLoading] = useState(true);

  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);
  const [singleUser, setSingleUser] = useState(false);
  const [userID, setUserID] = useState("abc");
  const [userDetails, setUserDetails] = useState({});

  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();

  const { userData } = useContext(context);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!loading && user && userData) {
      setLoader(false);
      checkAdmin();
    }

    if (loading && !user) {
      setLoader(true);
    }

    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading]);

  // function checkUserStats() {
  //   if (userData?.blocked) {
  //     navigate("/login");
  //     setToastMessage("Your account has been blocked");
  //     setToastType("error");
  //     setOpenToast(true);
  //   } else {
  //     checkAdmin();
  //   }
  // }

  function checkAdmin() {
    if (!userData.admin) {
      setToastType("error");
      setToastMessage("You do not have access to this page");
      setOpenToast(true);
      navigate("/dashboard");
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }

    // else {
    // }
  }

  // Overview
  const menus = [
    // "Overview",
    "Users",
    "Verifications",
    "Payments",
    "Signal Deposits",
    "Withdrawals",
    "Signals",
    "Investments",
    "Trading",
    "Subscriptions",
    "Trades",
    "Stakings",
  ];

  function handleMenuSwitch(value) {
    if (singleUser) {
      setSingleUser(false);
    }
    setSelectedMenu(value);
  }

  return (
    <>
      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      {loader ? (
        <MainContainer>
          <MainPage>
            <CircularLoader
              bg="rgba(12, 108, 243, 0.2)"
              size="44"
              color="#0C6CF2"
            />
          </MainPage>
        </MainContainer>
      ) : (
        <>
          {isLoading ? (
            <MainContainer>
              <Sidebar
                selected="Manage"
                hidden={{ sidebarHidden, setSidebarHidden }}
              />
              <MainPage className="scrollbar-hide">
                <Header sidebar={{ sidebarHidden, setSidebarHidden }} />

                <div className="content" style={{ color: "white" }}>
                  <p
                    className="title"
                    style={{ fontSize: "28px", fontWeight: "600" }}
                  >
                    Manage
                  </p>

                  <div
                    style={{
                      // display: "grid",
                      // placeContent: "center",
                      // margin: "64px auto",
                      // placeSelf: "center",
                      marginTop: "140px",
                    }}
                  >
                    <CircularLoader
                      // bg="rgba(12, 108, 243, 0.2)"
                      size="44"
                      color="#0C6CF2"
                    />
                    {/* <p style={{ placeSelf: "center" }}>loader...</p> */}
                  </div>

                  {/* Menus */}
                </div>
              </MainPage>
            </MainContainer>
          ) : (
            <MainContainer>
              <Sidebar
                selected="Manage"
                hidden={{ sidebarHidden, setSidebarHidden }}
              />
              <MainPage className="scrollbar-hide">
                <Header sidebar={{ sidebarHidden, setSidebarHidden }} />

                <div className="content" style={{ color: "white" }}>
                  <p
                    className="title"
                    style={{ fontSize: "28px", fontWeight: "600" }}
                  >
                    Manage
                  </p>

                  {/* Menus */}
                  <ManageStandard>
                    <div
                      className="menuSwitch scrollbar-hide"
                      style={{
                        display: "flex",
                        // gridTemplateColumns: `repeat(${menus.length}, auto)`,
                        marginTop: "40px",
                        gap: "24px",
                        fontWeight: "500",
                        borderBottom: "1px solid rgba(27, 31, 45, 0.7)",
                        fontSize: "18px",
                        overflowX: "auto",
                        overflowY: "hidden",
                        whiteSpace: "nowrap",
                        // zIndex: "99",
                      }}
                    >
                      {menus.map((menu) => (
                        <div
                          key={menu}
                          style={{
                            padding: "0px 4px",
                            position: "relative",
                            paddingBottom: "24px",
                            cursor: "pointer",
                            transition: "all 0.3s ease-in-out",
                            color: menu !== selectedMenu && "#BAC2DE",
                          }}
                          onClick={() => handleMenuSwitch(menu)}
                        >
                          <p>{menu}</p>
                          {menu === selectedMenu && (
                            <div
                              style={{
                                width: "100%",
                                height: "3px",
                                backgroundColor: "#0C6CF2",
                                position: "absolute",
                                bottom: "0",
                                marginBottom: "0.1px",
                                transition: "all 0.3s ease-in-out",
                                zIndex: "99",
                              }}
                            ></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {selectedMenu === "Overview" && !singleUser && (
                      <div className="item">
                        <Overview />
                      </div>
                    )}

                    {selectedMenu === "Users" && !singleUser && (
                      <div className="item">
                        <UsersTable
                          open={{ singleUser, setSingleUser }}
                          user={{ userDetails, setUserDetails }}
                          id={userID}
                        />
                      </div>
                    )}

                    {singleUser && (
                      <div className="item">
                        <SingleUser user={{ userDetails, setUserDetails }} />
                      </div>
                    )}

                    {selectedMenu === "Payments" && (
                      <div className="item">
                        <PaymentsTable />
                      </div>
                    )}

                    {selectedMenu === "Signal Deposits" && (
                      <div className="item">
                        <SignalDepositsTable />
                      </div>
                    )}

                    {selectedMenu === "Verifications" && (
                      <div className="item">
                        <VerificationsTable />
                      </div>
                    )}

                    {selectedMenu === "Signals" && (
                      <div className="item">
                        <SignalsTable />
                      </div>
                    )}

                    {selectedMenu === "Investments" && (
                      <div className="item">
                        <InvestmentsTable />
                      </div>
                    )}

                    {selectedMenu === "Withdrawals" && (
                      <div className="item">
                        <WithdrawalsTable />
                      </div>
                    )}

                    {selectedMenu === "Trading" && (
                      <div className="item">
                        <TradingsTable />
                      </div>
                    )}

                    {selectedMenu === "Trades" && (
                      <div className="item">
                        <TradesTable />
                      </div>
                    )}

                    {selectedMenu === "Subscriptions" && (
                      <div className="item">
                        <SubscriptionsTable />
                      </div>
                    )}

                    {selectedMenu === "Stakings" && (
                      <div className="item">
                        <StakingsTable />
                      </div>
                    )}
                  </ManageStandard>
                </div>
              </MainPage>
            </MainContainer>
          )}
        </>
      )}
    </>
  );
};

const ManageStandard = styled.div`
  .item {
    margin-top: 24px;
  }
`;

export default Manage;
