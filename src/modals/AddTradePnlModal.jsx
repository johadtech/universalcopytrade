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
  TextBox,
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
import { formatterZero, toFixedIfNecessary } from "../utils/utils";

const AddTradePnlModal = ({ open, details }) => {
  const { addPnl, setAddPnl } = open;

  const { user, pnl, amount, ref, converted, type, asset, direction, alt } =
    details;

  //   const asset = "BTC";
  //   const { asset, minimum, maximum, duration, roi } = pool;

  //   const [cryptoAccount, setCryptoAccount] = useState({});
  //   const [balance, setBalance] = useState(undefined);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  //   const { id } = user;

  //   useEffect(() => {
  //     if (prices && accounts) {
  //       const live = accounts.live;
  //       if (live) {
  //         setCryptoAccount(live.Crypto);
  //         setBalance(live.Crypto[asset]?.value);
  //       }
  //     }
  //   }, [prices, accounts]);

  // amount
  const amountRef = useRef();
  //   const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false);

  const [showToolTip, setShowToolTip] = useState(false);
  const [tooltipMessage, setToolTipMessage] = useState(
    "Using negative sign will reduce from the current profits. Please do not remove more than the current pnl"
  );

  const [computedPnl, setComputedPnl] = useState(0);

  function handlePnl(e) {
    const { value } = e.target;

    if (value) {
      setComputedPnl(Number(value));
    } else {
      setComputedPnl(0);
    }
  }

  // roi & compiled
  const [compiledTotal, setCompiledTotal] = useState(0);
  const [showCompiledToolTip, setShowCompiledToolTip] = useState(false);
  const compiledToolTipMessage = useState(
    `This is the amount the user will earn after the trade is complete (plus their initial amount)`
  );

  const [isAdding, setIsAdding] = useState(false);
  function handleAdd() {
    setIsAdding(true);
    addPnlDB();
  }

  async function addPnlDB() {
    const q = doc(db, "trades", ref);
    try {
      await updateDoc(q, {
        pnl: increment(Number(computedPnl)),
      });
      setIsAdding(false);
      setToastType("success");
      setToastMessage("Added successfully");
      setOpenToast(true);

      setTimeout(() => {
        setAddPnl(false);
      }, 700);
    } catch (error) {
      console.log("error", error);
      setIsAdding(false);
      setToastType("error");
      setToastMessage("Failed to add. Please try again later.");
      setOpenToast(true);
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

      <Modal
        open={addPnl}
        onClose={() => setAddPnl(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Add pnl </p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setAddPnl(!addPnl)}
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
                    <p>Profits or Loss</p>
                    <img
                      src="./assets/misc/info.svg"
                      alt=""
                      className="error_inform"
                      id="popcorn"
                      style={{ display: "block" }}
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
                      type="number"
                      placeholder="1000"
                      onChange={handlePnl}
                      ref={amountRef}
                    />

                    <span className="asset">
                      <span>
                        {type === "Forex" && <p>USD</p>}
                        {type === "Stocks" && <p>{asset}</p>}
                        {type === "Crypto" && <p>{asset}</p>}
                      </span>
                    </span>
                  </div>

                  {/* {balance && (
                    <div className="captions">
                      <span>
                        <p className="caption">Current balance</p>
                        <p className="value">{formatterZero.format(balance)}</p>
                      </span>
                    </div>
                  )} */}
                </MiniAmountBoxFull>

                {/* <DropDownBox className="type_select">
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
                </DropDownBox> */}

                {/* <MiniAmountBox className={"amount_box"}>
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
                        <div className="tooltip" id="tooltip">
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
                </MiniAmountBox> */}

                <div className="details_wrapper">
                  <span className="details">
                    <p className="title">Asset</p>
                    <p className="detail"> {type === "Forex" ? asset : alt}</p>
                  </span>

                  <span className="details">
                    <p className="title">Trade amount</p>
                    <p className="detail">
                      {" "}
                      {type === "Forex" && `${amount} USD`}
                      {type === "Crypto" && (
                        <>
                          {direction === "Sell"
                            ? `${amount} ${asset}`
                            : `${toFixedIfNecessary(converted, 6)} ${asset}`}
                        </>
                      )}
                      {type === "Stocks" && (
                        <>
                          {direction === "Sell"
                            ? `${amount} ${asset}`
                            : `${toFixedIfNecessary(converted, 6)} ${asset}`}
                        </>
                      )}
                    </p>
                  </span>

                  <span className="details">
                    <p className="title">Current pnl</p>
                    <p
                      className="detail"
                      style={{
                        color: pnl < 0 ? "#ff3344" : "#51BE7F",
                      }}
                    >
                      {type === "Forex"
                        ? formatterZero.format(pnl)
                        : pnl + " " + asset}
                    </p>
                  </span>

                  <span className="details">
                    <p className="title">Direction</p>
                    <p className="detail">{direction}</p>
                  </span>

                  {/* <span className="details">
                    <p className="title">Entry price</p>
                    <p className="detail">{direction}</p>
                  </span> */}
                </div>

                {/* {computedPnl && ( */}
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
                      Total returns after trade closes
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
                  {/* {computedPnl && ( */}
                  <span>
                    <p
                      style={{
                        fontSize: "20px",
                        color: "#5BDE4C",
                        fontWeight: "600",
                      }}
                    >
                      {type === "Forex" &&
                        formatterZero.format(Number(computedPnl) + amount)}
                      {type === "Crypto" && (
                        <>
                          {direction === "Buy"
                            ? toFixedIfNecessary(
                                Number(
                                  computedPnl < 0
                                    ? pnl + computedPnl
                                    : pnl + computedPnl
                                ) + converted,
                                6
                              )
                            : toFixedIfNecessary(
                                Number(
                                  computedPnl < 0
                                    ? pnl + computedPnl
                                    : pnl + computedPnl
                                ) + amount,
                                6
                              )}
                        </>
                      )}
                      {type === "Stocks" && (
                        <>
                          {direction === "Buy"
                            ? toFixedIfNecessary(
                                Number(
                                  computedPnl < 0
                                    ? pnl + computedPnl
                                    : pnl + computedPnl
                                ) + converted,
                                6
                              )
                            : toFixedIfNecessary(
                                Number(
                                  computedPnl < 0
                                    ? pnl + computedPnl
                                    : pnl + computedPnl
                                ) + amount,
                                6
                              )}
                        </>
                      )}
                      {/* ~{} */}
                    </p>
                  </span>
                  {/* )} */}
                </div>
                {/* )} */}
              </LargeDivider>
            </div>

            <div className="bottom">
              <FullButton
                onClick={handleAdd}
                className={isAdding && "disabled"}
              >
                {isAdding ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Add</p>
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

  .details_wrapper {
    padding: 24px 0px;
    padding-top: 12px;
  }

  .details {
    margin-top: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    font-weight: 500;
  }

  .title {
    color: #bac2de;
  }

  .detail {
    color: white;
  }

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
    overflow-y: scroll;

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

export default AddTradePnlModal;

// outlinedModal
// filledModal
