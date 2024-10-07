import { createPopper } from "@popperjs/core";
import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import {
  AmountBox,
  FullButton,
  MiniAmountBoxFull,
} from "../styled/input/Input";
import { LargeDivider } from "../styled/forms/dividers";
import { useNavigate } from "react-router-dom";
import { formatterZero } from "../utils/utils";
import { ClickAwayListener, Skeleton } from "@mui/material";
import CircularLoader from "../styled/loaders/CircularLoader";
import {
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import Toast from "../hooks/Toast";
import EditSignalModal from "../modals/EditSignalModal";

const SignalCard = ({ details, loading, accounts, user, admin, balance }) => {
  const { isLoading, setIsLoading } = loading;
  const { userIsAdmin, setUserIsAdmin } = admin;
  const { name, price } = details;
  const { id } = user;

  const navigate = useNavigate();

  const [showSkeleton, setShowSkeleton] = useState(true);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  useEffect(() => {
    if (!isLoading && accounts && details && !isNaN(balance)) {
      setTimeout(() => {
        setShowSkeleton(false);
      }, 600);
    } else {
      showSkeleton(true);
    }
  }, [isLoading, accounts, userIsAdmin]);

  // amount
  const amountRef = useRef();
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false);
  function handleAmount(e) {
    const { value } = e.target;

    if (value) {
      setAmount(Number(value));
      if (Number(value) > balance) {
        // value check
        setToolTipMessage(
          `Your current balance is ${formatterZero.format(
            balance
          )}. Kindly choose a lower amount or deposit into your account.`
        );
        setAmountError(true);
      } else if (Number(value) > price || Number(value) < price) {
        // maximum check
        setAmountError(true);
        setToolTipMessage(
          `The price of this plan is ${formatterZero.format(price)} `
        );
      } else {
        // valid
        setAmount(Number(value));
        setAmountError(false);
      }
    } else {
      setAmount(""); // empty value
    }
  }

  const [tooltipMessage, setToolTipMessage] = useState("");
  const [showToolTip, setShowToolTip] = useState(false);

  function reset() {
    if (amountRef) {
      amountRef.current.value = " ";
    }

    setAmountError(false);
    setAmount(undefined);
    // setSelectedDuration(1);
  }

  // purchase
  const [isPurchasing, setIsPurchasing] = useState(false);
  function handleSubscribe() {
    setIsPurchasing(true);
    decrementFiat();
  }

  // decrement fiat
  async function decrementFiat() {
    // `${currentAccount}.Crypto.${asset}.value`;
    const q = doc(db, "balances", id);
    const key = `signalBalance`;

    try {
      await updateDoc(q, {
        [key]: increment(-Number(amount)),
      }).then(() => {
        purchaseSignal();
      });
    } catch (error) {
      setIsPurchasing(false);
      setToastType("error");
      setToastMessage("Failed to purchase. Please try again later.");
      setOpenToast(true);
    }
  }

  // async function sendAdminNotification() {}
  async function purchaseSignal() {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "signals", str), {
      ref: str,
      user: id,
      signal: name,
      amount,
      date: serverTimestamp(),
      status: "purchased",
      userRef: {
        name: user.firstname + " " + user.lastname,
        photo: user.photoURL ? user.photoURL : null,
        admin: user.admin,
      },
    })
      .then(() => {
        sendUserNotification();
      })
      .catch((error) => {
        setIsPurchasing(false);
        setToastType("error");
        setToastMessage("Failed to subscribe. Please try again later.");
        setOpenToast(true);
      });
  }

  // user notified
  async function sendUserNotification() {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "notifications", str), {
      ref: str,
      type: "Signal",
      message: "You purchased " + name + " signal",
      user: id,
      read: false,
      date: serverTimestamp(),
    })
      .then(() => {
        setIsPurchasing(false);
        setToastType("success");
        setToastMessage("Purchased successfully");
        setOpenToast(true);
        reset();
      })
      .catch((error) => {
        setIsPurchasing(false);
        setToastType("error");
        setToastMessage("Failed to purchased. Please try again later.");
        setOpenToast(true);
      });
  }

  // edit signal
  const [editSignal, setEditSignal] = useState(false);
  const [selectedEditSignal, setSelectedEditSignal] = useState(undefined);

  function handleEditSignal(details) {
    setSelectedEditSignal(details);
    setEditSignal(true);
  }

  return (
    <SignalCardStandard>
      {showSkeleton ? (
        <>
          <div
            style={{
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "#1B1F2D",
              width: "100%",
              padding: "12px 16px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              position: "sticky",
              top: "0",
              zIndex: "999",
              left: "0",
              padding: "16px",
            }}
          ></div>
          <div className="content">
            <span className="price">
              <p className="title">
                <Skeleton
                  variant="rounded"
                  width={80}
                  sx={{ backgroundColor: "#1b1f2d" }}
                />
              </p>
              <p className="value">
                <Skeleton
                  variant="rounded"
                  // width={100}
                  sx={{ backgroundColor: "#1b1f2d", maxWidth: "40%" }}
                />
              </p>
            </span>

            <Skeleton
              variant="rounded"
              height={50}
              sx={{
                backgroundColor: "#1B1F2D",
              }}
            />

            <Skeleton
              variant="rounded"
              height={50}
              sx={{
                backgroundColor: "#1B1F2D",
                marginTop: "32px",
              }}
            />
          </div>
        </>
      ) : (
        <>
          {openToast && (
            <Toast
              open={{ openToast, setOpenToast }}
              message={toastMessage}
              type={toastType}
            />
          )}

          {editSignal && (
            <EditSignalModal
              open={{ editSignal, setEditSignal }}
              details={selectedEditSignal}
            />
          )}

          <div
            style={{
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "#1B1F2D",
              width: "100%",
              padding: "12px 16px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              position: "sticky",
              top: "0",
              zIndex: "999",
              left: "0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {details.name}
            {/* onClick={() => handleEditPlan(details)} */}
            {userIsAdmin && (
              <span>
                <p
                  className="edit_btn"
                  onClick={() => handleEditSignal(details)}
                >
                  Edit
                </p>
              </span>
            )}
          </div>

          <div className="content">
            <span className="price">
              <p className="title">Price</p>
              <p className="value">${details.price}</p>
            </span>

            <LargeDivider>
              {/* amount */}
              <MiniAmountBoxFull
                className={
                  amountError
                    ? "amount_box error variant"
                    : "amount_box variant"
                }
              >
                <div className="label">
                  <p>Amount:</p>
                  <img
                    src="./assets/misc/info.svg"
                    alt=""
                    className="error_inform"
                    id="popcorn"
                    onClick={() => setShowToolTip(!showToolTip)}
                  />
                  {showToolTip && (
                    <ClickAwayListener
                      onClickAway={() => setShowToolTip(false)}
                    >
                      <div className="tooltip" id="tooltip">
                        {tooltipMessage}
                      </div>
                    </ClickAwayListener>
                  )}
                </div>

                <div className="wrapper">
                  <input
                    ref={amountRef}
                    type="number"
                    placeholder="1000"
                    onChange={handleAmount}
                  />

                  <span className="asset">
                    <p>USD</p>
                  </span>
                </div>

                <div className="captions">
                  <span>
                    <p className="caption">Current balance</p>
                    {balance <= 0 && (
                      <p
                        className="value"
                        style={{
                          color: "#ff3344",
                          display: "flex",
                          gap: "4px",
                        }}
                      >
                        {formatterZero.format(balance)}{" "}
                        {/* <span
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => navigate("/deposit")}
                        >
                          Deposit now
                        </span> */}
                      </p>
                    )}

                    {balance > 0 && (
                      <p className="value" style={{ color: "#5BDE4C" }}>
                        {formatterZero.format(balance)}
                      </p>
                    )}
                  </span>
                </div>
              </MiniAmountBoxFull>

              <FullButton
                onClick={handleSubscribe}
                className={
                  (!amount || isPurchasing || amountError) && "disabled"
                }
                disabled={!amount || isPurchasing || amountError}
              >
                {isPurchasing ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Purchase</p>
                )}
              </FullButton>
            </LargeDivider>
          </div>
        </>
      )}
    </SignalCardStandard>
  );
};

const SignalCardStandard = styled.div`
  background-color: #151823;
  height: 100%;
  border-radius: 12px;

  .edit_btn {
    color: #0c6ef2;
    font-weight: 600;
    cursor: pointer;
  }

  .content {
    padding: 24px;
  }

  .price {
    display: grid;
    gap: 4px;
    padding-bottom: 24px;
  }

  .title {
    font-weight: 500;
    color: #bac2de;
  }

  .value {
    font-size: 24px;
    font-weight: 600;
    color: white;
  }
`;

export default SignalCard;
