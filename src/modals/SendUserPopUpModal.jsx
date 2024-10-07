import { useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import {
  AmountBox,
  DropDownIcon,
  FullButton,
  MiniAmountBox,
  MiniAmountBoxFull,
  TextBox,
} from "../styled/input/Input";
import CircularLoader from "../styled/loaders/CircularLoader";
import Toast from "../hooks/Toast";
import { db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const SendUserPopupModal = ({ open, ogPopup, user }) => {
  const { popup, setPopup } = open;
  const { hasPopup, setHasPopup } = ogPopup;
  const { userDetails, setUserDetails } = user;

  const { id } = userDetails;

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // title
  const titleRef = useRef();
  const [title, setTitle] = useState(undefined);
  function handleTitle(e) {
    const { value } = e.target;

    if (value) {
      // console.log(value);
      setTitle(value);
    } else {
      setTitle("");
    }
  }

  // message
  const messageRef = useRef();
  const [message, setMessage] = useState(undefined);

  function handleMessage(e) {
    const { value } = e.target;

    if (value) {
      // console.log(value);
      setMessage(value);
    } else {
      setMessage("");
    }
  }

  // submit
  const [isSendingPopup, setIsSendingPopup] = useState(false);
  async function handleSendPopup() {
    setIsSendingPopup(true);
    const profile = doc(db, "users", id);
    await updateDoc(profile, {
      popup: {
        title,
        text: message,
      },
    })
      .then(() => {
        // console.log("profile saved");
        setIsSendingPopup(false);
        setToastType("success");
        setToastMessage("Sent successfully");
        setOpenToast(true);

        setTimeout(() => {
          setPopup(false);
        }, 400);
      })
      .catch((error) => {
        // console.log("error", error);
        setIsSendingPopup(false);
        setToastType("error");
        setToastMessage("Failed to send. Please try again later");
        setOpenToast(true);
      });
  }

  // remove
  const [isDeleting, setIsDeleting] = useState(false);
  async function handleDeletePopup() {
    setIsDeleting(true);
    const profile = doc(db, "users", id);
    await updateDoc(profile, {
      popup: false,
    })
      .then(() => {
        // console.log("profile saved");
        setIsDeleting(false);
        setToastType("success");
        setToastMessage("Deleted successfully");
        setOpenToast(true);

        setTimeout(() => {
          setPopup(false);
        }, 400);
      })
      .catch((error) => {
        // console.log("error", error);
        setIsDeleting(false);
        setToastType("error");
        setToastMessage("Failed to delete. Please try again later");
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
        open={popup}
        onClose={() => setPopup(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
          padding: "12px",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Send pop-up</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setPopup(!popup)}
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

          <div className="modal_content">
            <div className="top">
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

              <TextBox className="scrollbar-hide">
                <label htmlFor="address">Title:</label>
                <br />
                <input
                  type="text"
                  placeholder="Deposit now"
                  ref={titleRef}
                  onChange={handleTitle}
                />
              </TextBox>

              <TextBox className="scrollbar-hide">
                <label htmlFor="address">Message:</label>
                <br />
                <input
                  type="text"
                  placeholder="Make a deposit"
                  ref={messageRef}
                  onChange={handleMessage}
                />
              </TextBox>
            </div>

            <div className="bottom">
              {/* <button style={{ backgroundColor: "#ff3344" }}>Delete</button>
            <button>Send </button> */}
              <FullButton
                className={
                  hasPopup === false || isSendingPopup || isDeleting
                    ? "disabled"
                    : "delete"
                }
                disabled={hasPopup === false || isSendingPopup || isDeleting}
                onClick={handleDeletePopup}
              >
                {isDeleting ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Delete</p>
                )}
              </FullButton>

              <FullButton
                className={
                  (!title || !message || isSendingPopup || isDeleting) &&
                  "disabled"
                }
                disabled={!title || !message || isSendingPopup || isDeleting}
                onClick={handleSendPopup}
              >
                {isSendingPopup ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Send</p>
                )}
              </FullButton>
            </div>
          </div>
        </ModalStandard>
      </Modal>
    </>
  );
};

const ModalStandard = styled.div`
  background-color: #151823;
  border-radius: 12px;
  max-width: 430px;
  place-self: center;
  width: 100%;
  border: 1px solid transparent;
  z-index: 10001;

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 32px;
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

export default SendUserPopupModal;
