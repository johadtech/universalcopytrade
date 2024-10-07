import { useState } from "react";
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
import { useRef } from "react";
import CircularLoader from "../styled/loaders/CircularLoader";
import { db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import Toast from "../hooks/Toast";

const EditTradingProgressModal = ({ open, ogProgress, user }) => {
  const { tradingProgress, setTradingProgress } = open;
  const { prog, setProg } = ogProgress;
  const { userDetails, setUserDetails } = user;

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const progressRef = useRef();
  const [progress, setProgress] = useState(undefined);

  function handleProgress(e) {
    const { value } = e.target;

    if (value) {
      // console.log(value);
      setProgress(value);
    } else {
      setProgress("");
    }
  }

  // add a deposit,
  //

  // submit
  // handleSetProgress
  const [isUpdating, setIsUpdating] = useState(false);
  async function handleSetProgress() {
    setIsUpdating(true);
    updateTradingProgress();
    // console.log(isAdding);
  }

  async function updateTradingProgress() {
    // setIsSubmittingForm(true);
    const q = doc(db, "users", userDetails.id);
    await updateDoc(q, {
      tradingProgress: Number(progress),
    })
      .then(() => {
        // console.log("profile saved");
        // setIsSubmittingForm(false);
        setIsUpdating(false);
        setToastType("success");
        setToastMessage("Updated successfully");
        setOpenToast(true);
        setTimeout(() => {
          setTradingProgress(false);
        }, 500);
        // setOpenToast(true);
      })
      .catch((error) => {
        // console.log("error", error);
        setIsUpdating(false);
        setToastType("error");
        setToastMessage("Failed to update. Please try again later");
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
        open={tradingProgress}
        onClose={() => setTradingProgress(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
          padding: "12px",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Update trading progress</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setTradingProgress(!tradingProgress)}
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
                <label htmlFor="address">Client name:</label>
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

              <MiniAmountBoxFull
                className={"amount_box"}
                // amountError ? "amount_box error" :
              >
                <div className="label">
                  <p>
                    Progress:{" "}
                    <strong style={{ color: "white", fontWeight: "600" }}>
                      {prog}%
                    </strong>
                  </p>
                  <img
                    src="./assets/misc/info.svg"
                    alt=""
                    className="error_inform"
                    id="popcorn"
                    // onClick={() => setShowToolTip(!showToolTip)}
                  />
                  {/* {showToolTip && (
                  <div className="tooltip" id="tooltip">
                    {tooltipMessage}
                  </div>
                )} */}
                </div>

                <div className="wrapper">
                  <input
                    type="number"
                    placeholder="100"
                    onChange={handleProgress}
                    ref={progressRef}
                  />

                  <span className="asset">
                    <p>%</p>
                  </span>
                </div>
              </MiniAmountBoxFull>
            </div>

            <div className="bottom">
              <FullButton
                className={(isUpdating || !progress) && "disabled"}
                disabled={isUpdating || !progress}
                onClick={handleSetProgress}
              >
                {isUpdating ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Update</p>
                )}
              </FullButton>
            </div>
          </div>
        </ModalStandard>
      </Modal>
    </>
  );
};

const SliderStandard = styled.div`
  display: flex;
  list-style: none;
  height: 250px;
  overflow-x: scroll;
  padding: 32px 0;
  flex: 0 0 600px;
  margin: 0 auto;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    height: 5px;
    width: 5px;
    background: #fff3;
    -webkit-border-radius: 1ex;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--accent);
    -webkit-border-radius: 1ex;
  }

  ::-webkit-scrollbar-corner {
    background: #fff3;
  }

  div {
    flex: 0 0 100px;
    background: var(--accent);
    margin: 0 20px 0 0;
  }

  div:last-of-type {
    margin: 0;
  }

  .slide img {
    border-radius: 12px;
    padding: 4px;
  }
`;

const ModalStandard = styled.div`
  background-color: #151823;
  border-radius: 12px;
  max-width: 430px;
  place-self: center;
  width: 100%;
  border: 1px solid transparent;
  z-index: 10001;

  .bottom {
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

export default EditTradingProgressModal;
