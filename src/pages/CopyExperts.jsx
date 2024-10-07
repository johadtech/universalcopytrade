import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { CardsWithGrid } from "../styled/templates/CardsWithGrid";
import { MainContainer } from "../styled/templates/MainContainer";
import { MainPage } from "../styled/templates/MainPage";
import { styled } from "styled-components";
import { Skeleton, useMediaQuery } from "@mui/material";
import { FullButton, PageButton } from "../styled/input/Input";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { context } from "../context/context";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Toast from "../hooks/Toast";
import AddExpertModal from "../modals/AddExpertModal";
import EditExpertModal from "../modals/EditExpertModal";
import CircularLoader from "../styled/loaders/CircularLoader";

const CopyExperts = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);

  const [isLoading, setIsLoading] = useState(true);

  const { userData } = useContext(context);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const [experts, setExperts] = useState([]);
  const [noExperts, setNoExperts] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!loading && user && userData) {
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
      fetchExperts();
    } else {
      fetchExperts();
    }
  }

  async function fetchExperts() {
    const docRef = doc(db, "admin", "experts");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setExperts(Object.values(docSnap.data()));
      setLoader(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } else {
      setNoExperts(true);
      setLoader(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }

  const dubExperts = [
    {
      name: "Bored Scalper",
      img: "data:image/jpeg;base64,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",
      status: "Pro trader",
      verified: true,
      wins: 33,
      losses: 0,
      winRate: 100,
      profitShare: 33.3,
    },
    {
      name: "Black Scalper",
      img: "https://xsgames.co/randomusers/assets/avatars/male/46.jpg",
      status: "Black man",
      verified: false,
      wins: 343,
      losses: 10,
      winRate: 74.5,
      profitShare: 100,
    },
    {
      name: "Bruh",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww&w=1000&q=80",
      status: "Earning trader",
      verified: true,
      wins: 30,
      losses: 1,
      winRate: 30,
      profitShare: 100,
    },
    {
      name: "Nerd Trader",
      img: "https://xsgames.co/randomusers/assets/avatars/male/31.jpg",
      status: "Fast trader",
      verified: true,
      wins: 30,
      losses: 1,
      winRate: 30,
      profitShare: 100,
    },
  ];

  const [addExpert, setAddExpert] = useState(false);

  // edit
  const [editExpert, setEditExpert] = useState(false);
  const [selectedEditExpert, setSelectedEditExpert] = useState({});
  function handleEditExpert(expert) {
    setSelectedEditExpert(expert);
    setEditExpert(true);
  }

  // copy expert
  const [isCopyingExpert, setIsCopyingExpert] = useState(false);
  const [selectedCopiedExpert, setSelectedCopyExpert] = useState(undefined);

  async function handleCopy(expert) {
    setIsCopyingExpert(true);
    const { subscriberList, ref } = expert;
    setSelectedCopyExpert(ref);

    let list = [];

    if (subscriberList) {
      subscriberList.forEach((sub) => {
        list.push(sub);
      });
    }

    list.push(userData.id);

    copyExpert(expert, list);
  }

  async function copyExpert(expert, list) {
    const ref = doc(db, "admin", "experts");
    const index = `${expert.ref}.subscriberList`;

    await updateDoc(ref, {
      [index]: list,
    })
      .then(() => {
        setIsCopyingExpert(false);
        setToastType("success");
        setToastMessage("Expert copied successfully");
        setOpenToast(true);
      })
      .catch((error) => {
        setIsCopyingExpert(false);
        setToastType("error");
        setToastMessage("Failed to copy. Please try again later.");
        setOpenToast(true);
      });
  }

  // uncopy expert
  const [isUncopyingExpert, setIsUncopyingExpert] = useState(false);
  const [selectedUncopiedExpert, setSelectedUncopiedExpert] =
    useState(undefined);
  async function handleCancel(expert) {
    const { subscriberList, ref } = expert;
    setSelectedUncopiedExpert(ref);
    setIsUncopyingExpert(true);

    const list = subscriberList.filter((sub) => sub !== userData.id);

    unCopyExpert(expert, list);
  }

  async function unCopyExpert(expert, list) {
    const ref = doc(db, "admin", "experts");
    const index = `${expert.ref}.subscriberList`;

    await updateDoc(ref, {
      [index]: list,
    })
      .then(() => {
        setIsUncopyingExpert(false);
        setToastType("success");
        setToastMessage("Copying cancelled successfully");
        setOpenToast(true);
      })
      .catch((error) => {
        setIsUncopyingExpert(false);
        setToastType("error");
        setToastMessage("Failed to cancel. Please try again later.");
        setOpenToast(true);
      });
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

      {editExpert && (
        <EditExpertModal
          expert={selectedEditExpert}
          open={{ editExpert, setEditExpert }}
        />
      )}

      <MainContainer>
        {addExpert && <AddExpertModal open={{ addExpert, setAddExpert }} />}

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
              selected="Copy Experts"
              hidden={{ sidebarHidden, setSidebarHidden }}
            />
            <MainPage className="style-4">
              <Header sidebar={{ sidebarHidden, setSidebarHidden }} />

              <div className="content">
                <h1 className="page_title">Copy Experts</h1>
                <p className="page_context">
                  Earn returns from copying professional traders
                </p>
                {/* () => setAddExpert(!addExpert) */}
                <div className="main">
                  <div className="main_title">
                    <span>
                      <p>Experts</p>
                    </span>
                    {userIsAdmin && (
                      <PageButton onClick={() => setAddExpert(!addExpert)}>
                        Add expert
                      </PageButton>
                    )}
                  </div>

                  <CardsWithGrid>
                    {isLoading ? (
                      dubExperts.map((expert) => (
                        <ExpertCard key={expert.name}>
                          <div>
                            <div className="expert_info">
                              <Skeleton
                                variant="circular"
                                width={48}
                                height={48}
                                sx={{ backgroundColor: "#1b1f2d" }}
                              />
                              <span>
                                <p className="expert_name">
                                  <Skeleton
                                    height={35}
                                    sx={{
                                      backgroundColor: "#1b1f2d",
                                      maxWidth: "60%",
                                    }}
                                  />
                                </p>
                                <div className="tags">
                                  <Skeleton
                                    variant="rounded"
                                    width={48}
                                    sx={{ backgroundColor: "#1b1f2d" }}
                                  />
                                </div>
                              </span>
                            </div>
                          </div>

                          <div className="details">
                            <Skeleton
                              className="detail wr"
                              variant="rounded"
                              height={80}
                              sx={{ backgroundColor: "#1b1f2d" }}
                            />

                            <Skeleton
                              className="detail ps"
                              variant="rounded"
                              height={80}
                              sx={{ backgroundColor: "#1b1f2d" }}
                            />
                            <Skeleton
                              className="detail loss"
                              variant="rounded"
                              height={80}
                              sx={{ backgroundColor: "#1b1f2d" }}
                            />
                            <Skeleton
                              className="detail wins"
                              variant="rounded"
                              height={80}
                              sx={{ backgroundColor: "#1b1f2d" }}
                            />
                          </div>

                          <Skeleton
                            variant="rounded"
                            height={40}
                            sx={{ backgroundColor: "#1b1f2d" }}
                          />
                        </ExpertCard>
                      ))
                    ) : (
                      <>
                        {!noExperts &&
                          experts.map((expert) => (
                            <>
                              {expert.subscriberList.includes(userData.id) && (
                                <ExpertCard key={expert.ref}>
                                  <div className="top">
                                    <div className="expert_info">
                                      {expert.picture ? (
                                        <img
                                          src={expert.picture}
                                          alt=""
                                          className="user"
                                        />
                                      ) : (
                                        <div className="user_circle">
                                          <p>{expert.name?.slice(0, 1)}</p>
                                        </div>
                                      )}

                                      <span>
                                        <span
                                          style={{
                                            display: "flex",
                                            gap: "4px",
                                            alignItems: "center",
                                          }}
                                        >
                                          <p className="expert_name">
                                            {expert.name}
                                          </p>

                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#0c6ef2"
                                            class="w-6 h-6"
                                            style={{ width: "22px" }}
                                          >
                                            <path
                                              fill-rule="evenodd"
                                              d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                              clip-rule="evenodd"
                                            />
                                          </svg>
                                        </span>
                                        <div className="tags">
                                          {expert.subscriberList.includes(
                                            userData.id
                                          ) && (
                                            <span className="expert_status">
                                              <p>Following</p>
                                            </span>
                                          )}
                                        </div>
                                      </span>
                                    </div>

                                    {userIsAdmin && (
                                      <span
                                        onClick={() => handleEditExpert(expert)}
                                      >
                                        <p className="edit_btn">Edit</p>
                                      </span>
                                    )}
                                  </div>

                                  <div className="details">
                                    <span className="detail wr">
                                      <p>Win rate</p>
                                      <p>{expert.winRate}%</p>
                                    </span>
                                    <span className="detail ps">
                                      <p>Profit Share</p>
                                      <p>{expert.profitShare}%</p>
                                    </span>
                                    <span className="detail loss">
                                      <p>Losses</p>
                                      <p>{expert.losses}</p>
                                    </span>
                                    <span className="detail wins">
                                      <p>Wins</p>
                                      <p>{expert.wins}</p>
                                    </span>
                                  </div>
                                  {!expert.subscriberList.includes(
                                    userData.id
                                  ) && (
                                    <FullButton
                                      onClick={() => handleCopy(expert)}
                                      disabled={
                                        isCopyingExpert &&
                                        selectedCopiedExpert === expert.ref
                                      }
                                      className={
                                        isCopyingExpert &&
                                        selectedCopiedExpert === expert.ref &&
                                        "disabled"
                                      }
                                    >
                                      {isCopyingExpert &&
                                      selectedCopiedExpert === expert.ref ? (
                                        <div style={{ padding: "8px" }}>
                                          <CircularLoader
                                            bg="#cccccc"
                                            size="28"
                                            color="#ffffff"
                                          />
                                        </div>
                                      ) : (
                                        <p>Copy</p>
                                      )}
                                    </FullButton>
                                  )}

                                  {expert.subscriberList.includes(
                                    userData.id
                                  ) && (
                                    <FullButton
                                      onClick={() => handleCancel(expert)}
                                      disabled={
                                        isUncopyingExpert &&
                                        selectedUncopiedExpert === expert.ref
                                      }
                                      className={
                                        isUncopyingExpert &&
                                        selectedUncopiedExpert === expert.ref
                                          ? "delete disabled"
                                          : "delete"
                                      }
                                    >
                                      {isUncopyingExpert &&
                                      selectedUncopiedExpert === expert.ref ? (
                                        <div style={{ padding: "8px" }}>
                                          <CircularLoader
                                            bg="#cccccc"
                                            size="28"
                                            color="#ffffff"
                                          />
                                        </div>
                                      ) : (
                                        <p>Cancel</p>
                                      )}
                                    </FullButton>
                                  )}
                                </ExpertCard>
                              )}
                            </>
                          ))}

                        {!noExperts &&
                          experts.map((expert) => (
                            <>
                              {!expert.subscriberList.includes(userData.id) && (
                                <ExpertCard key={expert.ref}>
                                  <div className="top">
                                    <div className="expert_info">
                                      {expert.picture ? (
                                        <img
                                          src={expert.picture}
                                          alt=""
                                          className="user"
                                        />
                                      ) : (
                                        <div className="user_circle">
                                          <p>{expert.name?.slice(0, 1)}</p>
                                        </div>
                                      )}

                                      <span>
                                        <span
                                          style={{
                                            display: "flex",
                                            gap: "4px",
                                            alignItems: "center",
                                          }}
                                        >
                                          <p className="expert_name">
                                            {expert.name}
                                          </p>

                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#0c6ef2"
                                            class="w-6 h-6"
                                            style={{ width: "22px" }}
                                          >
                                            <path
                                              fill-rule="evenodd"
                                              d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                              clip-rule="evenodd"
                                            />
                                          </svg>
                                        </span>
                                        <div className="tags">
                                          {expert.subscriberList.includes(
                                            userData.id
                                          ) && (
                                            <span className="expert_status">
                                              <p>Following</p>
                                            </span>
                                          )}
                                        </div>
                                      </span>
                                    </div>

                                    {userIsAdmin && (
                                      <span
                                        onClick={() => handleEditExpert(expert)}
                                      >
                                        <p className="edit_btn">Edit</p>
                                      </span>
                                    )}
                                  </div>

                                  <div className="details">
                                    <span className="detail wr">
                                      <p>Win rate</p>
                                      <p>{expert.winRate}%</p>
                                    </span>
                                    <span className="detail ps">
                                      <p>Profit Share</p>
                                      <p>{expert.profitShare}%</p>
                                    </span>
                                    <span className="detail loss">
                                      <p>Losses</p>
                                      <p>{expert.losses}</p>
                                    </span>
                                    <span className="detail wins">
                                      <p>Wins</p>
                                      <p>{expert.wins}</p>
                                    </span>
                                  </div>
                                  {!expert.subscriberList.includes(
                                    userData.id
                                  ) && (
                                    <FullButton
                                      onClick={() => handleCopy(expert)}
                                      disabled={
                                        isCopyingExpert &&
                                        selectedCopiedExpert === expert.ref
                                      }
                                      className={
                                        isCopyingExpert &&
                                        selectedCopiedExpert === expert.ref &&
                                        "disabled"
                                      }
                                    >
                                      {isCopyingExpert &&
                                      selectedCopiedExpert === expert.ref ? (
                                        <div style={{ padding: "8px" }}>
                                          <CircularLoader
                                            bg="#cccccc"
                                            size="28"
                                            color="#ffffff"
                                          />
                                        </div>
                                      ) : (
                                        <p>Copy</p>
                                      )}
                                    </FullButton>
                                  )}

                                  {expert.subscriberList.includes(
                                    userData.id
                                  ) && (
                                    <FullButton
                                      onClick={() => handleCancel(expert)}
                                      disabled={
                                        isUncopyingExpert &&
                                        selectedUncopiedExpert === expert.ref
                                      }
                                      className={
                                        isUncopyingExpert &&
                                        selectedUncopiedExpert === expert.ref
                                          ? "delete disabled"
                                          : "delete"
                                      }
                                    >
                                      {isUncopyingExpert &&
                                      selectedUncopiedExpert === expert.ref ? (
                                        <div style={{ padding: "8px" }}>
                                          <CircularLoader
                                            bg="#cccccc"
                                            size="28"
                                            color="#ffffff"
                                          />
                                        </div>
                                      ) : (
                                        <p>Cancel</p>
                                      )}
                                    </FullButton>
                                  )}
                                </ExpertCard>
                              )}
                            </>
                          ))}

                        {/* {!isLoading && experts.length < 1 && (
                      <p
                        style={{
                          color: "#BAC2DE",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        There are no available experts.
                      </p>
                    )} */}
                      </>
                    )}
                  </CardsWithGrid>
                </div>
              </div>
            </MainPage>
          </>
        )}
      </MainContainer>
    </>
  );
};

