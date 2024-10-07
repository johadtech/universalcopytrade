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

const DepositSettings = () => {
  const { depositSettings } = useContext(context);

  const [openModal, setOpenModal] = useState(false);

  // edit Address
  const [editAddress, setEditAddress] = useState(false);

  const [selectedEditAddress, setSelectedEditAddress] = useState(undefined);
  const [selectedEditOption, setSelectedEditOption] = useState(undefined);

  function handleEditAddress(address, type) {
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

  // const {regular, setRegular} = useState({})
  // const {signals, setSignals} = useState({})

  const [regularType, setRegularType] = useState(undefined);
  const [regularApiKey, setRegularApiKey] = useState(undefined);
  const [regularAddresses, setRegularAddresses] = useState({});

  const [signalType, setSignalType] = useState(undefined);
  const [signalApiKey, setSignalApiKey] = useState(undefined);
  const [signalAddresses, setSignalAddresses] = useState({});
  const [repeatSignal, setRepeatSignal] = useState(undefined);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  useEffect(() => {
    if (depositSettings) {
      const { Regular, Signals } = depositSettings;

      if (Regular && Signals) {
        setRegularType(Regular.type);
        setRegularApiKey(Regular.apiKey);
        setRegularAddresses(Regular.addresses);

        setSignalType(Signals.type);
        setSignalApiKey(Signals.apiKey);
        setSignalAddresses(Signals.addresses);
        setRepeatSignal(Signals.repeat);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [depositSettings]);

  function handleChangeRegularDepositType(e) {
    setRegularType(e.target.value);
  }

  function handleChangeSignalsDepositType(e) {
    setSignalType(e.target.value);
  }

  const [isSavingDepositSettings, setIsSavingDepositSettings] = useState(false);

  async function handleSaveDepositSettings() {
    setIsSavingDepositSettings(true);

    // const namekey = `Signals.type`;

    // let namekey;

    // switch (type) {
    //   case "Regular":
    //     namekey = `Regular.addresses.${symbol}`;
    //     break;
    //   case "Signals":
    //     namekey = `Signals.addresses.${symbol}`;
    //   default:
    //     break;
    // }

    // const namekey = type === "Regular "`Regular.addresses.${symbol}`;

    const q = doc(db, "admin", "deposit");
    try {
      await updateDoc(q, {
        Regular: {
          addresses: regularAddresses,
          apiKey: regularApiKey,
          type: regularType,
        },
        Signals: {
          addresses: signalAddresses,
          apiKey: signalApiKey,
          repeat: repeatSignal ? true : false,
          type: signalType,
        },
      });
      setIsSavingDepositSettings(false);
      // console.log("saved");
      setToastType("success");
      setToastMessage("Updated successfully");
      setOpenToast(true);
      // toast.success("Updated successfully.");
      // setIsEditing(false);
    } catch (error) {
      console.log(error);
      setIsSavingDepositSettings(false);
      setToastType("error");
      setToastMessage("Could not update. Please try again later");
      setOpenToast(true);
      // toast.error("Could not update. Please try again later");
    }
  }

  function handleRegularApi(e) {
    const { value } = e.target;

    if (value && value.length > 10) {
      setRegularApiKey(value);
    } else {
      setRegularApiKey("");
    }
  }

  function handleSignalsApi(e) {
    const { value } = e.target;

    if (value && value.length > 10) {
      setSignalApiKey(value);
    } else {
      setSignalApiKey("");
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

      <DepositSettingsStandard>
        {editAddress && (
          <EditDepositAddressModal
            open={{ editAddress, setEditAddress }}
            selected={selectedEditAddress}
            type={selectedEditOption}
          />
        )}

        {addAddress && (
          <AddDepositAddressModal
            open={{ addAddress, setAddAddress }}
            type={selectedAddOption}
          />
        )}

        <SettingsFormStandard>
          <div className="header">
            <p className="title">Deposit</p>
            <p className="subtext">
              Manage your deposit settings, add and delete addresses.
            </p>
          </div>

          {isLoading ? (
            <div className="form">
              {/* Regular deposit */}
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
                <div className="form_item">
                  <DropDownIconOutlined className="variant">
                    <div className="wrapper">
                      <label for="country" className="label">
                        <Skeleton
                          variant="rounded"
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "20%",
                          }}
                        />
                      </label>
                      {/* <div className="content">
                       
                      </div> */}
                      <Skeleton
                        variant="rounded"
                        height={40}
                        sx={{
                          backgroundColor: "rgba(27, 31, 45)",
                          // maxWidth: "20%",
                        }}
                      />
                    </div>
                  </DropDownIconOutlined>
                </div>

                {regularType === "automated" && (
                  <>
                    <div className="form_item">
                      <div className="content">
                        <p className="label">
                          {" "}
                          <Skeleton
                            variant="rounded"
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "20%",
                            }}
                          />
                        </p>
                        <OutlinedIconBoxWithButton className="variant">
                          <Skeleton
                            variant="rounded"
                            height={40}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              width: "100%",
                              marginTop: "8px",
                            }}
                          />
                          {/* <button>Save Key</button> */}
                        </OutlinedIconBoxWithButton>
                      </div>
                    </div>
                  </>
                )}

                {regularType === "manual" && (
                  <>
                    <div className="form_item">
                      <p className="label">Addresses</p>

                      {Object.values(regularAddresses).length > 0 &&
                        Object.values(
                          Object.values(regularAddresses).map((address) => (
                            <div className="address">
                              <div className="content">
                                <OutlinedIconBoxWithButton className="variant">
                                  <div className="left">
                                    <img
                                      src={`./asseticons/${address.symbol}.svg`}
                                      style={{ marginLeft: "12px" }}
                                      // ./asseticons/${selectedMethod}.svg

                                      alt=""
                                    />
                                    <input
                                      type="text"
                                      placeholder={address.address}
                                      defaultValue={address.address}
                                      // disabled
                                    />
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleEditAddress(address, "Regular")
                                    }
                                  >
                                    Edit address
                                  </button>
                                </OutlinedIconBoxWithButton>
                              </div>
                            </div>
                          ))
                        )}
                    </div>

                    <div className="mini_form_item">
                      <button
                        className="action_button"
                        onClick={(e) => handleAddAddress(e, "Regular")}
                      >
                        Add address
                      </button>
                    </div>
                  </>
                )}

                <br />
              </div>
            </div>
          ) : (
            <div className="form">
              {/* Regular deposit */}
              <div className="section">
                <div className="section_intro">
                  <p className="title">Regular deposit</p>
                  <p className="subtext">Edit your regular deposit settings.</p>
                </div>
                <div className="form_item">
                  <DropDownIconOutlined className="variant">
                    <div className="wrapper">
                      <label for="country" className="label">
                        Deposit type
                      </label>
                      <div className="content">
                        <select
                          name=""
                          id=""
                          onChange={(e) => handleChangeRegularDepositType(e)}
                        >
                          {regularType === "automated" && (
                            <>
                              <option value="automated">
                                Automated (Coinbase commerce)
                              </option>
                              <option value="manual">Manual</option>
                            </>
                          )}

                          {regularType === "manual" && (
                            <>
                              <option value="manual">Manual</option>
                              <option value="automated">
                                Automated (Coinbase commerce)
                              </option>
                            </>
                          )}
                        </select>

                        <span className="selectors">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7 9L12 4L17 9"
                              stroke="#BAC2DE"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>

                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7 15L12 20L17 15"
                              stroke="#BAC2DE"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </DropDownIconOutlined>
                </div>

                {regularType === "automated" && (
                  <>
                    <div className="form_item">
                      <div className="content">
                        <p className="label">API Key</p>
                        <OutlinedIconBoxWithButton className="variant">
                          <div className="left">
                            <input
                              type="text"
                              // value={
                              //   regularApiKey
                              //     ? regularApiKey
                              //     : "3d3evf3g4qg4g44444f4"
                              // }
                              onChange={handleRegularApi}
                              placeholder={
                                regularApiKey && regularApiKey.length > 10
                                  ? " Current: " + regularApiKey
                                  : "Your Coinbase API Key"
                              }
                            />
                          </div>
                          {/* <button>Save Key</button> */}
                        </OutlinedIconBoxWithButton>
                      </div>
                    </div>
                  </>
                )}

                {regularType === "manual" && (
                  <>
                    <div className="form_item">
                      <p className="label">Addresses</p>

                      {Object.values(regularAddresses).length > 0 &&
                        Object.values(
                          Object.values(regularAddresses).map((address) => (
                            <div className="address">
                              <div className="content">
                                <OutlinedIconBoxWithButton className="variant">
                                  <div className="left">
                                    <img
                                      src={`./asseticons/${address.symbol}.svg`}
                                      style={{ marginLeft: "12px" }}
                                      // ./asseticons/${selectedMethod}.svg

                                      alt=""
                                    />
                                    <input
                                      type="text"
                                      placeholder={address?.address}
                                      disabled
                                    />
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleEditAddress(address, "Regular")
                                    }
                                  >
                                    Edit address
                                  </button>
                                </OutlinedIconBoxWithButton>
                              </div>
                            </div>
                          ))
                        )}
                    </div>

                    <div className="mini_form_item">
                      <button
                        className="action_button"
                        onClick={(e) => handleAddAddress(e, "Regular")}
                      >
                        Add address
                      </button>
                    </div>
                  </>
                )}

                <br />
              </div>

              {/* Signal deposit */}
              <div className="section">
                <div className="section_intro">
                  <p className="title">Signal deposit</p>
                  <p className="subtext">Edit your signal deposit settings.</p>
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
                        Repeat address
                      </p>
                      <p
                        style={{
                          color: "#bac2de",
                          fontSize: "14px",
                          lineHeight: "24px",
                        }}
                      >
                        Use same address as regular deposit
                      </p>
                    </span>

                    <ToggleSwitch
                      className={repeatSignal && "toggled"}
                      onClick={() => setRepeatSignal(!repeatSignal)}
                    >
                      <div className="toggle"></div>
                    </ToggleSwitch>
                  </div>
                </div>

                {!repeatSignal && (
                  <div className="form_item">
                    <DropDownIconOutlined className="variant">
                      <div className="wrapper">
                        <label for="country" className="label">
                          Deposit type
                        </label>
                        <div className="content">
                          <select
                            name=""
                            id=""
                            onChange={(e) => handleChangeSignalsDepositType(e)}
                          >
                            {signalType === "repeat" && (
                              <>
                                <option value="automated">
                                  Automated (Coinbase commerce)
                                </option>
                                <option value="manual">Manual</option>
                              </>
                            )}

                            {signalType === "automated" && (
                              <>
                                <option value="automated">
                                  Automated (Coinbase commerce)
                                </option>
                                <option value="manual">Manual</option>
                              </>
                            )}

                            {signalType === "manual" && (
                              <>
                                <option value="manual">Manual</option>
                                <option value="automated">
                                  Automated (Coinbase commerce)
                                </option>
                              </>
                            )}
                          </select>

                          <span className="selectors">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 9L12 4L17 9"
                                stroke="#BAC2DE"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 15L12 20L17 15"
                                stroke="#BAC2DE"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </DropDownIconOutlined>
                  </div>
                )}

                {!repeatSignal && (
                  <>
                    {signalType === "automated" && (
                      <>
                        <div className="form_item">
                          <div className="content">
                            <p className="label">API Key</p>
                            <OutlinedIconBoxWithButton className="variant">
                              <div className="left">
                                <input
                                  type="text"
                                  // value={
                                  //   regularApiKey
                                  //     ? regularApiKey
                                  //     : "3d3evf3g4qg4g44444f4"
                                  // }
                                  onChange={handleSignalsApi}
                                  placeholder={
                                    signalApiKey && signalApiKey.length > 10
                                      ? " Current: " + signalApiKey
                                      : "Your Coinbase API Key"
                                  }
                                />
                              </div>
                              {/* <button>Save Key</button> */}
                            </OutlinedIconBoxWithButton>
                          </div>
                        </div>
                      </>
                    )}

                    {signalType === "manual" && (
                      <>
                        <div className="form_item">
                          <p className="label">Addresses</p>

                          {Object.values(signalAddresses)?.length > 0 &&
                            Object.values(
                              Object.values(signalAddresses)?.map((address) => (
                                <div className="address">
                                  <div className="content">
                                    <OutlinedIconBoxWithButton className="variant">
                                      <div className="left">
                                        <img
                                          src={`./asseticons/${address.symbol}.svg`}
                                          style={{ marginLeft: "12px" }}
                                          // ./asseticons/${selectedMethod}.svg

                                          alt=""
                                        />
                                        <input
                                          type="text"
                                          placeholder={address.address}
                                          // defaultValue={address.address}
                                          disabled
                                        />
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleEditAddress(address, "Signals")
                                        }
                                      >
                                        Edit address
                                      </button>
                                    </OutlinedIconBoxWithButton>
                                  </div>
                                </div>
                              ))
                            )}
                        </div>

                        <div className="mini_form_item">
                          <button
                            className="action_button"
                            onClick={(e) => handleAddAddress(e, "Signals")}
                          >
                            Add address
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <FormButton
                disabled={
                  isSavingDepositSettings ||
                  (regularType === "manual" && !regularAddresses) ||
                  (regularType === "automated" && !regularApiKey) ||
                  (signalType === "manual" &&
                    !repeatSignal &&
                    !signalAddresses) ||
                  (signalType === "automated" && !repeatSignal && !signalApiKey)
                }
                className={
                  (isSavingDepositSettings ||
                    (regularType === "manual" && !regularAddresses) ||
                    (regularType === "automated" && !regularApiKey) ||
                    (signalType === "manual" &&
                      !repeatSignal &&
                      !signalAddresses) ||
                    (signalType === "automated" &&
                      !repeatSignal &&
                      !signalApiKey)) &&
                  "disabled"
                }
                onClick={handleSaveDepositSettings}
              >
                {isSavingDepositSettings ? (
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
      </DepositSettingsStandard>
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

const DepositSettingsStandard = styled.div`
  .form_item {
    margin-top: 24px;
  }

  .mini_form_item {
    margin-top: 12px;
  }
`;

export default DepositSettings;
