import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../../../firebase/firebase";
import { Skeleton } from "@mui/material";
import { getTimeNoti } from "../../../utils/utils";

const NotificationAlertsAdmin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let notificationList = [];

    async function getNotifications() {
      const q = query(
        collection(db, "adminNotifications"),
        orderBy("date", "desc")
      );

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

  return (
    <>
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
              <NotiAlertStandard>
                <div className="alert_top">
                  <div className="left_section">
                    {noti.userRef?.photoURL ? (
                      <img
                        src={noti.userRef.photoURL}
                        alt=""
                        className="user"
                      />
                    ) : (
                      <div className="user_circle">
                        <p>{noti.userRef.name.slice(0, 1)}</p>
                      </div>
                    )}
                    <span className="alert_details">
                      <span className="user_info">
                        <p className="user_name">{noti.userRef?.name}</p>
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
                    />
                    <div className="dot"></div>
                  </div>
                </div>

                {noti.type === "Deposit" && (
                  <div className="actions">
                    <button className="approve">
                      <p>Approve</p>
                    </button>
                    <button className="decline">
                      <p>Decline</p>
                    </button>
                  </div>
                )}
              </NotiAlertStandard>
            ))}
          </div>
          {/* bottom */}
          <div className="bottom">
            {/* <p>Mark all as read</p> */}
            <p>{""}</p>
            <button className="button">
              <p>Delete all notifications</p>
            </button>
          </div>
        </>
      ) : (
        <NotiAlertStandard>
          <p className="no_notifications">No new admin notifications.</p>
        </NotiAlertStandard>
      )}
    </>
  );
};

const NotiAlertStandard = styled.div`
  padding-bottom: 32px;
  transition: all 0.3s ease-in-out;
  padding: 24px;

  .no_notifications {
    font-weight: 500;
    color: #bac2de;
  }

  &:hover {
    background-color: rgba(25, 31, 52);
  }

  .trash {
    display: none;
    width: 20px;
    padding: 1px;
    transition: all 0.1s ease-in-out;
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

export default NotificationAlertsAdmin;
