import { useState, useEffect, useContext } from "react";
import { styled } from "styled-components";
import { Search } from "../styled/input/Input";
import { context } from "../context/context";
import { ClickAwayListener, Grow, Skeleton } from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import Toast from "../hooks/Toast";
import CircularLoader from "../styled/loaders/CircularLoader";

const StakeHistory = ({ user }) => {
  const [contexts, setContexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stakings, setStakings] = useState([]);
  const [stakingsList, setStakingsList] = useState([]);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // hmm
  const [selectedRef, setSelectedRef] = useState("");

  useEffect(() => {
    const stakingList = [];

    async function getStakings() {
      const q = query(collection(db, "stakings"), where("user", "==", user));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        stakingList.push(doc.data());
      });
      setStakings(stakingList);
      setStakingsList(stakingList);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }

    getStakings();
  }, []);

  const dummyList = [
    {
      id: "2PA6DDXmkgO2dr4reve3h31fgSukHFG3",
      firstname: "Sam",
      lastname: "Wells",
      photoURL: null,
      admin: true,
      registerDate: "2 days ago",
      lastLogin: "1 day ago",
      presence: "online",
      verified: true,
      email: "samwells333@gmail.com",
      currency: "USD",
      blocked: false, // or active
      // status: "active", // or blocked
      ref: "ILrA8832",
      amount: "4000 USD",
      total: "$32,393",
    },
    {
      id: "GKOqJzyMllht7LIcWB2rq43r4cCFpFGD3",
      firstname: "Russel",
      lastname: "Carter",
      photoURL: null,
      admin: false,
      registerDate: "2 days ago",
      lastLogin: "1 day ago",
      presence: "online",
      verified: true,
      email: "samwells333@gmail.com",
      currency: "USD",
      blocked: false, // or active
      // status: "active", // or blocked
      ref: "ILrA8832",
      amount: "4000 USD",
      total: "$32,393",
    },
    {
      id: "g9xpimLpX1XGk2KJEy1d6ef3ggTUft2",
      firstname: "Global",
      lastname: "Finex",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/finance-test-5f328.appspot.com/o/logo.pngThu%20Feb%2016%202023%2002%3A58%3A39%20GMT%2B0100%20(West%20Africa%20Standard%20Time)?alt=media&token=9f3ff58c-d249-4af2-8c44-b39370f137ab",
      admin: false,
      registerDate: "2 days ago",
      lastLogin: "1 day ago",
      presence: "online",
      verified: true,
      email: "support@globalfinex.net",
      currency: "USD",
      blocked: false, // or active
      // status: "active", // or blocked
      ref: "ILrA8832",
      amount: "4000 USD",
      total: "$32,393",
    },
    {
      id: "g9xpimLpX1XGk2KJEy1d6gedd3gTUft2",
      firstname: "Global",
      lastname: "Finex",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/finance-test-5f328.appspot.com/o/logo.pngThu%20Feb%2016%202023%2002%3A58%3A39%20GMT%2B0100%20(West%20Africa%20Standard%20Time)?alt=media&token=9f3ff58c-d249-4af2-8c44-b39370f137ab",
      admin: false,
      registerDate: "2 days ago",
      lastLogin: "1 day ago",
      presence: "online",
      verified: true,
      email: "support@globalfinex.net",
      currency: "USD",
      blocked: false, // or active
      // status: "active", // or blocked
      ref: "ILrA8832",
      amount: "4000 USD",
      total: "$32,393",
    },
    {
      id: "g9xpimLpX1XGk2KJEyfe3q1d6ggTUft2",
      firstname: "Global",
      lastname: "Finex",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/finance-test-5f328.appspot.com/o/logo.pngThu%20Feb%2016%202023%2002%3A58%3A39%20GMT%2B0100%20(West%20Africa%20Standard%20Time)?alt=media&token=9f3ff58c-d249-4af2-8c44-b39370f137ab",
      admin: false,
      registerDate: "2 days ago",
      lastLogin: "1 day ago",
      presence: "online",
      verified: true,
      email: "support@globalfinex.net",
      currency: "USD",
      blocked: false, // or active
      // status: "active", // or blocked
      ref: "ILrA8832",
      amount: "4000 USD",
      total: "$32,393",
    },
  ];

  const contextsAllStakingsTicked = ["Delete stakings"];

  const contextsSingleStaking = ["Cancel", "Delete"];

  const [singleContext, setSingleContext] = useState(false);
  const [multiContext, setMultiContext] = useState(false);

  const [selectedStakings, setSelectedStakings] = useState([]);

  const [allStakingsSelected, setAllStakingsSelected] = useState(false);

  const [singleSelectedStaking, setSingleSelectedStaking] = useState([]);
  const [currentAction, setCurrentAction] = useState(undefined);

  useEffect(() => {
    if (selectedStakings) {
      if (selectedStakings.length > 1) {
        setContexts(contextsAllStakingsTicked);
        setMultiContext(true);
        setSingleContext(false);
      }
      if (selectedStakings.length === 1) {
        setContexts(contextsSingleStaking);
        setSingleContext(true);
        setMultiContext(false);
      }
      if (selectedStakings.length < 1) {
        setContexts([]);
        setSingleContext(false);
        setMultiContext(false);
      }
      if (
        !isLoading &&
        stakings.length !== 1 &&
        selectedStakings.length === stakings.length
      ) {
        setAllStakingsSelected(true);
        setMultiContext(true);
        setSingleContext(false);
      } else {
        setAllStakingsSelected(false);
      }
    } else {
      setContexts([]);
      setSingleContext(false);
      setMultiContext(false);
    }
  }, [selectedStakings]);

  function handleContext(value) {
    if (singleContext) {
      if (value === "Cancel") {
        if (singleSelectedStaking.status === "approved") {
          setCurrentAction(undefined);
          setToastType("error");
          setToastMessage("Staking already cancelled");
          setOpenToast(true);
        } else {
          cancelStaking(
            singleSelectedStaking.ref,
            singleSelectedStaking.user,
            singleSelectedStaking.duration
          );
        }
      }

      if (value === "Delete") {
        deleteStaking(singleSelectedStaking.ref);
      }
    }

    if (multiContext) {
      if (value === "Delete stakings") {
        setCurrentAction("Delete stakings");
        selectedStakings.forEach((selectedStaking) => {
          try {
            deleteStaking(selectedStaking);

            if (allStakingsSelected) {
              setAllStakingsSelected(false);
              setSelectedStakings([]);
            }
            // console.log("done");
          } catch (error) {
            // console.log("error", error);
          }
        });
      }
    }
  }

  function handleCheckboxClicked(staking, e) {
    const { value } = e.target;

    setSingleSelectedStaking(staking);

    let selectedStakingList = selectedStakings;

    if (selectedStakingList.includes(value)) {
      if (allStakingsSelected) {
        setAllStakingsSelected(false);
      }
      let slicedArr = selectedStakingList.splice(
        selectedStakingList.indexOf(value),
        1
      );

      setSelectedStakings([...selectedStakingList]);
    } else {
      setSelectedStakings([...selectedStakings, value]);
    }
  }

  function selectAllStakings() {
    let selectedStakingList = [];

    if (allStakingsSelected) {
      selectedStakingList = [];
      setAllStakingsSelected(false);
    } else {
      stakings.forEach((staking) => {
        selectedStakingList.push(staking.ref);
      });
      setAllStakingsSelected(true);
    }

    // console.log(selectedStakingList);
    setSelectedStakings(selectedStakingList);
  }

  function handleStakingsSearch(e) {
    const { value } = e.target;
    // let accountsList = allAccounts;

    let filteredStakings;

    if (value) {
      filteredStakings = stakingsList.filter(
        (stakings) =>
          stakings.userRef?.name.toLowerCase().includes(value.toLowerCase()) ||
          stakings.ref.toLowerCase().includes(value.toLowerCase())
      );
      setStakings(filteredStakings);
    } else {
      setStakings(stakingsList);
    }
  }
  // const checkBoxRef = useRef();

  function handleSelectedRef(staking) {
    const { ref } = staking;
    // const { firstname } = user;
    // console.log(firstname);
    setSelectedRef(selectedRef === ref ? " " : ref);
  }

  function handleAction(action, staking) {
    const { ref, user, duration } = staking;
    setSelectedRef(undefined);

    if (action === "cancel") {
      cancelStaking(ref, user, duration);
    }

    if (action === "delete") {
      deleteStaking(ref);
    }
  }

  // delete
  async function deleteStaking(ref) {
    setCurrentAction(ref);
    const document = doc(db, "stakings", ref);
    await deleteDoc(document)
      .then(() => {
        setCurrentAction(undefined);
        setToastType("success");
        setToastMessage("Deleted successfully");
        setOpenToast(true);
      })
      .catch((error) => {
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to delete. Please try again later");
        setOpenToast(true);
      });
  }

  // approve
  async function cancelStaking(ref, user, duration) {
    setCurrentAction(ref);
    const document = doc(db, "stakings", ref);
    await updateDoc(document, {
      status: "closed",
      daysLeft: 0,
      daysRan: duration,
    })
      .then(() => {
        setCurrentAction(undefined);
        setToastType("success");
        setToastMessage("Cancelled successfully");
        setOpenToast(true);
      })
      .catch((error) => {
        // console.log(error)
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to cancel. Please try again later");
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

      <StakeHistoryStandard className="scrollbar-hide">
        <div className="top scrollbar-hide">
          <p className="active">Stakings</p>
        </div>

        {isLoading && (
          <table>
            <th>
              <td className="head-cell login">
                <p>
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      // maxWidth: "70%",
                    }}
                  />
                </p>
              </td>

              <td className="head-cell currency">
                <p>
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "70%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell currency">
                <p>
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "70%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell login">
                <p>
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      // maxWidth: "70%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell login">
                <p>
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      // maxWidth: "70%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell login">
                <p>
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "70%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell registered">
                <p>
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "70%",
                    }}
                  />
                </p>
              </td>
            </th>

            {dummyList.map((user) => (
              <tr id="user-row">
                <td className="row-cell currency" id="user-row">
                  <p className="name">
                    <Skeleton
                      // width={120}
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "80%",
                      }}
                    />
                  </p>
                </td>

                <td className="row-cell currency" id="user-row">
                  <p className="name">
                    <Skeleton
                      // width={120}
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "80%",
                      }}
                    />
                  </p>
                </td>

                <td className="row-cell currency" id="user-row">
                  <p className="name">
                    <Skeleton
                      // width={120}
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "70%",
                      }}
                    />
                  </p>
                </td>

                <td className="row-cell login" id="user-row">
                  <p className="name">
                    <Skeleton
                      // width={120}
                      variant="rounded"
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />
                  </p>
                </td>

                <td className="row-cell login" id="user-row">
                  <p className="name">
                    <Skeleton
                      // width={120}
                      variant="rounded"
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />
                  </p>
                </td>

                <td className="row-cell login" id="user-row">
                  <p className="name">
                    <Skeleton
                      // width={120}
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "80%",
                      }}
                    />
                  </p>
                </td>

                <td className="row-cell  registered" id="user-row">
                  <p className="name">
                    <Skeleton
                      // width={120}
                      variant="rounded"
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />
                  </p>
                </td>
              </tr>
            ))}
          </table>
        )}

        {!isLoading && (
          <table>
            <th
              style={{
                borderBottom: stakings?.length > 0 && "1px solid #212945",
              }}
            >
              <td className="head-cell user">
                <div>
                  <p>Ref</p>
                </div>
              </td>
              <td className="head-cell currency">
                <p>Amount</p>
              </td>
              <td className="head-cell currency">
                <p>Duration</p>
              </td>
              <td className="head-cell login">
                <p>Days Left</p>
              </td>
              <td className="head-cell login">
                <p>Total (USD) </p>
              </td>
              <td className="head-cell login">
                <p>ROI</p>
              </td>
              <td className="head-cell registered">
                <p>Status</p>
              </td>
            </th>

            {stakings.map(
              (staking) =>
                staking.status === "open" && (
                  <tr
                    id="user-row"
                    className={
                      selectedStakings.includes(staking.ref) && "selected"
                    }
                  >
                    <td className="row-cell user" id="user-row">
                      <div>
                        <p style={{ color: "white", fontWeight: "600" }}>
                          {staking.ref}
                        </p>
                      </div>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      <p>
                        {staking.amount} {staking.asset}
                      </p>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      <p>{staking.duration} days</p>
                    </td>

                    <td className="row-cell login" id="user-row">
                      <p>
                        {staking.duration - staking.daysRan}{" "}
                        {staking.duration - staking.daysRan > 1 ||
                        staking.duration - staking.daysRan === 0
                          ? "days"
                          : "day"}
                      </p>
                    </td>

                    <td className="row-cell login" id="user-row">
                      <p>$34,494</p>
                    </td>

                    <td className="row-cell login" id="user-row">
                      <p>{staking.roi}%</p>
                    </td>

                    <td className="row-cell  registered" id="user-row">
                      <div className="status_box active">
                        <p>Running</p>
                      </div>
                    </td>
                  </tr>
                )
            )}

            {stakings.map(
              (staking) =>
                staking.status === "closed" && (
                  <tr
                    id="user-row"
                    className={
                      selectedStakings.includes(staking.ref) && "selected"
                    }
                  >
                    <td className="row-cell user" id="user-row">
                      <div>
                        <p style={{ color: "white", fontWeight: "600" }}>
                          {staking.ref}
                        </p>
                      </div>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      <p>
                        {staking.amount} {staking.asset}
                      </p>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      <p>{staking.duration} days</p>
                    </td>

                    <td className="row-cell login" id="user-row">
                      <p>
                        {staking.duration - staking.daysRan}{" "}
                        {staking.duration - staking.daysRan > 1 ||
                        staking.duration - staking.daysRan === 0
                          ? "days"
                          : "day"}
                      </p>
                    </td>

                    <td className="row-cell login" id="user-row">
                      <p>$34,494</p>
                    </td>

                    <td className="row-cell login" id="user-row">
                      <p>{staking.roi}%</p>
                    </td>

                    <td className="row-cell  registered" id="user-row">
                      <div className="status_box inactive">
                        <p>Ended</p>
                      </div>
                    </td>
                  </tr>
                )
            )}
          </table>
        )}
      </StakeHistoryStandard>
    </>
  );
};

