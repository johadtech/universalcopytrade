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

const BankWithdrawal = ({ select, user, prices, accounts, settings }) => {
  const [tooltipMessage, setToolTipMessage] = useState("");
  const [showToolTip, setShowToolTip] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fiatAccount, setFiatAccount] = useState({});
  const [selectedAsset, setSelectedAsset] = useState({});
  const { selectedWithdrawalOption, setSelectedWithdrawalOption } = select;

  const { id } = user;

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

  const bankAmountRef = useRef();
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

  // const [bankName, setBankName] = useState(undefined);
  // const [accountName, setAccountName] = useState(undefined);
  // const [accountNumber, setAccountNumber] = useState(undefined);
  // const [routingNumber, setRoutingNumber] = useState(undefined);
  // const [iban, setIban] = useState(undefined);
  // const [swiftCode, setSwiftCode] = useState(undefined);

  // function handleBankName(e) {
  //   const { value } = e.target;

  //   if (value) {
  //     setBankName(value);
  //   } else {
  //     setBankName("");
  //   }
  // }

  // function handleAccountName(e) {
  //   const { value } = e.target;

  //   if (value) {
  //     setAccountName(value);
  //   } else {
  //     setAccountName("");
  //   }
  // }

  // function handleAccountNumber(e) {
  //   const { value } = e.target;

  //   if (value) {
  //     setAccountNumber(value);
  //   } else {
  //     setAccountNumber("");
  //   }
  // }

  // function handleRoutingNumber(e) {
  //   const { value } = e.target;

  //   if (value) {
  //     setRoutingNumber(value);
  //   } else {
  //     setRoutingNumber("");
  //   }
  // }

  // function handleIban(e) {
  //   const { value } = e.target;

  //   if (value) {
  //     setIban(value);
  //   } else {
  //     setIban("");
  //   }
  // }

  // function handleSwift(e) {
  //   const { value } = e.target;

  //   if (value) {
  //     setSwiftCode(value);
  //   } else {
  //     setSwiftCode("");
  //   }
  // }

  const [paymentDetails, setPaymentDetails] = useState(undefined);

  const bankDetailsRef = useRef();
  function handleDetails(e) {
    const { value } = e.target;

    if (value) {
      setPaymentDetails(value);
    } else {
      setPaymentDetails("");
    }
  }

  function resetBank() {
    setSelectedWithdrawalOption("Bank Transfer");

    if (bankAmountRef) {
      bankAmountRef.current.value = "";
    }

    if (bankDetailsRef) {
      bankDetailsRef.current.value = "";
    }

    setAmount(undefined);
    setPaymentDetails(undefined);
  }

  //   const ["Bank Name", "Account Name", "Account Number", "Routing", "IBAN", "Swift code"]

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
      type: "Bank Transfer",
      amount: Number(amount),
      asset: "USD",
      date: serverTimestamp(),
      totalInUSD: Number(amount),
      status: "pending",
      details: paymentDetails,
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
          resetBank();
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
                  ref={bankAmountRef}
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
              <label htmlFor="address">Payment details:</label>
              <br />
              <textarea
                type="text"
                cols="30"
                rows="5"
                ref={bankDetailsRef}
                placeholder={`Your bank payment details`}
                onChange={handleDetails}
              ></textarea>
            </TextBox>

            {/* <TextBox className="scrollbar-hide">
              <label htmlFor="address">Bank name:</label>
              <br />
              <input
                type="text"
                placeholder={`Name of your bank`}
                onChange={handleBankName}
              />
            </TextBox>

            <TextBox className="scrollbar-hide">
              <label htmlFor="address">Account name:</label>
              <br />
              <input
                type="text"
                placeholder={`Your bank account name`}
                onChange={handleAccountName}
              />
            </TextBox>

            <TextBox className="scrollbar-hide">
              <label htmlFor="address">Account number:</label>
              <br />
              <input
                type="number"
                placeholder={`Your bank account number`}
                onChange={handleAccountNumber}
              />
            </TextBox>

            <TextBox className="scrollbar-hide">
              <label htmlFor="address">Routing number:</label>
              <br />
              <input
                type="number"
                placeholder={`Routing number`}
                onChange={handleRoutingNumber}
              />
            </TextBox>

            <TextBox className="scrollbar-hide">
              <label htmlFor="address">IBAN:</label>
              <br />
              <input type="text" placeholder={`IBAN`} onChange={handleIban} />
            </TextBox>

            <TextBox className="scrollbar-hide">
              <label htmlFor="address">Swift code:</label>
              <br />
              <input
                type="text"
                placeholder={`Swift code`}
                onChange={handleSwift}
              />
            </TextBox> */}

            <FilledButton
              //   style={{ marginTop: "24px" }}
              className={
                !amount || !paymentDetails || isWithdrawing ? "disabled" : ""
              }
              disabled={!amount || !paymentDetails || isWithdrawing}
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

export default BankWithdrawal;
