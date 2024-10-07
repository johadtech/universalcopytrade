import { useState, useEffect } from "react";
import { styled } from "styled-components";
import { Search } from "../styled/input/Input";
import { ClickAwayListener, Grow, Skeleton } from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getTime } from "../utils/utils";
import Toast from "../hooks/Toast";
import { Lightbox } from "react-modal-image";
import CircularLoader from "../styled/loaders/CircularLoader";
import emailjs from "@emailjs/browser";
import { siteSettings } from "../static";

const VerificationsTable = () => {
  const [contexts, setContexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verifications, setVerifications] = useState([]);
  const [verificationsList, setVerificationsList] = useState([]);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // hmm
  const [selectedRef, setSelectedRef] = useState("");

  useEffect(() => {
    const verificationList = [];

    async function getVerifications() {
      const q = query(collection(db, "verifications"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        verificationList.push(doc.data());
      });
      setVerifications(verificationList);
      setVerificationsList(verificationList);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }

    getVerifications();
  }, []);

  const dummyList = [
    {
      id: "2PA6DDXmkgO2dr4rh31fgSkgfgukHFG3",
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
    },
    {
      id: "GKOqJzyMllhtufgjf7LIcWB2rcCFpFGD3",
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
    },
    {
      id: "g9xpimLpX1XGk2KJEtujryy1d6ggTUft2",
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
    },
    {
      id: "g9xpimLpX1XGk2KJEyjyrfjuf1d6ggTUft2",
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
    },
    {
      id: "g9xpimLpX1XGk2KJEy1mumud6ggTUft2",
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
    },
  ];

  const contextsAllVerificationsTicked = [
    // "Approve verifications",
    // "Decline verifications",
    "Delete verifications",
  ];

  const contextsSingleVerification = ["Approve", "Decline", "Delete"];

  const [singleContext, setSingleContext] = useState(false);
  const [multiContext, setMultiContext] = useState(false);

  const [selectedVerifications, setSelectedVerifications] = useState([]);

  const [allVerificationsSelected, setAllVerificationsSelected] =
    useState(false);

  const [singleSelectedVerification, setSingleSelectedVerification] = useState(
    []
  );
  const [currentAction, setCurrentAction] = useState(undefined);

  useEffect(() => {
    if (selectedVerifications) {
      if (selectedVerifications.length > 1) {
        setContexts(contextsAllVerificationsTicked);
        setMultiContext(true);
        setSingleContext(false);
      }
      if (selectedVerifications.length === 1) {
        setContexts(contextsSingleVerification);
        setSingleContext(true);
        setMultiContext(false);
      }
      if (selectedVerifications.length < 1) {
        setContexts([]);
        setSingleContext(false);
        setMultiContext(false);
      }
      if (
        !isLoading &&
        verifications.length !== 1 &&
        selectedVerifications.length === verifications.length
      ) {
        setAllVerificationsSelected(true);
        setMultiContext(true);
        setSingleContext(false);
      } else {
        setAllVerificationsSelected(false);
      }
    } else {
      setContexts([]);
      setSingleContext(false);
      setMultiContext(false);
    }
  }, [selectedVerifications]);

  function handleContext(value) {
    // console.log(value);

    if (singleContext) {
      // console.log("single user");
      // console.log(singleSelectedUser);
      if (value === "Approve") {
        if (singleSelectedVerification.status === "approved") {
          setCurrentAction(undefined);
          setToastType("error");
          setToastMessage("Verification already approved");
          setOpenToast(true);
        } else {
          approveVerification(
            singleSelectedVerification.ref,
            singleSelectedVerification.user
          );
        }
      }

      if (value === "Decline") {
        if (singleSelectedVerification.status === "declined") {
          setCurrentAction(undefined);
          setToastType("error");
          setToastMessage("Verification already declined");
          setOpenToast(true);
        } else {
          declineVerification(
            singleSelectedVerification.ref,
            singleSelectedVerification.user
          );
        }
      }

      if (value === "Delete") {
        deleteVerification(singleSelectedVerification.ref);
      }
    }

    if (multiContext) {
      if (value === "Delete verifications") {
        setCurrentAction("Delete verifications");
        selectedVerifications.forEach((selectedVerification) => {
          try {
            deleteVerification(selectedVerification);

            if (allVerificationsSelected) {
              setAllVerificationsSelected(false);
              setVerifications([]);
            }
            // console.log("done");
          } catch (error) {
            // console.log("error", error);
          }
        });
      }
    }
  }

  function handleCheckboxClicked(verification, e) {
    const { value } = e.target;

    setSingleSelectedVerification(verification);

    let selectedVerificationList = selectedVerifications;

    if (selectedVerificationList.includes(value)) {
      if (allVerificationsSelected) {
        setAllVerificationsSelected(false);
      }
      let slicedArr = selectedVerificationList.splice(
        selectedVerificationList.indexOf(value),
        1
      );

      setSelectedVerifications([...selectedVerificationList]);
    } else {
      setSelectedVerifications([...selectedVerifications, value]);
    }
  }

  function selectAllVerifications() {
    let selectedVerificationList = [];

    if (allVerificationsSelected) {
      selectedVerificationList = [];
      setAllVerificationsSelected(false);
    } else {
      verifications.forEach((verification) => {
        selectedVerificationList.push(verification.ref);
      });
      setAllVerificationsSelected(true);
    }

    // console.log(selectedVerificationList);
    setSelectedVerifications(selectedVerificationList);
  }

  // const checkBoxRef = useRef();

  function handleSelectedRef(verification) {
    const { ref } = verification;
    // const { firstname } = user;
    // console.log(firstname);
    setSelectedRef(selectedRef === ref ? " " : ref);
  }

  function handleVerificationsSearch(e) {
    const { value } = e.target;
    // let accountsList = allAccounts;

    let filteredVerifications;

    if (value) {
      filteredVerifications = verificationsList.filter(
        (verifications) =>
          verifications.userRef?.name
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          verifications.ref.toLowerCase().includes(value.toLowerCase())
      );
      setVerifications(filteredVerifications);
    } else {
      setVerifications(verificationsList);
    }
  }

  const [selectedOpenVerification, setSelectedOpenVerification] =
    useState(undefined);

  function handleAction(action, verification) {
    const { ref, user, userRef } = verification;
    setSelectedRef(undefined);

    const name = userRef.name?.slice(0, userRef.name?.indexOf(" "));
    const email = userRef.email;

    if (action === "delete") {
      deleteVerification(ref);
    }

    if (action === "approve") {
      approveVerification(ref, user, name, email);
    }

    if (action === "decline") {
      declineVerification(ref, user, name, email);
    }
  }

  // delete
  async function deleteVerification(ref) {
    setCurrentAction(ref);
    const document = doc(db, "verifications", ref);
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

  // decline
  async function declineVerification(ref, user, name, email) {
    setCurrentAction(ref);
    const document = doc(db, "verifications", ref);
    await updateDoc(document, {
      status: "declined",
    })
      .then(() => {
        setVerification(user, name, email);
      })
      .catch((error) => {
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to decline. Please try again later");
        setOpenToast(true);
      });
  }

  async function setVerification(user, name, email) {
    const profile = doc(db, "users", user);
    await updateDoc(profile, {
      verificationSubmitted: true,
    })
      .then(() => {
        sendUserDeclineNotification(user, "declined");
        sendDeclineEmail(name, email);
      })
      .catch((error) => {
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to decline. Please try again later");
        setOpenToast(true);
      });
  }

  // user decline notification
  async function sendUserDeclineNotification(user, type) {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      user.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "notifications", str), {
      ref: str,
      type: "Verification request",
      message: "Your verification request was declined",
      user,
      read: false,
      date: serverTimestamp(),
    })
      .then(() => {
        setCurrentAction(undefined);
        setToastType("success");
        setToastMessage("Declined successfully");
        setOpenToast(true);
      })
      .catch((error) => {
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to decline. Please try again later");
        setOpenToast(true);
      });
  }

  // approved
  async function approveVerification(ref, user, name, email) {
    setCurrentAction(ref);
    const document = doc(db, "verifications", ref);
    await updateDoc(document, {
      status: "approved",
    })
      .then(() => {
        verifyUser(user);
        sendApproveEmail(name, email);
      })
      .catch((error) => {
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to approve. Please try again later");
        setOpenToast(true);
      });
  }

  // verify user
  async function verifyUser(user) {
    const profile = doc(db, "users", user);
    await updateDoc(profile, {
      verified: true,
    })
      .then(() => {
        sendUserApproveNotification(user, "approved");
      })
      .catch((error) => {
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to approve. Please try again later");
        setOpenToast(true);
      });
  }

  // user approve notification
  async function sendUserApproveNotification(user, type) {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      user.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "notifications", str), {
      ref: str,
      type: "Verification request",
      message: "Your verification request was approved",
      user,
      read: false,
      date: serverTimestamp(),
    })
      .then(() => {
        setCurrentAction(undefined);
        setToastType("success");
        setToastMessage("Approved successfully");
        setOpenToast(true);
      })
      .catch((error) => {
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to approve. Please try again later");
        setOpenToast(true);
      });
  }

  async function sendApproveEmail(name, email) {
    const params = {
      action_name: "Verification approved",
      to_name: name,
      details: "Your verification request has been approved successfully.",
      broker_support_email: `${siteSettings.supportEmail}`,
      from_name: `${siteSettings.name}`,
      year: `${new Date().getFullYear()}`,
      to_login: `${siteSettings.link}`,
      logo_link: `${siteSettings.ogLink}/logo.png`,
      to_email: email,
      from_email: `${siteSettings.supportEmail}`,
      reply_to: `${siteSettings.supportEmail}`,
    };

    emailjs
      .send("service_veufzcm", "template_75w3svv", params, "9IOr2_lHheTH7RW1k")
      .then(() => {})
      .catch((error) => {});
  }

  async function sendDeclineEmail(name, email) {
    const params = {
      action_name: "Verification declined",
      to_name: name,
      details: "Unfortunately, your verification request has been declined.",
      broker_support_email: `${siteSettings.supportEmail}`,
      from_name: `${siteSettings.name}`,
      year: `${new Date().getFullYear()}`,
      to_login: `${siteSettings.link}`,
      logo_link: `${siteSettings.ogLink}/logo.png`,
      to_email: email,
      from_email: `${siteSettings.supportEmail}`,
      reply_to: `${siteSettings.supportEmail}`,
    };

    emailjs
      .send("service_veufzcm", "template_75w3svv", params, "9IOr2_lHheTH7RW1k")
      .then(() => {})
      .catch((error) => {});
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

      <HeadingStandard>
        <Search style={{ maxHeight: "max-content" }}>
          <img src="./assets/misc/search.svg" alt="" />
          <input
            type="text"
            name=""
            id=""
            placeholder="Search"
            onChange={handleVerificationsSearch}
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

      {isLoading && (
        <VerificationsTableStandard className="scrollbar-hide">
          <div className="top scrollbar-hide">
            <p className="active">Verifications</p>
          </div>
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
                      // height={18}
                      // width={18}
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "60%",
                      }}
                    />
                  </p>
                </div>
              </td>
              <td className="head-cell user">
                <p>
                  <Skeleton
                    variant="rounded"
                    // height={18}
                    // width={20}
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
                    // height={18}
                    // width={20}
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "40%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell login">
                <p>
                  <Skeleton
                    variant="rounded"
                    // height={18}
                    // width={20}
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "40%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell registered">
                <p>
                  <Skeleton
                    variant="rounded"
                    // height={18}
                    // width={20}
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "70%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell verification"></td>
            </th>

            {dummyList.map((user) => (
              <tr id="user-row">
                <td className="row-cell user" id="user-row">
                  <div>
                    <Skeleton
                      variant="rounded"
                      height={18}
                      width={18}
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />
                    <p style={{ color: "white", fontWeight: "600" }}>
                      <Skeleton
                        variant="rounded"
                        // height={18}
                        // width={18}
                        sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                      />
                    </p>
                  </div>
                </td>

                <td className="row-cell user">
                  <VerificationsUserStandard>
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
                  </VerificationsUserStandard>
                </td>

                <td className="row-cell currency" id="user-row">
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
                        maxWidth: "300px",
                        textOverflow: "hidden",
                        overflow: "hidden",
                        fontWeight: "400",
                      }}
                    >
                      <Skeleton
                        width={120}
                        variant="rounded"
                        sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                      />
                    </p>

                    <Skeleton
                      width={60}
                      variant="rounded"
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />
                  </div>
                </td>
                <td className="row-cell login" id="user-row">
                  <p>
                    <Skeleton
                      width={80}
                      variant="rounded"
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />
                  </p>
                </td>

                <td className="row-cell  registered" id="user-row">
                  <Skeleton
                    width={60}
                    variant="rounded"
                    sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                  />
                </td>
                <td className="row-cell verification" id="user-row">
                  <div style={{ position: "relative" }}>
                    <Skeleton
                      width={60}
                      variant="rounded"
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </table>
        </VerificationsTableStandard>
      )}

      {!isLoading && (
        <VerificationsTableStandard className="scrollbar-hide">
          <div className="top scrollbar-hide">
            <p className="active">Verifications</p>
          </div>

          <table className={currentAction ? "disabled_select" : " "}>
            <th
              style={{
                borderBottom: verifications?.length > 0 && "1px solid #212945",
              }}
            >
              <td className="head-cell user">
                <div>
                  <input
                    type="checkbox"
                    name="user"
                    id=""
                    onChange={selectAllVerifications}
                    checked={allVerificationsSelected}
                    className="checkbox"
                  />
                  <p>Ref</p>
                </div>
              </td>
              <td className="head-cell user">
                <p>User</p>
              </td>
              <td className="head-cell currency">
                <p>Type</p>
              </td>
              <td className="head-cell login">
                <p>Date</p>
              </td>
              <td className="head-cell registered">
                <p>Status</p>
              </td>
              <td className="head-cell verification"></td>
            </th>

            {/* pending */}
            {verifications.map(
              (verification) =>
                verification.status === "pending" && (
                  <tr
                    id="user-row"
                    className={
                      selectedVerifications.includes(verification.ref) &&
                      "selected"
                    }
                  >
                    <td className="row-cell user" id="user-row">
                      <div>
                        <input
                          type="checkbox"
                          name="user"
                          id=""
                          onChange={(e) =>
                            handleCheckboxClicked(verification, e)
                          }
                          value={verification.ref}
                          checked={selectedVerifications.includes(
                            verification.ref
                          )}
                          className="checkbox"
                        />
                        <p style={{ color: "white", fontWeight: "600" }}>
                          {verification.ref}
                        </p>
                      </div>
                    </td>

                    <td className="row-cell user">
                      <VerificationsUserStandard>
                        {!verification.userRef?.photo ? (
                          <div className="user_circle">
                            <p>{verification.userRef?.name.slice(0, 1)}</p>
                          </div>
                        ) : (
                          <img
                            src={verification.userRef?.photo}
                            alt=""
                            className="user_avatar"
                          />
                        )}
                        <div className="user_details">
                          <p className="name">{verification.userRef?.name}</p>

                          {verification.userRef?.admin && (
                            <div className="admin_tag">
                              <p>Admin</p>
                            </div>
                          )}
                        </div>
                      </VerificationsUserStandard>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      {/* <p>Driver's License</p> */}

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
                            maxWidth: "300px",
                            textOverflow: "hidden",
                            overflow: "hidden",
                            fontWeight: "400",
                          }}
                        >
                          {verification.type}
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
                          onClick={() =>
                            setSelectedOpenVerification(verification)
                          }
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
                            View
                          </p>
                        </button>

                        {selectedOpenVerification?.link ===
                          verification.link && (
                          <Lightbox
                            className="light"
                            medium={selectedOpenVerification.link}
                            alt={selectedOpenVerification.type}
                            onClose={() =>
                              setSelectedOpenVerification(undefined)
                            }
                          />
                        )}
                      </div>
                    </td>
                    <td className="row-cell login" id="user-row">
                      <p>
                        {" "}
                        {getTime(new Date() - verification.date.toDate())}{" "}
                      </p>
                    </td>

                    <td className="row-cell  registered" id="user-row">
                      <div className="status_box pending">
                        <p>Pending</p>
                      </div>
                    </td>
                    <td className="row-cell verification" id="user-row">
                      <div style={{ position: "relative" }}>
                        <button
                          className="action_button"
                          onClick={() => handleSelectedRef(verification)}
                        >
                          {currentAction === verification.ref ? (
                            <CircularLoader
                              bg="#cccccc"
                              size="24"
                              color="#ffffff"
                            />
                          ) : (
                            <p>Edit</p>
                          )}
                          {/**/}
                        </button>

                        {selectedRef === verification.ref && (
                          <ClickAwayListener
                            onClickAway={() => setSelectedRef("")}
                          >
                            <Grow
                              in={selectedRef === verification.ref}
                              style={{ transformOrigin: "0 0 0 0" }}
                              {...(selectedRef === verification.ref
                                ? { timeout: 300 }
                                : {})}
                            >
                              <BottomSectionStandard className="bottom_section">
                                <p
                                  onClick={() =>
                                    handleAction("approve", verification)
                                  }
                                >
                                  Approve
                                </p>
                                <p
                                  onClick={() =>
                                    handleAction("decline", verification)
                                  }
                                >
                                  Decline
                                </p>
                                <p
                                  onClick={() =>
                                    handleAction("delete", verification)
                                  }
                                >
                                  Delete
                                </p>
                              </BottomSectionStandard>
                            </Grow>
                          </ClickAwayListener>
                        )}
                      </div>
                    </td>
                  </tr>
                )
            )}

            {/* approved */}
            {verifications.map(
              (verification) =>
                verification.status === "approved" && (
                  <tr
                    id="user-row"
                    className={
                      selectedVerifications.includes(verification.ref) &&
                      "selected"
                    }
                  >
                    <td className="row-cell user" id="user-row">
                      <div>
                        <input
                          type="checkbox"
                          name="user"
                          id=""
                          onChange={(e) =>
                            handleCheckboxClicked(verification, e)
                          }
                          value={verification.ref}
                          checked={selectedVerifications.includes(
                            verification.ref
                          )}
                          className="checkbox"
                        />
                        <p style={{ color: "white", fontWeight: "600" }}>
                          {verification.ref}
                        </p>
                      </div>
                    </td>

                    <td className="row-cell user">
                      <VerificationsUserStandard>
                        {!verification.userRef?.photo ? (
                          <div className="user_circle">
                            <p>{verification.userRef?.name.slice(0, 1)}</p>
                          </div>
                        ) : (
                          <img
                            src={verification.userRef?.photo}
                            alt=""
                            className="user_avatar"
                          />
                        )}
                        <div className="user_details">
                          <p className="name">{verification.userRef?.name}</p>

                          {verification.userRef?.admin && (
                            <div className="admin_tag">
                              <p>Admin</p>
                            </div>
                          )}
                        </div>
                      </VerificationsUserStandard>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      {/* <p>Driver's License</p> */}

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
                            maxWidth: "300px",
                            textOverflow: "hidden",
                            overflow: "hidden",
                            fontWeight: "400",
                          }}
                        >
                          {verification.type}
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
                          onClick={() =>
                            setSelectedOpenVerification(verification)
                          }
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
                            View
                          </p>
                        </button>

                        {selectedOpenVerification?.link ===
                          verification.link && (
                          <Lightbox
                            className="light"
                            medium={selectedOpenVerification.link}
                            alt={selectedOpenVerification.type}
                            onClose={() =>
                              setSelectedOpenVerification(undefined)
                            }
                          />
                        )}
                      </div>
                    </td>
                    <td className="row-cell login" id="user-row">
                      <p>
                        {" "}
                        {getTime(new Date() - verification.date.toDate())}{" "}
                      </p>
                    </td>

                    <td className="row-cell  registered" id="user-row">
                      <div className="status_box">
                        <p>Approved</p>
                      </div>
                    </td>
                  </tr>
                )
            )}

            {/* declined */}
            {verifications.map(
              (verification) =>
                verification.status === "declined" && (
                  <tr
                    id="user-row"
                    className={
                      selectedVerifications.includes(verification.ref) &&
                      "selected"
                    }
                  >
                    <td className="row-cell user" id="user-row">
                      <div>
                        <input
                          type="checkbox"
                          name="user"
                          id=""
                          onChange={(e) =>
                            handleCheckboxClicked(verification, e)
                          }
                          value={verification.ref}
                          checked={selectedVerifications.includes(
                            verification.ref
                          )}
                          className="checkbox"
                        />
                        <p style={{ color: "white", fontWeight: "600" }}>
                          {verification.ref}
                        </p>
                      </div>
                    </td>

                    <td className="row-cell user">
                      <VerificationsUserStandard>
                        {!verification.userRef?.photo ? (
                          <div className="user_circle">
                            <p>{verification.userRef?.name.slice(0, 1)}</p>
                          </div>
                        ) : (
                          <img
                            src={verification.userRef?.photo}
                            alt=""
                            className="user_avatar"
                          />
                        )}
                        <div className="user_details">
                          <p className="name">{verification.userRef?.name}</p>

                          {verification.userRef?.admin && (
                            <div className="admin_tag">
                              <p>Admin</p>
                            </div>
                          )}
                        </div>
                      </VerificationsUserStandard>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      {/* <p>Driver's License</p> */}

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
                            maxWidth: "300px",
                            textOverflow: "hidden",
                            overflow: "hidden",
                            fontWeight: "400",
                          }}
                        >
                          {verification.type}
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
                          onClick={() =>
                            setSelectedOpenVerification(verification)
                          }
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
                            View
                          </p>
                        </button>

                        {selectedOpenVerification?.link ===
                          verification.link && (
                          <Lightbox
                            className="light"
                            medium={selectedOpenVerification.link}
                            alt={selectedOpenVerification.type}
                            onClose={() =>
                              setSelectedOpenVerification(undefined)
                            }
                          />
                        )}
                      </div>
                    </td>
                    <td className="row-cell login" id="user-row">
                      <p>
                        {" "}
                        {getTime(new Date() - verification.date.toDate())}{" "}
                      </p>
                    </td>

                    <td className="row-cell  registered" id="user-row">
                      <div className="status_box inactive">
                        <p>Declined</p>
                      </div>
                    </td>
                  </tr>
                )
            )}
          </table>
        </VerificationsTableStandard>
      )}
    </>
  );
};

const VerificationsTableStandard = styled.div`
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

  /* .light {
    z-index: 99999999999;
  } */

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
    grid-template-columns: 176px 300px 280px 150px 130px 150px;
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
    grid-template-columns: 176px 300px 280px 150px 130px 150px;
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
      grid-template-columns: 176px 280px 300px 133px 133px 150px;
    }

    tr {
      display: grid;
      grid-template-columns: 176px 280px 300px 133px 133px 150px;
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

const VerificationsUserStandard = styled.div`
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

export default VerificationsTable;
