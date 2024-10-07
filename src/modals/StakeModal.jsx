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

const StakeModal = ({ open, pool, accounts, prices, user }) => {
  const { stake, setStake } = open;
  const { asset, minimum, maximum, duration, roi } = pool;

  const [cryptoAccount, setCryptoAccount] = useState({});
  const [balance, setBalance] = useState(undefined);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const { id } = user;

  useEffect(() => {
    if (prices && accounts) {
      const live = accounts.live;
      if (live) {
        setCryptoAccount(live.Crypto);
        setBalance(live.Crypto[asset]?.value);
      }
    }
  }, [prices, accounts]);

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
          `Your current balance is ${balance} but you are attempting to stake ${e.target.value} ${asset}, which is over your available balance`
        );
        setAmountError(true);
      } else if (Number(value) < minimum) {
        // minimum check
        setAmountError(true);
        setToolTipMessage(`The minimum stake allowed is ${minimum} ${asset}`);
      } else if (Number(value) > maximum) {
        // maximum check
        setAmountError(true);
        setToolTipMessage(`The maximum stake allowed is ${maximum} ${asset}`);
      } else {
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
  const [maxiDaysArr, setMaxiDaysArr] = useState([]);
  useEffect(() => {
    let arr = [];
    let num = duration;

    for (let i = 0; i < num; i++) {
      const value = i + 1;
      arr.push(value);
    }
    setMaxiDaysArr(arr);
  }, []);

  const [selectedDuration, setSelectedDuration] = useState(1);
  function handleDuration(e) {
    const { value } = e.target;

    if (value) {
      setSelectedDuration(value);
    } else {
      setSelectedDuration(1);
    }
  }

  // roi & compiled
  const [compiledTotal, setCompiledTotal] = useState(0);
  const [showCompiledToolTip, setShowCompiledToolTip] = useState(false);
  const compiledToolTipMessage = useState(
    `This is the amount you will earn after the staking session completes, plus your initial stake`
  );

  const [isStaking, setIsStaking] = useState(false);
  function handleStake() {
    setIsStaking(true);
    decrementCrypto();
  }

  async function decrementCrypto() {
    // `${currentAccount}.Crypto.${asset}.value`;
    const q = doc(db, "accounts", id);
    const key = `live.Crypto.${asset}.value`;

    try {
      await updateDoc(q, {
        [key]: increment(-Number(amount)),
      }).then(() => {
        stakeCrypto();
      });
    } catch (error) {
      setIsStaking(false);
      setToastType("error");
      setToastMessage("Failed to stake. Please try again later.");
      setOpenToast(true);
      // reset();
      // setTimeout(() => {
      //   setEditStake(false);
      // }, 400);
      // console.log(error);
    }
  }

  // async function sendAdminNotification() {}
  async function stakeCrypto() {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "stakings", str), {
      date: serverTimestamp(),
      ref: str,
      status: "open",
      asset,
      amount,
      duration: selectedDuration,
      daysRan: 0,
      daysLeft: selectedDuration,
      roi,
      user: id,
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
        // console.log(error)
        setIsStaking(false);
        setToastType("error");
        setToastMessage("Failed to stake. Please try again later.");
        setOpenToast(true);
      });
  }

  function reset() {
    if (amountRef) {
      amountRef.current.value = " ";
    }

    setAmountError(false);
    setAmount(undefined);
    setSelectedDuration(1);
  }

  // user notified
  async function sendUserNotification() {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "notifications", str), {
      ref: str,
      type: "Staking",
      message: "You successfully staked " + amount + " " + asset,
      user: id,
      read: false,
      date: serverTimestamp(),
    })
      .then(() => {
        setIsStaking(false);
        setToastType("success");
        setToastMessage("Staked successfully");
        setOpenToast(true);
        reset();
        setTimeout(() => {
          setStake(false);
        }, 400);
      })
      .catch((error) => {
        setIsStaking(false);
        setToastType("error");
        setToastMessage("Failed to stake. Please try again later.");
        setOpenToast(true);
      });
  }

  useEffect(() => {
    if (roi && duration && amount) {
      setCompiledTotal(Number((amount / 100) * roi + amount).toFixed(3));
    } else {
      setCompiledTotal(undefined);
    }
  }, [roi, duration, amount]);

  const [showRoiTooltip, setShowRoiTooltip] = useState(false);
  const roiTooltipMessage = "This is the total % of your staking earnings";

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
        open={stake}
        onClose={() => setStake(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Stake {asset}</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setStake(!stake)}
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
                <AmountBox
                  className={amountError ? "amount_box error" : "amount_box"}
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
                          // style={{ top: "0px" }}
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
                        <img src={`./asseticons/${asset}.svg`} alt="" />
                        <p>{asset}</p>
                      </span>
                    </span>
                  </div>

                  {asset && (
                    <div className="captions">
                      <span>
                        <p className="caption">Current balance</p>
                        <p className="value">
                          {cryptoAccount[asset]?.value} {asset}{" "}
                        </p>
                      </span>
                    </div>
                  )}
                </AmountBox>

                <DropDownBox className="type_select">
                  <div className="wrapper">
                    <p className="label">Duration (Days):</p>
                    <span className="content">
                      <select name="options" onChange={handleDuration}>
                        {maxiDaysArr.map((val, index) => (
                          <option value={val}>
                            {val} {index === 0 ? "day" : "days"}
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
                      Total returns after staking session
                      <span style={{ position: "absolute", marginLeft: "4px" }}>
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
                      ~{compiledTotal} {asset}
                    </p>
                  </span>
                </div>
              </LargeDivider>
            </div>

            <div className="bottom">
              <FullButton
                onClick={handleStake}
                disabled={
                  isStaking ||
                  !asset ||
                  !amount ||
                  amountError ||
                  !selectedDuration ||
                  !roi
                }
                className={
                  (isStaking ||
                    !asset ||
                    !amount ||
                    amountError ||
                    !selectedDuration ||
                    !roi) &&
                  "disabled"
                }
              >
                {isStaking ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Stake</p>
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

export default StakeModal;

// outlinedModal
// filledModal
