import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { CardsWithGrid } from "../styled/templates/CardsWithGrid";
import { MainContainer } from "../styled/templates/MainContainer";
import { MainPage } from "../styled/templates/MainPage";
import { createPopper } from "@popperjs/core";
import { styled } from "styled-components";
import SubscriptionCard from "../components/SubscriptionCard";
import { Skeleton, useMediaQuery } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { context } from "../context/context";
import { auth, db } from "../firebase/firebase";
import Toast from "../hooks/Toast";
import { PageButton } from "../styled/input/Input";
import { doc, getDoc } from "@firebase/firestore";
import AddSubscriptionPlanModal from "../modals/AddSubscriptionPlanModal";
import CircularLoader from "../styled/loaders/CircularLoader";
import WithdrawalHistory from "../history/WithdrawalHistory";
import SubscriptionsHistory from "../history/SubscriptionsHistory";
import DummySubscriptionCard from "../components/DummySubscriptionCard";

const Subscribe = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);

  const [isLoading, setIsLoading] = useState(true);
  const { userData, accounts, currentPrices } = useContext(context);
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
      fetchPlans();
    } else {
      fetchPlans();
    }
  }

  async function fetchPlans() {
    const docRef = doc(db, "admin", "plans");
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
      name: "Starter",
      ref: "stau9ed33",
      minimum: 14000,
      duration: 3,
      roi: 350,
      maximum: 99500,
    },
    {
      name: "Pro",
      ref: "stau2293",
      minimum: 100000,
      duration: 3,
      roi: 403,
      maximum: 100000000,
    },
    {
      name: "Starter",
      ref: "stau3d393",
      minimum: 11000,
      duration: 3,
      roi: 200,
      maximum: 19500,
    },
    {
      name: "test",
      ref: "stau3d3w93",
      minimum: 100,
      duration: 10,
      roi: 200,
      maximum: 1000,
    },
  ];

  const [addPlan, setAddPlan] = useState(false);

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
        {addPlan && <AddSubscriptionPlanModal open={{ addPlan, setAddPlan }} />}

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
              selected="Subscribe"
              hidden={{ sidebarHidden, setSidebarHidden }}
            />
            <MainPage className="style-4">
              <Header sidebar={{ sidebarHidden, setSidebarHidden }} />

              <div className="content">
                <h1 className="page_title">Subscribe</h1>
                <p className="page_context">
                  Subscribe to plans and earn profits
                </p>

                <div className="main">
                  <div className="main_title">
                    <span>
                      <p>Plans</p>
                    </span>
                    {userIsAdmin && (
                      <PageButton onClick={() => setAddPlan(!addPlan)}>
                        Add plan
                      </PageButton>
                    )}
                  </div>

                  <CardsWithGrid>
                    {isLoading &&
                      dubPlans.map((plan) => (
                        <DummySubscriptionCard key={plan.ref} />
                      ))}

                    {!isLoading && (
                      <>
                        {!noPlans &&
                          plans.map((plan) => (
                            <SubscriptionCard
                              key={plan.ref}
                              details={plan}
                              prices={currentPrices}
                              accounts={accounts}
                              user={userData}
                              loading={{ isLoading, setIsLoading }}
                              admin={{ userIsAdmin, setUserIsAdmin }}
                            />
                          ))}

                        {/* {!isLoading && noPlans && (
                      <p
                        style={{
                          color: "#BAC2DE",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        There are no available plans.
                      </p>
                    )} */}
                      </>
                    )}
                  </CardsWithGrid>

                  <div className="main_title">
                    <span>
                      <p>Subscriptions</p>
                    </span>
                  </div>

                  <SubscriptionsHistory user={userData.id} />
                </div>
              </div>
            </MainPage>
          </>
        )}
      </MainContainer>
    </>
  );
};

const SubscriptionCardStandard = styled.div`
  background-color: #151823;
  height: 100%;
  border-radius: 12px;

  .edit_btn {
    color: #0c6ef2;
    font-weight: 600;
    cursor: pointer;
  }
`;

export default Subscribe;
