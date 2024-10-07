import { styled } from "styled-components";
import { SettingsFormStandard } from "../../../styled/forms/SettingsFormStandard";
import {
  DropDownIconOutlined,
  FormButton,
  OutlinedIconBoxWithButton,
} from "../../../styled/input/Input";
import { useContext, useEffect, useState } from "react";
import DepositModal from "../../../modals/DepositModal";
import EditDepositAddressModal from "../../../modals/EditDepositAddressModal";
import AddDepositAddressModal from "../../../modals/AddDepositAddressModal";
import { context } from "../../../context/context";
import CircularLoader from "../../../styled/loaders/CircularLoader";
import { db } from "../../../firebase/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { Skeleton } from "@mui/material";
import Toast from "../../../hooks/Toast";

//  admin => settings => deposit => Regular || Signals : {repeatAddress: false, type: "Automated || Manual ", manual ? addresses.map => QR Code !== null   }

// const deposit = {
//   Regular: {
//     type: "automated",
//     apiKey: "api-key-293934h3-348r44h",
//     addresses: {},
//   },
//   Signals: {
//     repeat: false,
//     type: undefined,
//     apiKey: "api-key-293934h3-348r44h",
//     addresses: {},
//   },
// };

const WithdrawalSettings = () => {
  const { withdrawalSettings } = useContext(context);

  const [openModal, setOpenModal] = useState(false);

  // edit Address
  const [editAddress, setEditAddress] = useState(false);

  const [selectedEditAddress, setSelectedEditAddress] = useState(undefined);
  const [selectedEditOption, setSelectedEditOption] = useState(undefined);

  function handleEditAddress(address, type) {
    // console.log(address);
    setSelectedEditOption(type);
    setSelectedEditAddress(address);
    setEditAddress(true);
  }

  const [addAddress, setAddAddress] = useState(false);
  const [selectedAddAddress, setSelectedAddAddress] = useState(undefined);
  const [selectedAddOption, setSelectedAddOption] = useState(undefined);

  function handleAddAddress(e, type) {
    setSelectedAddOption(type);
    setAddAddress(true);
  }

  const [isLoading, setIsLoading] = useState(true);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // const {regular, setRegular} = useState({})
  // const {signals, setSignals} = useState({})

  //   const [regularType, setRegularType] = useState(undefined);
  //   const [regularApiKey, setRegularApiKey] = useState(undefined);
  //   const [regularAddresses, setRegularAddresses] = useState({});

  //   const [signalType, setSignalType] = useState(undefined);
  //   const [signalApiKey, setSignalApiKey] = useState(undefined);
  //   const [signalAddresses, setSignalAddresses] = useState({});
  //   const [repeatSignal, setRepeatSignal] = useState(undefined);

  const availableMethods = [
    "Crypto",
    "Bank Transfer",
    "Skrill",
    "Western Union",
    "Neteller",
    "MoneyGram",
    "Perfect Money",
  ];

  const [isCrypto, setIsCrypto] = useState(false);
  const [isBank, setIsBank] = useState(false);
  const [isPayPal, setIsPayPal] = useState(false);
  const [isSkrill, setIsSkrill] = useState(false);
  const [isWestern, setIsWestern] = useState(false);
  const [isNeteller, setIsNeteller] = useState(false);
  const [isMoneyGram, setIsMoneyGram] = useState(false);
  const [isPerfectMoney, setIsPerfectMoney] = useState(false);

  useEffect(() => {
    if (withdrawalSettings) {
      //   console.log("settings", withdrawalSettings);
      const { methods } = withdrawalSettings;
      setIsCrypto(methods.includes("Crypto") ? true : false);
      setIsBank(methods.includes("Bank Transfer") ? true : false);
      setIsSkrill(methods.includes("Skrill") ? true : false);
      setIsWestern(methods.includes("Western Union") ? true : false);
      setIsNeteller(methods.includes("Neteller") ? true : false);
      setIsMoneyGram(methods.includes("MoneyGram") ? true : false);
      setIsPerfectMoney(methods.includes("Perfect Money") ? true : false);
      setIsPayPal(methods.includes("PayPal") ? true : false);

      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [withdrawalSettings]);

  const [isSavingWithdrawalSettings, setIsSavingWithdrawalSettings] =
    useState(false);

  async function handleSaveWithdrawalSettings() {
    setIsSavingWithdrawalSettings(true);

    let withdrawalList = [];

    if (isCrypto) {
      withdrawalList.push("Crypto");
    }

    if (isBank) {
      withdrawalList.push("Bank Transfer");
    }

    if (isPayPal) {
      withdrawalList.push("PayPal");
    }

    if (isSkrill) {
      withdrawalList.push("Skrill");
    }

    if (isWestern) {
      withdrawalList.push("Western Union");
    }

    if (isNeteller) {
      withdrawalList.push("Neteller");
    }

    if (isMoneyGram) {
      withdrawalList.push("MoneyGram");
    }

    if (isPerfectMoney) {
      withdrawalList.push("Perfect Money");
    }

    const q = doc(db, "admin", "withdraw");
    try {
      await updateDoc(q, {
        methods: withdrawalList,
      });
      setIsSavingWithdrawalSettings(false);
      setToastType("success");
      setToastMessage("Updated successfully");
      setOpenToast(true);
      // console.log("saved");
      // toast.success("Updated successfully.");
      // setIsEditing(false);
    } catch (error) {
      // console.log(error);
      setIsSavingWithdrawalSettings(false);
      setToastType("error");
      setToastMessage("Could not update. Please try again later");
      setOpenToast(true);
      // toast.error("Could not update. Please try again later");
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

      <WithdrawalSettingsStandard>
        <SettingsFormStandard>
          <div className="header">
            <p className="title">Withdrawal</p>
            <p className="subtext">
              {" "}
              Manage your withdrawal settings and available methods
            </p>
          </div>

          {isLoading ? (
            <div className="form">
              {/* Withdrawal Methods */}
              <div className="section">
                <div className="section_intro">
                  <p className="title">
                    {" "}
                    <Skeleton
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "20%",
                      }}
                    />
                  </p>
                  <p className="subtext">
                    <Skeleton
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "60%",
                      }}
                    />
                  </p>
                </div>

                {/* Crypto */}
                <div className="form_item">
                  <Skeleton
                    variant="rounded"
                    height={80}
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      // maxWidth: "20%",
                    }}
                  />
                </div>

                {/* Bank */}
                <div className="form_item">
                  <Skeleton
                    variant="rounded"
                    height={80}
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      // maxWidth: "20%",
                    }}
                  />
                </div>

                {/* PayPal */}

                <div className="form_item">
                  <Skeleton
                    variant="rounded"
                    height={80}
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      // maxWidth: "20%",
                    }}
                  />
                </div>

                {/* Skrill */}
              </div>
            </div>
          ) : (
            <div className="form">
              {/* Withdrawal Methods */}
              <div className="section">
                <div className="section_intro">
                  <p className="title">Withdrawal methods</p>
                  <p className="subtext">Edit available withdrawal methods</p>
                </div>

                {/* Crypto */}
                <div className="form_item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      border: "1px solid #222739",
                      backgroundColor: "rgba(27, 31, 45, 0.3)",
                      borderRadius: "12px",
                      padding: "16px 24px",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: "500",
                          lineHeight: "28px",
                        }}
                      >
                        Crypto
                      </p>
                      <p
                        style={{
                          color: "#bac2de",
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        Allow users withdraw cryptocurrencies
                      </p>
                    </span>

                    <ToggleSwitch
                      className={isCrypto && "toggled"}
                      onClick={() => setIsCrypto(!isCrypto)}
                    >
                      <div className="toggle"></div>
                    </ToggleSwitch>
                  </div>
                </div>

                {/* Bank */}
                <div className="form_item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      border: "1px solid #222739",
                      backgroundColor: "rgba(27, 31, 45, 0.3)",
                      borderRadius: "12px",
                      padding: "16px 24px",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: "500",
                          lineHeight: "28px",
                        }}
                      >
                        Bank Transfer
                      </p>
                      <p
                        style={{
                          color: "#bac2de",
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        Allow users withdraw to their bank accounts
                      </p>
                    </span>

                    <ToggleSwitch
                      className={isBank && "toggled"}
                      onClick={() => setIsBank(!isBank)}
                    >
                      <div className="toggle"></div>
                    </ToggleSwitch>
                  </div>
                </div>

                {/* PayPal */}

                <div className="form_item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      border: "1px solid #222739",
                      backgroundColor: "rgba(27, 31, 45, 0.3)",
                      borderRadius: "12px",
                      padding: "16px 24px",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: "500",
                          lineHeight: "28px",
                        }}
                      >
                        PayPal
                      </p>
                      <p
                        style={{
                          color: "#bac2de",
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        Allow users withdraw to PayPal
                      </p>
                    </span>

                    <ToggleSwitch
                      className={isPayPal && "toggled"}
                      onClick={() => setIsPayPal(!isPayPal)}
                    >
                      <div className="toggle"></div>
                    </ToggleSwitch>
                  </div>
                </div>

                {/* Skrill */}

                <div className="form_item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      border: "1px solid #222739",
                      backgroundColor: "rgba(27, 31, 45, 0.3)",
                      borderRadius: "12px",
                      padding: "16px 24px",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: "500",
                          lineHeight: "28px",
                        }}
                      >
                        Skrill
                      </p>
                      <p
                        style={{
                          color: "#bac2de",
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        Allow users withdraw to Skrill
                      </p>
                    </span>

                    <ToggleSwitch
                      className={isSkrill && "toggled"}
                      onClick={() => setIsSkrill(!isSkrill)}
                    >
                      <div className="toggle"></div>
                    </ToggleSwitch>
                  </div>
                </div>

                {/* Western Union */}

                <div className="form_item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      border: "1px solid #222739",
                      backgroundColor: "rgba(27, 31, 45, 0.3)",
                      borderRadius: "12px",
                      padding: "16px 24px",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: "500",
                          lineHeight: "28px",
                        }}
                      >
                        Western Union
                      </p>
                      <p
                        style={{
                          color: "#bac2de",
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        Allow users withdraw to Western Union
                      </p>
                    </span>

                    <ToggleSwitch
                      className={isWestern && "toggled"}
                      onClick={() => setIsWestern(!isWestern)}
                    >
                      <div className="toggle"></div>
                    </ToggleSwitch>
                  </div>
                </div>

                {/* Neteller */}
                <div className="form_item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      border: "1px solid #222739",
                      backgroundColor: "rgba(27, 31, 45, 0.3)",
                      borderRadius: "12px",
                      padding: "16px 24px",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: "500",
                          lineHeight: "28px",
                        }}
                      >
                        Neteller
                      </p>
                      <p
                        style={{
                          color: "#bac2de",
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        Allow users withdraw to Neteller
                      </p>
                    </span>

                    <ToggleSwitch
                      className={isNeteller && "toggled"}
                      onClick={() => setIsNeteller(!isNeteller)}
                    >
                      <div className="toggle"></div>
                    </ToggleSwitch>
                  </div>
                </div>

                {/* MoneyGram */}
                <div className="form_item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      border: "1px solid #222739",
                      backgroundColor: "rgba(27, 31, 45, 0.3)",
                      borderRadius: "12px",
                      padding: "16px 24px",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: "500",
                          lineHeight: "28px",
                        }}
                      >
                        MoneyGram
                      </p>
                      <p
                        style={{
                          color: "#bac2de",
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        Allow users withdraw to MoneyGram
                      </p>
                    </span>

                    <ToggleSwitch
                      className={isMoneyGram && "toggled"}
                      onClick={() => setIsMoneyGram(!isMoneyGram)}
                    >
                      <div className="toggle"></div>
                    </ToggleSwitch>
                  </div>
                </div>

                <div className="form_item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      border: "1px solid #222739",
                      backgroundColor: "rgba(27, 31, 45, 0.3)",
                      borderRadius: "12px",
                      padding: "16px 24px",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: "500",
                          lineHeight: "28px",
                        }}
                      >
                        Perfect Money
                      </p>
                      <p
                        style={{
                          color: "#bac2de",
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        Allow users withdraw to Perfect Money
                      </p>
                    </span>

                    <ToggleSwitch
                      className={isPerfectMoney && "toggled"}
                      onClick={() => setIsPerfectMoney(!isPerfectMoney)}
                    >
                      <div className="toggle"></div>
                    </ToggleSwitch>
                  </div>
                </div>
              </div>

              <FormButton
                onClick={handleSaveWithdrawalSettings}
                className={
                  isSavingWithdrawalSettings
                    ? "form_button disabled"
                    : "form_button"
                }
              >
                {isSavingWithdrawalSettings ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="24" color="#ffffff" />
                  </div>
                ) : (
                  <p>Save</p>
                )}
              </FormButton>
            </div>
          )}
        </SettingsFormStandard>
      </WithdrawalSettingsStandard>
    </>
  );
};

const ToggleSwitch = styled.button`
  height: 24px;
  width: 48px;
  max-width: 48px;
  padding: 0;
  background-color: #222739;

  border-radius: 48px;
  display: flex;
  cursor: pointer;
  border: none;
  outline: none;
  /* margin: 0; */

  &.toggled {
    background-color: white;
  }

  .toggle {
    width: 22px;
    height: 22px;
    margin-left: 2px;
    border-radius: 100%;
    place-self: center;
    /* padding: 2px; */
    transition: all 300ms ease-in-out;
    background-color: #07080d;
  }

  &.toggled .toggle {
    transform: translateX(20px);
    margin-left: 4px;
  }
`;

const WithdrawalSettingsStandard = styled.div`
  .form_item {
    margin-top: 24px;
  }

  .mini_form_item {
    margin-top: 12px;
  }
`;

export default WithdrawalSettings;
