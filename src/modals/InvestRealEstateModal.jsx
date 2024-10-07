import { useEffect, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import { ClickAwayListener } from "@mui/material";
import { LargeDivider } from "../styled/forms/dividers";
import {
  AmountBox,
  DropDownBox,
  FullButton,
  MiniAmountBox,
  MiniAmountBoxFull,
  ToolTipContainer,
} from "../styled/input/Input";

import {
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../firebase/firebase";
import CircularLoader from "../styled/loaders/CircularLoader";
import Toast from "../hooks/Toast";
import { formatterZero } from "../utils/utils";

const InvestRealEstateModal = ({ details, open, accounts, user }) => {
  const { stake, setStake } = open;
  const { investRealEstate, setInvestRealEstate } = open;

  const { minimum, roi, title, description, thumbnail } = details;

  // const { asset, minimum, maximum, duration, roi } = pool;

  // const [cryptoAccount, setCryptoAccount] = useState({});
  const [balance, setBalance] = useState(undefined);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const { id } = user;

  useEffect(() => {
    if (accounts) {
      const live = accounts.live;
      if (live) {
        // setAccount()
        // setCryptoAccount(live.Crypto);
        setBalance(live.Fiat.value);
      }
    }
  }, [accounts]);

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
          )} but you are attempting to invest ${formatterZero.format(
            Number(e.target.value)
          )}, which is over your available balance`
        );
        setAmountError(true);
      } else if (Number(value) < minimum) {
        // minimum check
        setAmountError(true);
        setToolTipMessage(
          `The minimum allowed for this project allowed is ${formatterZero.format(
            minimum
          )}`
        );
      }

      // else if (Number(value) > maximum) {
      //   // maximum check
      //   setAmountError(true);
      //   setToolTipMessage(`The maximum allowed for this project allowed is ${maximum}`);
      // }
      else {
        // valid
        setAmount(Number(value));
        setAmountError(false);
      }
    } else {
      setAmount(""); // empty value
    }
  }
  const [showToolTip, setShowToolTip] = useState(false);
  const [tooltipMessage, setToolTipMessage] = useState("");

  // duration

  // duration
  const durationOptions = [
    // "1 day",
    // "2 days",
    // "4 weeks",
    "3 days",
    "4 days",
    "5 days",
    "6 days",
    "1 week",
    "2 weeks",
    "3 weeks",
    "1 month",
    "2 months",
    "3 months",
    "4 months",
    "5 months",
    "6 months",
    "7 months",
    "8 months",
    "9 months",
    "10 months",
    "1 year",
    "2 years",
    "3 years",
  ];
  const [time, setTime] = useState(2);
  const [duration, setDuration] = useState(3);
  function handleDuration(e) {
    const { value } = e.target;

    // setDurationToolTipMessage(`Your trade will auto close after ${value}`);
    const timeSlice = value.slice(0, value.indexOf(" "));

    if (value.includes("day")) {
      setDuration(Number(timeSlice) * 1);
      // console.log("day", Number(timeSlice) * 1);
    }
    if (value.includes("week")) {
      setDuration(Number(timeSlice) * 7);
      // console.log("week", Number(timeSlice) * 7);
    }
    if (value.includes("month")) {
      setDuration(Number(timeSlice) * 30.417);
      // console.log("month", Number(timeSlice) * 30.417);
    }

    if (value.includes("year")) {
      setDuration(Number(timeSlice) * 365);
      // console.log("year", Number(timeSlice) * 365);
    }

    // console.log(time);
    // setDuration(value);
  }

  // const [maxiDaysArr, setMaxiDaysArr] = useState([]);
  // useEffect(() => {
  //   let arr = [];
  //   let num = duration;

  //   for (let i = 0; i < num; i++) {
  //     const value = i + 1;
  //     arr.push(value);
  //   }
  //   setMaxiDaysArr(arr);
  // }, []);

  // const [selectedDuration, setSelectedDuration] = useState(1);
  // function handleDuration(e) {
  //   const { value } = e.target;

  //   if (value) {
  //     setSelectedDuration(value);
  //   } else {
  //     setSelectedDuration(1);
  //   }
  // }

  // roi & compiled
  const [compiledTotal, setCompiledTotal] = useState(0);
  const [showCompiledToolTip, setShowCompiledToolTip] = useState(false);
  const compiledToolTipMessage = useState(
    `This is the amount you will earn after the investment completes, plus your capital`
  );

  // investing
  const [isInvesting, setIsInvesting] = useState(false);
  function handleInvest() {
    const { id } = user;
    setIsInvesting(true);
    decrementFiat(id);
  }

  async function decrementFiat(id) {
    const q = doc(db, "accounts", id);
    const key = `live.Fiat.value`;

    try {
      await updateDoc(q, {
        [key]: increment(-Number(amount)),
      }).then(() => {
        // submitInvestment(id);
        incrementBalance(id);
      });
    } catch (error) {
      // setIsSubscribing(false);
      setIsInvesting(false);
      setToastType("error");
      setToastMessage("Failed to invest. Please try again later.");
      setOpenToast(true);
    }
  }

  async function incrementBalance(id) {
    const q = doc(db, "balances", id);
    // const key = `live.Fiat.value`;

    try {
      await updateDoc(q, {
        realEstateBalance: increment(Number(amount)),
      }).then(() => {
        submitInvestment(id);
      });
    } catch (error) {
      // setIsSubscribing(false);
      setIsInvesting(false);
      setToastType("error");
      setToastMessage("Failed to invest. Please try again later.");
      setOpenToast(true);
    }
  }

  async function submitInvestment(id) {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);
    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();
    await setDoc(doc(db, "investments", str), {
      ref: str,
      status: "open",
      type: "Real Estate",
      user: id,
      amount: Number(amount),
      pnl: 0,
      date: serverTimestamp(),
      duration,
      daysRan: 0,
      daysLeft: duration,
      projectTitle: title,
      projectRoi: roi,
      projectDesc: description,
      projectThumb: thumbnail,
      userRef: {
        name: user.firstname + " " + user.lastname,
        photo: user.photoURL ? user.photoURL : null,
        admin: user.admin,
      },
    })
      .then(() => {
        setIsInvesting(false);
        setToastType("success");
        setToastMessage("Invested successfully");
        setOpenToast(true);

        setTimeout(() => {
          setInvestRealEstate(false);
        }, 700);
      })
      .catch((error) => {
        console.log("error", error);
        setIsInvesting(false);
        setToastType("error");
        setToastMessage("Failed to invest. Please try again later.");
        setOpenToast(true);
      });
  }

  useEffect(() => {
    if (roi && duration && amount) {
      setCompiledTotal(
        Number(Number((roi / 100) * amount * duration) + amount).toFixed(3)
      );
    } else {
      setCompiledTotal(undefined);
    }
  }, [roi, duration, amount]);

  const [showRoiTooltip, setShowRoiTooltip] = useState(false);
  const roiTooltipMessage =
    "This is the total % of profits to be gained on this project";

  return (
    <>
      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      <Modal
        open={investRealEstate}
        onClose={() => setInvestRealEstate(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Invest in {title}</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setInvestRealEstate(!investRealEstate)}
              style={{ cursor: "pointer" }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.8647 0.366365C12.3532 -0.122122 13.1451 -0.122122 13.6336 0.366365C14.1221 0.854853 14.1221 1.64685 13.6336 2.13533L8.88929 6.87968L13.8743 11.8647C14.3628 12.3532 14.3628 13.1451 13.8743 13.6336C13.3858 14.1221 12.5938 14.1221 12.1053 13.6336L7.12032 8.64864L2.13533 13.6336C1.64685 14.1221 0.854853 14.1221 0.366366 13.6336C-0.122122 13.1451 -0.122122 12.3532 0.366366 11.8647L5.35136 6.87968L0.607014 2.13533C0.118527 1.64685 0.118527 0.854853 0.607014 0.366365C1.0955 -0.122122 1.8875 -0.122122 2.37598 0.366365L7.12032 5.11071L11.8647 0.366365Z"
                fill="#858DAD"
              />
            </svg>
          </div>

          <div className="modal_content">
            <div className="top">
              <LargeDivider className="variant">
                <MiniAmountBoxFull
                  className={
                    amountError ? "amount_box error" : "amount_box variant"
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
                        <div
                          className="tooltip"
                          id="tooltip"
                          style={{ left: "1px" }}
                        >
                          {tooltipMessage}
                        </div>
                      </ClickAwayListener>
                    )}
                  </div>

                  <div className="wrapper">
                    <input
                      type="number"
                      placeholder="1000"
                      onChange={handleAmount}
                      ref={amountRef}
                    />

                    <span className="asset">
                      <span>
                        <p>USD</p>
                      </span>
                    </span>
                  </div>

                  {balance > 0 && (
                    <div className="captions">
                      <span>
                        <p className="caption">Current balance</p>
                        <p className="value">{formatterZero.format(balance)}</p>
                      </span>
                    </div>
                  )}
                </MiniAmountBoxFull>

                <DropDownBox className="type_select">
                  <div className="wrapper">
                    <p className="label">Duration (Days):</p>
                    <span className="content">
                      <select
                        name="options"
                        onChange={(e) => handleDuration(e)}
                      >
                        {durationOptions.map((option) => (
                          <option value={option} key={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="#5C6175"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </DropDownBox>

                <MiniAmountBox className={"amount_box"}>
                  <div className="label">
                    <p>ROI:</p>
                    <img
                      src="./assets/misc/info.svg"
                      alt=""
                      className="error_inform"
                      id="popcorn"
                      style={{ display: "block" }}
                      onClick={() => setShowRoiTooltip(!showRoiTooltip)}
                    />
                    {showRoiTooltip && (
                      <ClickAwayListener
                        onClickAway={() => setShowRoiTooltip(false)}
                      >
                        <div
                          className="tooltip"
                          id="tooltip"
                          style={{ left: "1px" }}
                        >
                          {roiTooltipMessage}
                        </div>
                      </ClickAwayListener>
                    )}
                  </div>

                  <div className="wrapper" style={{ padding: "24px" }}>
                    <input
                      type="number"
                      placeholder={roi + "%"}
                      onChange={(e) => handleDuration(e)}
                      disabled
                    />
                  </div>
                </MiniAmountBox>

                {amount && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        maxWidth: "180px",
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      {showCompiledToolTip && (
                        <ClickAwayListener
                          onClickAway={() =>
                            setShowCompiledToolTip(!showCompiledToolTip)
                          }
                        >
                          <ToolTipContainer>
                            <div
                              className="tooltip"
                              id="tooltip"
                              style={{
                                bottom: "28px",
                                left: "5px",
                                width: "100%",
                              }}
                            >
                              {compiledToolTipMessage}
                            </div>
                          </ToolTipContainer>
                        </ClickAwayListener>
                      )}
                      <p
                        style={{
                          color: "#bac2de",
                          fontSize: "14px",
                          lineHeight: "20px",
                        }}
                      >
                        Total returns on this investment
                        <span
                          style={{ position: "absolute", marginLeft: "4px" }}
                        >
                          <img
                            src="./assets/misc/info.svg"
                            alt=""
                            className="error_inform"
                            id="popcorn"
                            onClick={() =>
                              setShowCompiledToolTip(!showCompiledToolTip)
                            }
                          />
                        </span>
                      </p>
                    </span>

                    <span>
                      <p
                        style={{
                          fontSize: "20px",
                          color: "#5BDE4C",
                          fontWeight: "600",
                        }}
                      >
                        ~{formatterZero.format(compiledTotal)}
                      </p>
                    </span>
                  </div>
                )}
              </LargeDivider>
            </div>

            <div className="bottom">
              <FullButton
                onClick={handleInvest}
                disabled={
                  isInvesting || !amount || !duration || !roi || amountError
                }
                className={
                  (isInvesting ||
                    !amount ||
                    !duration ||
                    !roi ||
                    amountError) &&
                  "disabled"
                }
              >
                {isInvesting ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Invest</p>
                )}
              </FullButton>
            </div>
          </div>
        </ModalStandard>
      </Modal>
    </>
  );
};

const ModalStandard = styled.div`
  background-color: #151823;
  border-radius: 12px;
  max-width: 430px;
  place-self: center;
  width: 100%;
  border: 1px solid transparent;
  z-index: 10001;

  .bottom button {
    cursor: pointer;
    width: 100%;
    background-color: #0c6cf2;
    padding: 12px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
  }

  .bottom button:hover {
    background-color: #ff3344;
  }

  .bottom {
    margin-top: 32px;
  }

  @media screen and (max-width: 768px) {
    width: 100vw;
    max-width: unset;
    height: fit-content;
    max-height: 90vh;
    position: fixed;
    left: 0;
    bottom: 0;
    padding-bottom: 48px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    /* overflow-y: scroll; */

    .bottom button {
      margin: 0;
    }

    .top {
      margin-bottom: 52px;
    }

    .bottom {
      position: fixed;
      bottom: 0px;
      right: 0px;
      width: 100%;
      padding: 12px 24px;
      height: fit-content;
      background-color: #151823;
      z-index: 999;
      border: none;
      outline: none;
      /* display: none; */
    }
  }

  .modal_top {
    color: white;
    font-size: 16px;
    font-weight: 600;
    background-color: #1b1f2d;
    width: 100%;
    padding: 14px 30px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    position: sticky;
    top: 0;
    z-index: 999;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal_content {
    padding: 24px;
  }

  .modal_content .top {
    display: grid;
    gap: 24px;
  }
`;

// const SubscriptionCardStandard = styled.div`
//   background-color: #151823;
//   height: 100;
//   border-radius: 12px;
// `;

export default InvestRealEstateModal;
