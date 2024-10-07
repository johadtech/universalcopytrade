import { createPopper } from "@popperjs/core";
import { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import {
  AmountBox,
  FullButton,
  MiniAmountBox,
  MiniAmountBoxFull,
} from "../styled/input/Input";
import { formatterZero } from "../utils/utils";
import { ClickAwayListener, Skeleton } from "@mui/material";
import EditSubscriptionPlanModal from "../modals/EditSubscriptionPlanModal";
import { useNavigate } from "react-router";
import CircularLoader from "../styled/loaders/CircularLoader";
import {
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import Toast from "../hooks/Toast";
import { db } from "../firebase/firebase";

const SubscriptionCard = ({ details, loading, accounts, user, admin }) => {
  const { isLoading, setIsLoading } = loading;
  const { userIsAdmin, setUserIsAdmin } = admin;
  const { name, minimum, maximum, duration, roi } = details;

  const { id } = user;

  const navigate = useNavigate();

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [balance, setBalance] = useState(0);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  useEffect(() => {
    if (!isLoading && accounts) {
      fetchBalance();
    } else {
      setShowSkeleton(true);
    }
  }, [isLoading, accounts, userIsAdmin]);

  function fetchBalance() {
    const live = accounts.live;
    if (live) {
      setBalance(live.Fiat?.value);
      setTimeout(() => {
        setShowSkeleton(false);
      }, 600);
    }
  }

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
      } else if (Number(value) > maximum) {
        // maximum check
        setAmountError(true);
        setToolTipMessage(
          `The maximum amount for this plan is ${formatterZero.format(
            maximum
          )} `
        );
      } else if (Number(value) < minimum) {
        // minimum check
        setAmountError(true);
        setToolTipMessage(
          `The minimum amount for this plan is ${formatterZero.format(
            minimum
          )} `
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

  // edit
  const [editPlan, setEditPlan] = useState(false);
  const [selectedEditPlan, setSelectedEditPlan] = useState({});
  function handleEditPlan(details) {
    setSelectedEditPlan(details);
    setEditPlan(true);
  }

  const [isSubscribing, setIsSubscribing] = useState(false);
  function handleSubscribe() {
    setIsSubscribing(true);
    decrementFiat();
  }

  // decrement fiat
  async function decrementFiat() {
    // `${currentAccount}.Crypto.${asset}.value`;
    const q = doc(db, "accounts", id);
    const key = `live.Fiat.value`;

    try {
      await updateDoc(q, {
        [key]: increment(-Number(amount)),
      }).then(() => {
        subscribePlan();
      });
    } catch (error) {
      setIsSubscribing(false);
      setToastType("error");
      setToastMessage("Failed to subscribe. Please try again later.");
      setOpenToast(true);
    }
  }

  // async function sendAdminNotification() {}
  async function subscribePlan() {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "subscriptions", str), {
      ref: str,
      user: id,
      plan: name,
      duration,
      daysRan: 0,
      daysLeft: duration,
      amount,
      date: serverTimestamp(),
      roi,
      status: "open",
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
        setIsSubscribing(false);
        setToastType("error");
        setToastMessage("Failed to subscribe. Please try again later.");
        setOpenToast(true);
      });
  }

  function reset() {
    if (amountRef) {
      amountRef.current.value = " ";
    }

    setAmountError(false);
    setAmount(undefined);
    // setSelectedDuration(1);
  }

  // user notified
  async function sendUserNotification() {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "notifications", str), {
      ref: str,
      type: "Subscription",
      message: "You subscribed to " + name + " plan",
      user: id,
      read: false,
      date: serverTimestamp(),
    })
      .then(() => {
        setIsSubscribing(false);
        setToastType("success");
        setToastMessage("Subscribed successfully");
        setOpenToast(true);
        reset();
      })
      .catch((error) => {
        setIsSubscribing(false);
        setToastType("error");
        setToastMessage("Failed to subscribe. Please try again later.");
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

      {editPlan && (
        <EditSubscriptionPlanModal
          open={{ editPlan, setEditPlan }}
          details={selectedEditPlan}
        />
      )}

      <SubscriptionCardStandard>
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

            <div className="content" style={{ padding: "24px" }}>
              <span className="minimum" style={{ display: "grid", gap: "4px" }}>
                <p
                  className="title"
                  style={{ fontWeight: "500", color: "#BAC2DE" }}
                >
                  <Skeleton
                    variant="rounded"
                    width={80}
                    sx={{ backgroundColor: "#1b1f2d" }}
                  />
                </p>
                <p
                  className="value"
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    // width={100}
                    sx={{ backgroundColor: "#1b1f2d", maxWidth: "40%" }}
                  />
                </p>
              </span>

              <div
                className="details"
                style={{
                  display: "grid",
                  gridTemplateAreas: " 'duration roi' 'max max' ",
                  padding: "24px 0px",
                  gap: "4px",
                }}
              >
                <Skeleton
                  variant="rounded"
                  height={80}
                  sx={{
                    gridArea: "duration",
                    display: "grid",
                    textTransform: "uppercase",
                    gap: "4px",
                    justifyItems: "center",
                    padding: "24px",
                    backgroundColor: "#1B1F2D",
                    borderRadius: "4px",
                    gap: "4px",
                  }}
                />

                <Skeleton
                  variant="rounded"
                  height={80}
                  sx={{
                    gridArea: "roi",
                    display: "grid",
                    textTransform: "uppercase",
                    gap: "4px",
                    justifyItems: "center",
                    padding: "24px",
                    backgroundColor: "#1B1F2D",
                    borderRadius: "4px",
                    gap: "4px",
                  }}
                />

                <Skeleton
                  variant="rounded"
                  height={80}
                  sx={{
                    gridArea: "max",
                    display: "grid",
                    textTransform: "uppercase",
                    gap: "4px",
                    justifyItems: "center",
                    padding: "24px",
                    backgroundColor: "#1B1F2D",
                    borderRadius: "4px",
                    gap: "4px",
                  }}
                />
              </div>

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
            {/* top */}
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
              <p>{details.name}</p>
              {userIsAdmin && (
                <span onClick={() => handleEditPlan(details)}>
                  <p className="edit_btn">Edit</p>
                </span>
              )}
            </div>

            <div className="content" style={{ padding: "24px" }}>
              {/* minimum */}
              <span className="minimum" style={{ display: "grid", gap: "4px" }}>
                <p
                  className="title"
                  style={{ fontWeight: "500", color: "#BAC2DE" }}
                >
                  Minimum
                </p>
                <p
                  className="value"
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  {formatterZero.format(details.minimum)}
                </p>
              </span>

              {/* details */}
              <div
                className="details"
                style={{
                  display: "grid",
                  gridTemplateAreas: " 'duration roi' 'max max' ",
                  padding: "24px 0px",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    gridArea: "duration",
                    display: "grid",
                    textTransform: "uppercase",
                    gap: "4px",
                    justifyItems: "center",
                    padding: "24px",
                    backgroundColor: "#1B1F2D",
                    borderRadius: "4px",
                    gap: "4px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#BAC2DE",
                      fontWeight: "500",
                    }}
                  >
                    Duration
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {details.duration} days
                  </p>
                </span>
                <span
                  style={{
                    gridArea: "roi",
                    display: "grid",
                    textTransform: "uppercase",
                    gap: "4px",
                    justifyItems: "center",
                    padding: "24px",
                    backgroundColor: "#1B1F2D",
                    borderRadius: "4px",
                    gap: "4px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#BAC2DE",
                      fontWeight: "500",
                    }}
                  >
                    ROI
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#51BE7F",
                      fontWeight: "600",
                    }}
                  >
                    {details.roi}%
                  </p>
                </span>
                <span
                  style={{
                    gridArea: "max",
                    display: "grid",
                    textTransform: "uppercase",
                    gap: "4px",
                    justifyItems: "center",
                    padding: "24px",
                    backgroundColor: "#1B1F2D",
                    borderRadius: "4px",
                    gap: "4px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#BAC2DE",
                      fontWeight: "500",
                    }}
                  >
                    Maximum
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {formatterZero.format(details.maximum)}
                  </p>
                </span>
              </div>

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
                        <span
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => navigate("/deposit")}
                        >
                          Deposit now
                        </span>
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
                style={{ marginTop: "32px" }}
                onClick={handleSubscribe}
                disabled={isSubscribing || !amount || amountError}
                className={
                  (isSubscribing || !amount || amountError) && "disabled"
                }
              >
                {isSubscribing ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Subscribe</p>
                )}
              </FullButton>
            </div>
          </>
        )}
      </SubscriptionCardStandard>
    </>
  );
};

const SubscriptionCardStandard = styled.div`
  background-color: #151823;
  height: 100%;
  border-radius: 12px;

  .edit_btn {
    color: #0c6ef2;
    font-weight: 600;
    cursor: pointer;
  }
`;

export default SubscriptionCard;
