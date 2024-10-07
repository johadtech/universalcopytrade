import { styled } from "styled-components";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { MainContainer } from "../styled/templates/MainContainer";
import { MainPage } from "../styled/templates/MainPage";
import { CardsWithGrid } from "../styled/templates/CardsWithGrid";
import { useContext, useEffect, useState } from "react";
import RealEstateCard from "../components/RealEstateCard";
import { Skeleton, useMediaQuery } from "@mui/material";
import { PrimarySwitcher } from "../styled/input/Input";
import RealEstateCardInvested from "../components/RealEstateCardInvested";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { context } from "../context/context";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

// import { RealEstateFormStandard } from "../styled/forms/RealEstateFormStandard";
// import PieChartTest from "../material-ui/PieChartTest";
// import { formatnumber } from "../utils/utils";
// import Project from "../components/Project";
// import Project from "./Project";
import CountUp from "react-countup";
import RealEstateCardClosed from "../components/RealEstateCardClosed";
import RealEstateCardDummy from "../components/RealEstateCardDummy";
import * as Scroll from "react-scroll";
import CircularLoader from "../styled/loaders/CircularLoader";
import RealEstateClosed from "../components/RealEstateClosed";

const scroll = Scroll.animateScroll;

const RealEstate = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);

  const [isLoading, setIsLoading] = useState(true);

  const { userData, selectedProject, accounts, realEstateBalance } =
    useContext(context);
  const { projectDetails, setProjectDetails } = selectedProject;
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const { id } = userData;

  // const {  } = useContext(context);
  // const { } = selectedProject;

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const [projects, setProjects] = useState([]);
  const [noProjects, setNoProjects] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!loading && user && userData && accounts) {
      setLoader(false);
      checkUserStats(user);
    }

    if (loading && !user) {
      setLoader(true);
    }

    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading]);

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
      fetchProjects();
    } else {
      fetchProjects();
    }
  }

  async function fetchProjects() {
    const docRef = doc(db, "admin", "projects");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setProjects(Object.values(docSnap.data()));
      // getInvestments();
      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 300);
    } else {
      setNoProjects(true);
      // getInvestments();
      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 300);
    }
  }

  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    function getInvestments() {
      const q = query(
        collection(db, "investments"),
        where("user", "==", userData.id)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const investList = [];
        querySnapshot.forEach((doc) => {
          investList.push(doc.data());
        });
        setInvestments(investList);
        setTimeout(() => {
          setIsLoading(false);
        }, 600);
      });
    }

    if (projects && id) {
      getInvestments();
    }
  }, [projects, id]);

  const dubProjects = [
    {
      name: "General stade3qy in Pembrokle",
    },
    {
      name: "General stay in Pd3d3embrokle",
    },

    {
      name: "General stay in d33embrokle",
    },
    {
      name: "General stay in Pececembrokle",
    },
    {
      name: "General stay in Pc3c3brokle",
    },
    {
      name: "General stay in Pe3d3fcmbrokle",
    },
  ];

  const panels = ["Open", "Closed", "Running"];

  const [selectedPanel, setSelectedPanel] = useState("Open");

  const [projectShown, setProjectShow] = useState(false);
  const [projectShownDetails, setProjectShownDetails] = useState(undefined);

  return (
    <MainContainer>
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
            selected="Real Estate"
            hidden={{ sidebarHidden, setSidebarHidden }}
          />
          <MainPage className="style-4" id="mainView">
            <Header sidebar={{ sidebarHidden, setSidebarHidden }} />
            {isLoading && (
              <div className="content">
                <h1 className="page_title">Real Estate</h1>
                <p className="page_context">
                  Invest in projects and earn profits
                </p>

                <div className="main">
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

                  <div className="main_title">
                    <span>
                      <p>Projects</p>
                    </span>

                    <PrimarySwitcher className="scrollbar-hide">
                      {panels.map((panel) => (
                        <button
                          className={
                            selectedPanel === panel
                              ? "variant active"
                              : " variant"
                          }
                          key={panel}
                          onClick={() => setSelectedPanel(panel)}
                        >
                          {panel}
                        </button>
                      ))}
                    </PrimarySwitcher>
                  </div>

                  <CardsWithGrid>
                    {dubProjects.map((project) => (
                      <RealEstateCardDummy key={project.name} />
                    ))}
                  </CardsWithGrid>
                </div>
              </div>
            )}

            {!isLoading && !projectShown && (
              <div className="content">
                <h1 className="page_title">Real Estate</h1>
                <p className="page_context">
                  Invest in projects and earn passive income
                </p>

                <div className="main">
                  <BalanceCardStandard>
                    <CountUp
                      end={realEstateBalance}
                      duration={1}
                      decimals={2}
                      delay={0}
                      separator=","
                      prefix="$"
                    >
                      {({ countUpRef }) => (
                        <span>
                          <p>Total portfolio value</p>
                          <p ref={countUpRef}></p>
                        </span>
                      )}
                    </CountUp>
                  </BalanceCardStandard>

                  <div className="main_title">
                    <span>
                      <p>Projects</p>
                    </span>

                    <PrimarySwitcher className="scrollbar-hide">
                      {panels.map((panel) => (
                        <button
                          className={
                            selectedPanel === panel
                              ? "variant active"
                              : " variant"
                          }
                          key={panel}
                          onClick={() => setSelectedPanel(panel)}
                        >
                          {panel}
                        </button>
                      ))}
                    </PrimarySwitcher>
                  </div>

                  {selectedPanel === "Open" && (
                    <CardsWithGrid>
                      {projects.map(
                        (project) =>
                          !project.closedByDefault &&
                          project.status === "open" && (
                            <RealEstateCard
                              key={project.ref}
                              details={project}
                              open={{ projectShown, setProjectShow }}
                              shown={{
                                projectShownDetails,
                                setProjectShownDetails,
                              }}
                              newShown={{ projectDetails, setProjectDetails }}
                              accounts={accounts}
                              user={userData}
                              admin={{ userIsAdmin, setUserIsAdmin }}
                            />
                          )
                      )}
                    </CardsWithGrid>
                  )}

                  {selectedPanel === "Closed" && (
                    <CardsWithGrid>
                      {projects.map(
                        (project) =>
                          !project.closedByDefault &&
                          project.status === "closed" && (
                            <RealEstateClosed
                              details={project}
                              admin={{ userIsAdmin, setUserIsAdmin }}
                              key={project.ref}
                            />
                          )
                      )}

                      {projects.map(
                        (project) =>
                          project.closedByDefault && (
                            <RealEstateCardClosed
                              details={project}
                              key={project.ref}
                            />
                          )
                      )}
                    </CardsWithGrid>
                  )}

                  {selectedPanel === "Running" && (
                    <>
                      {investments.length > 0 && (
                        <CardsWithGrid>
                          {investments.map(
                            (investment) =>
                              investment.status === "open" && (
                                <RealEstateCardInvested
                                  key={investment.ref}
                                  details={investment}
                                  accounts={accounts}
                                  user={userData}
                                />
                              )
                          )}
                        </CardsWithGrid>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* {!isLoading && projectShown && (
          <Project
            details={{ projectShownDetails, setProjectShownDetails }}
            open={{ projectShown, setProjectShow }}
          />
        )} */}
            {/* <button onClick={() => window.scrollTo(0, 0)}>My link</button> */}
          </MainPage>
        </>
      )}
    </MainContainer>
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

export default RealEstate;
