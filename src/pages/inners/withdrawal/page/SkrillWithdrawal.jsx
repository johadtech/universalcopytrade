import { useEffect, useRef, useState } from "react";
import {
  AmountBox,
  DropDownBox,
  FilledButton,
  TextBox,
} from "../../../../styled/input/Input";
import { LargeDivider } from "../../../../styled/forms/dividers";
import CircularLoader from "../../../../styled/loaders/CircularLoader";
import { ClickAwayListener, Grow } from "@mui/material";
import { formatter, formatterZero } from "../../../../utils/utils";
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

const SkrillWithdrawal = ({ select, user, prices, accounts, settings }) => {
  const [tooltipMessage, setToolTipMessage] = useState("");
  const [showToolTip, setShowToolTip] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fiatAccount, setFiatAccount] = useState({});
  const [selectedAsset, setSelectedAsset] = useState({});
  const { id } = user;
  const [address, setAddress] = useState(undefined);

  useEffect(() => {
    if (prices && accounts && settings) {
      const live = accounts.live;
      if (live) {
        setFiatAccount(live.Fiat);
        setSelectedAsset(live.Fiat);
        setIsLoading(false);
      }
    }
  }, [prices, accounts, settings]);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const amountRef = useRef();
  function handleAmount(e) {
    const { value } = e.target;

    if (value) {
      setAmount(value);

      if (value > selectedAsset.value) {
        setAmount(value);
        setAmountError(true);
        setToolTipMessage(
          `Your current balance is ${formatterZero.format(
            selectedAsset.value
          )} but you are attempting to withdraw ${formatterZero.format(
            e.target.value
          )}, which is over your available balance`
        );
      } else {
        setAmountError(false);
      }
    } else {
      setAmount("");
    }
  }

  const addressRef = useRef();
  function handleAddress(e) {
    const { value } = e.target;

    if (value) {
      setAddress(value);
    } else {
      setAddress("");
    }
  }

  function reset() {
    if (amountRef) {
      amountRef.current.value = "";
    }

    if (addressRef) {
      addressRef.current.value = "";
    }

    setAmount(undefined);
    setAddress(undefined);
  }

  //   const ["Bank Name", "Account Name", "Account Number", "Routing", "IBAN", "Swift code"]

  // withdraw
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  function handleWithdrawal() {
    setIsWithdrawing(true);
    const progress = user.tradingProgress;

    // if (Number(progress) === 100) {
    decrementFiat();
    // } else {
    // setIsWithdrawing(false);
    // setToastType("error");
    // setToastMessage("Complete your trading progress");
    // setOpenToast(true);
    // }
    // console.log(amount, paymentDetails);
  }

  // decrement fiat
  async function decrementFiat() {
    const q = doc(db, "accounts", id);
    const key = `live.Fiat.value`;

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
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "withdrawals", str), {
      ref: str,
      user: id,
      type: "Skrill",
      amount: Number(amount),
      asset: "USD",
      date: serverTimestamp(),
      totalInUSD: Number(amount),
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
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "adminNotifications", str), {
      ref: str,
      type: "Withdrawal",
      message: "Made a withdrawal of " + amount + " USD",
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
          reset();
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
                  ref={amountRef}
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
                      {selectedAsset?.value} {selectedAsset?.asset}{" "}
                    </p>
                  </span>
                )}

                {selectedAsset && amount && (
                  <span>
                    <p className="caption">Total in USD</p>
                    <p className="value" style={{ color: "#5BDE4C" }}>
                      {formatter.format(prices[selectedAsset?.asset] * amount)}
                    </p>
                  </span>
                )}
              </div>
            </AmountBox>

            <TextBox className="scrollbar-hide">
              <label htmlFor="address">Skrill address:</label>
              <br />
              <input
                type="text"
                ref={addressRef}
                placeholder={`Your Skrill Address`}
                onChange={handleAddress}
              />
            </TextBox>

            <FilledButton
              //   style={{ marginTop: "24px" }}
              className={!amount || !address || isWithdrawing ? "disabled" : ""}
              disabled={!amount || !address || isWithdrawing}
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

export default SkrillWithdrawal;
