import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { CardsWithGrid } from "../styled/templates/CardsWithGrid";
import { MainContainer } from "../styled/templates/MainContainer";
import { MainPage } from "../styled/templates/MainPage";
// import { createPopper } from "@popperjs/core";
import { styled } from "styled-components";
// import SubscriptionCard from "../components/SubscriptionCard";
import SignalCard from "../components/SignalCard";
import { PageButton, PrimarySwitcher } from "../styled/input/Input";
import { Skeleton, useMediaQuery } from "@mui/material";
// import TradingProgress from "../components/TradingProgress";/
import SignalStrength from "../components/SignalStrength";
import SignalDeposit from "./SignalDeposit";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebase";
import { context } from "../context/context";
import { doc, getDoc } from "firebase/firestore";
// import { formatter } from "../utils/utils";
import Toast from "../hooks/Toast";
import AddSignalModal from "../modals/AddSignalModal";
import CountUp from "react-countup";
import CircularLoader from "../styled/loaders/CircularLoader";
import SubscriptionsHistory from "../history/SubscriptionsHistory";
import SignalHistory from "../history/SignalHistory";
import DummySignalCard from "../components/DummySignalCard";

const Signals = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);

  const [isLoading, setIsLoading] = useState(true);
  const { userData, accounts, currentPrices, signalBalance } =
    useContext(context);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const [plans, setPlans] = useState([]);
  const [noPlans, setNoPlans] = useState(false);

  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!loading && user && userData && accounts && currentPrices) {
      checkUserStats(user);
    }

    if (loading && !user) {
      setLoader(true);
    }

    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, userData]);

  function checkUserStats() {
    if (userData?.blocked) {
      navigate("/login");
      setToastMessage("Your account has been blocked");
      setToastType("error");
      setOpenToast(true);
    } else {
      checkAdmin();
    }
  }

  function checkAdmin() {
    if (userData?.admin) {
      setUserIsAdmin(true);
      fetchSignals();
    } else {
      fetchSignals();
    }
  }

  async function fetchSignals() {
    const docRef = doc(db, "admin", "signals");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setPlans(Object.values(docSnap.data()));
      setLoader(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } else {
      setNoPlans(true);
      setLoader(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }

  const dubPlans = [
    {
      name: "BC-IRS LEVEL2 Pro",
      price: 10000,
    },
    {
      name: "ACD-Pro",
      price: 2000,
    },

    {
      name: "CD V5 Pro",
      price: 3000,
    },
    {
      name: "BC-IRS",
      price: 7000,
    },
  ];

  const panels = ["Signals", "Deposit"];
  // "Withdraw"
  const [selectedPanel, setSelectedPanel] = useState("Signals");

  const [addSignal, setAddSignal] = useState(false);

  return (
    <>
      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      <MainContainer>
        {addSignal && <AddSignalModal open={{ addSignal, setAddSignal }} />}

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
              selected="Signals"
              hidden={{ sidebarHidden, setSidebarHidden }}
            />
            <MainPage className="scrollbar-hide">
              <Header sidebar={{ sidebarHidden, setSidebarHidden }} />

              <div className="content">
                <h1 className="page_title">Signals</h1>
                <p className="page_context">
                  Purchase trading signals and manage your signal history
                </p>
                {isLoading && (
                  <>
                    <BalanceCardStandard>
                      <span>
                        <p>
                          {" "}
                          <Skeleton
                            variant="rounded"
                            width={100}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              // maxWidth: "50%",
                            }}
                          />
                        </p>
                        <p>
                          {" "}
                          <Skeleton
                            variant="rounded"
                            width={170}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              // maxWidth: "80%",
                            }}
                          />
                        </p>
                      </span>
                    </BalanceCardStandard>

                    {selectedPanel === "Signals" && (
                      <SignalsContainerStandard>
                        <div className="main">
                          <div className="main_title"></div>

                          <div>
                            <Skeleton
                              variant="rounded"
                              height={63}
                              sx={{
                                backgroundColor: "#1b1f2d",
                                marginTop: "8px",
                              }}
                            />
                          </div>
                        </div>
                        <div className="main">
                          <div className="main_title">
                            <span>
                              <p>Active signals</p>
                            </span>
                          </div>

                          <CardsWithGrid>
                            {dubPlans.map((plan) => (
                              <DummySignalCard key={plan.name} />
                            ))}
                          </CardsWithGrid>

                          <div className="main_title">
                            <span>
                              <p>History</p>
                            </span>
                          </div>

                          <SignalHistory user={userData.id} />
                        </div>
                      </SignalsContainerStandard>
                    )}

                    {selectedPanel === "Deposit" && <SignalDeposit />}
                  </>
                )}

                {!isLoading && (
                  <>
                    <BalanceCardStandard>
                      {/* <span>
                    <p>Signal Balance</p>
                    <p> */}

                      <CountUp
                        end={signalBalance}
                        duration={1}
                        decimals={0}
                        delay={0}
                        separator=","
                        prefix="$"
                      >
                        {({ countUpRef }) => (
                          // <div>
                          //   <span className="bottomText bigText" ref={countUpRef} />
                          // </div>

                          <span>
                            <p>Signal Balance</p>
                            <p ref={countUpRef}></p>
                          </span>
                        )}
                      </CountUp>

                      {/* </p>
                  </span> */}

                      <PrimarySwitcher className="scrollbar-hide">
                        {panels.map((p) => (
                          <button
                            className={selectedPanel === p && "active"}
                            key={p}
                            onClick={() => setSelectedPanel(p)}
                          >
                            {p}
                          </button>
                        ))}
                      </PrimarySwitcher>
                    </BalanceCardStandard>

                    {selectedPanel === "Signals" && (
                      <SignalsContainerStandard>
                        <div className="main">
                          {/* <div className="main_title">
                        <span>
                          <p>Signal strength</p>
                        </span>
                      </div> */}

                          <div>
                            <SignalStrength style="variant" />
                          </div>
                        </div>
                        <div className="main">
                          <div className="main_title">
                            <span>
                              <p>Signals</p>
                            </span>
                            {userIsAdmin && (
                              <PageButton
                                onClick={() => setAddSignal(!addSignal)}
                              >
                                Add signal
                              </PageButton>
                            )}
                          </div>

                          <CardsWithGrid>
                            {/* staking card */}
                            {/* aspectRatio: "20 / 19", */}

                            {plans.map((plan) => (
                              <SignalCard
                                key={plan.name}
                                details={plan}
                                prices={currentPrices}
                                accounts={accounts}
                                user={userData}
                                balance={signalBalance}
                                loading={{ isLoading, setIsLoading }}
                                admin={{ userIsAdmin, setUserIsAdmin }}
                              />
                            ))}
                          </CardsWithGrid>

                          <div className="main_title">
                            <span>
                              <p>History</p>
                            </span>
                          </div>

                          <SignalHistory user={userData.id} />
                        </div>
                      </SignalsContainerStandard>
                    )}

                    {selectedPanel === "Deposit" && <SignalDeposit />}
                  </>
                )}
              </div>
            </MainPage>
          </>
        )}
      </MainContainer>
    </>
  );
};

const BalanceCardStandard = styled.div`
  margin: 64px 0px;

  span {
    display: grid;
    gap: 4px;
  }

  span p:nth-child(1) {
    color: #bac2de;
    font-size: 16px;
    font-weight: 500;
  }

  span p:nth-child(2) {
    color: white;
    font-size: 30px;
    font-weight: 600;
  }
`;

const SignalsContainerStandard = styled.div`
  margin-top: 40px;
  max-height: fit-content;

  .main:nth-child(2) {
    margin-top: 80px;
  }
`;

export default Signals;
