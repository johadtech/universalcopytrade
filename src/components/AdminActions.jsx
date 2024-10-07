import { styled } from "styled-components";
import CircularLoader from "../styled/loaders/CircularLoader";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DepositModal from "../modals/DepositModal";
import BillingModal from "../modals/BillingModal";
import AddSignalBalanceModal from "../modals/AddSignalBalanceModal";
import EditTradingProgressModal from "../modals/EditTradingProgressModal";
import EditSignalStrengthModal from "../modals/EditSignalStrengthModal";
import SendUserPopupModal from "../modals/SendUserPopUpModal";
import AddUserProfitsModal from "../modals/AddProfitsModal";
import SendUserNotificationModal from "../modals/SendUserNotificationModal";
import UpgradeAccountModal from "../modals/UpgradeAccountModal";
import FixUserTradeModal from "../modals/FixUserTradeModal";
import Toast from "../hooks/Toast";
import AddDepositModal from "../modals/AddDepositModal";

const AdminActions = ({ user }) => {
  const { userDetails, setUserDetails } = user;

  const { id } = userDetails;

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // image change [action]
  const imageRef = useRef();
  const [picture, setPicture] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // function handleAction(action) {
  //   console.log(action);
  // }

  function handleImageChange() {
    imageRef.current?.click();

    // setTimeout(() => {

    // }, 3000);
  }

  function handleImageURL(e) {
    const imageLink = e.target.files[0];

    if (imageLink) {
      setIsUploadingImage(true);
      const url = URL.createObjectURL(imageLink);
      setPicture(url);
      // console.log(imageLink);
      const storageRef = ref(storage, imageLink.name + new Date());
      const uploadTask = uploadBytesResumable(storageRef, imageLink);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          // console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log("File available at", downloadURL);
            uploadPicture(downloadURL);
          });
        }
      );
    } else {
      setIsUploadingImage(false);
    }
  }
  // userData.id

  async function uploadPicture(newURL) {
    const q = doc(db, "users", userDetails.id);
    try {
      await updateDoc(q, {
        photoURL: newURL,
      });
      setIsUploadingImage(false);
      setToastType("success");
      setToastMessage("Photo successfully changed");
      setOpenToast(true);
      // console.log("successful");
      //   toast.success("Updated successfully");
    } catch (error) {
      setIsUploadingImage(false);
      setToastType("error");
      setToastMessage("Failed to change photo. Please try again later");
      setOpenToast(true);
      // console.log(error);
    }
  }

  //   billing
  const [isBilling, setIsBilling] = useState(false);
  const [billing, setBilling] = useState(false);

  function handleBilling() {
    setIsBilling(true);

    setTimeout(() => {
      setBilling(true);
      setIsBilling(false);
    }, 500);
  }

  // add signal balance
  const [addSignalBalance, setAddSignalBalance] = useState(false);
  const [isAddingSignalBalance, setIsAddingSignalBalance] = useState(false);
  const [bal, setBal] = useState(undefined);

  function handleAddSignalBalance() {
    setIsAddingSignalBalance(true);
    getBalance();

    // setTimeout(() => {
    //   setAddSignalBalance(true);
    //   setIsAddingSignalBalance(false);
    // }, 500);
    async function getBalance() {
      const docRef = doc(db, "balances", userDetails.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const { signalBalance } = data;

        setBal(signalBalance);
        setIsAddingSignalBalance(false);
        setAddSignalBalance(true);
      } else {
        console.log("No such document!");
      }
    }
  }

  //   set trading progress
  const [isTradingProgress, setIsTradingProgress] = useState(false);
  const [tradingProgress, setTradingProgress] = useState(false);
  const [prog, setProg] = useState(undefined);

  function handleTradingProgress() {
    setIsTradingProgress(true);
    getProgress();

    // setTimeout(() => {
    //   setTradingProgress(true);
    //   setIsTradingProgress(false);
    // }, 500);
    async function getProgress() {
      const docRef = doc(db, "users", userDetails.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const { tradingProgress } = data;
        setProg(tradingProgress);
        setIsTradingProgress(false);
        setTradingProgress(true);
      } else {
        console.log("No such document!");
      }
    }
  }

  //   set signal strength
  const [isSignalStrength, setIsSignalStrength] = useState(false);
  const [signalStrength, setSignalStrength] = useState(false);
  const [str, setStr] = useState(undefined);

  function handleSignalStrength() {
    setIsSignalStrength(true);
    getStrength();

    async function getStrength() {
      const docRef = doc(db, "users", userDetails.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const { signalStrength } = data;
        setStr(signalStrength);
        setIsSignalStrength(false);
        setSignalStrength(true);
      } else {
        console.log("No such document!");
      }
    }

    // setTimeout(() => {
    //   setSignalStrength(true);
    //   setIsSignalStrength(false);
    // }, 500);
  }

  //   send popup
  const [isPopup, setIsPopup] = useState(false);
  const [popup, setPopup] = useState(false);
  const [hasPopup, setHasPopup] = useState(false);

  function handlePopup() {
    setIsPopup(true);
    getPopup();

    async function getPopup() {
      const docRef = doc(db, "users", userDetails.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const { popup } = data;

        setHasPopup(popup);
        setIsPopup(false);
        setPopup(true);
      } else {
        console.log("No such document!");
      }
    }

    // setTimeout(() => {
    //   setPopup(true);
    //   setIsPopup(false);
    // }, 500);
  }

  //   add profits
  const [isAddingProfits, setIsAddingProfits] = useState(false);
  const [addProfits, setAddProfits] = useState(false);
  const [profits, setProfits] = useState(undefined);

  function handleAddProfits() {
    setIsAddingProfits(true);
    getProfits();

    async function getProfits() {
      const docRef = doc(db, "profits", userDetails.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const { profits } = data;
        setProfits(profits);
        setIsAddingProfits(false);
        setAddProfits(true);
      } else {
        console.log("No such document!");
      }
    }

    // setTimeout(() => {
    //   setAddProfits(true);
    //   setIsAddingProfits(false);
    // }, 500);
  }

  //   add profits
  const [isAddingDeposit, setIsAddingDeposit] = useState(false);
  const [addDeposit, setAddDeposit] = useState(false);
  const [accounts, setAccounts] = useState(undefined);

  function handleAddDeposit() {
    setIsAddingDeposit(true);
    getAccounts();

    async function getAccounts() {
      const docRef = doc(db, "accounts", userDetails.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setAccounts(data);
        setIsAddingDeposit(false);
        setAddDeposit(true);
      } else {
        console.log("No such document!");
      }
    }

    // setTimeout(() => {
    //   setAddDeposit(true);
    //   setIsAddingDeposit(false);
    // }, 500);
  }

  //   send notification
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [sendNotification, setSendNotification] = useState(false);

  function handleSendNotification() {
    setIsSendingNotification(true);

    setSendNotification(true);

    setTimeout(() => {
      setIsSendingNotification(false);
    }, 2500);
  }

  //   upgrade account
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeAccount, setUpgradeAccount] = useState(false);
  const [currentAccountType, setCurrentAccountType] = useState(undefined);
  function handleUpgrade() {
    setIsUpgrading(true);
    fetchAccountType();

    async function fetchAccountType() {
      const docRef = doc(db, "users", userDetails.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const { accountType } = data;
        setCurrentAccountType(accountType);
        setIsUpgrading(true);
        setUpgradeAccount(true);
        setIsUpgrading(false);
      } else {
        console.log("No such document!");
      }
    }

    // setTimeout(() => {
    //   setUpgradeAccount(true);
    //   setIsUpgrading(false);
    // }, 500);
  }

  //   block account
  const [isBlocking, setIsBlocking] = useState(false);
  function handleBlock() {
    setIsBlocking(true);

    if (userDetails.blocked) {
      unblockUser();
    } else {
      blockUser();
    }
    // setTimeout(() => {
    //   setIsBlocking(false);
    // }, 500);
  }

  // block user
  async function blockUser() {
    await updateDoc(doc(db, "users", id), {
      blocked: true,
    })
      .then(() => {
        setIsBlocking(false);
        setToastType("success");
        setToastMessage("User blocked successfully");
        setOpenToast(true);
      })
      .catch((error) => {
        setIsBlocking(false);
        setToastType("error");
        setToastMessage("Failed to block. Please try again later");
        setOpenToast(true);
      });
  }

  async function unblockUser() {
    await updateDoc(doc(db, "users", id), {
      blocked: false,
    })
      .then(() => {
        setIsBlocking(false);
        setToastType("success");
        setToastMessage("User unblocked successfully");
        setOpenToast(true);
      })
      .catch((error) => {
        setIsBlocking(false);
        setToastType("error");
        setToastMessage("Failed to unblock. Please try again later");
        setOpenToast(true);
      });
  }

  //   lock trade
  const [isLockingTrade, setIsLockingTrade] = useState(false);
  function handleLockTrade() {
    setIsLockingTrade(true);

    if (userDetails.tradeEnabled) {
      lockTrade();
    } else {
      unlockTrade();
    }
    // setTimeout(() => {
    //   setIsBlocking(false);
    // }, 500);
  }

  // lock trade
  async function lockTrade() {
    await updateDoc(doc(db, "users", id), {
      tradeEnabled: false,
    })
      .then(() => {
        setIsLockingTrade(false);
        setToastType("success");
        setToastMessage("User trade locked successfully");
        setOpenToast(true);
      })
      .catch((error) => {
        setIsLockingTrade(false);
        setToastType("error");
        setToastMessage("Failed to lock trade. Please try again later");
        setOpenToast(true);
      });
  }

  async function unlockTrade() {
    await updateDoc(doc(db, "users", id), {
      tradeEnabled: true,
    })
      .then(() => {
        setIsLockingTrade(false);
        setToastType("success");
        setToastMessage("Trade unlocked successfully");
        setOpenToast(true);
      })
      .catch((error) => {
        setIsLockingTrade(false);
        setToastType("error");
        setToastMessage("Failed to unlock trade. Please try again later");
        setOpenToast(true);
      });
  }

  const [fixTrade, setFixTrade] = useState(false);
  const [isFixingTrade, setIsFixingTrade] = useState(false);
  const [selectedFixAccount, setSelectedFixAccount] = useState(undefined);
  async function handleFixTrade() {
    setIsFixingTrade(true);

    const docRef = doc(db, "accounts", userDetails.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setIsFixingTrade(false);
      setSelectedFixAccount(data);
      setFixTrade(true);
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

      {/* // className="disabled_select" */}
      <ActionsStandard
        className={
          (isUploadingImage ||
            isBilling ||
            isAddingSignalBalance ||
            isTradingProgress ||
            isSignalStrength ||
            isPopup ||
            isAddingProfits ||
            isAddingDeposit ||
            isSendingNotification ||
            isUpgrading ||
            isFixingTrade ||
            isBlocking) &&
          "disabled_select"
        }
      >
        {billing && (
          <BillingModal
            open={{ billing, setBilling }}
            user={{ userDetails, setUserDetails }}
          />
        )}

        {fixTrade && (
          <FixUserTradeModal
            open={{ fixTrade, setFixTrade }}
            userData={userDetails}
            accounts={selectedFixAccount}
          />
        )}

        {addSignalBalance && (
          <AddSignalBalanceModal
            open={{ addSignalBalance, setAddSignalBalance }}
            ogBalance={{ bal, setBal }}
            user={{ userDetails, setUserDetails }}
          />
        )}

        {tradingProgress && (
          <EditTradingProgressModal
            open={{ tradingProgress, setTradingProgress }}
            ogProgress={{ prog, setProg }}
            user={{ userDetails, setUserDetails }}
          />
        )}

        {signalStrength && (
          <EditSignalStrengthModal
            open={{ signalStrength, setSignalStrength }}
            ogStrength={{ str, setStr }}
            user={{ userDetails, setUserDetails }}
          />
        )}

        {popup && (
          <SendUserPopupModal
            open={{ popup, setPopup }}
            ogPopup={{ hasPopup, setHasPopup }}
            user={{ userDetails, setUserDetails }}
          />
        )}

        {addProfits && (
          <AddUserProfitsModal
            open={{ addProfits, setAddProfits }}
            ogProfits={{ profits, setProfits }}
            user={{ userDetails, setUserDetails }}
          />
        )}

        {addDeposit && (
          <AddDepositModal
            open={{ addDeposit, setAddDeposit }}
            ogAccounts={{ accounts, setAccounts }}
            user={{ userDetails, setUserDetails }}
          />
        )}

        {sendNotification && (
          <SendUserNotificationModal
            open={{ sendNotification, setSendNotification }}
            user={{ userDetails, setUserDetails }}
          />
        )}

        {upgradeAccount && (
          <UpgradeAccountModal
            open={{ upgradeAccount, setUpgradeAccount }}
            user={{ userDetails, setUserDetails }}
            ogAccountType={{ currentAccountType, setCurrentAccountType }}
          />
        )}

        <div className="wrapper">
          {/* change profile photo */}
          <button
            className={isUploadingImage ? "action disabled" : "action"}
            disabled={isUploadingImage}
            onClick={handleImageChange}
            style={{ position: "relative" }}
          >
            {isUploadingImage ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              <p>Change profile photo</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              onChange={handleImageURL}
              type="file"
              accept="image/png, image/gif, image/jpeg"
              style={{
                opacity: "0",
                // backgroundColor: "red",
                pointerEvents: "none",
                userSelect: "none",
                position: "absolute",
                width: "100%",
                height: "100%",
                left: "0",
              }}
              ref={imageRef}
            />
          </button>

          {/* send billing */}
          <button
            className={isBilling ? "action disabled" : "action"}
            disabled={isBilling}
            onClick={handleBilling}
          >
            {isBilling ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              <p>Send billing</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          {/* add signal balance   */}
          <button
            className={isAddingSignalBalance ? "action disabled" : "action"}
            disabled={isAddingSignalBalance}
            onClick={handleAddSignalBalance}
          >
            {isAddingSignalBalance ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              <p>Add signal balance</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          {/* subscription balance */}

          {/* set trading progress   */}
          <button
            className={isTradingProgress ? "action disabled" : "action"}
            disabled={isTradingProgress}
            onClick={handleTradingProgress}
          >
            {isTradingProgress ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              <p>Set trading progress</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          {/* set signal strength   */}
          <button
            className={isSignalStrength ? "action disabled" : "action"}
            disabled={isSignalStrength}
            onClick={handleSignalStrength}
          >
            {isSignalStrength ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              <p>Set signal strength</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          {/* send pop-up */}
          <button
            className={isPopup ? "action disabled" : "action"}
            disabled={isPopup}
            onClick={handlePopup}
          >
            {isPopup ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              <p>Send pop-up</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          {/* fix trade */}
          <button
            className={isFixingTrade ? "action disabled" : "action"}
            disabled={isFixingTrade}
            onClick={handleFixTrade}
          >
            {isFixingTrade ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              <p>Fix trade</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          {/* handleSendNotification */}

          {/* add profits */}
          <button
            className={isAddingProfits ? "action disabled" : "action"}
            disabled={isAddingProfits}
            onClick={handleAddProfits}
          >
            {isAddingProfits ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              <p>Add profits</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          {/* add deposit */}
          <button
            className={isAddingDeposit ? "action disabled" : "action"}
            disabled={isAddingDeposit}
            onClick={handleAddDeposit}
          >
            {isAddingDeposit ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              <p>Add deposit</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          {/* send notification */}
          <button
            className={isSendingNotification ? "action disabled" : "action"}
            disabled={isSendingNotification}
            onClick={handleSendNotification}
          >
            {isSendingNotification ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              <p>Send notification</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          {/* upgrade account */}
          <button
            className={isUpgrading ? "action disabled" : "action"}
            disabled={isUpgrading}
            onClick={handleUpgrade}
          >
            {isUpgrading ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              <p>Upgrade account</p>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          {/* delete account */}
          {/* <button
          className={isDeleting ? "action disabled" : "action"}
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? (
            <p>
              <CircularLoader
                bg="rgba(12, 108, 243, 0.2)"
                size="28"
                color="#0C6CF2"
              />
            </p>
          ) : (
            <p>Delete account</p>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#BAC2DE"
            class="w-6 h-6"
            style={{ width: "22px" }}
          >
            <path
              fill-rule="evenodd"
              d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
              clip-rule="evenodd"
            />
          </svg>
        </button> */}

          {/* block account */}
          <button
            className={isBlocking ? "action disabled" : "action"}
            disabled={isBlocking}
            onClick={handleBlock}
          >
            {isBlocking ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              // <p>Block account</p>
              <>
                {userDetails.blocked ? (
                  <p>Unblock account</p>
                ) : (
                  <p>Block account</p>
                )}
              </>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          {/* lock trade */}
          <button
            className={isLockingTrade ? "action disabled" : "action"}
            disabled={isLockingTrade}
            onClick={handleLockTrade}
          >
            {isLockingTrade ? (
              <p>
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </p>
            ) : (
              // <p>Block account</p>
              <>
                {userDetails.tradeEnabled ? (
                  <p>Lock trade</p>
                ) : (
                  <p>Unlock trade</p>
                )}
              </>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#BAC2DE"
              class="w-6 h-6"
              style={{ width: "22px" }}
            >
              <path
                fill-rule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </ActionsStandard>
    </>
  );
};

const ActionsStandard = styled.div`
  background-color: rgba(27, 31, 45, 0.3);
  border-radius: 12px;
  border: 1px solid #222739;

  &.disabled_select {
    /* opacity: 0.8; */
    /* animation: blinker 2s linear infinite; */
    cursor: not-allowed;
    user-select: none;
    pointer-events: none;
  }

  .action {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
    line-height: 28px;
    color: #bac2de;
    cursor: pointer;
    width: 100%;
    height: 100%;
    padding: 12px 24px;
    background-color: transparent;
    outline: none;
    border: none;
    border-bottom: 1px solid rgba(34, 39, 57, 0.3);
    padding-bottom: 18px;
    transition: all 0.3s ease-in-out;
  }

  .action:last-child {
    border-bottom: none;
  }

  .action:hover {
    color: #8087a0;
  }

  .action svg {
    user-select: none;
    pointer-events: none;
    transition: all 0.3s ease-in-out;
  }

  .action:hover svg {
    stroke: #8087a0;
    transform: translateX(4px);
  }

  .action.disabled {
    opacity: 0.4;
    user-select: none;
    pointer-events: none;
    cursor: not-allowed;
  }
`;

export default AdminActions;