const StakeHistoryStandard = styled.div`
  padding-bottom: 24px;
  position: relative;
  max-width: 100%;
  /* overflow-y: visible; */
  overflow-x: scroll;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-top: 24px;
  padding-bottom: 60px;
  background-color: transparent;
  padding: 18px 0px;

  .disabled_select {
    /* opacity: 0.8; */
    /* animation: blinker 2s linear infinite; */
    cursor: not-allowed;
    user-select: none;
    pointer-events: none;
  }

  .top {
    color: #acb3cd;
    font-size: 16px;
    font-weight: 600;
    background-color: #1b1f2d;
    width: 100%;
    padding: 16px 24px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    display: flex;
    gap: 32px;
    position: sticky;
    top: 0;
    left: 0;
    white-space: nowrap;
    overflow-x: scroll;
  }

  .top p.active {
    color: #ffffff;
  }

  table {
    background-color: #151823;
    width: 100%;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    max-width: 100%;
    overflow-x: auto;
  }

  th {
    display: grid;
    grid-template-columns: 200px 133px 133px 133px 133px 133px 133px;
    justify-content: space-between;
    text-align: left;
    width: 100%;
    /* border-bottom: 1px solid #212945; */
    padding: 4px 0px;
  }

  th p {
    color: white;
    font-weight: 600;
  }

  tr p {
    color: #bac2de;
    font-size: 16px;
  }

  tr {
    display: grid;
    grid-template-columns: 200px 133px 133px 133px 133px 133px 133px;
    justify-content: space-between;
    text-align: left;
    width: 100%;
    transition: all 0.1s ease-in-out;
    cursor: pointer;
    padding: 8px 0px;
    border-bottom: 1px solid #2129456f;
    position: relative;
  }

  tr:last-child {
    border-bottom: none;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  tr.selected {
    background-color: #21294546;
  }

  tr:hover {
    background-color: #212945;
  }

  @media screen and (max-width: 1300px) {
    th {
      display: grid;
      grid-template-columns: 180px 175px 133px 133px 133px 133px 133px;
    }

    tr {
      display: grid;
      grid-template-columns: 180px 175px 133px 133px 133px 133px 133px;
    }
  }

  .head-cell {
    padding: 0px 24px;
    height: 44px;
    white-space: nowrap;
    text-align: left;
    display: grid;
    align-content: center;
    color: #bac2de;
    font-size: 14px;
    font-weight: 600;
  }

  .row-cell {
    padding: 0px 24px;
    height: 72px;
    white-space: nowrap;
    text-align: left;
    display: grid;
    align-content: center;
    color: white;
  }

  .user {
    width: 100%;
    /* background-color: red; */
  }

  .id {
    width: 100%;
  }

  .currency {
    width: 100%;
  }

  .login {
    width: 100%;
  }

  .resgistered {
    width: 100%;
    text-align: right;
  }

  .verification {
    width: 100%;
  }

  .status {
    width: 100%;
  }

  .user div:nth-child(1) {
    display: grid;
    grid-template-columns: 20px auto;
    gap: 12px;
    align-items: center;
    white-space: nowrap;
  }

  .user div .checkbox:nth-child(1) {
    width: 18px;
    height: 18px;
    border: 1px solid #acb3cd;
    border-radius: 6px;
    box-sizing: border-box;
    accent-color: #0c6ef2;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    position: relative;
    background-color: transparent;
    margin: 0;
    display: grid;
    place-content: center;
  }

  .user div .checkbox:checked {
    background-color: #0c6ef2;
    border: 1px solid #0c6ef2;
  }

  input[type="checkbox"] {
    appearance: none;
    background-color: #fff;
    margin: 0;
    font: inherit;
    color: currentColor;
    width: 1.15em;
    height: 1.15em;
    border: 0.15em solid currentColor;
    border-radius: 0.15em;
    transform: translateY(-0.075em);
  }

  input[type="checkbox"]::before {
    content: "";
    width: 0.59em;
    height: 0.59em;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em #fff;
    transform-origin: bottom left;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  input[type="checkbox"]:checked::before {
    transform: scale(1);
  }

  .status_box {
    padding: 4px 8px;
    border: 1px solid #c6f6d8;
    background-color: #f0fdf4;
    border-radius: 6px;
    max-width: max-content;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .status_box p {
    font-size: 14px;
    font-weight: 500;
    color: #15803d;
    line-height: 20px;
  }

  .action_button {
    padding: 4px 24px;
    border: 1px solid #212945;
    background-color: #1b1f2d;
    border-radius: 6px;
    max-width: max-content;
    display: flex;
    gap: 4px;
    align-items: center;
    color: #c6f6d82b;
    cursor: pointer;
    place-self: flex-start;
  }

  .action_button p {
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
  }

  .status_box.active {
    border: 1px solid #c6f6d8;
    background-color: #f0fdf4;
  }

  .status_box.active p {
    color: #15803d;
  }

  .status_box.inactive {
    border: 1px solid #4b3547;
    background-color: #2d202b;
  }

  .status_box.inactive p {
    color: #d55763;
  }

  .status_box.pending {
    border: 1px solid #b2ddff;
    background-color: #eff8ff;
  }

  .status_box.pending p {
    color: #175cd3;
  }
`;

