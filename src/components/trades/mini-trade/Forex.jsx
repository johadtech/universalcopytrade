import { useEffect, useRef, useState } from "react";
import {
  AmountBox,
  DropDownBox,
  DropDownBoxWithIcon,
  FullButton,
  MiniAmountBox,
  MiniAmountBoxFull,
  ToolTipContainer,
  TradeDropDown,
} from "../../../styled/input/Input";
import { ClickAwayListener } from "@mui/material";
import {
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { styled } from "styled-components";
import { formatter } from "../../../utils/utils";
import CircularLoader from "../../../styled/loaders/CircularLoader";
import Toast from "../../../hooks/Toast";
import { siteSettings } from "../../../static";

const Forex = ({ account, prices, action, user, fiat, symbol }) => {
  const { selectedSymbol, setSelectedSymbol } = symbol;

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // amount
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false);
  const amountRef = useRef();

  const [showToolTip, setShowToolTip] = useState(false);
  const [tooltipMessage, setToolTipMessage] = useState("");

  // asset
  const [selectedAsset, setSelectedAsset] = useState(undefined);
  const [showAssetsDropdown, setShowAssetsDropdown] = useState(false);

  //sl
  const [sl, setSl] = useState(undefined);
  // const [slError, setSlError] = useState(false);
  // const [showSlToolTipError, setShowSlToolTipError] = useState(false);
  const slRef = useRef();

  // tp
  const [tp, setTp] = useState(undefined);
  // const [tpError, setTpError] = useState(false);
  // const [showTpToolTipError, setTpShowToolTipError] = useState(false);
  const tpRef = useRef();

  // duration
  const durationOptions = [
    "2 minutes",
    "5 minutes",
    "10 minutes",
    "30 minutes",
    "1 hour",
    "2 hours",
    "4 hours",
    "6 hours",
    "8 hours",
    "10 hours",
    "20 hours",
    "1 day",
    "2 days",
    "3 days",
    "4 days",
    "5 days",
    "6 days",
    "1 weeks",
    "2 weeks",
  ];
  const [time, setTime] = useState(2);
  const [duration, setDuration] = useState(durationOptions[0]);
  const [showDurationTooltip, setShowDurationTooltip] = useState(false);
  const [durationToolTipMessage, setDurationToolTipMessage] = useState(
    `Your trade will auto close after ${durationOptions[0]}`
  );

  // submit
  const [isSubmittingTrade, setIsSubmittingTrade] = useState(false);

  function reset() {
    setAmount(undefined);
    setAmountError(false);
    if (amountRef) {
      amountRef.current.value = "";
    }
  }

  useEffect(() => {
    setSelectedAsset(account["EURUSD"]);
    setSelectedSymbol("EURUSD");
    // setPrice(prices[selectedAsset?.asset]);
    // console.log(price);
    // console.log(account["BTC"].value, "accounts");
    // console.log("prices", prices["BTC"]);
    // console.log("action", action);
    // console.log("user", user);
    // console.log("fiat", fiat);
  }, [action, prices, account, user]);

  useEffect(() => {
    if (action) {
      reset();
    }
  }, [action]);

  function handleAmount(e) {
    const { value } = e.target;

    const balance = selectedAsset?.value;
    const usdBalance = fiat.value;

    if (Number(value) && Number(value) > 0) {
      setAmount(Number(value));

      if (Number(value) > usdBalance) {
        setAmount(Number(value));
        setAmountError(true);
        setToolTipMessage(
          `Forex trading uses your USD balance. You have selected an amount that is above your current USD balance.`
        );
      } else {
        setAmountError(false);
      }
    } else {
      setAmount("");
    }
  }

  function handleAssetSelect(e) {
    reset();
    const { value } = e.target;

    Object.values(account).forEach((acc) => {
      if (acc.name === value) {
        setSelectedAsset(acc);
        setSelectedSymbol(acc.name);
      }
    });

    // console.log(e.target.value);
    // setSelectedAsset(value);
    // value(asset.asset);
    // setShowAssetsDropdown(false);
  }

  function handleSl(e) {
    const { value } = e.target;

    if (Number(value) && Number(value) > 0) {
      setSl(Number(value));
    } else {
      setSl("");
    }
  }

  function handleTp(e) {
    const { value } = e.target;

    if (Number(value) && Number(value) > 0) {
      setTp(Number(value));
    } else {
      setTp("");
    }
  }

  function handleDuration(e) {
    const { value } = e.target;

    setDurationToolTipMessage(`Your trade will auto close after ${value}`);
    const timeSlice = value.slice(0, value.indexOf(" "));

    if (value.includes("minute")) {
      setTime(Number(timeSlice) * 1);
    }
    if (value.includes("hour")) {
      setTime(Number(timeSlice) * 60);
    }
    if (value.includes("day")) {
      setTime(Number(timeSlice) * 1440);
    }
    if (value.includes("week")) {
      setTime(Number(timeSlice) * 10080);
    }
    setDuration(value);
  }

  async function submitForexTrade() {
    if (!user.tradeEnabled) {
      setToastType("error");
      setToastMessage("Trading is disabled for your account");
      setOpenToast(true);
      return;
    }
    setIsSubmittingTrade(true);

    const { id } = user;

    decrementFiat(id);
  }

  // decrement fiat
  async function decrementFiat(user) {
    const q = doc(db, "accounts", user);
    const key = `live.Fiat.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(-amount)),
      }).then(() => {
        placeTrade();
      });
    } catch (error) {
      console.log("error", error);
      setIsSubmittingTrade(false);
      setToastType("error");
      setToastMessage("Failed to place trade. Please try again later");
      setOpenToast(true);
    }
  }

  async function placeTrade() {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const { id } = user;

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    const details = {
      ref: str,
      status: "open",
      type: "Forex",
      user: id,
      alt: `${selectedAsset.alt}`,
      fixed: false,
      amount: Number(amount),
      asset: selectedAsset.asset,
      direction: action,
      entry: prices[selectedAsset.asset],
      pnl: 0,
      converted: amount,
      date: serverTimestamp(),
      duration: time,
      sl: sl ? sl : null,
      tp: tp ? tp : null,
    };

    // console.log(details);

    // return;

    await setDoc(doc(db, "trades", str), {
      ref: str,
      status: "open",
      type: "Forex",
      user: id,
      alt: `${selectedAsset.alt}`,
      fixed: false,
      amount: Number(amount),
      asset: selectedAsset.asset,
      direction: action,
      entry: prices[selectedAsset.asset],
      pnl: 0,
      converted: amount,
      date: serverTimestamp(),
      duration: time,
      sl: sl ? sl : null,
      tp: tp ? tp : null,
      userRef: {
        name: user.firstname + " " + user.lastname,
        photo: user.photoURL ? user.photoURL : null,
        admin: user.admin,
      },
    })
      .then(() => {
        postTrade(details);
        // setIsSubmittingTrade(false);
        // console.log("traded");
      })
      .catch((error) => {
        console.log("error", error);
        setIsSubmittingTrade(false);
        setToastType("error");
        setToastMessage("Failed to place trade. Please try again later");
        setOpenToast(true);
      });
  }

  async function postTrade(details) {
    const url = `${siteSettings.serverLink}/forex`;

    const base = {
      details,
    };

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(base),
    };

    await fetch(url, config)
      .then((response) => {
        if (response) {
          reset();
          setIsSubmittingTrade(false);
          setToastType("success");
          setToastMessage("Trade successfully placed");
          setOpenToast(true);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setIsSubmittingTrade(false);
        setToastType("error");
        setToastMessage("Failed to place trade. Please try again later");
        setOpenToast(true);
      });
  }

  return (
    <>
      {/* amount  & asset */}

      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      <MiniAmountBoxFull
        className={
          amountError ? "amount_box error variant" : "amount_box variant"
        }
      >
        <div className="label">
          <p>
            Current USD Balance:{" "}
            <strong style={{ color: "#5BDE4C", fontWeight: "600" }}>
              {formatter.format(fiat?.value)}
            </strong>
          </p>
          <img
            src="./assets/misc/info.svg"
            alt=""
            className="error_inform"
            id="popcorn"
            onClick={() => setShowToolTip(!showToolTip)}
          />
          {showToolTip && (
            // <div className="tooltip" id="tooltip">
            //   {tooltipMessage}
            // </div>
            <ClickAwayListener onClickAway={() => setShowToolTip(false)}>
              <ToolTipContainer>
                <div
                  className="tooltip"
                  id="tooltip"
                  style={{ bottom: "33px", left: "38px", zIndex: "9999" }}
                >
                  {tooltipMessage}
                </div>
              </ToolTipContainer>
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
            <p>USD</p>
          </span>
        </div>
      </MiniAmountBoxFull>

      <DropDownBoxWithIcon className="type_select">
        <div className="wrapper">
          <p className="label">Asset:</p>
          <span className="content">
            <div className="icon_wrap">
              <img src={`./asseticons/${selectedAsset?.asset}.svg`} alt="" />
              <select
                name="assets"
                id=""
                onChange={(e) => handleAssetSelect(e)}
              >
                {/* {coinbaseMethods.map((method) => ( */}
                {Object.values(account).map((asset) => (
                  <option key={asset.asset} value={asset.name}>
                    {asset.alt}
                  </option>
                ))}

                {/* ))} */}
              </select>
            </div>
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
      </DropDownBoxWithIcon>

      {/* sl & tp */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto",
          gap: "12px",
          margin: "24px 0px",
          width: "100%",
        }}
      >
        {/* sl */}
        <MiniAmountBox
          // amountError ? "amount_box error" :
          className={"amount_box variant"}
        >
          <div className="label">
            <p>Stop Loss:</p>
            <img
              src="./assets/misc/info.svg"
              alt=""
              className="error_inform"
              id="popcorn"
              // onClick={() => setShowToolTip(!showToolTip)}
            />
            {/* {showToolTip && (
              <div className="tooltip" id="tooltip">
                {tooltipMessage}
              </div>
            )} */}
          </div>

          <div className="wrapper">
            <input
              type="number"
              placeholder={
                Number(prices[selectedAsset?.asset] - 1.5).toFixed(3) || "1000"
              }
              onChange={handleSl}
            />

            <span className="asset">
              <p>{selectedAsset?.asset}</p>
            </span>
          </div>
        </MiniAmountBox>

        {/*  tp  */}
        <MiniAmountBox className={"amount_box variant"}>
          <div className="label">
            <p>Take profit:</p>
            <img
              src="./assets/misc/info.svg"
              alt=""
              className="error_inform"
              id="popcorn"
              // onClick={() => setShowToolTip(!showToolTip)}
            />
            {/* {showToolTip && (
              <div className="tooltip" id="tooltip">
                {tooltipMessage}
              </div>
            )} */}
          </div>

          <div className="wrapper">
            <input
              type="number"
              placeholder={Number(prices[selectedAsset?.asset] + 1.5).toFixed(
                3
              )}
              onChange={handleTp}
            />

            <span className="asset">
              <p>{selectedAsset?.asset}</p>
            </span>
          </div>
        </MiniAmountBox>
      </div>

      {/* duration */}
      <DropDownBox className="type_select">
        <div className="wrapper">
          <div
            className="label"
            style={{
              position: "relative",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <p>Duration:</p>
            <img
              src="./assets/misc/info.svg"
              alt=""
              className="error_inform"
              id="popcorn"
              style={{ display: "block" }}
              onClick={() => setShowDurationTooltip(!showDurationTooltip)}
            />
            {/* // onClickAway={() => setShowCompiledToolTip(false)} */}

            {showDurationTooltip && (
              <ClickAwayListener
                onClickAway={() => setShowDurationTooltip(false)}
              >
                <ToolTipContainer>
                  <div
                    className="tooltip"
                    id="tooltip"
                    style={{ bottom: "33px", left: "-13px", zIndex: "9999" }}
                  >
                    {durationToolTipMessage}
                  </div>
                </ToolTipContainer>
              </ClickAwayListener>
            )}
          </div>
          {/* <p className="label">Duration:</p> */}
          <span className="content">
            <select name="duration" onChange={handleDuration}>
              {durationOptions.map((duration) => (
                <option value={duration}>{duration}</option>
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

      {/* submit */}
      <FullButton
        onClick={submitForexTrade}
        className={
          (!amount ||
            isSubmittingTrade ||
            amountError ||
            !selectedAsset ||
            !duration) &&
          "disabled"
        }
        disabled={
          !amount ||
          isSubmittingTrade ||
          amountError ||
          !selectedAsset ||
          !duration
        }
      >
        {isSubmittingTrade ? (
          <div style={{ padding: "8px" }}>
            <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
          </div>
        ) : (
          <p>Trade</p>
        )}
      </FullButton>
    </>
  );
};

export default Forex;
