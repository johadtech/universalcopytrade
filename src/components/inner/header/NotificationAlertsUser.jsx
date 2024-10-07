import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../../../firebase/firebase";
import { Skeleton } from "@mui/material";
import { getTimeNoti } from "../../../utils/utils";
import Toast from "../../../hooks/Toast";

const NotificationAlertsUser = ({ id, open }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const { showNotis, setShowNotis } = open;

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  useEffect(() => {
    let notificationList = [];

    async function getNotifications() {
      const q = query(collection(db, "notifications"), where("user", "==", id));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        notificationList.push(doc.data());
      });

      setNotifications(notificationList);

      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }

    getNotifications();
  }, []);

  async function deleteAllNotifications() {
    notifications.forEach((notification) => {
      deleteNoti(notification.ref);
    });
  }

  async function deleteNoti(ref) {
    setIsLoading(true);

    const q = doc(db, "notifications", ref);
    try {
      await deleteDoc(q);

      setToastType("success");
      setToastMessage("Deleted successfully");
      setOpenToast(true);
      setIsLoading(false);
      setTimeout(() => {
        setIsLoading(false);
        setShowNotis(false);
      }, 600);
      // switchType();
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false);
        // setShowNotis(false);
      }, 600);
      setToastType("error");
      setToastMessage("Could not delete. Please try again later");
      setOpenToast(true);
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

      {isLoading ? (
        <>
          <div className="alerts style-4">
            <NotiAlertStandard>
              <div className="alert_top">
                <div className="left_section">
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    sx={{
                      backgroundColor: "rgba(16, 24, 40)",
                      // maxWidth: "40%",
                    }}
                  />
                  <span className="alert_details">
                    <span className="user_info">
                      <p className="user_name">
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          height={20}
                          sx={{
                            backgroundColor: "rgba(16, 24, 40)",
                            // maxWidth: "40%",
                          }}
                        />
                      </p>
                      <p className="alert_timeline">
                        <Skeleton
                          variant="rounded"
                          width={70}
                          height={20}
                          sx={{
                            backgroundColor: "rgba(16, 24, 40)",
                            // maxWidth: "40%",
                          }}
                        />
                      </p>
                    </span>

                    <p className="alert_detail">
                      <Skeleton
                        variant="rounded"
                        // width={100}
                        height={20}
                        sx={{
                          backgroundColor: "rgba(16, 24, 40)",
                          marginTop: "8px",
                          width: "100%",
                        }}
                      />
                    </p>
                  </span>
                </div>
                <div className="right_section">
                  <Skeleton
                    variant="circular"
                    // width={100}
                    width={10}
                    height={10}
                    sx={{
                      backgroundColor: "rgba(16, 24, 40)",
                    }}
                  />
                </div>
              </div>
            </NotiAlertStandard>
            <NotiAlertStandard>
              <div className="alert_top">
                <div className="left_section">
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    sx={{
                      backgroundColor: "rgba(16, 24, 40)",
                      // maxWidth: "40%",
                    }}
                  />
                  <span className="alert_details">
                    <span className="user_info">
                      <p className="user_name">
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          height={20}
                          sx={{
                            backgroundColor: "rgba(16, 24, 40)",
                            // maxWidth: "40%",
                          }}
                        />
                      </p>
                      <p className="alert_timeline">
                        <Skeleton
                          variant="rounded"
                          width={70}
                          height={20}
                          sx={{
                            backgroundColor: "rgba(16, 24, 40)",
                            // maxWidth: "40%",
                          }}
                        />
                      </p>
                    </span>

                    <p className="alert_detail">
                      <Skeleton
                        variant="rounded"
                        // width={100}
                        height={20}
                        sx={{
                          backgroundColor: "rgba(16, 24, 40)",
                          marginTop: "8px",
                          width: "100%",
                        }}
                      />
                    </p>
                  </span>
                </div>
                <div className="right_section">
                  <Skeleton
                    variant="circular"
                    // width={100}
                    width={10}
                    height={10}
                    sx={{
                      backgroundColor: "rgba(16, 24, 40)",
                    }}
                  />
                </div>
              </div>
            </NotiAlertStandard>
          </div>

          {/* bottom */}
          <div className="bottom">
            {/* <p>Mark all as read</p> */}
            <p>{""}</p>
            <Skeleton
              variant="rounded"
              width={100}
              // height={20}
              sx={{
                backgroundColor: "rgba(16, 24, 40)",
                marginTop: "8px",
                width: "100%",
              }}
            />
          </div>
        </>
      ) : notifications.length > 0 ? (
        <>
          <div className="alerts style-4">
            {notifications.map((noti) => (
              <NotiAlertStandard className="alert" key={noti.ref}>
                <div className="alert_top">
                  <div className="left_section">
                    <span className="alert_details">
                      <span className="user_info">
                        <p className="user_name">{noti?.type}</p>
                        <p className="alert_timeline">
                          {getTimeNoti(new Date() - noti.date.toDate())}
                        </p>
                      </span>

                      <p className="alert_detail">{noti?.message}</p>
                    </span>
                  </div>
                  <div className="right_section">
                    <img
                      src="./assets/misc/trash.svg"
                      alt=""
                      className="trash"
                      onClick={() => deleteNoti(noti.ref)}
                    />
                    <div className="dot"></div>
                  </div>
                </div>
              </NotiAlertStandard>
            ))}
          </div>
          {/* bottom */}
          <div className="bottom">
            {/* <p>Mark all as read</p> */}
            <p>{""}</p>
            <button className="button" onClick={deleteAllNotifications}>
              <p>Delete all notifications</p>
            </button>
          </div>
        </>
      ) : (
        <NotiAlertStandard>
          <p className="no_notifications">No new notifications.</p>
        </NotiAlertStandard>
      )}
    </>
  );
};