const BottomSectionStandard = styled.div`
  position: absolute;
  right: 50px;
  z-index: 1000;
  top: -100px;
  width: 100%;
  border-radius: 8px;
  z-index: 9999;
  padding: 4px;
  border: 1px solid #212945;
  min-width: fit-content;
  background-color: #1b1f2d;
  white-space: nowrap;
  box-shadow: 0px 4px 6px -2px rgba(16, 24, 40, 0.03),
    0px 12px 16px -4px rgba(16, 24, 40, 0.08);

  p {
    font-size: 14px;
    font-weight: 500;

    color: #bac2de;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }

  p:hover {
    background-color: #1c233b;
    border-radius: 6px;
  }
`;

const HeadingStandard = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;

  .blink_me {
    animation: blinker 2s linear infinite;
    cursor: not-allowed;
    user-select: none;
    pointer-events: none;
  }

  @keyframes blinker {
    50% {
      opacity: 0.5;
    }
  }

  .context_switch {
    display: flex;
    gap: 8px;
    max-width: 100vw;

    overflow-x: auto;
    overflow-y: hidden;
  }

  .context_switch button {
    background-color: #191f34;
    /* backgroundColor: ctx === selectedContext ? "white" : "#191F34",  ctx !== selectedContext && */
    padding: 8px 12px;
    outline: none;
    border: none;
    border-radius: 32px;
    color: white;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    height: max-content;
    text-align: justify;
    max-width: max-content;
    white-space: nowrap;
  }

  .context_switch button:hover {
    background-color: rgba(25, 31, 52, 0.5);
  }

  .context_switch button p {
    font-size: 14px;
    font-weight: 600;
  }

  @media screen and (max-width: 1500px) {
    display: grid;
    gap: 24px;
  }
`;

const PaymentsUserStandard = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  .user_avatar {
    width: 44px;
    height: 44px;
    border-radius: 100%;
  }

  .user_details {
    margin-left: 18px;
    display: flex;
    align-items: center;
  }

  .user_details .name {
    color: white;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
  }

  .user_circle {
    min-width: 40px;
    min-height: 40px;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-color: #1b1f2d;
    display: grid;
    color: #bac2de;
    font-weight: 600;
    font-size: 18px;
  }

  .user_circle p {
    width: 40px;
    text-align: center;
  }

  .admin_tag {
    padding: 4px;
    border: 1px solid #c6f6d8;
    background-color: #f0fdf4;
    border-radius: 6px;
    max-width: max-content;
    display: flex;
    gap: 4px;
    align-items: center;
    margin-left: 4px;
  }

  .admin_tag p {
    font-size: 12px;
    font-weight: 500;
    color: #15803d;
  }
`;

export default StakeHistory;
