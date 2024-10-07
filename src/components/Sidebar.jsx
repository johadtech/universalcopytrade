import { styled } from "styled-components";
// import { theme } from "../theme";
import { sidebarItems } from "../static";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { context, themeContext } from "../context/context";
import { ClickAwayListener, Skeleton, useMediaQuery } from "@mui/material";
import Toast from "../hooks/Toast";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Sidebar = ({ selected, hidden }) => {
  const navigate = useNavigate();
  const { theme } = useContext(themeContext);
  const [showGeneral, setShowGeneral] = useState(true);
  // const [showAdmin, setShowAdmin] = useState(true);
  const { sidebarHidden, setSidebarHidden } = hidden;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const mobile = useMediaQuery("(max-width: 768px)");
  const [showUserTab, setShowUserTab] = useState(false);
  const sidebarRef = useRef();
  // const drawerWidth = 280;
  const { userData, dispatch } = useContext(context);
  const [isLoading, setIsLoading] = useState(true);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  useEffect(() => {
    if (userData) {
      console.log("UserData in Sidebar:", userData);
      setIsLoading(false);
    }
  }, [userData]);

  function handleCollapserStandard() {
    if (sidebarHidden) {
      setSidebarHidden(false);
    }
    setSidebarCollapsed(!sidebarCollapsed);
  }

  window.addEventListener("resize", function () {
    {
      !mobile && setSidebarHidden(false);
    }
  });

  const userTabs = [
    {
      name: "View profile",
      icon: "./assets/sidebar/user-side-menu.svg",
    },
    {
      name: "Settings",
      icon: "./assets/sidebar/settings-side-menu.svg",
    },
    {
      name: "Log out",
      icon: "./assets/sidebar/log-out-side-menu.svg",
    },
  ];

  function handleClickAway() {
    setSidebarHidden(!sidebarHidden);
  }

  const menuRef = useRef();

  useEffect(() => {
    if (!mobile) return;
    const handler = (e) => {
      if (!sidebarRef.current.contains(e.target)) {
        setSidebarHidden(true);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [sidebarRef, mobile]);

  //const fullName = `${userData.firstname} ${userData.lastname}`;
  const fullName = userData ? `${userData.firstname || ''} ${userData.lastname || ''}` : 'Loading...';

  function handleUserTab(name) {
    console.log(name);
  }

  function handleAction(action) {
    switch (action.name) {
      case "View profile":
        navigate("/settings");
        break;
      case "Settings":
        navigate("/settings");
        break;
      case "Log out":
        dispatch({ type: "logout" });
        signOut(auth);
        navigate("/login");
        setToastType("success");
        setToastMessage("Logged out");
        setOpenToast(true);
        break;
      default:
        break;
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
      {/* {theme === "new" && (
        <SidebarNew>
          <p style={{ color: "white" }}>Priest</p>
        </SidebarNew>
      )}

      {theme === "oba" && (
        <SidebarNew>
          <p>Theme is Oba</p>
        </SidebarNew>
      )} */}

      {theme === "standard" &&
        (isLoading ? (
          <StandardContainer className={sidebarCollapsed && "collapsed"}>
            {!sidebarHidden && <Overlay></Overlay>}

            <img
              src="./assets/misc/arrow-left.svg"
              alt=""
              style={{}}
              onClick={handleCollapserStandard}
              className={sidebarCollapsed ? "closer collapsed" : "closer"}
            />

            {mobile && (
              <SidebarStandardMobile
                ref={sidebarRef}
                className={
                  sidebarHidden
                    ? sidebarCollapsed
                      ? "scrollbar-hide hidden collapsed"
                      : "sidebar-hide hidden"
                    : sidebarCollapsed
                    ? "scrollbar-hide collapsed"
                    : "scrollbar-hide "
                }
              >
                <div className="top_section">
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="./logo.svg"
                      alt="logo"
                      width="60px"
                      className="logo"
                    />
                    <img
                      src="./assets/misc/close.svg"
                      alt=""
                      className="sidebar_close"
                      onClick={() => setSidebarHidden(!sidebarHidden)}
                    />
                  </span>

                  <div className="selectable_sections">
                    <div className="selectable_section">
                      <div className="section_title">
                        <span>
                          <p>General</p>
                        </span>

                        {showGeneral && (
                          <img
                            src="./assets/sidebar/minus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowGeneral(!showGeneral)}
                          />
                        )}

                        {!showGeneral && (
                          <img
                            src="./assets/sidebar/plus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowGeneral(!showGeneral)}
                          />
                        )}
                      </div>

                      <div
                        className={
                          showGeneral ? "sidebar_items" : "sidebar_items off"
                        }
                      >
                        {sidebarItems.map((item) => (
                          <span
                            onClick={() => navigate(item.link)}
                            className={
                              item.name === selected
                                ? "sidebar_item active"
                                : "sidebar_item"
                            }
                          >
                            <img src={item.icon} alt="" />
                            <p>{item.name}</p>
                          </span>
                        ))}
                        {userData.admin && (
                          <span
                            onClick={() => navigate("/manage")}
                            className={
                              selected === "Manage"
                                ? "sidebar_item active"
                                : "sidebar_item"
                            }
                          >
                            <img src="./assets/sidebar/manage.svg" alt="" />
                            <p>Manage</p>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* <div
                      className="selectable_section"
                      style={{ marginTop: showGeneral ? "32px" : "12px" }}
                    >
                      <div className="section_title">
                        <span>
                          <p>Admin</p>
                        </span>

                        {showAdmin && (
                          <img
                            src="./assets/sidebar/minus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowAdmin(!showAdmin)}
                          />
                        )}

                        {!showAdmin && (
                          <img
                            src="./assets/sidebar/plus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowAdmin(!showAdmin)}
                          />
                        )}
                      </div>

                      <div
                        className={
                          showAdmin ? "sidebar_items" : "sidebar_items off"
                        }
                      >
                        {adminItems.map((item) => (
                          <span
                            onClick={() => navigate(item.link)}
                            className={
                              item.name === selected
                                ? "sidebar_item active"
                                : "sidebar_item"
                            }
                          >
                            <p>{item.name}</p>
                          </span>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </div>

                <BottomSectionStandard className="bottom_section">
                  {showUserTab && (
                    <ClickAwayListener
                      onClickAway={() => setShowUserTab(false)}
                    >
                      <div className="menu">
                        {userTabs.map((tab) => (
                          <span onClick={() => handleAction(tab)}>
                            <img src={tab.icon} alt="" />
                            <p>{tab.name}</p>
                          </span>
                        ))}
                      </div>
                    </ClickAwayListener>
                  )}
                  {/* User_tab */}
                  <div
                    className="user_tab"
                    onClick={() => setShowUserTab(!showUserTab)}
                  >
                    <span className="user_container">
                      <Skeleton
                        variant="circular"
                        height={48}
                        width={48}
                        sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                      />
                      <span className="user_details">
                        <p className="name">
                          <Skeleton
                            variant="rounded"
                            // height={48}
                            width={100}
                            sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                          />
                        </p>
                        <p className="account">
                          <Skeleton
                            variant="rounded"
                            // height={48}
                            width={48}
                            sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                          />
                        </p>
                      </span>
                    </span>
                  </div>
                </BottomSectionStandard>
              </SidebarStandardMobile>
            )}

            {!mobile && (
              <SidebarStandardDesktop
                className={
                  sidebarHidden
                    ? sidebarCollapsed
                      ? "scrollbar-hide hidden collapsed"
                      : "sidebar-hide hidden"
                    : sidebarCollapsed
                    ? "scrollbar-hide collapsed"
                    : "scrollbar-hide "
                }
              >
                <div className="top_section">
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="./logo.svg"
                      alt="logo"
                      width="60px"
                      className="logo"
                    />
                  </span>

                  <div className="selectable_sections">
                    <div className="selectable_section">
                      <div className="section_title">
                        <span>
                          <p>General</p>
                        </span>

                        {showGeneral && (
                          <img
                            src="./assets/sidebar/minus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowGeneral(!showGeneral)}
                          />
                        )}

                        {!showGeneral && (
                          <img
                            src="./assets/sidebar/plus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowGeneral(!showGeneral)}
                          />
                        )}
                      </div>

                      <div
                        className={
                          showGeneral ? "sidebar_items" : "sidebar_items off"
                        }
                      >
                        {sidebarItems.map((item) => (
                          <span
                            onClick={() => navigate(item.link)}
                            className={
                              item.name === selected
                                ? "sidebar_item active"
                                : "sidebar_item"
                            }
                          >
                            <img src={item.icon} alt="" />
                            <p>{item.name}</p>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* <div
                      className="selectable_section"
                      style={{ marginTop: showGeneral ? "32px" : "12px" }}
                    >
                      <div className="section_title">
                        <span>
                          <p>Admin</p>
                        </span>

                        {showAdmin && (
                          <img
                            src="./assets/sidebar/minus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowAdmin(!showAdmin)}
                          />
                        )}

                        {!showAdmin && (
                          <img
                            src="./assets/sidebar/plus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowAdmin(!showAdmin)}
                          />
                        )}
                      </div>

                      <div
                        className={
                          showAdmin ? "sidebar_items" : "sidebar_items off"
                        }
                      >
                        {adminItems.map((item) => (
                          <span
                            onClick={() => navigate(item.link)}
                            className={
                              item.name === selected
                                ? "sidebar_item active"
                                : "sidebar_item"
                            }
                          >
                            <p>{item.name}</p>
                          </span>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </div>

                {!sidebarCollapsed && (
                  <BottomSectionStandard className="bottom_section">
                    {showUserTab && (
                      <ClickAwayListener
                        onClickAway={() => setShowUserTab(false)}
                      >
                        <div className="menu">
                          {userTabs.map((tab) => (
                            <span onClick={() => handleAction(tab)}>
                              <img src={tab.icon} alt="" />
                              <p>{tab.name}</p>
                            </span>
                          ))}
                        </div>
                      </ClickAwayListener>
                    )}
                    <div
                      className="user_tab"
                      // onClick={() => setShowUserTab(!showUserTab)}
                    >
                      <span className="user_container">
                        <Skeleton
                          variant="circular"
                          height={40}
                          width={40}
                          sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                        />
                        <span className="user_details">
                          <p className="name">
                            <Skeleton
                              variant="rounded"
                              // height={48}
                              width={100}
                              sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                            />
                          </p>
                          <p className="account">
                            <Skeleton
                              variant="rounded"
                              // height={48}
                              width={48}
                              sx={{ backgroundColor: "rgba(27, 31, 45)" }}
                            />
                          </p>
                        </span>
                      </span>
                    </div>
                  </BottomSectionStandard>
                )}
              </SidebarStandardDesktop>
            )}
          </StandardContainer>
        ) : (
          <StandardContainer className={sidebarCollapsed && "collapsed"}>
            {!sidebarHidden && <Overlay></Overlay>}

            <img
              src="./assets/misc/arrow-left.svg"
              alt=""
              style={{}}
              onClick={handleCollapserStandard}
              className={sidebarCollapsed ? "closer collapsed" : "closer"}
            />

            {mobile && (
              <SidebarStandardMobile
                ref={sidebarRef}
                className={
                  sidebarHidden
                    ? sidebarCollapsed
                      ? "scrollbar-hide hidden collapsed"
                      : "sidebar-hide hidden"
                    : sidebarCollapsed
                    ? "scrollbar-hide collapsed"
                    : "scrollbar-hide "
                }
              >
                <div className="top_section">
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="./logo.svg"
                      alt="logo"
                      width="60px"
                      className="logo"
                    />
                    <img
                      src="./assets/misc/close.svg"
                      alt=""
                      className="sidebar_close"
                      onClick={() => setSidebarHidden(!sidebarHidden)}
                    />
                  </span>

                  <div className="selectable_sections">
                    <div className="selectable_section">
                      <div className="section_title">
                        <span>
                          <p>General</p>
                        </span>

                        {showGeneral && (
                          <img
                            src="./assets/sidebar/minus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowGeneral(!showGeneral)}
                          />
                        )}

                        {!showGeneral && (
                          <img
                            src="./assets/sidebar/plus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowGeneral(!showGeneral)}
                          />
                        )}
                      </div>

                      <div
                        className={
                          showGeneral ? "sidebar_items" : "sidebar_items off"
                        }
                      >
                        {sidebarItems.map((item) => (
                          <Link to={item.link} key={item.name} className="link">
                            <span
                              // onClick={() => navigate(item.link)}
                              className={
                                item.name === selected
                                  ? "sidebar_item active"
                                  : "sidebar_item"
                              }
                            >
                              <img src={item.icon} alt="" />
                              <p>{item.name}</p>
                            </span>
                          </Link>
                        ))}
                        {userData.admin && (
                          <Link to="/manage" className="link">
                            <span
                              // onClick={() => navigate("/manage")}
                              className={
                                selected === "Manage"
                                  ? "sidebar_item active"
                                  : "sidebar_item"
                              }
                            >
                              <img src="./assets/sidebar/manage.svg" alt="" />
                              <p>Manage</p>
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* <div
                      className="selectable_section"
                      style={{ marginTop: showGeneral ? "32px" : "12px" }}
                    >
                      <div className="section_title">
                        <span>
                          <p>Admin</p>
                        </span>

                        {showAdmin && (
                          <img
                            src="./assets/sidebar/minus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowAdmin(!showAdmin)}
                          />
                        )}

                        {!showAdmin && (
                          <img
                            src="./assets/sidebar/plus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowAdmin(!showAdmin)}
                          />
                        )}
                      </div>

                      <div
                        className={
                          showAdmin ? "sidebar_items" : "sidebar_items off"
                        }
                      >
                        {adminItems.map((item) => (
                          <span
                            onClick={() => navigate(item.link)}
                            className={
                              item.name === selected
                                ? "sidebar_item active"
                                : "sidebar_item"
                            }
                          >
                            <p>{item.name}</p>
                          </span>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </div>

                <BottomSectionStandard className="bottom_section">
                  {showUserTab && (
                    <ClickAwayListener
                      onClickAway={() => setShowUserTab(false)}
                    >
                      <div className="menu">
                        {userTabs.map((tab) => (
                          <span onClick={() => handleAction(tab)}>
                            <img src={tab.icon} alt="" />
                            <p>{tab.name}</p>
                          </span>
                        ))}
                      </div>
                    </ClickAwayListener>
                  )}
                  {/* User_tab */}
                  <div
                    className="user_tab"
                    onClick={() => setShowUserTab(!showUserTab)}
                  >
                    <span className="user_container">
                      {userData && userData.photoURL ? (
                        <img src={userData.photoURL} alt="" />
                      ) : (
                        <div className="user_circle">
                          <p>{userData.firstname?.slice(0, 1)}</p>
                        </div>
                      )}
                      <span className="user_details">
                        <p className="name">
                          {userData?.firstname} {userData?.lastname}
                        </p>
                        {userData.accountType && (
                          <p className="account">
                            {userData?.accountType} account
                          </p>
                        )}
                      </span>
                    </span>

                    <span
                      className={showUserTab ? "selectors tab" : "selectors"}
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
                </BottomSectionStandard>
              </SidebarStandardMobile>
            )}

            {!mobile && (
              <SidebarStandardDesktop
                className={
                  sidebarHidden
                    ? sidebarCollapsed
                      ? "scrollbar-hide hidden collapsed"
                      : "sidebar-hide hidden"
                    : sidebarCollapsed
                    ? "scrollbar-hide collapsed"
                    : "scrollbar-hide "
                }
              >
                <div className="top_section">
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="./logo.svg"
                      alt="logo"
                      width="60px"
                      className="logo"
                    />
                  </span>

                  <div className="selectable_sections">
                    <div className="selectable_section">
                      <div className="section_title">
                        <span>
                          <p>General</p>
                        </span>

                        {showGeneral && (
                          <img
                            src="./assets/sidebar/minus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowGeneral(!showGeneral)}
                          />
                        )}

                        {!showGeneral && (
                          <img
                            src="./assets/sidebar/plus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowGeneral(!showGeneral)}
                          />
                        )}
                      </div>

                      <div
                        className={
                          showGeneral ? "sidebar_items" : "sidebar_items off"
                        }
                      >
                        {sidebarItems.map((item) => (
                          <Link to={item.link} key={item.name} className="link">
                            <span
                              // onClick={() => navigate(item.link)}
                              className={
                                item.name === selected
                                  ? "sidebar_item active"
                                  : "sidebar_item"
                              }
                            >
                              <img src={item.icon} alt="" />
                              <p>{item.name}</p>
                            </span>
                          </Link>
                        ))}
                        {userData.admin && (
                          <Link to="/manage" className="link">
                            <span
                              // onClick={() => navigate("/manage")}
                              className={
                                selected === "Manage"
                                  ? "sidebar_item active"
                                  : "sidebar_item"
                              }
                            >
                              <img src="./assets/sidebar/manage.svg" alt="" />
                              <p>Manage</p>
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* <div
                      className="selectable_section"
                      style={{ marginTop: showGeneral ? "32px" : "12px" }}
                    >
                      <div className="section_title">
                        <span>
                          <p>Admin</p>
                        </span>

                        {showAdmin && (
                          <img
                            src="./assets/sidebar/minus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowAdmin(!showAdmin)}
                          />
                        )}

                        {!showAdmin && (
                          <img
                            src="./assets/sidebar/plus.svg"
                            alt=""
                            className="close"
                            onClick={() => setShowAdmin(!showAdmin)}
                          />
                        )}
                      </div>

                      <div
                        className={
                          showAdmin ? "sidebar_items" : "sidebar_items off"
                        }
                      >
                        {adminItems.map((item) => (
                          <span
                            onClick={() => navigate(item.link)}
                            className={
                              item.name === selected
                                ? "sidebar_item active"
                                : "sidebar_item"
                            }
                          >
                            <p>{item.name}</p>
                          </span>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </div>

                {!sidebarCollapsed && (
                  <BottomSectionStandard className="bottom_section">
                    {showUserTab && (
                      <ClickAwayListener
                        onClickAway={() => setShowUserTab(false)}
                      >
                        <div className="menu">
                          {userTabs.map((tab) => (
                            <span onClick={() => handleAction(tab)}>
                              <img src={tab.icon} alt="" />
                              <p>{tab.name}</p>
                            </span>
                          ))}
                        </div>
                      </ClickAwayListener>
                    )}
                    <div
                      className="user_tab"
                      onClick={() => setShowUserTab(!showUserTab)}
                    >
                      <span className="user_container">
                        {userData && userData.photoURL ? (
                          <img src={userData.photoURL} alt="" />
                        ) : (
                          <div className="user_circle">
                            <p>{userData.firstname?.slice(0, 1)}</p>
                          </div>
                        )}

                        <span className="user_details">
                          {fullName.length <= 21 && (
                            <p className="name">
                              {userData.firstname} {userData.lastname}
                            </p>
                          )}

                          {fullName.length > 21 && (
                            <p className="name">{userData.firstname}</p>
                          )}
                          {userData.accountType && (
                            <p className="account">
                              {userData.accountType} account
                            </p>
                          )}
                        </span>
                      </span>

                      {/* selectors */}
                      <span
                        className={showUserTab ? "selectors tab" : "selectors"}
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

                      {/* <img src="./assets/sidebar/selector.svg" alt="" /> */}
                    </div>
                  </BottomSectionStandard>
                )}
              </SidebarStandardDesktop>
            )}
          </StandardContainer>
        ))}
    </>
  );
};

const Overlay = styled.div`
  position: absolute;
  background-color: black;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  user-select: none;
  pointer-events: none;
  opacity: 0.2;
  z-index: 10000;
  display: none;

  @media screen and (max-width: 1024px) {
    visibility: visible;
  }
`;

const StandardContainer = styled.div`
  max-width: 280px;
  width: 100%;
  position: relative;
  z-index: 10001;

  .link {
    color: transparent;
    text-decoration: none;
  }

  &.collapsed {
    max-width: max-content;

    @media screen and (max-width: 768px) {
      max-width: 280px;
      width: 100%;
    }
  }

  .closer {
    background-color: #111522;
    padding: 8px;
    position: absolute;
    border-radius: 8px;
    right: -30px;
    top: 30px;
    z-index: 99991;
    cursor: pointer;
    transition: all 300ms ease-in-out;

    @media screen and (max-width: 768px) {
      display: none;
    }

    &.collapsed {
      transform: rotate(180deg);
    }
  }

  @media screen and (max-width: 768px) {
    position: fixed;
    left: 0;
  }
`;

const SidebarStandardMobile = styled.div`
  padding: 32px 16px;
  height: 100vh;
  background-color: #080a11;
  max-width: 280px;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 9998;
  max-height: 100vh;
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  justify-content: space-between;
  transition: all 300ms ease-in-out;

  * {
    transition: all 300ms ease-in-out;
  }

  &.collapsed {
    max-width: max-content;

    @media screen and (max-width: 768px) {
      max-width: 280px;
      width: 100%;
    }
  }

  &.collapsed .sidebar_close {
    display: none;

    @media screen and (max-width: 768px) {
      display: block;
    }
  }

  &.collapsed .section_title {
    display: none;
    @media screen and (max-width: 768px) {
      display: flex;
    }
  }

  &.collapsed .sidebar_item {
    display: grid;
    place-content: center;

    @media screen and (max-width: 768px) {
      display: flex;
      place-content: unset;
    }
  }

  &.collapsed .sidebar_item p {
    display: none;

    @media screen and (max-width: 768px) {
      display: block;
    }
  }

  &.hidden {
    display: none;
    transition: display 400ms 0ms;
  }

  .top_section {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .selectable_sections {
  }

  .selectable_section {
    display: grid;
    gap: 8px;
  }

  .section_title {
    display: flex;
    /* background-color: red; */
    justify-content: space-between;
    align-items: center;
  }

  .section_title p {
    color: #bac2de;
    font-weight: 600;
    font-size: 16px;

    /* text-transform: ; */
  }

  .close,
  .sidebar_close {
    cursor: pointer;
    transition: all 0.1s cubic-bezier(0.46, 0.03, 0.52, 0.96);
  }

  .close:hover,
  .sidebar_close:hover {
    background-color: #111522;
    border-radius: 8px;
  }

  .sidebar_close {
    visibility: hidden;
    pointer-events: none;
    user-select: none;

    @media screen and (max-width: 1024px) {
      visibility: visible;
      pointer-events: all;
      user-select: all;
    }
  }

  .sidebar_items {
    display: grid;
    gap: 4px;
    transition: all 0.1s cubic-bezier(0.46, 0.03, 0.52, 0.96);
  }

  .sidebar_items.off {
    display: none;
  }

  .sidebar_item {
    cursor: pointer;
    display: flex;
    padding: 8px 12px;
    background-color: transparent;
    gap: 12px;
    align-items: center;
    border-radius: 8px;
    transition: all 0.1s cubic-bezier(0.46, 0.03, 0.52, 0.96);
  }

  .sidebar_item:hover {
    transform: translateX(8px);
    background-color: #111522;
  }

  .sidebar_item.active {
    background-color: #0c6cf2;
  }

  .sidebar_item.active img {
    filter: invert(0%) sepia(0%) saturate(0%) hue-rotate(334deg)
      brightness(200%) contrast(100%);
  }

  .sidebar_item p {
    color: #bac2de;
    font-weight: 600;
    font-size: 16px;
  }

  .sidebar_item.active p {
    color: #ffffff;
  }

  @media screen and (max-width: 768px) {
    position: fixed;
    /* top: 72px; */
    left: 0;
  }
`;

const SidebarStandardDesktop = styled.div`
  padding: 32px 16px;
  height: 100vh;
  /* background-color: rgb(3 7 18); */
  background-color: #080a11;
  max-width: 280px;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 10001;
  max-height: 100vh;
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  justify-content: space-between;
  transition: all 300ms ease-in-out;

  * {
    transition: all 300ms ease-in-out;
  }

  &.collapsed {
    max-width: max-content;

    @media screen and (max-width: 768px) {
      max-width: 280px;
      width: 100%;
    }
  }

  &.collapsed .sidebar_close {
    display: none;

    @media screen and (max-width: 768px) {
      display: block;
    }
  }

  &.collapsed .section_title {
    display: none;
    @media screen and (max-width: 768px) {
      display: flex;
    }
  }

  &.collapsed .sidebar_item {
    display: grid;
    place-content: center;

    @media screen and (max-width: 768px) {
      display: flex;
      place-content: unset;
    }
  }

  &.collapsed .sidebar_item p {
    display: none;

    @media screen and (max-width: 768px) {
      display: block;
    }
  }

  &.hidden {
    display: none;
    transition: display 400ms 0ms;
  }

  .top_section {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .selectable_sections {
  }

  .selectable_section {
    display: grid;
    gap: 8px;
  }

  .section_title {
    display: flex;
    /* background-color: red; */
    justify-content: space-between;
    align-items: center;
  }

  .section_title p {
    color: #bac2de;
    font-weight: 600;
    font-size: 16px;

    /* text-transform: ; */
  }

  .close,
  .sidebar_close {
    cursor: pointer;
    transition: all 0.1s cubic-bezier(0.46, 0.03, 0.52, 0.96);
  }

  .close:hover,
  .sidebar_close:hover {
    background-color: #111522;
    border-radius: 8px;
  }

  .sidebar_close {
    visibility: hidden;
    pointer-events: none;
    user-select: none;

    @media screen and (max-width: 1024px) {
      visibility: visible;
      pointer-events: all;
      user-select: all;
    }
  }

  .sidebar_items {
    display: grid;
    gap: 4px;
    transition: all 0.1s cubic-bezier(0.46, 0.03, 0.52, 0.96);
  }

  .sidebar_items.off {
    display: none;
  }

  .sidebar_item {
    cursor: pointer;
    display: flex;
    padding: 8px 12px;
    background-color: transparent;
    gap: 12px;
    align-items: center;
    border-radius: 8px;
    transition: all 0.1s cubic-bezier(0.46, 0.03, 0.52, 0.96);
  }

  .sidebar_item:hover {
    transform: translateX(8px);
    background-color: #111522;
  }

  .sidebar_item.active {
    background-color: #0c6cf2;
  }

  .sidebar_item.active img {
    filter: invert(0%) sepia(0%) saturate(0%) hue-rotate(334deg)
      brightness(200%) contrast(100%);
  }

  .sidebar_item p {
    color: #bac2de;
    font-weight: 600;
    font-size: 16px;
  }

  .sidebar_item.active p {
    color: #ffffff;
  }

  @media screen and (max-width: 768px) {
    position: fixed;
    left: 0;
  }
`;

const BottomSectionStandard = styled.div`
  position: relative;
  /* display: none; */

  .selectors {
    position: relative;
    display: flex;
    align-items: center;
    /* margin-left: 2px; */
  }

  .selectors svg {
    transition: all 0.3s cubic-bezier(0.65, 0.05, 0.36, 1);
    position: absolute;
    margin-left: -20px;
  }

  .selectors.tab svg:nth-child(1) {
    transform: translateY(-2px);
  }

  .selectors.tab svg:nth-child(2) {
    transform: translateY(2px);
  }

  .selector path {
    transform: translateY(3px);
    /* stroke: red; */
  }

  .user_tab {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #111522;
    padding: 12px;
    border-radius: 8px;
    margin-top: 32px;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    margin-bottom: 80px;
    /* .user_tab {
    } */
    /* .bottom { */
    /* position: absolute; */
    /* bottom: 0px; */
    /* width: 100%; */
    /* right: 0px; */
    /* margin-bottom: 56px; */
    /* } */
    /* margin-bottom: calc(80px); */

    /* .selectors { */
    /* bottom: 100px; */
    /* margin-left: 2px; */
    /* } */
  }

  .menu {
    position: absolute;
    background-color: #121623;
    bottom: 72px;
    width: 100%;
    border-radius: 8px;
    z-index: 10;
    padding: 4px;
  }

  .menu span {
    display: flex;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    align-items: center;
    color: #bac2de;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }

  .menu span:hover {
    background-color: #1c233b;
    border-radius: 6px;
  }

  /* .menu span.active {
    display: flex;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    align-items: center;
    color: #bac2de;
    padding: 12px 16px;
    cursor: pointer;
   
  } */

  .user_container {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .user_container img {
    width: 40px;
    height: 40px;
    border-radius: 100%;
  }

  .user_circle {
    min-width: 40px;
    min-height: 40px;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-color: #1b1f2d;
    display: grid;
    color: #bac2de;
    font-weight: 600;
    font-size: 18px;
    display: flex;
  }

  .user_circle p {
    place-self: center;
    width: 40px;
    text-align: center;
  }

  .user_details {
    display: grid;
    gap: 4px;
  }

  .name {
    font-size: 14px;
    color: white;
    font-weight: 600;
    /* max-width: 100px; */
    width: 100%;
    text-overflow: hidden;
    max-height: 28px;
    overflow: hidden;
  }

  .account {
    font-size: 14px;
    color: #bac2de;
  }
`;

export default Sidebar;
