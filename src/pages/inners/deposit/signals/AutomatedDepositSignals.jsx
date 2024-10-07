import { styled } from "styled-components";
import {
  AmountBox,
  DropDownBoxWithIcon,
  FilledButton,
} from "../../../../styled/input/Input";
import { useEffect, useRef, useState } from "react";
import { coinbaseMethods, siteSettings } from "../../../../static";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { LargeDivider } from "../../../../styled/forms/dividers";
import { formatter } from "../../../../utils/utils";
import CircularLoader from "../../../../styled/loaders/CircularLoader";
import Toast from "../../../../hooks/Toast";
import emailjs from "@emailjs/browser";

const AutomatedDepositSignals = ({ api, user, prices, accounts }) => {
  const [cryptoAccount, setCryptoAccount] = useState({});
  const [tooltipMessage, setToolTipMessage] = useState("");
  const [showToolTip, setShowToolTip] = useState(false);
  const { id } = user;

  useEffect(() => {
    const live = accounts?.live;
    const { Crypto } = live;
    setCryptoAccount(Crypto);
  }, []);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  //   const [asset, setAsset] = useState(undefined);

  // amount
  const amountRef = useRef();
  const [amount, setAmount] = useState(undefined);
  const [amountError, setAmountError] = useState(false);
  function handleAmount(e) {
    const value = e.target.value;

    if (value > 0) {
      setAmount(value);
    } else {
      setAmount("");
    }
  }

  // method
  const [selectedMethod, setSelectedMethod] = useState("BTC");

  function reset() {
    if (amountRef) {
      amountRef.current.value = " ";
    }

    setAmount(undefined);
    setSelectedMethod("BTC");
  }

  function handleAsset(e) {
    setSelectedMethod(e.target?.value);
    // setAsset(e.target?.value);
  }

  // submit payment
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);
  function handleAutomatedPayment() {
    setIsSubmittingDeposit(true);

    submitDeposit();

    // submit proof
    // create deposit ref
    // create admin notifications
    // create admin email
  }

  // deposits
  // ref userRef amount asset total (USD) date status type?"manual or automated"

  async function submitDeposit() {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "signalDeposits", str), {
      ref: str,
      user: id,
      amount: Number(amount),
      asset: selectedMethod,
      totalInUSD: prices[selectedMethod] * Number(amount),
      date: serverTimestamp(),
      status: "pending",
      class: "Signals",
      type: "automated",
      userRef: {
        name: user.firstname + " " + user.lastname,
        photo: user.photoURL ? user.photoURL : null,
        admin: user.admin,
        email: user.email,
      },
    })
      .then(() => {
        sendAdminNotification(str);
        // toast.success("Verification request submitted");
        sendAdminEmail();
        // setIsSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        setIsSubmittingDeposit(false);
        setToastType("error");
        setToastMessage("Failed to deposit. Please try again later.");
        setOpenToast(true);
        // setToastType("error");
        // setToastMessage("Failed to deposit. Please try again later.");
        // setOpenToast(true);
      });
  }

  async function sendAdminEmail() {
    const params = {
      to_name: "Admin",
      details: `A new deposit request was submitted on your platform.`,
      action_name: "Deposit",
      logo_link: `${siteSettings.ogLink}/logo.png`,
      to_login: `${siteSettings.link}`,
      from_name: `${siteSettings.name}`,
      to_email: `${siteSettings.supportEmail}`,
    };

    emailjs
      .send("service_veufzcm", "template_fwhr0oo", params, "9IOr2_lHheTH7RW1k")
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
      type: "Deposit",
      message: "Made a deposit of " + amount + " " + selectedMethod,
      user: id,
      read: false,
      date: serverTimestamp(),
      userRef: {
        name: user.firstname + " " + user.lastname,
        photo: user.photoURL ? user.photoURL : null,
        email: user.email,
      },
      depositRef: {
        class: "Signals",
        type: "automated",
        ref,
      },
    })
      .then(() => {
        createCoinbaseCharge(ref);
      })
      .catch((error) => {
        console.log(error);
        setIsSubmittingDeposit(false);
        setToastType("error");
        setToastMessage("Failed to deposit. Please try again later.");
        setOpenToast(true);
      });
  }

  async function createCoinbaseCharge(ref) {
    // console.log("here");
    const url = "https://api.commerce.coinbase.com/charges";

    const base = {
      name: siteSettings.name,
      description: siteSettings.description,
      local_price: {
        amount: String(Number(amount)),
        currency: selectedMethod,
      },
      pricing_type: "fixed_price",
      metadata: {
        user,
        amount: String(Number(amount)),
        ref,
        asset: selectedMethod,
      },
      redirect_url: `${siteSettings.link}/deposit`,
      cancel_url: `${siteSettings.link}/deposit`,
    };

    const config = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": api,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify(base),
    };

    try {
      const response = await fetch(url, config);

      if (response) {
        const data = await response.json();
        console.log(data);
        const hosted_url = data.data.hosted_url;
        window.location.replace(hosted_url);
        setIsSubmittingDeposit(false);
        // setIsWaiting(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //admin email

  return (
    <>
      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      <DepositContainerStandard>
        <p className="instruction">
          To make a deposit, choose your preferred method, enter an amount and
          proceed to make payment.
        </p>

        <LargeDivider>
          <DropDownBoxWithIcon className="type_select">
            <div className="wrapper">
              <p className="label">Asset:</p>
              <span className="content">
                <div className="icon_wrap">
                  <img src={`./asseticons/${selectedMethod}.svg`} alt="" />
                  <select name="assets" id="" onChange={handleAsset}>
                    {coinbaseMethods.map((method) => (
                      <option key={method.symbol} value={method.symbol}>
                        {method.name}
                      </option>
                    ))}
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
                <div className="tooltip" id="tooltip">
                  {tooltipMessage}
                </div>
              )}
            </div>

            <div className="wrapper">
              <input
                type="number"
                placeholder="0.3"
                onChange={handleAmount}
                ref={amountRef}
              />

              <span className="asset">
                <span>
                  <img src={`./asseticons/${selectedMethod}.svg`} alt="" />
                  <p>{selectedMethod}</p>
                </span>
              </span>
            </div>

            <div className="captions">
              {selectedMethod && (
                <span>
                  <p className="caption">Current balance</p>
                  <p className="value">
                    {cryptoAccount[selectedMethod]?.value} {selectedMethod}{" "}
                  </p>
                </span>
              )}
              {amount && selectedMethod && (
                <span>
                  <p className="caption">Total in USD</p>
                  <p className="value" style={{ color: "#5BDE4C" }}>
                    {formatter.format(prices[selectedMethod] * amount)}
                  </p>
                </span>
              )}
            </div>
          </AmountBox>

          <FilledButton
            className={
              !amount || !selectedMethod || isSubmittingDeposit
                ? "disabled"
                : ""
            }
            disabled={!amount || !selectedMethod || isSubmittingDeposit}
            onClick={handleAutomatedPayment}
          >
            {isSubmittingDeposit ? (
              <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
            ) : (
              <p>Pay with crypto</p>
            )}
          </FilledButton>
        </LargeDivider>
      </DepositContainerStandard>
    </>
  );
};

