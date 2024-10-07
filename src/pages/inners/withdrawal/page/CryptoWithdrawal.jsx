import { useContext, useEffect, useRef, useState } from "react";
import {
  AmountBox,
  DropDownBox,
  FilledButton,
  TextBox,
} from "../../../../styled/input/Input";
import { formatter } from "../../../../utils/utils";
import CircularLoader from "../../../../styled/loaders/CircularLoader";
import { context } from "../../../../context/context";
import { ClickAwayListener, Grow } from "@mui/material";
import { LargeDivider } from "../../../../styled/forms/dividers";
import Toast from "../../../../hooks/Toast";
import {
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import emailjs from "@emailjs/browser";
import { siteSettings } from "../../../../static";

const CryptoWithdrawal = ({ select, user, prices, accounts, settings }) => {
  const popcorn = document.querySelector("#popcorn");
  const tooltip = document.querySelector("#tooltip");
  const [tooltipMessage, setToolTipMessage] = useState("");
  const [showToolTip, setShowToolTip] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cryptoAccount, setCryptoAccount] = useState({});
  const { selectedMethod, setSelectedMethod } = useState({});
  const availableMethods = ["Bitcoin", "Ethereum", "USD Coin", "Tether"];
  const [selectedAsset, setSelectedAsset] = useState("Bitcoin");
  const [address, setAddress] = useState(undefined);

  const { id } = user;

  useEffect(() => {
    if (prices && accounts && settings) {
      const live = accounts.live;
      if (live) {
        setCryptoAccount(live.Crypto);
        Object.values(live.Crypto).forEach((account) => {
          if (account.name === "Bitcoin") {
            setSelectedAsset(account);
          }
        });
        setIsLoading(false);
      }
    }
  }, [prices, accounts, settings]);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  function handleselectAsset(e) {
    const { value } = e.target;

    resetCrypto();

    Object.values(cryptoAccount).forEach((account) => {
      if (account.name === value) {
        setSelectedAsset(account);
      }
    });
  }

  const cryptoAmountRef = useRef();
  function handleAmount(e) {
    const { value } = e.target;

    if (value) {
      setAmount(value);

      if (value > selectedAsset.value) {
        setAmount(value);
        setAmountError(true);
        setToolTipMessage(
          `Your current balance is ${selectedAsset?.value} ${selectedAsset.asset} but you are attempting to withdraw ${e.target.value} ${selectedAsset.asset}, which is over your available balance`
        );
      } else {
        setAmountError(false);
      }
    } else {
      setAmount("");
    }
  }

  function resetCrypto() {
    if (amount) {
      setAmount("");
    }

    if (cryptoAmountRef) {
      cryptoAmountRef.current.value = "";
    }

    if (cryptoAddressRef) {
      cryptoAddressRef.current.value = "";
    }

    setAddress(undefined);
    setAmountError(false);
    setShowToolTip(false);
  }

  const cryptoAddressRef = useRef();
  function handleAddress(e) {
    const { value } = e.target;

    if (value) {
      setAddress(value);
    } else {
      setAddress("");
    }
  }

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  function handleWithdrawal() {
    setIsWithdrawing(true);

    const progress = user.tradingProgress;

    // if (Number(progress) === 100) {
    decrementCrypto();
    // } else {
    //   setIsWithdrawing(false);
    //   setToastType("error");
    //   setToastMessage("Complete your trading progress");
    //   setOpenToast(true);
    // }
  }

  // decrementCrypto
  // submit withdrawal
  // admin notification
  // admin email

  // decrement crypto
  async function decrementCrypto() {
    const { asset } = selectedAsset;
    // `${currentAccount}.Crypto.${asset}.value`;
    const q = doc(db, "accounts", id);
    const key = `live.Crypto.${asset}.value`;

    try {
      await updateDoc(q, {
        [key]: increment(-Number(amount)),
      }).then(() => {
        submitWithdrawal();
      });
    } catch (error) {
      setIsWithdrawing(false);
      setToastType("error");
      setToastMessage("Withdrawal failed. Please try again later.");
      setOpenToast(true);
    }
  }

  // ref userRef user type?Crypto amount asset date totalInUSD status details
  async function submitWithdrawal() {
    const { asset } = selectedAsset;

    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "withdrawals", str), {
      ref: str,
      user: id,
      type: "Crypto",
      amount: Number(amount),
      asset,
      date: serverTimestamp(),
      totalInUSD: prices[asset] * Number(amount),
      status: "pending",
      details: address,
      userRef: {
        name: user.firstname + " " + user.lastname,
        photo: user.photoURL ? user.photoURL : null,
        admin: user.admin,
        email: user.email,
      },
    })
      .then(() => {
        sendAdminNotification(str);
        sendAdminEmail();
      })
      .catch((error) => {
        setIsWithdrawing(false);
        setToastType("error");
        setToastMessage("Withdrawal failed. Please try again later.");
        setOpenToast(true);
      });
  }

  async function sendAdminEmail() {
    const params = {
      to_name: "Admin",
      details: `A new withdrawal request was submitted on your platform.`,
      action_name: "Withdrawal",
      logo_link: `${siteSettings.ogLink}/logo.png`,
      to_login: `${siteSettings.link}`,
      from_name: `${siteSettings.name}`,
      to_email: `${siteSettings.supportEmail}`,
    };

    emailjs
      .send("service_1nttr5h", "template_fwhr0oo", params, "9IOr2_lHheTH7RW1k")
      .then(() => {})
      .catch((error) => {});
  }

  // admin notified
  async function sendAdminNotification(ref) {
    const { asset } = selectedAsset;

    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "adminNotifications", str), {
      ref: str,
      type: "Withdrawal",
      message: "Made a withdrawal of " + amount + " " + asset,
      user: id,
      read: false,
      date: serverTimestamp(),
      userRef: {
        name: user.firstname + " " + user.lastname,
        photo: user.photoURL ? user.photoURL : null,
        email: user.email,
      },
      withdrawalRef: {
        ref,
      },
    })
      .then(() => {
        setIsWithdrawing(false);
        setToastType("success");
        setToastMessage("Withdrawal request successful");
        setOpenToast(true);
        setTimeout(() => {
          resetCrypto();
        }, 400);
      })
      .catch((error) => {
        setIsWithdrawing(false);
        setToastType("error");
        setToastMessage("Withdrawal failed. Please try again later.");
        setOpenToast(true);
      });
  }

  return (
    <>
      {isLoading ? (
        <CircularLoader
          bg="rgba(12, 108, 243, 0.2)"
          size="28"
          color="#0C6CF2"
        />
      ) : (
        <>
          {openToast && (
            <Toast
              open={{ openToast, setOpenToast }}
              message={toastMessage}
              type={toastType}
            />
          )}

          <LargeDivider>
            <DropDownBox className="type_select">
              <div className="wrapper">
                <p className="label">Asset:</p>
                <span className="content">
                  <select name="options" onChange={(e) => handleselectAsset(e)}>
                    {availableMethods.map((method) => (
                      <option value={method}>{method}</option>
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
                  <ClickAwayListener onClickAway={() => setShowToolTip(false)}>
                    <Grow
                      in={showToolTip}
                      style={{ transformOrigin: "0 0 0 0" }}
                      {...(showToolTip ? { timeout: 300 } : {})}
                    >
                      <div className="tooltip" id="tooltip">
                        {tooltipMessage}
                      </div>
                    </Grow>
                  </ClickAwayListener>
                )}
              </div>

              <div className="wrapper">
                <input
                  type="number"
                  placeholder="1000"
                  onChange={handleAmount}
                  ref={cryptoAmountRef}
                />

                <span className="asset">
                  <span>
                    <img
                      src={`./asseticons/${selectedAsset.asset}.svg`}
                      alt=""
                    />
                    <p>{selectedAsset.asset}</p>
                  </span>
                </span>
              </div>

              <div className="captions">
                {selectedAsset && (
                  <span>
                    <p className="caption">Current balance</p>
                    <p className="value">
                      {cryptoAccount[selectedAsset.asset]?.value}{" "}
                      {selectedAsset.asset}{" "}
                    </p>
                  </span>
                )}

                {selectedAsset && amount && (
                  <span>
                    <p className="caption">Total in USD</p>
                    <p className="value" style={{ color: "#5BDE4C" }}>
                      {formatter.format(prices[selectedAsset.asset] * amount)}
                    </p>
                  </span>
                )}
              </div>
            </AmountBox>

            <TextBox className="scrollbar-hide" style={{ marginTop: "24px" }}>
              <label htmlFor="address">Address:</label>
              <br />
              <input
                type="text"
                ref={cryptoAddressRef}
                placeholder={`Your ${selectedAsset.asset} address`}
                onChange={handleAddress}
              />
            </TextBox>

            <FilledButton
              style={{ marginTop: "24px" }}
              className={
                !amount ||
                !address ||
                !selectedAsset ||
                amountError ||
                isWithdrawing
                  ? "disabled"
                  : ""
              }
              disabled={
                !amount ||
                !address ||
                !selectedAsset ||
                amountError ||
                isWithdrawing
              }
              onClick={handleWithdrawal}
            >
              {isWithdrawing ? (
                <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
              ) : (
                <p>Withdraw</p>
              )}
            </FilledButton>
          </LargeDivider>
        </>
      )}
    </>
  );
};

export default CryptoWithdrawal;