const ExpertCard = styled.div`
  padding: 24px;
  background-color: #151823;
  height: 100%;
  border-radius: 12px;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .edit_btn {
    color: #0c6ef2;
    font-weight: 600;
    cursor: pointer;
  }

  .user_circle,
  .user_circle_variant {
    min-width: 48px;
    min-height: 48px;
    width: 48px;
    height: 48px;
    border-radius: 100%;
    background-color: #1b1f2d;
    display: grid;
    color: #bac2de;
    font-weight: 600;
    font-size: 18px;
    display: flex;
  }

  .user_circle p,
  .user_circle_variant p {
    width: 48px;
    text-align: center;
    place-self: center;
  }

  .expert_info {
    display: grid;
    grid-template-columns: 48px auto;
    gap: 12px;
    align-items: center;
  }

  .expert_info img {
    width: 48px;
    height: 48px;
    border-radius: 100%;
    object-fit: cover;
  }

  .expert_name {
    color: white;
    font-weight: 600;
    text-transform: capitalize;
  }

  .tags {
    margin-top: 4px;
    display: flex;
    gap: 4px;
  }

  .expert_status {
    font-size: 12px;
    line-height: 18px;
    padding: 2px 8px;
    display: flex;
    gap: 4px;
    border-radius: 16px;
    border: 1px solid #b2ddff;
    background-color: #eff8ff;
    max-width: max-content;
    color: #175cd3;
    font-weight: 600;
    font-family: Inter;
    align-items: center;
  }

  .details {
    display: grid;
    grid-template-areas: "wr wins" "ps loss";
    padding: 24px 0px;
    gap: 4px;
  }

  .detail {
    display: grid;
    text-transform: uppercase;
    gap: 4px;
    justify-items: center;
    padding: 24px;
    background-color: #1b1f2d;
    border-radius: 4px;
    gap: 4px;
  }

  .detail.wr {
    grid-area: wr;
  }

  .detail.ps {
    grid-area: ps;
  }

  .detail.loss {
    grid-area: loss;
  }

  .detail.wins {
    grid-area: wins;
  }

  .detail p:nth-child(1) {
    font-size: 14px;
    color: #bac2de;
    font-weight: 500;
  }
  .detail p:nth-child(2) {
    font-size: 16px;
    color: white;
    font-weight: 600;
  }
`;

export default CopyExperts;
