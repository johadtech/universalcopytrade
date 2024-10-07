import { useContext, useEffect, useRef, useState } from "react";
import {
  AmountBox,
  DropDownBox,
  FullButton,
  MiniAmountBox,
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
// import { styled } from "styled-components";
import {
  formatter,
  formatterZero,
  toFixedIfNecessary,
} from "../../../utils/utils";
import CircularLoader from "../../../styled/loaders/CircularLoader";
import Toast from "../../../hooks/Toast";
import { siteSettings } from "../../../static";
import { context } from "../../../context/context";

const Crypto = ({ account, prices, action, user, fiat, symbol }) => {
  const { selectedSymbol, setSelectedSymbol } = symbol;

  const { accounts } = useContext(context);

  const [allAccounts, setAllAccounts] = useState(undefined);
  const [accountsList, setAccountsList] = useState(undefined);

  useEffect(() => {
    const { live, practice } = accounts;
    if (live) {
      const { Crypto } = live;
      setAllAccounts(Crypto);
      setAccountsList(Crypto);
    }
  }, [accounts]);

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
  const slRef = useRef();

  // tp
  const [tp, setTp] = useState(undefined);
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

    // setResetCalled(false);
    // setResetCalled(true);
    // setResetCalled(false);
  }

  useEffect(() => {
    setSelectedAsset(account["BTC"]);
    setSelectedSymbol("BTC");
  }, [action, prices, account, user]);

  useEffect(() => {
    if (action) {
      reset();
    }
  }, [action]);

  const searchRef = useRef();
  function handleCurrencySearch(e) {
    const { value } = e.target;

    // console.log(allAssets);

    let filteredAssets;

    if (value) {
      filteredAssets = Object.values(accountsList).filter(
        (assets) =>
          assets.name.toLowerCase().includes(value.toLowerCase()) ||
          assets.asset.toLowerCase().includes(value.toLowerCase())
      );
      setAllAccounts(filteredAssets);
    } else {
      setAllAccounts(accountsList);
    }
  }

  function handleAmount(e) {
    const { value } = e.target;

    const balance = selectedAsset?.value;
    const usdBalance = fiat.value;

    if (Number(value) && Number(value) > 0) {
      setAmount(Number(value));

      if (action === "Buy") {
        if (value > usdBalance) {
          setAmount(value);
          setAmountError(true);
          setToolTipMessage(
            `Buying ${selectedAsset.asset} will take out balance from your USD account and purchase ${selectedAsset.asset} with it. Your USD balance is below the amout you have selected. `
          );
          // but you are attempting to withdraw ${e.target.value} BTC, which is over your available balance
          // `Your current balance is ${balance} ${selectedAsset.asset} `
        } else {
          setAmountError(false);
        }
      }

      if (action === "Sell") {
        if (value > balance) {
          setAmount(value);
          setAmountError(true);
          setToolTipMessage(
            `Selling ${selectedAsset.asset} will take out balance from your ${selectedAsset.asset} account and trade USD with it. Your ${selectedAsset.asset} balance is below the amout you have selected. `
          );
          // but you are attempting to withdraw ${e.target.value} BTC, which is over your available balance
          // `Your current balance is ${balance} ${selectedAsset} `
        } else {
          setAmountError(false);
        }
      }
    } else {
      setAmount("");
    }
  }

  function handleAssetSelect(asset) {
    reset();
    setSelectedAsset(asset);
    setSelectedSymbol(asset.alt);
    setAllAccounts(accountsList);
    if (searchRef) {
      searchRef.current.value = "";
    }
    setShowAssetsDropdown(false);
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

  async function submitCryptoTrade() {
    if (!user.tradeEnabled) {
      setToastType("error");
      setToastMessage("Trading is disabled for your account");
      setOpenToast(true);
      return;
    }
    setIsSubmittingTrade(true);

    // console.log(user);

    const { id } = user;

    if (action === "Sell") {
      decrementCrypto(id);
    } else {
      decrementFiat(id);
    }
  }

  // decrement crypto
  async function decrementCrypto(user) {
    const q = doc(db, "accounts", user);
    const key = `live.Crypto.${selectedAsset.asset}.value`;

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
      type: "Crypto",
      user: id,
      alt: `${selectedAsset.asset}/USD`,
      fixed: false,
      amount: Number(amount),
      asset: selectedAsset.asset,
      direction: action,
      entry: prices[selectedAsset.asset],
      pnl: 0,
      converted: amount / prices[selectedAsset.asset],
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
      type: "Crypto",
      user: id,
      alt: `${selectedAsset.asset}/USD`,
      fixed: false,
      amount: Number(amount),
      asset: selectedAsset.asset,
      direction: action,
      entry: prices[selectedAsset.asset],
      pnl: 0,
      converted: amount / prices[selectedAsset.asset],
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
    const url = `${siteSettings.serverLink}/crypto`;

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
      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      {/* amount  & asset */}
      <AmountBox
        className={amountError ? "amount_box error" : "amount_box"}
        style={{ position: "relative" }}
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
            <div className="tooltip" id="tooltip">
              {tooltipMessage}
            </div>
          )}
        </div>

        <div className="wrapper">
          <input
            type="number"
            placeholder="1000"
            onChange={handleAmount}
            ref={amountRef}
          />

          <span
            className="asset"
            onClick={() => setShowAssetsDropdown(!showAssetsDropdown)}
          >
            <span>
              <img src={`./asseticons/${selectedAsset?.asset}.svg`} alt="" />
              <p>{selectedAsset?.asset}</p>
            </span>
            {/* <img src="./assets/icons/chevron-down.svg" alt="" /> */}
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

        <div className="captions">
          {selectedAsset && (
            <span>
              <p className="caption">Current balance</p>
              <p className="value">
                {action === "Buy"
                  ? fiat?.value + " USD"
                  : selectedAsset?.value + " " + selectedAsset?.asset}
              </p>
            </span>
          )}

          {selectedAsset && (
            <span>
              <p className="caption">Current {selectedAsset.asset} price</p>
              <p className="value" style={{ color: "#5BDE4C" }}>
                {formatter.format(prices[selectedAsset?.asset])}
              </p>
            </span>
          )}

          {amount && selectedAsset && (
            <span>
              <p className="caption">Total in USD</p>
              <p className="value" style={{ color: "#5BDE4C" }}>
                {action === "Buy"
                  ? formatter.format(amount)
                  : formatter.format(prices[selectedAsset?.asset] * amount)}
              </p>
            </span>
          )}
        </div>

        {showAssetsDropdown && (
          <ClickAwayListener
            onClickAway={() => setShowAssetsDropdown(!showAssetsDropdown)}
          >
            <TradeDropDown>
              <div className="dropdown_top">
                <p>Select an asset</p>
                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => setShowAssetsDropdown(!showAssetsDropdown)}
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.8647 0.366365C12.3532 -0.122122 13.1451 -0.122122 13.6336 0.366365C14.1221 0.854853 14.1221 1.64685 13.6336 2.13533L8.88929 6.87968L13.8743 11.8647C14.3628 12.3532 14.3628 13.1451 13.8743 13.6336C13.3858 14.1221 12.5938 14.1221 12.1053 13.6336L7.12032 8.64864L2.13533 13.6336C1.64685 14.1221 0.854853 14.1221 0.366366 13.6336C-0.122122 13.1451 -0.122122 12.3532 0.366366 11.8647L5.35136 6.87968L0.607014 2.13533C0.118527 1.64685 0.118527 0.854853 0.607014 0.366365C1.0955 -0.122122 1.8875 -0.122122 2.37598 0.366365L7.12032 5.11071L11.8647 0.366365Z"
                    fill="#858DAD"
                  />
                </svg>
              </div>

              <div className="container">
                <div className="search">
                  <input
                    type="text"
                    placeholder="Search for assets.."
                    ref={searchRef}
                    onChange={handleCurrencySearch}
                  />
                </div>
              </div>

              <div className="scrollable style-4">
                {Object.values(allAccounts).map(
                  (currency) =>
                    currency.value > 0 && (
                      <div
                        className="asset_box"
                        onClick={() => handleAssetSelect(currency)}
                      >
                        <span className="asset_box_left">
                          <img
                            src={`./asseticons/${currency.asset}.svg`}
                            alt=""
                          />
                          <span>
                            <p>{currency.name} </p>
                          </span>
                        </span>

                        <span className="asset_box_right">
                          <p>
                            {formatterZero.format(
                              currency.value * prices[currency.asset]
                            )}
                          </p>
                          <p>
                            {toFixedIfNecessary(currency.value, 5)}{" "}
                            {currency.asset}
                          </p>
                        </span>
                      </div>
                    )
                )}

                {Object.values(allAccounts).map(
                  (currency) =>
                    currency.value <= 0 && (
                      <div
                        className="asset_box"
                        onClick={() => handleAssetSelect(currency)}
                      >
                        <span className="asset_box_left">
                          <img
                            src={`./asseticons/${currency.asset}.svg`}
                            alt=""
                          />
                          <span>
                            <p>{currency.name} </p>
                          </span>
                        </span>

                        <span className="asset_box_right">
                          <p>
                            {formatter.format(
                              currency.value * prices[currency.asset]
                            )}
                          </p>
                          <p>
                            {currency.value} {currency.asset}
                          </p>
                        </span>
                      </div>
                    )
                )}
              </div>
            </TradeDropDown>
          </ClickAwayListener>
        )}
      </AmountBox>

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
        onClick={submitCryptoTrade}
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

export default Crypto;
