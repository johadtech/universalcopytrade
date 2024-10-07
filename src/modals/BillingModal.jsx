import { useState } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import { FullButton, MiniAmountBoxFull, TextBox } from "../styled/input/Input";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
import BillingItem from "../components/BillingItem";
import emailjs from "@emailjs/browser";
import { siteSettings } from "../static";
import { LargeDivider } from "../styled/forms/dividers";
import CircularLoader from "../styled/loaders/CircularLoader";
import Toast from "../hooks/Toast";

const BillingModal = ({ open, user }) => {
  const { billing, setBilling } = open;
  const { userDetails, setUserDetails } = user;

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const [selectedBilling, setSelectedBilling] = useState(undefined);
  const [highLightedBilling, setHighLightedBilling] = useState(undefined);

  // Insurance
  const [currentBalance, setCurrentBalance] = useState(undefined);
  function handleBalance(e) {
    const value = e.target.value;

    if (value) {
      setCurrentBalance(value);
    } else {
      setCurrentBalance("");
    }
  }

  const [amount, setAmount] = useState(undefined);
  function handleAmount(e) {
    const value = e.target.value;

    if (value) {
      setAmount(value);
    } else {
      setAmount("");
    }
  }

  const [networkFee, setNetworkFee] = useState(undefined);
  function handleNetwork(e) {
    const value = e.target.value;

    if (value) {
      setNetworkFee(value);
    } else {
      setNetworkFee("");
    }
  }

  const [imfWithdrawal, setImfWithdrawal] = useState(undefined);
  function handleImfWithdrawal(e) {
    const value = e.target.value;

    if (value) {
      setImfWithdrawal(value);
    } else {
      setImfWithdrawal("");
    }
  }

  const [signalName, setSignalName] = useState(undefined);
  function handleSignalName(e) {
    const value = e.target.value;

    if (value) {
      setSignalName(value);
    } else {
      setSignalName("");
    }
  }

  const [signalPrice, setSignalPrice] = useState("");
  function handleSignalPrice(e) {
    const value = e.target.value;

    if (value) {
      setSignalPrice(value);
    } else {
      setSignalPrice("");
    }
  }

  const [signalProfits, setSignalProfits] = useState("");
  function handleSignalProfits(e) {
    const value = e.target.value;

    if (value) {
      setSignalProfits(value);
    } else {
      setSignalProfits("");
    }
  }

  const [total, setTotal] = useState("");
  function handleTotal(e) {
    const value = e.target.value;

    if (value) {
      setTotal(value);
    } else {
      setTotal("");
    }
  }

  const [amountDue, setAmountDue] = useState("");
  function handleAmountDue(e) {
    const value = e.target.value;

    if (value) {
      setAmountDue(value);
    } else {
      setAmountDue("");
    }
  }

  const [modeOfWithdrawal, setModeOfWithdrawal] = useState("");
  function handleMode(e) {
    const value = e.target.value;

    if (value) {
      setModeOfWithdrawal(value);
    } else {
      setModeOfWithdrawal("");
    }
  }

  const [percent, setPercent] = useState(undefined);
  function handlePercent(e) {
    const { value } = e.target;

    if (value) {
      setPercent(value);
    } else {
      setPercent("");
    }
  }

  const [certificateCost, setCertificateCost] = useState("");
  function handleCost(e) {
    const value = e.target.value;

    if (value) {
      setCertificateCost(value);
    } else {
      setCertificateCost("");
    }
  }

  const [upgradeAmount, setUpgradeAmount] = useState("");
  function handleUpgradeAmount(e) {
    const value = e.target.value;

    if (value) {
      setUpgradeAmount(value);
    } else {
      setUpgradeAmount("");
    }
  }

  const availableBillings = [
    {
      name: "Insurance",
      link: "./billings/Insurance.png",
    },
    {
      name: "Ofac",
      link: "./billings/Ofac.png",
    },
    {
      name: "Staking",
      link: "./billings/Staking.png",
    },
    {
      name: "Signals",
      link: "./billings/Signals.png",
    },
    {
      name: "Notice of Transfer",
      link: "./billings/Imf.png",
    },
    {
      name: "Upgrade",
      link: "./billings/Upgrade.png",
    },
    {
      name: "Network Fee",
      link: "./billings/Network.png",
    },
    {
      name: "IRS Tax",
      link: "./billings/IrsTax.png",
    },
    {
      name: "IRS Fee",
      link: "./billings/IrsFee.png",
    },
    {
      name: "Tax Maintenance",
      link: "./billings/TaxMaintenance.png",
    },
    {
      name: "Account Limit",
      link: "./billings/AccountLimit.png",
    },
    {
      name: "Account Linking",
      link: "./billings/AccountLinking.png",
    },
    {
      name: "Withdrawal Charges",
      link: "./billings/WithdrawalCharges.png",
    },

    {
      name: "Upgrade (Trade complete)",
      link: "./billings/UpgradeComplete.png",
    },
    {
      name: "Upgrade (Trade incomplete)",
      link: "./billings/UpgradeIncomplete.png",
    },
  ];

  function handleSelectBilling() {
    setSelectedBilling(highLightedBilling);
  }

  // checked
  // insurance
  // ofac

  const [isSending, setIsSending] = useState(false);
  async function sendBilling() {
    setIsSending(true);
    let base;
    switch (selectedBilling) {
      case "Insurance":
        base = `method: "Insurance",
            userName: ${userDetails.firstname},
            userEmail: ${userDetails.email},
            currentBalance: ${currentBalance},
            percent: ${percent}
            `;
        break;
      case "Ofac":
        base = `
          method: "Ofac",
          userName: ${userDetails.firstname},
          userEmail: ${userDetails.email},
          withdrawalAmount: ${amount},
          certificateCost: ${certificateCost},
          modeOfWithdrawal: ${modeOfWithdrawal},
          `;
        break;
      case "Staking":
        base = `
         method: "Staking",
        userName: ${userDetails.firstname},
         userEmail: ${userDetails.email},
         total: ${total},
         amountDue: ${amountDue},
        `;
        break;
      case "Signals":
        base = `
           method: "Signals",
          userName: ${userDetails.firstname},
           userEmail: ${userDetails.email},
           signalName: ${signalName},
           signalPrice: ${signalPrice},
           signalProfits: ${signalProfits},
          `;
        break;
      case "Notice of Transfer":
        base = `
         method: "Notice of Transfer",
        userName: ${userDetails.firstname},
         userEmail: ${userDetails.email},
         withdrawalAmount: ${amount},
         percent: ${percent},
        `;
        break;
      case "Upgrade":
        base = `
       method: "Upgrade",
      userName: ${userDetails.firstname},
       userEmail: ${userDetails.email},
       upgradeCost: ${upgradeAmount},
      `;
        break;
      case "Network Fee":
        base = `
     method: "Network Fee",
    userName: ${userDetails.firstname},
     userEmail: ${userDetails.email},
     withdrawalAmount: ${amount},
     feeAmount: ${networkFee},
    `;
        break;
      case "IRS Tax":
        base = `
       method: "IRS Tax",
      userName: ${userDetails.firstname},
       userEmail: ${userDetails.email},
       withdrawalAmount: ${amount},
       percent: ${percent},
      `;
        break;
      case "IRS Fee":
        base = `
         method: "IRS Fee",
        userName: ${userDetails.firstname},
         userEmail: ${userDetails.email},
         feeAmount: ${amount},
        `;
        break;
      case "Tax Maintenance":
        base = `
           method: "Tax Maintenance",
          userName: ${userDetails.firstname},
           userEmail: ${userDetails.email},
           taxAmount: ${amount},
          `;
        break;
      case "Account Limit":
        base = `
             method: "Account Limit",
            userName: ${userDetails.firstname},
             userEmail: ${userDetails.email},
             upgradeCost: ${amount},
            `;
        break;
      case "Account Linking":
        base = `
               method: "Account Linking",
              userName: ${userDetails.firstname},
               userEmail: ${userDetails.email},
               feeAmount: ${amount},
              `;
        break;
      case "Withdrawal Charges":
        base = `
                 method: "Withdrawal Charges",
                userName: ${userDetails.firstname},
                 userEmail: ${userDetails.email},
                 modeOfWithdrawal: ${modeOfWithdrawal},
                 withdrawalAmount: ${amount},
                 chargeAmount: ${certificateCost}
                `;
        break;
      case "Upgrade (Trade complete)":
        base = `
                   method: "Upgrade (Trade complete)",
                  userName: ${userDetails.firstname},
                   userEmail: ${userDetails.email},
                    upgradeCost: ${upgradeAmount}
                  `;
        break;
      case "Upgrade (Trade incomplete)":
        base = `
                     method: "Upgrade (Trade incomplete)",
                    userName: ${userDetails.firstname},
                     userEmail: ${userDetails.email},
                      upgradeCost: ${upgradeAmount}
                    `;
        break;
      default:
        break;
    }

    const params = {
      details: `New ${selectedBilling} billing on ${siteSettings.name} with details: ${base}`,
      action_name: "Billing",
      to_email: "themaarv@gmail.com",
      from_name: "Billing",
      logo_link: `${siteSettings.ogLink}/logo.png`,
      to_name: "BIG 20",
      broker_to_link: `${siteSettings.link}`,
      broker_name: `${siteSettings.name}`,
    };

    emailjs
      .send("service_x4dbltd", "template_kkyhhxq", params, "9IOr2_lHheTH7RW1k")
      .then(() => {
        // console.log("sent");
        setIsSending(false);
        setToastType("success");
        setToastMessage("Billing sent successfully");
        setOpenToast(true);
        setTimeout(() => {
          setBilling(false);
        }, 500);
        // toast.success("Billing Sent Successfully.");
        // setIsSending(false);
      })
      .catch((error) => {
        // console.log("error", error);
        setIsSending(false);
        setToastType("error");
        setToastMessage("Failed to send. Please try again later");
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

      <Modal
        open={billing}
        onClose={() => setBilling(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
          padding: "12px",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Send {selectedBilling && selectedBilling} billing</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setBilling(!billing)}
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

          {!selectedBilling && (
            <div className="modal_content">
              <SliderStandard className="slider scrollbar-hide">
                {availableBillings.map((billing) => (
                  <BillingItem
                    selected={{ highLightedBilling, setHighLightedBilling }}
                    name={billing.name}
                    key={billing.name}
                    link={billing.link}
                  />
                ))}
              </SliderStandard>

              <div className="bottom">
                {highLightedBilling ? (
                  <FullButton onClick={handleSelectBilling}>
                    {" "}
                    <p>Select {highLightedBilling}</p>{" "}
                  </FullButton>
                ) : (
                  <FullButton className="disabled">
                    <p>Select</p>
                  </FullButton>
                )}
              </div>
            </div>
          )}

          {selectedBilling && (
            <div className="modal_content">
              <div className="top">
                <span
                  className="go_back"
                  onClick={() => setSelectedBilling(undefined)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>

                  <p>Back to billings</p>
                </span>

                {/* name */}
                <TextBox className="scrollbar-hide">
                  <label htmlFor="address">User:</label>
                  <br />
                  <input
                    type="text"
                    placeholder={
                      userDetails?.firstname + " " + userDetails?.lastname
                    }
                    value={userDetails?.firstname + " " + userDetails?.lastname}
                    defaultValue={
                      userDetails?.firstname + " " + userDetails?.lastname
                    }
                    disabled
                  />
                </TextBox>

                {/* email */}
                <TextBox className="scrollbar-hide">
                  <label htmlFor="address">User email:</label>
                  <br />
                  <input
                    type="text"
                    placeholder={userDetails?.email}
                    value={userDetails?.email}
                    defaultValue={userDetails?.email}
                    disabled
                  />
                </TextBox>
              </div>

              {/* Insurance */}
              {selectedBilling === "Insurance" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Current balance: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="1000"
                        onChange={handleBalance}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Percent: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="15"
                        onChange={handlePercent}
                      />

                      <span className="asset">
                        <p>%</p>
                      </span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={isSending || !currentBalance || !percent}
                      className={
                        (isSending || !currentBalance || !percent) && "disabled"
                      }
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* Ofac */}
              {selectedBilling === "Ofac" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Withdrawal Amount: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="1000"
                        onChange={handleAmount}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <TextBox className="scrollbar-hide">
                    <label htmlFor="address">Mode of withdrawal:</label>
                    <br />
                    <input
                      type="text"
                      placeholder="BTC"
                      onChange={handleMode}
                    />
                  </TextBox>

                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Certificate cost: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="500"
                        onChange={handleCost}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={
                        isSending ||
                        !amount ||
                        !certificateCost ||
                        !modeOfWithdrawal
                      }
                      className={
                        (isSending ||
                          !amount ||
                          !certificateCost ||
                          !modeOfWithdrawal) &&
                        "disabled"
                      }
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* Staking */}
              {selectedBilling === "Staking" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Total: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="1000"
                        onChange={handleTotal}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Amount due: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="500"
                        onChange={handleAmountDue}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={isSending || !total || !amountDue}
                      className={
                        (isSending || !total || !amountDue) && "disabled"
                      }
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* Signals */}
              {selectedBilling === "Signals" && (
                <LargeDivider>
                  <TextBox className="scrollbar-hide">
                    <label htmlFor="address">Signal name:</label>
                    <br />
                    <input
                      type="text"
                      placeholder="XPN-4N"
                      onChange={handleSignalName}
                    />
                  </TextBox>

                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Signal price: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="3500"
                        onChange={handleSignalPrice}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Signal profits: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="1000"
                        onChange={handleSignalProfits}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={
                        isSending ||
                        !signalName ||
                        !signalPrice ||
                        !signalProfits
                      }
                      className={
                        (isSending ||
                          !signalName ||
                          !signalPrice ||
                          !signalProfits) &&
                        "disabled"
                      }
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* Notice of Transfer */}
              {selectedBilling === "Notice of Transfer" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Withdrawal amount: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="3500"
                        onChange={handleAmount}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Percent: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="30"
                        onChange={handlePercent}
                      />

                      <span className="asset">
                        <p>%</p>
                      </span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={isSending || !amount || !percent}
                      className={
                        (isSending || !amount || !percent) && "disabled"
                      }
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* Upgrade */}
              {selectedBilling === "Upgrade" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Upgrade cost: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="3500"
                        onChange={handleUpgradeAmount}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={isSending || !upgradeAmount}
                      className={(isSending || !upgradeAmount) && "disabled"}
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* Network Fee */}
              {selectedBilling === "Network Fee" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Withdrawal amount: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="3500"
                        onChange={handleAmount}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Fee amount: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="1000"
                        onChange={handleNetwork}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={isSending || !amount || !networkFee}
                      className={
                        (isSending || !amount || !networkFee) && "disabled"
                      }
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* IRS Tax */}
              {selectedBilling === "IRS Tax" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Withdrawal amount: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="3500"
                        onChange={handleAmount}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Percent: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="30"
                        onChange={handlePercent}
                      />

                      <span className="asset">
                        <p>%</p>
                      </span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={isSending || !amount || !percent}
                      className={
                        (isSending || !amount || !percent) && "disabled"
                      }
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* IRS Fee */}
              {selectedBilling === "IRS Fee" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Fee amount: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="3500"
                        onChange={handleAmount}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={isSending || !amount}
                      className={(isSending || !amount) && "disabled"}
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* Tax Maintenance */}
              {selectedBilling === "Tax Maintenance" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Tax amount: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="3500"
                        onChange={handleAmount}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={isSending || !amount}
                      className={(isSending || !amount) && "disabled"}
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* Account Limit */}
              {selectedBilling === "Account Limit" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Upgrade cost: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="1200"
                        onChange={handleAmount}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={isSending || !amount}
                      className={(isSending || !amount) && "disabled"}
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* Account Linking */}
              {selectedBilling === "Account Linking" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Fee amount: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="400"
                        onChange={handleAmount}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={isSending || !amount}
                      className={(isSending || !amount) && "disabled"}
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* Withdrawal Charges */}
              {selectedBilling === "Withdrawal Charges" && (
                <LargeDivider>
                  <TextBox className="scrollbar-hide">
                    <label htmlFor="address">Mode of withdrawal:</label>
                    <br />
                    <input
                      type="text"
                      placeholder="BTC"
                      onChange={handleMode}
                    />
                  </TextBox>

                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Withdrawal Amount: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="1000"
                        onChange={handleAmount}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Charge amount: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="500"
                        onChange={handleCost}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={
                        isSending ||
                        !amount ||
                        !certificateCost ||
                        !modeOfWithdrawal
                      }
                      className={
                        (isSending ||
                          !amount ||
                          !certificateCost ||
                          !modeOfWithdrawal) &&
                        "disabled"
                      }
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* Upgrade (Trade complete) */}
              {selectedBilling === "Upgrade (Trade complete)" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Upgrade cost: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="3500"
                        onChange={handleUpgradeAmount}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={isSending || !upgradeAmount}
                      className={(isSending || !upgradeAmount) && "disabled"}
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}

              {/* Upgrade (Trade complete) */}
              {selectedBilling === "Upgrade (Trade incomplete)" && (
                <LargeDivider>
                  <MiniAmountBoxFull className={"amount_box variant"}>
                    <div className="label">
                      <p>Upgrade cost: </p>
                    </div>

                    <div className="wrapper">
                      <input
                        type="number"
                        placeholder="3500"
                        onChange={handleUpgradeAmount}
                      />

                      <span style={{ padding: "22px" }}></span>
                    </div>
                  </MiniAmountBoxFull>

                  <div className="bottom">
                    <FullButton
                      onClick={sendBilling}
                      disabled={isSending || !upgradeAmount}
                      className={(isSending || !upgradeAmount) && "disabled"}
                    >
                      {isSending ? (
                        <div style={{ padding: "8px" }}>
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        </div>
                      ) : (
                        <p>Send</p>
                      )}
                    </FullButton>
                  </div>
                </LargeDivider>
              )}
            </div>
          )}
        </ModalStandard>
      </Modal>
    </>
  );
};

const SliderStandard = styled.div`
  display: flex;
  list-style: none;
  height: 250px;
  overflow-x: scroll;
  padding: 32px 24px;
  flex: 0 0 600px;
  margin: 0 auto;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    height: 5px;
    width: 5px;
    background: #fff3;
    -webkit-border-radius: 1ex;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--accent);
    -webkit-border-radius: 1ex;
  }

  ::-webkit-scrollbar-corner {
    background: #fff3;
  }

  div {
    flex: 0 0 100px;
    background: var(--accent);
    margin: 0 20px 0 0;
  }

  div:last-of-type {
    margin: 0;
  }

  .slide {
    position: relative;
    white-space: nowrap;
    /* margin-left: 24px; */
    cursor: pointer;
  }

  .slide img {
    border-radius: 12px;
    /* border: 1px solid red; */
    padding: 4px;
    border: 1px solid transparent;
    transition: border-color 0.3s ease-in-out;
  }

  .slide img.selected {
    border: 1px solid red;
    /* border-radius: 12px; */
    /* padding: 4px; */
  }
`;

const ModalStandard = styled.div`
  background-color: #151823;
  border-radius: 12px;
  max-width: 430px;
  place-self: center;
  width: 100%;
  border: 1px solid transparent;
  z-index: 10001;

  .go_back {
    display: flex;
    gap: 6px;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
    color: #fff;
    text-decoration: underline;
    /* background-color: #0a57c218; */
    max-width: max-content;
    border: 4px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }

  .go_back p {
  }

  .go_back:hover {
    color: #0c6cf2;
  }

  .go_back svg {
    width: 18px;
    height: 18px;
  }

  .bottom button {
    cursor: pointer;
    width: 100%;
    background-color: #0c6cf2;
    padding: 12px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
    margin-top: 32px;
    font-family: "Inter";
  }

  .bottom button:hover {
    background-color: #0a57c2;
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

  .slide {
    color: white;
    /* margin-left: 30px; */
  }

  .slider {
    max-width: 100%;
    overflow-x: scroll;
    display: flex;
    gap: 12px;
    overflow-y: hidden;
  }

  .slide img {
    /* margin-left: 12px; */
    aspect-ratio: 4.135/ 5.845;
    width: 100%;
  }
`;

export default BillingModal;
