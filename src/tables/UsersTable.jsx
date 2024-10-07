import { useState, useEffect, useRef } from "react";
import { Search } from "../styled/input/Input";
import { styled } from "styled-components";
import { getTime } from "../utils/utils";
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { Skeleton } from "@mui/material";
import Toast from "../hooks/Toast";
import {
  EmailAuthProvider,
  deleteUser,
  getAuth,
  reauthenticateWithCredential,
} from "firebase/auth";

const UsersTable = ({ open, user }) => {
  const { singleUser, setSingleUser } = open;
  const [contexts, setContexts] = useState([]);
  // const { userID, setUserID } = id;
  const { userDetails, setUserDetails } = user;

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userList, setUserList] = useState([]);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  useEffect(() => {
    const usersList = [];

    async function getUsers() {
      const q = query(collection(db, "users"), orderBy("registerDate", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        usersList.push(doc.data());
      });
      setUsers(usersList);
      setUserList(usersList);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }

    getUsers();
  }, []);

  const dummyList = [
    {
      id: "2PA6DDXmkgO2dfr4rh31fgSukHFG3",
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
      id: "GKOqJzyMllht7LIcWuyB2rcCFpFGD3",
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
      id: "g9xpimLpyryX1XGk2KJEy1d6ggTUft2",
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
    {
      id: "g9xpimLpX1XGk2KJErumfyy1d6ggTUft2",
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
    {
      id: "g9xpimLpX1XGk2KJryjyrjyrEy1d6ggTUft2",
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

  const contextsAllUsersTicked = [
    "Verify selected users",
    "Block selected users",
    // "Delete selected users",
  ];

  const contextsSingleUser = [
    "Edit user",
    "Verify user",
    "Copy user name",
    "Copy user email",
    "Copy user ID",
    "Block user",
    // "Delete user",
  ];

  const [singleContext, setSingleContext] = useState(false);
  const [multiContext, setMultiContext] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsersSelected, setAllUsersSelected] = useState(false);
  const [singleSelectedUser, setSingleSelectedUser] = useState([]);
  const [currentAction, setCurrentAction] = useState(undefined);

  // copy function
  function copyValue(value, type) {
    navigator.clipboard.writeText(value);
    setToastType("success");
    setToastMessage("Copied" + type);
    setOpenToast(true);
  }

  useEffect(() => {
    if (selectedUsers) {
      if (selectedUsers.length > 1) {
        setContexts(contextsAllUsersTicked);
        setMultiContext(true);
        setSingleContext(false);
      }
      if (selectedUsers.length === 1) {
        setContexts(contextsSingleUser);
        setSingleContext(true);
        setMultiContext(false);
      }
      if (selectedUsers.length < 1) {
        setContexts([]);
        setSingleContext(false);
        setMultiContext(false);
      }
      if (
        !isLoading &&
        users.length !== 1 &&
        selectedUsers.length === users.length
      ) {
        setAllUsersSelected(true);
        setMultiContext(true);
        setSingleContext(false);
      } else {
        setAllUsersSelected(false);
      }
    } else {
      setContexts([]);
      setSingleContext(false);
      setMultiContext(false);
    }
  }, [selectedUsers]);

  function handleContext(value) {
    // console.log(value);

    if (singleContext) {
      // console.log("single user");
      // console.log(singleSelectedUser);
      if (value === "Copy user name") {
        copyValue(
          singleSelectedUser.firstname + " " + singleSelectedUser.lastname,
          " user name"
        );
      }

      if (value === "Copy user email") {
        copyValue(singleSelectedUser.email, " email address");
      }

      if (value === "Copy user ID") {
        copyValue(singleSelectedUser.id, " user ID");
      }

      if (value === "Edit user") {
        setCurrentAction("Edit user");
        setUserDetails(singleSelectedUser);
        setSingleUser(true);
        setCurrentAction(undefined);
      }

      // verify user
      if (value === "Verify user") {
        setCurrentAction("Verify user");
        verifyUser(singleSelectedUser.id);
      }

      // block user
      if (value === "Block user") {
        setCurrentAction("Block user");
        blockUser(singleSelectedUser.id);
      }
    }

    if (multiContext) {
      if (value === "Verify selected users") {
        setCurrentAction("Verify selected users");
        selectedUsers.forEach((selectedUser) => {
          try {
            verifyUser(selectedUser);

            if (allUsersSelected) {
              setAllUsersSelected(false);
              setSelectedUsers([]);
            }
            // console.log("done");
          } catch (error) {
            console.log("error", error);
          }
        });
      }

      if (value === "Block selected users") {
        setCurrentAction("Block selected users");
        selectedUsers.forEach((selectedUser) => {
          try {
            blockUser(selectedUser);

            if (allUsersSelected) {
              setAllUsersSelected(false);
              setSelectedUsers([]);
            }
            // console.log("done");
          } catch (error) {
            // console.log("error", error);
          }
        });
      }
    }
  }

  function handleCheckboxClicked(user, e) {
    const { value } = e.target;

    setSingleSelectedUser(user);

    let selectedUserList = selectedUsers;

    if (selectedUserList.includes(value)) {
      if (allUsersSelected) {
        setAllUsersSelected(false);
      }
      let slicedArr = selectedUserList.splice(
        selectedUserList.indexOf(value),
        1
      );

      setSelectedUsers([...selectedUserList]);
    } else {
      setSelectedUsers([...selectedUsers, value]);
    }
  }

  function selectAllUsers() {
    let selectedUserList = [];

    if (allUsersSelected) {
      selectedUserList = [];
      setAllUsersSelected(false);
    } else {
      users.forEach((user) => {
        selectedUserList.push(user.id);
      });
      setAllUsersSelected(true);
    }

    // console.log(selectedUserList);
    setSelectedUsers(selectedUserList);
  }

  function handleSearchUsers(e) {
    const { value } = e.target;
    let filteredUsers;

    if (value) {
      filteredUsers = userList.filter(
        (users) =>
          users.firstname.toLowerCase().includes(value.toLowerCase()) ||
          users.email.toLowerCase().includes(value.toLowerCase())
      );
      setUsers(filteredUsers);
    } else {
      setUsers(userList);
    }
  }

  const checkBoxRef = useRef();

  function handleRowClick(user, e) {
    const { localName } = e.target;

    if (localName === "button") {
      // dispatch({
      //   type: "toast",
      //   payload: JSON.stringify({
      //     open: true,
      //     message: "This is a success alert check it out",
      //     type: "success",
      //   }),
      // });
    } else if (localName === "input") {
      // console.log("checkbox for", user);
      // console.log(selectedUsers);
      // console.log("checkbox clicked");
      // console.log(singleSelectedUser);
    } else if (localName === "img" || localName === "p") {
      return;
    } else {
      setUserDetails(user);
      setSingleUser(true);
    }
  }

  // verify user
  async function verifyUser(user) {
    // if (user.verified) {
    //   setCurrentAction(undefined);
    //   setToastType("success");
    //   setToastMessage("User is already verified");
    //   setOpenToast(true);
    //   return;
    // }

    await updateDoc(doc(db, "users", user), {
      verified: true,
    })
      .then(() => {
        // setIsEditingSignal(false);
        setCurrentAction(undefined);

        setToastType("success");
        setToastMessage(
          multiContext
            ? "Users verified successfully"
            : "User verified successfully"
        );
        setOpenToast(true);
      })
      .catch((error) => {
        // console.log(error);
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to verify. Please try again later");
        setOpenToast(true);
      });
  }

  // block user
  async function blockUser(user) {
    // if (user.blocked) {
    //   setCurrentAction(undefined);
    //   setToastType("success");
    //   setToastMessage("User is already blocked");
    //   setOpenToast(true);
    //   return;
    // }

    await updateDoc(doc(db, "users", user), {
      blocked: true,
    })
      .then(() => {
        // setIsEditingSignal(false);
        setCurrentAction(undefined);

        setToastType("success");
        setToastMessage(
          multiContext
            ? "Users blocked successfully"
            : "User blocked successfully"
        );
        setOpenToast(true);
      })
      .catch((error) => {
        // console.log(error);
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to block. Please try again later");
        setOpenToast(true);
      });
  }

  // delete user
  // async function deleteUserFirebase(user) {
  //   // setIsDeleting(true);
  //   // setIsDeletingUser(true);

  //   const auth = getAuth();
  //   const credential = EmailAuthProvider.credential(user.email, user.userPass);

  //   const result = await reauthenticateWithCredential(
  //     auth.currentUser,
  //     credential
  //   )
  //     .then(() => {
  //       deleteUser(result)
  //         .then((result) => {
  //           console.log(result);
  //           console.log("deleted");
  //           // setIsDeleting(false);
  //           // deleteUserData();
  //           // setIsDeleting(false);
  //           // deleteUserData();
  //           // deleteUserData();
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //           // setIsDeleting(false);
  //           setToastType("error");
  //           setToastMessage(
  //             "There was an error with your request. Please try again later"
  //           );
  //           setOpenToast(true);
  //           // console.log("error changing", error);
  //           // console.log("changing error", error.code);
  //         });
  //     })
  //     .catch((error) => {
  //       // const { code } = error;
  //       console.log(error);

  //       // setIsDeleting(false);
  //       // console.log("auth", error);
  //       // console.log("error with reauthentication", error.code);

  //       if (error.code === "auth/network-request-failed") {
  //         // console.log("network problems");
  //         setToastType("error");
  //         setToastMessage(
  //           "Network request failed. Check your network and retry"
  //         );
  //         setOpenToast(true);
  //       }
  //       if (error.code === "auth/wrong-password") {
  //         // console.log("wrong password");
  //         setToastType("error");
  //         setToastMessage(
  //           "Invalid credentials. Check your password and try again"
  //         );
  //         setOpenToast(true);
  //       }
  //       if (error.code === "auth/too-many-requests") {
  //         // console.log("too many attempts");
  //         setToastType("error");
  //         setToastMessage("Too many attempts. Try again after a while");
  //         setOpenToast(true);
  //       }
  //       // error with reauthentication auth/wrong-password
  //     });
  // }

  return (
    <>
      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      <HeadingStandard>
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
            <button
              key={ctx}
              onClick={() => handleContext(ctx)}
              className={currentAction === ctx ? "blink_me" : " "}
            >
              <p>{ctx}</p>
            </button>
          ))}
        </div>
      </HeadingStandard>

      <UsersTableStandard className="scrollbar-hide">
        <div className="top scrollbar-hide">
          <p>Users</p>
        </div>
        {isLoading && (
          <table>
            <th>
              <td className="head-cell user">
                <div>
                  <Skeleton
                    variant="rounded"
                    height={18}
                    width={18}
                    sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                  />
                  <p>
                    <Skeleton
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "100%",
                      }}
                    />
                  </p>
                </div>
              </td>
              <td className="head-cell id">
                <Skeleton
                  variant="rounded"
                  sx={{
                    backgroundColor: "rgba(27, 31, 45)",
                    maxWidth: "100%",
                  }}
                />
              </td>
              <td className="head-cell currency">
                <Skeleton
                  variant="rounded"
                  sx={{
                    backgroundColor: "rgba(27, 31, 45)",
                    maxWidth: "100%",
                  }}
                />
              </td>
              <td className="head-cell login">
                <Skeleton
                  variant="rounded"
                  sx={{
                    backgroundColor: "rgba(27, 31, 45)",
                    maxWidth: "100%",
                  }}
                />
              </td>
              <td className="head-cell registered">
                <Skeleton
                  variant="rounded"
                  sx={{
                    backgroundColor: "rgba(27, 31, 45)",
                    maxWidth: "100%",
                  }}
                />
              </td>
              <td className="head-cell verification">
                <Skeleton
                  variant="rounded"
                  sx={{
                    backgroundColor: "rgba(27, 31, 45)",
                    maxWidth: "100%",
                  }}
                />
              </td>
              <td className="head-cell status">
                <Skeleton
                  variant="rounded"
                  sx={{
                    backgroundColor: "rgba(27, 31, 45)",
                    maxWidth: "100%",
                  }}
                />
              </td>
            </th>
            {dummyList.map((user) => (
              <tr
                // onClick={(e) => handleRowClick(user, e)}
                id="user-row"
                key={user.id}
              >
                <td className="row-cell user" id="user-row">
                  <div>
                    <Skeleton
                      variant="rounded"
                      height={18}
                      width={18}
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />
                    <span
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <Skeleton
                        variant="circular"
                        height={44}
                        width={44}
                        sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                      />

                      <span style={{ display: "grid" }} id="user-row">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <p>
                            <Skeleton
                              width={120}
                              variant="rounded"
                              sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                            />
                          </p>
                        </div>

                        <p style={{ marginTop: "4px" }}>
                          <Skeleton
                            width={200}
                            variant="rounded"
                            sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                          />
                        </p>
                      </span>
                    </span>
                  </div>
                </td>
                <td className="row-cell id" id="user-row">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <p>
                      <Skeleton
                        width={100}
                        variant="rounded"
                        sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                      />
                    </p>

                    <p>
                      <Skeleton
                        width={40}
                        variant="rounded"
                        sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                      />
                    </p>
                  </div>
                </td>
                <td className="row-cell currency" id="user-row">
                  <Skeleton
                    width={40}
                    variant="rounded"
                    sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                  />
                </td>
                <td className="row-cell login" id="user-row">
                  <Skeleton
                    variant="rounded"
                    sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                  />
                </td>
                <td className="row-cell  registered" id="user-row">
                  <Skeleton
                    variant="rounded"
                    sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                  />
                </td>
                <td className="row-cell verification" id="user-row">
                  <div>
                    <Skeleton
                      variant="rounded"
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />
                  </div>
                </td>
                <td className="row-cell status" id="user-row">
                  <Skeleton
                    width={40}
                    variant="rounded"
                    sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                  />
                </td>
              </tr>
            ))}
          </table>
        )}

        {!isLoading && (
          <table className={currentAction ? "disabled_select" : " "}>
            <th
              style={{
                borderBottom: users?.length > 0 && "1px solid #212945",
              }}
            >
              <td className="head-cell user">
                <div>
                  <input
                    type="checkbox"
                    name="user"
                    id=""
                    onChange={selectAllUsers}
                    checked={allUsersSelected}
                    className="checkbox"
                  />
                  <p>User</p>
                </div>
              </td>
              <td className="head-cell id">
                <p>ID</p>
              </td>
              <td className="head-cell currency">
                <p>Currency</p>
              </td>
              <td className="head-cell login">
                <p>Last Login</p>
              </td>
              <td className="head-cell registered">
                <p>Registered</p>
              </td>
              <td className="head-cell verification">
                <p>Verification</p>
              </td>
              <td className="head-cell status">
                <p>Status</p>
              </td>
            </th>

            {users.map((user) => (
              <tr
                onClick={(e) => handleRowClick(user, e)}
                key={user?.id}
                id="user-row"

                // className={
                //   selectedUsers.includes(user.id) ? "selected" : "normal"
                // }
              >
                <td className="row-cell user" id="user-row">
                  <div>
                    <input
                      type="checkbox"
                      name="user"
                      id=""
                      onChange={(e) => handleCheckboxClicked(user, e)}
                      value={user.id}
                      checked={selectedUsers.includes(user.id)}
                      className="checkbox"
                      ref={checkBoxRef}
                    />
                    <span
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      {!user.photoURL ? (
                        <div className="user_circle">
                          <p>{user.firstname.slice(0, 1)}</p>
                        </div>
                      ) : (
                        <img
                          src={user.photoURL}
                          alt=""
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "100%",
                          }}
                        />
                      )}
                      <span style={{ display: "grid" }} id="user-row">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <p
                            style={{
                              color: "white",
                              fontSize: "16px",
                              fontWeight: "500",
                              lineHeight: "20px",
                            }}
                          >
                            {user.firstname} {user.lastname}
                          </p>

                          {user.admin && (
                            <div
                              style={{
                                padding: "4px",
                                border: "1px solid  #C6F6D8",
                                backgroundColor: "#F0FDF4",
                                borderRadius: "6px",
                                maxWidth: "max-content",
                                display: "flex",
                                gap: "4px",
                                alignItems: "center",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  color: "#15803D",
                                  fontWeight: "500",
                                }}
                              >
                                Admin
                              </p>
                            </div>
                          )}
                        </div>

                        <p
                          style={{
                            color: "#BAC2DE",
                            fontSize: "14px",
                            maxWidth: "100%",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            fontWeight: "400",
                            marginTop: "4px",
                            lineHeight: "20px",
                          }}
                        >
                          {user.email}
                        </p>
                      </span>
                    </span>
                  </div>
                </td>
                <td className="row-cell id" id="user-row">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "16px",
                        maxWidth: "100px",
                        textOverflow: "hidden",
                        overflow: "hidden",
                        fontWeight: "400",
                      }}
                    >
                      {user.id}
                    </p>

                    <button
                      style={{
                        padding: "4px 8px",
                        border: "1px solid  #212945",
                        backgroundColor: "#1B1F2D",
                        borderRadius: "6px",
                        maxWidth: "max-content",
                        display: "flex",
                        gap: "4px",
                        alignItems: "center",
                        color: "#c6f6d82b",
                        cursor: "pointer",
                      }}
                      onClick={() => copyValue(user.id, " ID")}
                    >
                      <p
                        style={{
                          userSelect: "none",
                          pointerEvents: "none",
                          fontSize: "14px",
                          fontWeight: "500",
                          fontWeight: "500",
                          lineHeight: "20px",
                        }}
                      >
                        Copy
                      </p>
                    </button>
                  </div>
                </td>
                <td className="row-cell currency" id="user-row">
                  <p>USD</p>
                </td>
                <td className="row-cell login" id="user-row">
                  <p>{getTime(new Date() - user.lastLogin.toDate())}</p>
                </td>
                <td className="row-cell  registered" id="user-row">
                  <p>{getTime(new Date() - user.registerDate.toDate())}</p>
                </td>
                <td className="row-cell verification" id="user-row">
                  <div
                    className={
                      user.verified
                        ? "status_box active"
                        : "status_box inactive"
                    }
                  >
                    <p>{user.verified ? "Verified" : "Unverified"}</p>
                  </div>
                </td>
                <td className="row-cell status" id="user-row">
                  <div
                    className={
                      user.blocked ? "status_box inactive" : "status_box active"
                    }
                  >
                    <p>{user.blocked ? "Blocked" : "Active"}</p>
                  </div>
                </td>
              </tr>
            ))}
          </table>
        )}
      </UsersTableStandard>
    </>
  );
};

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

