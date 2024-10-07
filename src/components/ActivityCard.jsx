import { styled } from "styled-components";
import Marquee from "react-fast-marquee";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useContext, useEffect, useState } from "react";
import { context } from "../context/context";
import { Skeleton } from "@mui/material";

const ActivityCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const { userData } = useContext(context);

  useEffect(() => {
    let notificationList = [];

    async function getNotifications() {
      const q = query(
        collection(db, "notifications"),
        where("user", "==", userData.id),
        limit(4)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notificationList.push(data);
      });
      setNotifications(notificationList);
      setTimeout(() => {
        setIsLoading(false);
      }, 400);
    }

    if (userData) {
      getNotifications();
    }
  }, [userData]);

  return (
    <div
      style={{
        backgroundColor: "#151823",
        borderRadius: "12px",
        width: "100%",
        padding: " 24px",
        // maxHeight: "unset",
        height: "100%",
        backgroundColor: "rgba(27, 31, 45, 0.3)",
        borderRadius: "12px",
      }}
    >
      <p
        style={{
          color: "#BAC2DE",
          fontSize: "146x",
          fontWeight: "600",
          lineHeight: "24px",
          marginBottom: "24px",
          marginTop: "12px",
        }}
      >
        Recent activity
      </p>
      {isLoading ? (
        <div
          style={{
            fontSize: "16px",
            color: "white",
            fontWeight: "600",
            display: "grid",
            gap: "12px",
          }}
        >
          <p
            style={{
              lineHeight: "28px",
              padding: "4px 0px",
            }}
          >
            <Skeleton
              variant="rounded"
              sx={{ backgroundColor: "rgba(27, 31, 45)" }}
            />
          </p>
          <p
            style={{
              lineHeight: "28px",
              padding: "4px 0px",
            }}
          >
            <Skeleton
              variant="rounded"
              sx={{ backgroundColor: "rgba(27, 31, 45)" }}
            />
          </p>
          <p style={{ lineHeight: "28px", padding: "4px 0px" }}>
            <Skeleton
              variant="rounded"
              sx={{ backgroundColor: "rgba(27, 31, 45)" }}
            />
          </p>
          <p style={{ lineHeight: "28px", padding: "4px 0px" }}>
            <Skeleton
              variant="rounded"
              sx={{ backgroundColor: "rgba(27, 31, 45)" }}
            />
          </p>
          <p style={{ lineHeight: "28px", padding: "4px 0px" }}>
            <Skeleton
              variant="rounded"
              sx={{ backgroundColor: "rgba(27, 31, 45)" }}
            />
          </p>
        </div>
      ) : (
        <>
          {notifications.length > 0 && (
            <ActivityCardStandard style={{}}>
              {notifications.map((noti) => (
                <p key={noti.ref}>{noti.message}</p>
              ))}
            </ActivityCardStandard>
          )}

          {notifications.length <= 0 && (
            <ActivityCardStandard>
              <p>No recent activity</p>
            </ActivityCardStandard>
          )}
        </>
      )}
    </div>
  );
};

const ActivityCardStandard = styled.div`
  font-size: 16px;
  color: white;
  font-weight: 500;
  display: grid;
  gap: 12px;

  p {
    line-height: 28px;
    border-bottom: 1px solid rgba(31, 41, 55, 0.7);
    padding: 6px 0px;
  }

  p:last-child {
    border-bottom: none;
  }
`;

const Recent = styled.div`
  /* display: block; */
  /* animation: marquee 5s linear infinite; */
  /* overflow: hidden; */
  position: relative;
  /* margin-bottom: 32px; */
  width: 100%;

  .container {
    /* display: block; */
    width: 100%;
    height: fit-content;
    margin-top: 24px;
    position: absolute;
    /* display: flex;
    gap: 16px; */

    /* ma */
    /* bottom: 0; */
    /* overflow: hidden; */
    /* animation: marquee 10s linear infinite; */
    /* background-color: transparent; */
    /* animation: marquee 5s linear infinite; */

    /* white-space: nowrap; */
  }

  .container div {
    margin-left: 12px;
    /* margin-top: ; */
  }

  .container div {
    /* float: left;
    width: max-content; */

    /* z-index: 4; */
    /* height: 30px; */
    /* width: 50%; */
  }

  @keyframes marquee {
    0% {
      left: 0%;
    }
    100% {
      left: -100%; /* same as your text width */
    }
  }
`;

export default ActivityCard;
