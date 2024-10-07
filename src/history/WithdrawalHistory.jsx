import { useState, useEffect, useContext } from "react";
import { styled } from "styled-components";
import { Search } from "../styled/input/Input";
import { context } from "../context/context";
import { ClickAwayListener, Grow, Skeleton } from "@mui/material";
import Toast from "../hooks/Toast";
import { formatterZero, getTime } from "../utils/utils";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import CircularLoader from "../styled/loaders/CircularLoader";
import emailjs from "@emailjs/browser";
import { siteSettings } from "../static";

const WithdrawalHistory = ({ user }) => {
  const [contexts, setContexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);

  const { currentPrices } = useContext(context);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // hmm
  const [selectedRef, setSelectedRef] = useState("");

  useEffect(() => {
    const withdrawalList = [];

    async function getWithdrawals() {
      const q = query(collection(db, "withdrawals"), where("user", "==", user));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        withdrawalList.push(doc.data());
      });
      setWithdrawals(withdrawalList);
      setWithdrawalsList(withdrawalList);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }

    getWithdrawals();
  }, []);

  const dummyList = [
    {
      id: "2PA6DDXmkgO2dr4rh31wrfrrwfgSukHFG3",
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
      id: "GKOqJzyMllht7LIcWcwrrwcB2rcCFpFGD3",
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
      id: "g9xpimLpX1XGk2KJEy1cwrfd6ggTUft2",
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
      id: "g9xpimwLpX1XGkrwcrw2KJEy1d6ggTUft2",
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
      id: "g9xpimLxe3e33pX1XGk2KJEy1d6ggTUft2",
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

  const contextsAllWithdrawalsTicked = [
    "Approve withdrawals",
    "Decline withdrawals",
    "Delete withdrawals",
  ];

  const contextsSingleWithdrawal = ["Approve", "Decline", "Delete"];

  const [singleContext, setSingleContext] = useState(false);
  const [multiContext, setMultiContext] = useState(false);

  const [selectedWithdrawals, setSelectedWithdrawals] = useState([]);

  const [allWithdrawalsSelected, setAllWithdrawalsSelected] = useState(false);

  const [singleSelectedWithdrawal, setSingleSelectedWithdrawal] = useState([]);
  const [currentAction, setCurrentAction] = useState(undefined);

  useEffect(() => {
    if (selectedWithdrawals) {
      if (selectedWithdrawals.length > 1) {
        setContexts(contextsAllWithdrawalsTicked);
        setMultiContext(true);
        setSingleContext(false);
      }
      if (selectedWithdrawals.length === 1) {
        setContexts(contextsSingleWithdrawal);
        setSingleContext(true);
        setMultiContext(false);
      }
      if (selectedWithdrawals.length < 1) {
        setContexts([]);
        setSingleContext(false);
        setMultiContext(false);
      }
      if (
        !isLoading &&
        withdrawals.length !== 1 &&
        selectedWithdrawals.length === withdrawals.length
      ) {
        setAllWithdrawalsSelected(true);
        setMultiContext(true);
        setSingleContext(false);
      } else {
        setAllWithdrawalsSelected(false);
      }
    } else {
      setContexts([]);
      setSingleContext(false);
      setMultiContext(false);
    }
  }, [selectedWithdrawals]);

  function handleContext(value) {
    // console.log(value);

    if (singleContext) {
      // console.log("single");
      // console.log("single user");
      // console.log(singleSelectedUser);
      if (value === "Approve") {
        // console.log(singleSelectedWithdrawal);
        if (singleSelectedWithdrawal.status === "approved") {
          setCurrentAction(undefined);
          setToastType("error");
          setToastMessage("Deposit already approved");
          setOpenToast(true);
        } else {
          approveWithdrawal(
            singleSelectedWithdrawal.ref,
            singleSelectedWithdrawal.user,
            singleSelectedWithdrawal.amount,
            singleSelectedWithdrawal.asset,
            singleSelectedWithdrawal.type
          );
        }
      }

      if (value === "Decline") {
        if (singleSelectedWithdrawal.status === "declined") {
          setCurrentAction(undefined);
          setToastType("error");
          setToastMessage("Deposit already declined");
          setOpenToast(true);
        } else {
          declineWithdrawal(
            singleSelectedWithdrawal.ref,
            singleSelectedWithdrawal.user,
            singleSelectedWithdrawal.amount,
            singleSelectedWithdrawal.asset,
            singleSelectedWithdrawal.type
          );
        }
      }

      if (value === "Delete") {
        deleteWithdrawal(singleSelectedWithdrawal.ref);
      }
    }

    if (multiContext) {
      if (value === "Delete withdrawals") {
        setCurrentAction("Delete withdrawals");
        selectedWithdrawals.forEach((selectedWithdrawal) => {
          try {
            deleteWithdrawal(selectedWithdrawal);

            if (allWithdrawalsSelected) {
              setAllWithdrawalsSelected(false);
              setWithdrawals([]);
            }
            // console.log("done");
          } catch (error) {
            // console.log("error", error);
          }
        });
      }
    }
  }

  function handleCheckboxClicked(withdrawal, e) {
    const { value } = e.target;

    setSingleSelectedWithdrawal(withdrawal);

    let selectedWithdrawalList = selectedWithdrawals;

    if (selectedWithdrawalList.includes(value)) {
      if (allWithdrawalsSelected) {
        setAllWithdrawalsSelected(false);
      }
      let slicedArr = selectedWithdrawalList.splice(
        selectedWithdrawalList.indexOf(value),
        1
      );

      setSelectedWithdrawals([...selectedWithdrawalList]);
    } else {
      setSelectedWithdrawals([...selectedWithdrawals, value]);
    }
  }

  function selectAllWithdrawals() {
    let selectedWithdrawalList = [];

    if (allWithdrawalsSelected) {
      selectedWithdrawalList = [];
      setAllWithdrawalsSelected(false);
    } else {
      withdrawals.forEach((withdrawal) => {
        selectedWithdrawalList.push(withdrawal.ref);
      });
      setAllWithdrawalsSelected(true);
    }

    // console.log(selectedWithdrawalList);
    setSelectedWithdrawals(selectedWithdrawalList);
  }

  // search
  function handleWithdrawalsSearch(e) {
    const { value } = e.target;
    // let accountsList = allAccounts;

    let filteredWithdrawals;

    if (value) {
      filteredWithdrawals = withdrawalsList.filter(
        (withdrawals) =>
          withdrawals.userRef?.name
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          withdrawals.ref.toLowerCase().includes(value.toLowerCase())
      );
      setWithdrawals(filteredWithdrawals);
    } else {
      setWithdrawals(withdrawalsList);
    }
  }

  // const checkBoxRef = useRef();

  function handleSelectedRef(withdrawal) {
    const { ref } = withdrawal;
    // const { firstname } = user;
    // console.log(firstname);
    setSelectedRef(selectedRef === ref ? " " : ref);
  }

  function handleAction(action, withdrawal) {
    const { ref, user, amount, asset, type, userRef } = withdrawal;
    setSelectedRef(undefined);

    const name = userRef.name?.slice(0, userRef.name?.indexOf(" "));
    const email = userRef.email;

    if (action === "delete") {
      deleteWithdrawal(ref);
    }

    if (action === "approve") {
      approveWithdrawal(ref, user, amount, asset, type, name, email);
    }

    if (action === "decline") {
      declineWithdrawal(ref, user, amount, asset, type, name, email);
    }
  }

  // delete
  async function deleteWithdrawal(ref) {
    setCurrentAction(ref);
    const document = doc(db, "withdrawals", ref);
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
  async function approveWithdrawal(
    ref,
    user,
    amount,
    asset,
    type,
    name,
    email
  ) {
    setCurrentAction(ref);
    const document = doc(db, "withdrawals", ref);
    await updateDoc(document, {
      status: "approved",
    })
      .then(() => {
        sendUserApproveNotification(user, amount, asset, type);
        // incrementCrypto(user, amount, asset);
        sendApproveEmail(amount, asset, type, name, email);
      })
      .catch((error) => {
        // console.log(error)
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to approve. Please try again later");
        setOpenToast(true);
      });
  }

  // user approve notification
  async function sendUserApproveNotification(user, amount, asset, type) {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      user.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "notifications", str), {
      ref: str,
      type: "Withdrawal request",
      message:
        type === "Crypto"
          ? "Your withdrawal of " + amount + " " + asset + " was approved"
          : "Your withdrawal of " +
            formatterZero.format(amount) +
            " was approved",
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

  // decline
  async function declineWithdrawal(
    ref,
    user,
    amount,
    asset,
    type,
    name,
    email
  ) {
    setCurrentAction(ref);
    const document = doc(db, "withdrawals", ref);
    await updateDoc(document, {
      status: "declined",
    })
      .then(() => {
        if (type === "Crypto") {
          incrementCrypto(user, amount, asset, type);
        } else {
          incrementFiat(user, amount, asset, type);
        }
        sendDeclineEmail(amount, asset, type, name, email);
        // sendUserDeclineNotification(user, amount, asset);
      })
      .catch((error) => {
        setCurrentAction(undefined);
        setToastType("error");
        setToastMessage("Failed to decline. Please try again later");
        setOpenToast(true);
      });
  }

  // increment crypto
  async function incrementCrypto(user, amount, asset, type) {
    const q = doc(db, "accounts", user);
    const key = `live.Crypto.${asset}.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(amount)),
      }).then(() => {
        sendUserDeclineNotification(user, amount, asset, type);
      });
    } catch (error) {
      setCurrentAction(undefined);
      setToastType("error");
      setToastMessage("Failed to approve. Please try again later");
      setOpenToast(true);
    }
  }

  // increment fiat
  async function incrementFiat(user, amount, asset, type) {
    const q = doc(db, "accounts", user);
    const key = `live.Fiat.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(amount)),
      }).then(() => {
        sendUserDeclineNotification(user, amount, asset, type);
      });
    } catch (error) {
      setCurrentAction(undefined);
      setToastType("error");
      setToastMessage("Failed to decline. Please try again later");
      setOpenToast(true);
    }
  }

  // user decline notification
  async function sendUserDeclineNotification(user, amount, asset, type) {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      user.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "notifications", str), {
      ref: str,
      type: "Withdrawal request",
      message:
        type === "Crypto"
          ? "Your withdrawal of " + amount + " " + asset + " was declined"
          : "Your withdrawal of " +
            formatterZero.format(amount) +
            " was declined",
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

  async function sendApproveEmail(amount, asset, type, name, email) {
    const params = {
      action_name: "Withdrawal approved",
      to_name: name,
      details:
        type === "Crypto"
          ? "Your request to withdraw " +
            amount +
            " " +
            asset +
            " has been approved."
          : "Your request to withdraw " +
            formatterZero.format(amount) +
            " has been approved.",
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

  async function sendDeclineEmail(amount, asset, type, name, email) {
    const params = {
      action_name: "Withdrawal declined",
      to_name: name,
      details:
        type === "Crypto"
          ? "Unfortunately, your request to withdraw " +
            amount +
            " " +
            asset +
            " has been declined."
          : "Unfortunately, your request to withdraw " +
            formatterZero.format(amount) +
            " has been declined.",
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

      <WithdrawalHistoryStandard className="scrollbar-hide">
        <div className="top scrollbar-hide">
          <p className="active">Withdrawals</p>
          {/* <p>Signal Deposits</p>
          <p>Subscription Deposits</p> */}
        </div>

        {isLoading && (
          <table>
            <th>
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
              <td className="head-cell registered">
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
            </th>

            {dummyList.map((user) => (
              <tr id="user-row">
                <td className="row-cell currency" id="user-row">
                  <p className="name">
                    <Skeleton
                      variant="rounded"
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />
                  </p>
                </td>

                <td className="row-cell currency" id="user-row">
                  <p className="name">
                    <Skeleton
                      variant="rounded"
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                    />
                  </p>
                </td>

                <td className="row-cell currency" id="user-row">
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
                      sx={{ backgroundColor: "rgba(27, 31, 45)" }}
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
                borderBottom: withdrawals?.length > 0 && "1px solid #212945",
              }}
            >
              <td className="head-cell user">
                <div>
                  <p>Ref</p>
                </div>
              </td>

              <td className="head-cell currency">
                <p>Type</p>
              </td>
              <td className="head-cell currency">
                <p>Amount</p>
              </td>
              <td className="head-cell login">
                <p>Date</p>
              </td>
              <td className="head-cell login">
                <p>Total (USD)</p>
              </td>
              <td className="head-cell registered">
                <p>Status</p>
              </td>
            </th>

            {/* pending */}
            {withdrawals.map(
              (withdrawal) =>
                withdrawal.status === "pending" && (
                  <tr
                    id="user-row"
                    className={
                      selectedWithdrawals.includes(withdrawal.ref) && "selected"
                    }
                  >
                    <td className="row-cell user" id="user-row">
                      <div>
                        <p style={{ color: "white", fontWeight: "600" }}>
                          {withdrawal.ref}
                        </p>
                      </div>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      <p>{withdrawal.type}</p>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      <p>
                        {withdrawal.amount} {withdrawal.asset}
                      </p>
                    </td>

                    <td className="row-cell login" id="user-row">
                      <p>{getTime(new Date() - withdrawal.date.toDate())} </p>
                    </td>

                    <td className="row-cell login" id="user-row">
                      <p>{formatterZero.format(withdrawal.totalInUSD)}</p>
                    </td>

                    <td className="row-cell  registered" id="user-row">
                      <div className="status_box pending">
                        <p>Pending</p>
                      </div>
                    </td>
                  </tr>
                )
            )}

            {/* approved */}
            {withdrawals.map(
              (withdrawal) =>
                withdrawal.status === "approved" && (
                  <tr
                    id="user-row"
                    className={
                      selectedWithdrawals.includes(withdrawal.ref) && "selected"
                    }
                  >
                    <td className="row-cell user" id="user-row">
                      <div>
                        <p style={{ color: "white", fontWeight: "600" }}>
                          {withdrawal.ref}
                        </p>
                      </div>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      <p>{withdrawal.type}</p>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      <p>
                        {withdrawal.amount} {withdrawal.asset}
                      </p>
                    </td>

                    <td className="row-cell login" id="user-row">
                      <p>{getTime(new Date() - withdrawal.date.toDate())} </p>
                    </td>

                    <td className="row-cell login" id="user-row">
                      <p>{formatterZero.format(withdrawal.totalInUSD)}</p>
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
            {withdrawals.map(
              (withdrawal) =>
                withdrawal.status === "declined" && (
                  <tr
                    id="user-row"
                    className={
                      selectedWithdrawals.includes(withdrawal.ref) && "selected"
                    }
                  >
                    <td className="row-cell user" id="user-row">
                      <div>
                        <p style={{ color: "white", fontWeight: "600" }}>
                          {withdrawal.ref}
                        </p>
                      </div>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      <p>{withdrawal.type}</p>
                    </td>

                    <td className="row-cell currency" id="user-row">
                      <p>
                        {withdrawal.amount} {withdrawal.asset}
                      </p>
                    </td>

                    <td className="row-cell login" id="user-row">
                      <p>{getTime(new Date() - withdrawal.date.toDate())} </p>
                    </td>

                    <td className="row-cell login" id="user-row">
                      <p>{formatterZero.format(withdrawal.totalInUSD)}</p>
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
        )}
      </WithdrawalHistoryStandard>
    </>
  );
};

const WithdrawalHistoryStandard = styled.div`
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
    grid-template-columns: 200px 133px 133px 133px 133px 133px;
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
    grid-template-columns: 200px 133px 133px 133px 133px 133px;
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
      grid-template-columns: 180px 180px 133px 133px 133px 133px;
    }

    tr {
      display: grid;
      grid-template-columns: 180px 180px 133px 133px 133px 133px;
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

export default WithdrawalHistory;