const DepositContainerStandard = styled.div`
  display: grid;
  gap: 12px;
  /* padding: 32px 24px; */
  /* max-width: 500px; */
  /* width: 100%; */
  /* margin: auto auto; */

  @media screen and (max-width: 768px) {
    width: 100%;
  }

  .instruction {
    font-size: 16px;
    font-weight: 500;
    color: #bac2de;
    line-height: 20px;
  }

  .deposit-card {
    /* width: 100%; */
    margin: auto auto;
    background-color: #1b1f2d;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    padding: 16px 24px;
    box-sizing: border-box;
    cursor: pointer;
  }

  .deposit-card span {
    display: grid;
    grid-template-columns: 20px auto;
    gap: 8px;
    align-items: center;
  }

  .deposit-card .bottom {
    display: none;
    margin-top: 32px;
  }

  .deposit-card.active .bottom {
    display: grid;
  }

  .deposit-card img {
    width: 20px;
    height: 20px;
  }

  .bottom .qr-code {
    max-width: 200px;
    width: 100%;
    height: auto;
    place-self: center;
    margin-top: 24px;
  }

  .deposit-card {
    width: 396px;
    /* width: 100%; */
    margin: auto auto;
    background-color: #1b1f2d;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    padding: 16px 24px;
    box-sizing: border-box;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    .deposit-card {
      width: 100%;
    }
  }

  .deposit-card span {
    display: grid;
    grid-template-columns: 20px auto;
    gap: 8px;
    align-items: center;
  }

  .deposit-card .bottom {
    display: none;
    margin-top: 32px;
  }

  .deposit-card.active .bottom {
    display: grid;
  }

  .deposit-card img {
    width: 20px;
    height: 20px;
  }

  .caption {
    font-size: 14px;
    font-weight: 600;
    color: #bac2de;
    line-height: 16px;
  }

  .address-box {
    margin-top: 24px;
    position: relative;
    overflow-y: scroll;
  }

  .address-box .icons {
    /* display: flex; */
    /* gap: 8px; */
    /* align-items: center; */
    position: absolute;
    /* right: 10px; */
    /* top: 35px; */
    display: grid;
    place-content: center;
    background-color: #222739;
    border-bottom-right-radius: 12px;
    border-top-right-radius: 12px;
    z-index: 3;
    height: 49px;
    bottom: 0;
    right: 0;
    padding: 0px 12px;
    cursor: pointer;
  }

  .address-box input {
    width: 100%;
    border: none;
    margin-top: 8px;
    font-family: "Inter";
    color: white;
    font-size: 14px;
    display: flex;
    background-color: #222739;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    margin-top: 8px;
    height: fit-content;
    font-weight: 500;
    /* background-color: red; */
  }

  .address-box input::placeholder {
    color: #bac2de;
    font-size: 14px;
    font-weight: 500;
  }

  .address-box label {
    font-weight: 600;
    font-size: 14px;
    color: #bac2de;
  }

  .deposit_bottom .qr-code {
    max-width: 200px;
    width: 100%;
    height: auto;
    place-self: center;
    margin-top: 24px;
  }
`;

export default AutomatedDepositSignals;