const NotiAlertStandard = styled.div`
  transition: all 0.3s ease-in-out;
  padding: 24px;
  /* background-color: red; */
  /* padding-bottom: 72px; */

  .no_notifications {
    font-weight: 500;
    color: #bac2de;
  }

  &:last-child {
    padding-bottom: 210px;
  }

  &:hover {
    background-color: rgba(25, 31, 52);
  }

  .trash {
    display: none;
    width: 20px;
    padding: 1px;
    transition: all 0.1s ease-in-out;
    cursor: pointer;
  }

  .trash:hover {
    background-color: rgba(16, 24, 40);
    border-radius: 4px;
  }

  &:hover .trash {
    display: block;
  }

  .dot {
    width: 10px;
    height: 10px;
    background-color: #17b26a;
    border-radius: 100%;
    transition: all 0.1s ease-in-out;
    display: none;
  }

  &:hover .dot {
    display: none;
  }

  .actions {
    margin-top: 20px;
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .alert_top {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .alert_top .left_section {
    display: flex;
    gap: 12px;
  }
  .alert_top .left_section img {
    width: 48px;
    height: 48px;
    border-radius: 100%;
  }

  .alert_top .left_section .alert_details {
  }

  .user_info {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .user_info .user_name {
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
  }

  .alert_detail {
    font-size: 16px;
    color: #bac2de;
    line-height: 20px;
    /* max-width: 98%; */
  }

  .alert_timeline {
    font-size: 14px;
    color: #bac2de;
    line-height: 18px;
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }

  button.approve {
    padding: 8px 16px;
    border-radius: 8px;
    color: white;
    background-color: #0c6cf2;
    font-size: 12px;
    font-weight: 600;
    border: none;
    font-family: Inter;
  }

  button.decline {
    padding: 8px 16px;
    border-radius: 8px;
    color: white;
    background-color: #ff3344;
    font-size: 12px;
    font-weight: 600;
    border: none;
    font-family: Inter;
  }
`;

export default NotificationAlertsUser;
