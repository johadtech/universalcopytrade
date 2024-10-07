import { useEffect, useState } from "react";
import { DropDownIconOutlined, PrimarySwitcher } from "../styled/input/Input";
import { styled } from "styled-components";
import { useMediaQuery } from "@mui/material";
import BalancesManage from "./inners/manage/BalancesManage";
import SecurityManage from "./inners/manage/SecurityManage";
import ProfileManage from "./inners/manage/ProfileManage";
import UserVerifications from "../user/Verifications";
import UserPayments from "../user/Payments";
import UserSignalDeposits from "../user/UserSignalDeposits";
import UserWithdrawals from "../user/UserWithdrawals";
import UserSignals from "../user/UserSignals";
import UserInvestments from "../user/UserInvestments";
import UserSubscriptions from "../user/UserSubscriptions";
import UserTrades from "../user/Trades";
import UserStakings from "../user/Stakings";

const SingleUser = ({ user }) => {
  const { userDetails, setUserDetails } = user;

  const [selectedContext, setSelectedContext] = useState("Profile");

  const [selectedSetting, setSelectedSetting] = useState("Profile");

  const contexts = [
    "Profile",
    "Verifications",
    "Payments",
    "Signal Deposits",
    "Withdrawals",
    "Signals",
    "Investments",
    "Subscriptions",
    "Trades",
    "Stakings",
    // "Balances",
  ];

  const userSettings = [
    {
      name: "Profile",
      icon: "/assets/settings/profile.svg",
    },
    {
      name: "Security",
      icon: "/assets/settings/security.svg",
    },
    {
      name: "Balances",
      icon: "/assets/settings/wallet.svg",
    },
  ];

  function handleSettingSwitch(value) {
    setSelectedSetting(value);
  }

  const [showMobileOptions, setShowMobileOptions] = useState(false);

  function handleSettingChange(name) {
    setSelectedSetting(name);
    setShowMobileOptions(false);
  }

  return (
    <>
      {/* Context */}
      <PrimarySwitcher className="scrollbar-hide">
        {contexts.map((ctx) => (
          <button
            key={ctx}
            className={ctx === selectedContext && "active"}
            onClick={() => setSelectedContext(ctx)}
          >
            {ctx}
          </button>
        ))}
      </PrimarySwitcher>

      {selectedContext === "Profile" && (
        <SettingsStandard className="content">
          <div className="settings">
            <div className="switcher-desktop">
              {userSettings.map((us) => (
                <span
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "8px 16px",
                    lineHeight: "28px",
                    alignItems: "center",
                    borderRadius: "8px",
                    fontFamily: "Inter",
                    backgroundColor:
                      us.name === selectedSetting ? "#222739" : "transparent",
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                  }}
                  onClick={() => handleSettingSwitch(us.name)}
                >
                  {/* <img
                    src={us.icon}
                    alt=""
                    style={{
                      filter:
                        us.name === selectedSetting &&
                        "invert(0%) sepia(0%) saturate(0%) hue-rotate(334deg) brightness(200%) contrast(100%)",
                      cursor: "pointer",
                    }}
                  /> */}
                  <p
                    style={{
                      fontSize: "16px",
                      color: us.name === selectedSetting ? "white" : "#BAC2DE",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {us.name}
                  </p>
                </span>
              ))}
            </div>

            <div className="switcher-mobile">
              <DropDownIconOutlined>
                <div
                  className="wrapper"
                  onClick={() => setShowMobileOptions(!showMobileOptions)}
                >
                  <div className="content">
                    <div className="main">
                      {/* <img src={userSettings[0].icon} className="asset" /> */}
                      <input
                        type="text"
                        name="country"
                        id=""
                        value={
                          selectedSetting
                            ? selectedSetting
                            : userSettings[0].name
                        }
                        autoComplete="off"
                        disabled
                      />
                    </div>

                    <span
                      // className={showUserTab ? "selectors tab" : "selectors"}
                      className="selectors"
                    >
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

                <div
                  className="menu style-4"
                  style={{
                    display: showMobileOptions ? "block" : "none",
                  }}
                >
                  <div className="scrollable style-4">
                    {userSettings.map((setting) => (
                      <span onClick={() => handleSettingChange(setting.name)}>
                        {/* <img src={setting.icon} alt="" /> */}
                        <p>{setting.name}</p>
                      </span>
                    ))}
                  </div>
                </div>
              </DropDownIconOutlined>

              <div className="dropdown"></div>
            </div>

            <div className="wrapper">
              {selectedSetting === "Profile" && (
                <ProfileManage user={{ userDetails, setUserDetails }} />
              )}

              {selectedSetting === "Security" && (
                <SecurityManage user={{ userDetails, setUserDetails }} />
              )}

              {selectedSetting === "Balances" && (
                <BalancesManage user={{ userDetails, setUserDetails }} />
              )}
            </div>
          </div>
        </SettingsStandard>
      )}

      {selectedContext === "Verifications" && (
        <UserVerifications user={userDetails.id} />
      )}
      {selectedContext === "Payments" && <UserPayments user={userDetails.id} />}
      {selectedContext === "Signal Deposits" && (
        <UserSignalDeposits user={userDetails.id} />
      )}

      {selectedContext === "Withdrawals" && (
        <UserWithdrawals user={userDetails.id} />
      )}

      {selectedContext === "Signals" && <UserSignals user={userDetails.id} />}

      {selectedContext === "Investments" && (
        <UserInvestments user={userDetails.id} />
      )}

      {selectedContext === "Subscriptions" && (
        <UserSubscriptions user={userDetails.id} />
      )}

      {selectedContext === "Trades" && <UserTrades user={userDetails.id} />}

      {selectedContext === "Stakings" && <UserStakings user={userDetails.id} />}
    </>
  );
};

