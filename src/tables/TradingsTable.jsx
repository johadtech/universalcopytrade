import { useState, useEffect, useContext } from "react";
import { styled } from "styled-components";
import { Search } from "../styled/input/Input";
import { context } from "../context/context";
import { ClickAwayListener, Grow, Skeleton } from "@mui/material";
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import Toast from "../hooks/Toast";
import CircularLoader from "../styled/loaders/CircularLoader";
import AddExpertProfitsModal from "../modals/AddExpertProfitsModal";

const TradingsTable = () => {
  const [contexts, setContexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [experts, setExperts] = useState([]);
  const [users, setUsers] = useState([]);

  const [subsList, setSubsList] = useState([]);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  useEffect(() => {
    async function fetchDocs() {
      const docRef = doc(db, "admin", "experts");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setExperts(docSnap.data());
        getUsers();
      } else {
        console.log("No such document!");
      }
    }

    fetchDocs();
  }, []);

  async function getUsers() {
    const userList = [];
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userList.push(doc.data());
      setUsers(userList);
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }

  useEffect(() => {
    const list = [];

    if (experts) {
      const expertList = Object.values(experts);

      expertList.forEach((expert) => {
        if (expert.subscriberList.length) {
          for (let i = 0; i < expert.subscriberList.length; i++) {
            const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
            const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

            const customRef =
              expert.name.substring(0, 4) +
              randomOne.toString() +
              randomTwo.toString();

            const item = {
              customRef,
              ref: expert.ref,
              image: expert.picture,
              name: expert.name,
              user: expert.subscriberList[i],
              list: expert.subscriberList,
            };
            list.push(item);
          }
          setSubsList(list);
        }
      });
    }
  }, [experts]);

  const [selectedRef, setSelectedRef] = useState("");

  const dubUsers = [
    {
      id: "2PA6DDXmkgO2dr4rh31fgSukHFG3",
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
    },
    {
      id: "GKOqJzyMllht7LIcWB2rcCFpFGD3",
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
    },
    {
      id: "g9xpimLpX1XGk2KJEy1d6ggTUft2",
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
    },
  ];

  const [userList, setUserList] = useState(users);
  const [currentAction, setCurrentAction] = useState(undefined);

  function handleContext(value) {
    console.log(value);
  }

  function handleSelectedRef(sub) {
    const { customRef } = sub;

    setSelectedRef(selectedRef === customRef ? " " : customRef);
  }

  function handleAction(action, sub) {
    setSelectedRef(undefined);

    const { name, list, user, ref, customRef } = sub;

    if (action === "cancel") {
      handleUnsubscribe(name, list, user, ref, customRef);
    }

    if (action === "add profits") {
      getProfits(user, customRef, name);
    }
  }

  function handleUnsubscribe(name, subscriberList, user, ref, customRef) {
    setCurrentAction(customRef);
    const list = subscriberList.filter((sub) => sub !== user);

    setUnsubscribe(name, list, ref);
  }

  async function setUnsubscribe(name, list, ref) {
    const q = doc(db, "admin", "experts");
    const index = `${ref}.subscriberList`;

    await updateDoc(q, {
      [index]: list,
    })
      .then(() => {
        setCurrentAction(undefined);
        setToastType("success");
        setToastMessage("Successfully canceled");
        setOpenToast(true);
      })
      .catch((error) => {
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to cancel. Please try again later");
        setOpenToast(true);
      });
  }

  const [addProfits, setAddProfits] = useState(false);
  const [profits, setProfits] = useState(undefined);
  const [userDetails, setUserDetails] = useState(undefined);
  const [expertName, setExpertName] = useState(undefined);
  // const [selectedUS]

  async function getProfits(id, customRef, name) {
    setCurrentAction(customRef);
    const docRef = doc(db, "profits", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const { profits } = data;
      setExpertName(name);
      users.forEach((user) => {
        if (user.id === id) {
          setUserDetails(user);
          setProfits(profits);
          setAddProfits(true);
        }
        setTimeout(() => {
          setCurrentAction("");
        }, 500);
      });
    } else {
      console.log("No such document!");
    }
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

      {addProfits && (
        <AddExpertProfitsModal
          open={{ addProfits, setAddProfits }}
          ogProfits={{ profits, setProfits }}
          user={{ userDetails, setUserDetails }}
          expert={expertName}
        />
      )}

      {/* <HeadingStandard>
        <Search style={{ maxHeight: "max-content" }}>
          <img src="./assets/misc/search.svg" alt="" />
          <input
            type="text"
            name=""
            id=""
            placeholder="Search"
            onChange={handleSearchUsers}
          />
        </Search>

        <div className="context_switch scrollbar-hide">
          {contexts.map((ctx) => (
            <button key={ctx} onClick={() => handleContext(ctx)}>
              <p>{ctx}</p>
            </button>
          ))}
        </div>
      </HeadingStandard> */}

      <TradingsTableStandard className="scrollbar-hide">
        <div className="top scrollbar-hide">
          <p className="active">Signals</p>
        </div>

        {isLoading && (
          <table>
            <th>
              <td className="head-cell user">
                <p>
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "50%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell user">
                <p>
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "50%",
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
                      maxWidth: "50%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell verification"></td>
            </th>

            {dubUsers.map((user) => (
              <tr id="user-row">
                <td className="row-cell user">
                  <PaymentsUserStandard>
                    <Skeleton
                      variant="circular"
                      height={44}
                      width={44}
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />

                    <div className="user_details">
                      <p className="name">
                        <Skeleton
                          width={120}
                          variant="rounded"
                          sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                        />
                      </p>
                    </div>
                  </PaymentsUserStandard>
                </td>

                <td className="row-cell user">
                  <PaymentsUserStandard>
                    <Skeleton
                      variant="circular"
                      height={44}
                      width={44}
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />

                    <div className="user_details">
                      <p className="name">
                        <Skeleton
                          width={120}
                          variant="rounded"
                          sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                        />
                      </p>
                    </div>
                  </PaymentsUserStandard>
                </td>

                <td className="row-cell  registered" id="user-row">
                  <p className="name">
                    <Skeleton
                      width={120}
                      variant="rounded"
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />
                  </p>
                </td>

                <td className="row-cell verification" id="user-row">
                  <p className="name">
                    <Skeleton
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
                borderBottom: subsList?.length > 0 && "1px solid #212945",
              }}
            >
              <td className="head-cell user">
                <p>Expert</p>
              </td>
              <td className="head-cell user">
                <p>User</p>
              </td>
              <td className="head-cell registered">
                <p>Status</p>
              </td>
              <td className="head-cell verification"></td>
            </th>

            {subsList.map((sub) => (
              <tr id="user-row" key={sub.ref}>
                <td className="row-cell user">
                  <PaymentsUserStandard>
                    {!sub.image ? (
                      <div className="user_circle">
                        <p>{sub.name.slice(0, 1)}</p>
                      </div>
                    ) : (
                      <img src={sub.image} alt="" className="user_avatar" />
                    )}
                    <div className="user_details">
                      <p className="name">{sub.name}</p>
                    </div>
                  </PaymentsUserStandard>
                </td>

                <td className="row-cell user">
                  {users.map(
                    (user) =>
                      user.id === sub.user && (
                        <PaymentsUserStandard>
                          {!user.photoURL ? (
                            <div className="user_circle">
                              <p>{user.firstname.slice(0, 1)}</p>
                            </div>
                          ) : (
                            <img
                              src={user.photoURL}
                              alt=""
                              className="user_avatar"
                            />
                          )}
                          <div className="user_details">
                            <p className="name">
                              {user.firstname} {user.lastname}
                            </p>

                            {user.admin && (
                              <div className="admin_tag">
                                <p>Admin</p>
                              </div>
                            )}
                          </div>
                        </PaymentsUserStandard>
                      )
                  )}
                </td>

                <td className="row-cell  registered" id="user-row">
                  <div className="status_box">
                    <p>Following</p>
                  </div>
                </td>

                <td className="row-cell verification" id="user-row">
                  <div style={{ position: "relative" }}>
                    <button
                      className="action_button"
                      onClick={() => handleSelectedRef(sub)}
                    >
                      {currentAction === sub.customRef ? (
                        <CircularLoader
                          bg="#cccccc"
                          size="24"
                          color="#ffffff"
                        />
                      ) : (
                        <p>Edit</p>
                      )}
                    </button>

                    {selectedRef === sub.customRef && (
                      <ClickAwayListener onClickAway={() => setSelectedRef("")}>
                        <Grow
                          in={selectedRef === sub.customRef}
                          style={{ transformOrigin: "0 0 0 0" }}
                          {...(selectedRef === sub.customRef
                            ? { timeout: 300 }
                            : {})}
                        >
                          <BottomSectionStandard className="bottom_section">
                            <p onClick={() => handleAction("add profits", sub)}>
                              Add profits
                            </p>
                            <p onClick={() => handleAction("cancel", sub)}>
                              Cancel
                            </p>
                          </BottomSectionStandard>
                        </Grow>
                      </ClickAwayListener>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </table>
        )}
      </TradingsTableStandard>
    </>
  );
};

const TradingsTableStandard = styled.div`
  padding-bottom: 24px;
  position: relative;
  max-width: 100%;
  /* overflow-y: visible; */
  overflow-x: scroll;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-top: 24px;
  padding-bottom: 60px;

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
    grid-template-columns: 250px 250px 200px 133px;
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
    grid-template-columns: 250px 250px 200px 133px;
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
      grid-template-columns: 250px 300px 235px 133px;
    }

    tr {
      display: grid;
      grid-template-columns: 250px 300px 235px 133px;
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

export default TradingsTable;
