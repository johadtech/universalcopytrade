import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { MainContainer } from "../styled/templates/MainContainer";
import { MainPage } from "../styled/templates/MainPage";
import { DropDownIconOutlined } from "../styled/input/Input";
import { styled } from "styled-components";
import { context } from "../context/context";
import CircularLoader from "../styled/loaders/CircularLoader";
import ProfileSettings from "./inners/settings/ProfileSettings";
import SecuritySettings from "./inners/settings/SecuritySettings";
import AppearanceSettings from "./inners/settings/AppearanceSettings";
import VerificationSettings from "./inners/settings/VerificationSettings";
import DepositSettings from "./inners/settings/DepositSettings";
import WithdrawalSettings from "./inners/settings/WithdrawalSettings";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { ClickAwayListener, Skeleton, useMediaQuery } from "@mui/material";
import Toast from "../hooks/Toast";

const Settings = () => {
  const [selectedSetting, setSelectedSetting] = useState("Profile");
  const [isLoading, setIsLoading] = useState(true);
  const { userData, dispatch } = useContext(context);
  const [user, loading] = useAuthState(auth);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const navigate = useNavigate();

  const mobile = useMediaQuery("(max-width: 768px)");
  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);

  const [loader, setLoader] = useState(true);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  useEffect(() => {
    if (!loading && user && userData) {
      checkUserStats(user);
    }

    if (loading && !user) {
      setLoader(true);
    }

    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, userData]);

  function checkUserStats() {
    if (userData?.blocked) {
      navigate("/login");
      setToastMessage("Your account has been blocked");
      setToastType("error");
      setOpenToast(true);
    } else {
      checkAdmin();
    }

    function checkAdmin() {
      if (userData?.admin) {
        setUserIsAdmin(true);
        setLoader(false);

        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } else {
        setLoader(false);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    }
  }

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
      name: "Verification",
      icon: "/assets/settings/verification.svg",
    },
  ];

  const adminSettings = [
    {
      name: "Profile",
      icon: "/assets/settings/profile.svg",
    },
    {
      name: "Security",
      icon: "/assets/settings/security.svg",
    },
    {
      name: "Verification",
      icon: "/assets/settings/verification.svg",
    },
    // {
    //   name: "Appearance",
    //   icon: "/assets/settings/appearance.svg",
    // },
    {
      name: "Deposit",
      icon: "/assets/settings/deposit.svg",
    },
    {
      name: "Withdrawal",
      icon: "/assets/settings/deposit.svg",
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
      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      <MainContainer>
        {loader ? (
          <MainPage>
            <CircularLoader
              bg="rgba(12, 108, 243, 0.2)"
              size="44"
              color="#0C6CF2"
            />
          </MainPage>
        ) : (
          <>
            <Sidebar
              selected="Settings"
              hidden={{ sidebarHidden, setSidebarHidden }}
            />
            <MainPage className="scrollbar-hide">
              <Header sidebar={{ sidebarHidden, setSidebarHidden }} />

              <SettingsStandard className="content">
                <p className="title">Settings</p>

                {isLoading && (
                  <div className="settings">
                    <div className="switcher-desktop">
                      {userSettings.map((us) => (
                        <SettingBoxStandard key={us.name}>
                          <p>
                            <Skeleton
                              variant="rounded"
                              width={200}
                              height={40}
                              sx={{
                                backgroundColor: "rgba(27, 31, 45)",
                                maxWidth: "100%",
                              }}
                            />
                            {/* {us.name} */}
                          </p>
                        </SettingBoxStandard>
                      ))}
                    </div>

                    <div className="wrapper">
                      {selectedSetting === "Profile" && (
                        <ProfileSettings
                          userData={userData}
                          loading={{ isLoading, setIsLoading }}
                        />
                      )}
                    </div>
                  </div>
                )}

                {!isLoading && (
                  <div className="settings">
                    <div className="switcher-desktop">
                      {!userIsAdmin &&
                        userSettings.map((us) => (
                          <SettingBoxStandard
                            key={us.name}
                            style={{
                              backgroundColor:
                                us.name === selectedSetting
                                  ? "#222739"
                                  : "transparent",
                            }}
                            onClick={() => handleSettingSwitch(us.name)}
                          >
                            <p
                              style={{
                                color:
                                  us.name === selectedSetting
                                    ? "white"
                                    : "#BAC2DE",
                              }}
                            >
                              {us.name}
                            </p>
                          </SettingBoxStandard>
                        ))}

                      {userIsAdmin &&
                        adminSettings.map((us) => (
                          <SettingBoxStandard
                            key={us.name}
                            style={{
                              backgroundColor:
                                us.name === selectedSetting
                                  ? "#222739"
                                  : "transparent",
                            }}
                            onClick={() => handleSettingSwitch(us.name)}
                          >
                            <p
                              style={{
                                color:
                                  us.name === selectedSetting
                                    ? "white"
                                    : "#BAC2DE",
                              }}
                            >
                              {us.name}
                            </p>
                          </SettingBoxStandard>
                        ))}
                    </div>

                    <div className="switcher-mobile">
                      <DropDownIconOutlined>
                        <div
                          className="wrapper"
                          onClick={() =>
                            setShowMobileOptions(!showMobileOptions)
                          }
                        >
                          <div className="content">
                            <div className="main">
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

                        {showMobileOptions && (
                          <ClickAwayListener
                            onClickAway={() => setShowMobileOptions(false)}
                          >
                            <div className="menu away style-4">
                              <div className="scrollable style-4">
                                {!userIsAdmin &&
                                  userSettings.map((setting) => (
                                    <span
                                      key={setting.name}
                                      onClick={() =>
                                        handleSettingChange(setting.name)
                                      }
                                    >
                                      <p>{setting.name}</p>
                                    </span>
                                  ))}

                                {userIsAdmin &&
                                  adminSettings.map((setting) => (
                                    <span
                                      key={setting.name}
                                      onClick={() =>
                                        handleSettingChange(setting.name)
                                      }
                                    >
                                      <p>{setting.name}</p>
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </ClickAwayListener>
                        )}
                      </DropDownIconOutlined>
                    </div>

                    <div className="wrapper">
                      {selectedSetting === "Profile" && (
                        <ProfileSettings
                          userData={userData}
                          loading={{ isLoading, setIsLoading }}
                        />
                      )}

                      {selectedSetting === "Security" && (
                        <SecuritySettings userData={userData} />
                      )}

                      {selectedSetting === "Appearance" && (
                        <AppearanceSettings />
                      )}

                      {selectedSetting === "Verification" && (
                        <VerificationSettings userData={userData} />
                      )}

                      {selectedSetting === "Deposit" && <DepositSettings />}

                      {selectedSetting === "Withdrawal" && (
                        <WithdrawalSettings />
                      )}
                    </div>
                  </div>
                )}
              </SettingsStandard>
            </MainPage>
          </>
        )}
      </MainContainer>
    </>
  );
};

const SettingBoxStandard = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px 16px;
  line-height: 28px;
  align-items: center;
  border-radius: 8px;
  font-family: Inter;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  p {
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }
`;

const SettingsStandard = styled.div`
  color: white;
  /* display: none; */

  .title {
    font-size: 28px;
    font-weight: 600;
  }

  .settings {
    display: grid;
    grid-template-columns: 220px auto;
    margin-top: 24px;
    gap: 48px;
  }

  .switcher-desktop {
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

const NotificationsSettingsStandard = styled.div``;

export default Settings;

// deposit x
// withdraw x
// subs x
// copy experts x
// verification x
// signals x
// admin & settings
// fix dropdown and components (esp trade)
// redesign assets card and design assets page
// swipeable notifications
// finish trade page and swipeable trade search
// real estate- final0
// 2fa
// typography
// colors
// add xrp
// finish countries and assets

// dropdown; notifications, toast & alerts
// add logic & firebase refactoring
// second sidebar // theme switching