const UsersTableStandard = styled.div`
  padding-bottom: 24px;
  position: relative;
  max-width: 100%;
  overflow-y: auto;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-top: 24px;

  .top {
    color: #ffffff;
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
    z-index: 999;
    left: 0;
    white-space: nowrap;
    overflow-x: scroll;
  }

  .disabled_select {
    /* opacity: 0.8; */
    /* animation: blinker 2s linear infinite; */
    cursor: not-allowed;
    user-select: none;
    pointer-events: none;
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
    grid-template-columns: 400px 200px 120px 120px 120px 120px 120px;
    justify-content: space-between;
    text-align: left;
    width: 100%;
    /* border-bottom: 1px solid #212945; */
    padding: 4px 0px;
  }

  th p {
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
  }

  tr p {
    color: #bac2de;
    font-size: 16px;
  }

  tr {
    display: grid;
    grid-template-columns: 400px 200px 120px 120px 120px 120px 120px;
    justify-content: space-between;
    text-align: left;
    width: 100%;
    transition: all 0.1s ease-in-out;
    cursor: pointer;
    padding: 12px 0px;
    border-bottom: 1px solid #2129456f;
  }

  tr:last-child {
    border-bottom: none;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  tr.selected {
    background-color: rgba(27, 31, 45, 0.5);
  }

  tr:hover {
    background-color: rgba(27, 31, 45, 0.8);
  }

  @media screen and (max-width: 1300px) {
    th {
      display: grid;
      grid-template-columns: 330px 270px 120px 120px 120px 120px 120px;
    }

    tr {
      display: grid;
      grid-template-columns: 330px 270px 120px 120px 120px 120px 120px;
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

  .id {
    width: 100%;
  }

  .currency {
    width: 100%;
  }

  .login {
    width: 100%;
    text-align: right;
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

  .user div {
    display: grid;
    grid-template-columns: 20px auto;
    gap: 12px;
    align-items: center;
    white-space: nowrap;
  }

  .user div .checkbox {
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
    border-radius: 6px;
    max-width: max-content;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .status_box p {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
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
`;

{
  /* <div
style={{
  backgroundColor: "#151823",
  borderBottomLeftRadius: "12px",
  borderBottomRightRadius: "12px",
  padding: "60px",
}}
>
<CircularLoader
  bg="rgba(12, 108, 243, 0.2)"
  size="28"
  color="#0C6CF2"
/>
</div> */
}

export default UsersTable;