const SettingsStandard = styled.div`
  color: white;
  /* display: none; */

  .title {
    font-size: 28px;
    font-weight: 600;
  }

  .settings {
    display: grid;
    grid-template-columns: 250px auto;
    margin-top: 24px;
    gap: 48px;
    /* background-color: #151823; */
    border-radius: 12px;
    /* max-width: 70%; */
    /* padding: 12px; */
    /* padding-bottom: 64px; */
  }

  .switcher-desktop {
    height: 100%;
    /* background-color: #1b1f2d; */
    padding: 12px;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    padding-right: 16px;
    /* max-width: 80%; */
    /* border-right: 1px solid #2b2f3c; */
  }

  .switcher-mobile {
    width: 100%;
    display: none;
  }

  .switcher-mobile .selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border: 1px solid #323e67;
    border-radius: 8px;
    background-color: #0c0f19;
    cursor: pointer;
  }

  .switcher-mobile .selector p {
    font-weight: 600;
  }

  .switcher-mobile .selector img {
    filter: invert(0%) sepia(0%) saturate(0%) hue-rotate(334deg)
      brightness(200%) contrast(100%);
  }

  .switcher-mobile .selector span {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  @media screen and (max-width: 1100px) {
    .settings {
      grid-template-columns: auto;
      gap: 32px;
    }

    .switcher-desktop {
      display: none;
    }

    .switcher-mobile {
      display: block;
    }
  }

  .wrapper {
    height: 100%;
  }
`;

const AppearanceSettingsStandard = styled.div`
  .form_item {
    margin-top: 24px;
  }

  .content {
    margin-top: 12px;
  }
`;

const SecuritySettingsStandard = styled.div`
  .form_item {
    margin-top: 24px;
  }

  .multi_factor {
    margin-top: 48px;
  }
`;

const NotificationsSettingsStandard = styled.div``;

const VerificationsSettingsStandard = styled.div`
  .form_title {
    width: 100%;
    padding-bottom: 24px;
    border-bottom: 1px solid #293456;
  }

  .form_title .title {
    font-size: 18px;
    font-weight: 500;
    color: white;
  }

  .form_title .support_text {
    font-size: 14px;
    color: #bac2de;
    margin-top: 8px;
  }

  .form_item {
    margin-top: 24px;
  }

  .form_item .label {
    font-size: 14px;
    color: white;
    font-weight: 500;
  }

  .form_item .content {
    margin-top: 8px;
  }

  .status {
    display: grid;
    grid-template-columns: 18px auto;
    gap: 4px;
  }

  .status p {
    font-size: 14px;
    color: #ff3344;
    line-height: auto;
  }

  .form_item .caption {
    font-size: 14px;
    color: #bac2de;
    margin-top: 8px;
  }

  .form_button {
    max-width: max-content;
    padding: 12px 24px;
    border: none;
    color: white;
    background-color: #0c6ef2;
    font-size: 14px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 48px;
  }

  .country_search_ref::placeholder {
    color: white;
  }

  .file_upload {
    margin-top: 12px;
    /* background-color: red; */
    max-width: 512px;
    width: 100%;
  }

  .upload_box {
    /* max-width: 464px; */
    width: 100%;
    padding: 16px 24px;
    display: block;
    /* background-color: blue; */
    /* height: 126px; */
    /* margin: 0 auto; */
    border: 1px solid #323e67;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .file_box {
    width: 100%;
    /* max-width: 480px; */
    padding: 16px;
    border: 1px solid #323e67;
    border-radius: 12px;
    margin-top: 24px;
    display: grid;
    grid-template-columns: 40px auto;
    align-items: center;
    gap: 12px;
  }

  .file_box .right {
    display: grid;
    gap: 4px;
  }

  .file_box .right .details {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .bars {
    position: relative;
    width: 100%;
    height: 8px;
    background-color: transparent;
    /* border-radius: 8px; */
  }

  .bars .bar {
    width: 100%;
    position: absolute;
    background-color: #eaecf0;
    height: 100%;
    border-radius: 8px;
    top: 0;
    left: 0;
    box-sizing: border-box;
  }

  .bars .progress {
    /* width: ${(props) => `calc(${props.width} + 1px)`}; */
    position: absolute;
    background-color: #0c6ef2;
    height: 100%;
    border-radius: 8px;
    top: 0;
    left: 0;
    z-index: 33;
    margin-left: -1px;
    box-sizing: border-box;
  }

  .file_box .right .percent {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    gap: 12px;
    align-items: center;
  }

  .file_box .right span p:nth-child(1) {
    font-size: 16px;
    color: white;
    font-weight: 500;
    line-height: 20px;
  }

  .file_box .right span p:nth-child(2) {
    font-size: 14px;
    color: #bac2de;
    line-height: 20px;
  }

  .upload_box span {
    margin-top: 8px;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .upload_box span p:nth-child(1) {
    color: #0c6ef2;
    font-weight: 600;
    font-weight: 14px;
    line-height: 20px;
  }

  .upload_box span p:nth-child(2) {
    color: white;
    font-weight: 14px;
    line-height: 20px;
  }

  .upload_box img {
    padding: 10px;
    border: 1px solid #323e67;
    border-radius: 8px;
  }

  .upload_box .allowed {
    color: #bac2de;
    font-size: 12px;
    line-height: 18px;
  }
`;

const ActionsSettingsStandard = styled.div`
  .content {
    margin-top: 8px;
  }
`;

const DepositSettingsStandard = styled.div`
  .mini_form_item {
    margin-top: 12px;
  }
`;

export default SingleUser;
