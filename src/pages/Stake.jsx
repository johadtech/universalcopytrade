import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { CardsWithGrid } from "../styled/templates/CardsWithGrid";
import { MainContainer } from "../styled/templates/MainContainer";
import { MainPage } from "../styled/templates/MainPage";
import { Skeleton, useMediaQuery } from "@mui/material";
import AddStakeModal from "../modals/AddStakeModal";
import { PageButton } from "../styled/input/Input";
import { auth, db } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { context } from "../context/context";
import { useNavigate } from "react-router";
import Toast from "../hooks/Toast";
import { doc, getDoc } from "@firebase/firestore";
import StakeCard from "../components/StakeCard";
import { styled } from "styled-components";
import CircularLoader from "../styled/loaders/CircularLoader";
import PaymentsHistory from "../history/PaymentsHistory";
import StakeHistory from "../history/StakeHistory";
import DummyStakeCard from "../components/DummyStakeCard";

const Stake = () => {
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

  const [pools, setPools] = useState([]);
  const [noPools, setNoPools] = useState(false);

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
      fetchPools();
    } else {
      fetchPools();
    }
  }

  async function fetchPools() {
    const docRef = doc(db, "admin", "pools");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setPools(Object.values(docSnap.data()));
      setLoader(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } else {
      setNoPools(true);
      setLoader(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }

  const dubPools = [
    {
      name: "Bitcoin Cash",
      asset: "BCH",
      minimum: 3,
      maximum: 44,
      roi: 23,
    },
    {
      name: "Bitcoin",
      asset: "BTC",
      minimum: 1,
      maximum: 23,
      roi: 10,
    },
    {
      name: "Avax",
      asset: "AVAX",
      minimum: 9,
      maximum: 43,
      roi: 25,
    },
    {
      name: "Bitcoin Cash",
      asset: "BCH",
      minimum: 3,
      maximum: 44,
      roi: 22,
    },
  ];

  const [openModal, setOpenModal] = useState(false);
  const [addStake, setAddStake] = useState(false);

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
        {addStake && <AddStakeModal open={{ addStake, setAddStake }} />}

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
              selected="Stake"
              hidden={{ sidebarHidden, setSidebarHidden }}
            />
            <MainPage className="style-4">
              <Header sidebar={{ sidebarHidden, setSidebarHidden }} />

              <div className="content">
                <h1 className="page_title">Stake</h1>
                <p className="page_context">
                  Earn profits from staking and manage your staking history
                </p>

                <div className="main">
                  <div className="main_title">
                    <span>
                      <p>Pools</p>
                    </span>
                    {userIsAdmin && (
                      <PageButton onClick={() => setAddStake(!addStake)}>
                        Add pool
                      </PageButton>
                    )}
                  </div>

                  {isLoading && (
                    <>
                      <CardsWithGrid>
                        {dubPools.map((pool) => (
                          <DummyStakeCard key={pool.name} />
                        ))}
                      </CardsWithGrid>

                      <div className="main_title">
                        <span>
                          <p>Stakings</p>
                        </span>
                      </div>

                      <StakeHistory user={userData.id} />
                    </>
                  )}

                  {!isLoading && (
                    <>
                      <CardsWithGrid>
                        {!noPools &&
                          pools.map((pool) => (
                            <StakeCard
                              key={pool.name}
                              pool={pool}
                              prices={currentPrices}
                              accounts={accounts}
                              user={userData}
                              loading={{ isLoading, setIsLoading }}
                              admin={{ userIsAdmin, setUserIsAdmin }}
                            />
                          ))}
                      </CardsWithGrid>

                      <div className="main_title">
                        <span>
                          <p>Stakings</p>
                        </span>
                      </div>

                      <StakeHistory user={userData.id} />
                    </>
                  )}
                </div>
              </div>
            </MainPage>
          </>
        )}
      </MainContainer>
    </>
  );
};

const StakeCardStandard = styled.div`
  background-color: #151823;
  padding: 24px;
  border-radius: 12px;
  max-height: max-content;
  width: 100%;

  .edit_btn {
    color: #0c6ef2;
    font-weight: 600;
    cursor: pointer;
  }

  .top {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .top .icon_wrap {
    padding: 8px;
    background-color: #1b1f2d;
    border-radius: 8px;
  }

  .top .icon_wrap img {
    height: 32px;
    width: 32px;
  }

  .top .title_wrap {
    display: grid;
    gap: 4px;
  }

  .center {
    display: grid;
    grid-template-areas: "wins roi" "max max";
    padding: 24px 0px;
    gap: 4px;
  }

  .center .minimum {
    text-transform: uppercase;
    display: grid;
    justify-items: center;
    padding: 24px;
    background-color: #1b1f2d;
    border-radius: 4px;
    grid-area: wins;
    gap: 4px;
  }

  .center .cycle {
    text-transform: uppercase;
    display: grid;
    justify-items: center;
    padding: 24px;
    background-color: #1b1f2d;
    border-radius: 4px;
    grid-area: roi;
    gap: 4px;
  }

  .center .maximum {
    text-transform: uppercase;
    display: grid;
    justify-items: center;
    padding: 24px;
    background-color: #1b1f2d;
    border-radius: 4px;
    width: 100%;
    gap: 4px;
    grid-area: max;
  }

  .detail .title {
    font-size: 14px;
    color: #bac2de;
    font-weight: 500;
  }

  .detail .content {
    font-size: 16px;
    color: white;
    font-weight: 600;
  }
`;

export default Stake;
