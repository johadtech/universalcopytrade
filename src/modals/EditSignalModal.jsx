import { useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import { FullButton, MiniAmountBox, TextBox } from "../styled/input/Input";
import Toast from "../hooks/Toast";
import CircularLoader from "../styled/loaders/CircularLoader";
import { deleteField, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const EditSignalModal = ({ open, details }) => {
  const { editSignal, setEditSignal } = open;
  const [tooltipMessage, setToolTipMessage] = useState("");

  // const [showToolTip, setShowToolTip] = useState(false);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const amountRef = useRef();
  const [amount, setAmount] = useState(details.price);
  // const [amountError, setAmountError] = useState(false);
  function handleAmount(e) {
    const { value } = e.target;

    if (value) {
      // console.log(value);
      setAmount(value);
    } else {
      setAmount(details.price);
    }
  }

  const nameRef = useRef();
  const [name, setName] = useState(details.name);
  function handleName(e) {
    const { value } = e.target;

    if (value) {
      // console.log(value);
      setName(value);
    } else {
      setName(details.name);
    }
  }

  function reset() {
    if (amountRef) {
      amountRef.current.value = "";
    }

    if (nameRef) {
      nameRef.current.value = "";
    }

    setAmount(undefined);
    setName(undefined);
  }

  // submit
  const [isEditingSignal, setIsEditingSignal] = useState(false);
  async function handleEditSignal() {
    setIsEditingSignal(true);

    await updateDoc(doc(db, "admin", "signals"), {
      [details.ref]: {
        name,
        ref: details.ref,
        price: Number(amount),
      },
    })
      .then(() => {
        reset();
        setIsEditingSignal(false);
        setToastType("success");
        setToastMessage("Signal edited successfully");
        setOpenToast(true);
        setTimeout(() => {
          setEditSignal(false);
        }, 600);
      })
      .catch((error) => {
        console.log(error);
        setIsEditingSignal(false);
        setToastType("error");
        setToastMessage("Failed to edit. Please try again later");
        setOpenToast(true);
      });
  }

  // delete pool
  const [isDeletingSignal, setIsDeletingSignal] = useState(false);
  async function handleDeleteSignal() {
    setIsDeletingSignal(true);

    await updateDoc(doc(db, "admin", "signals"), {
      [details.ref]: deleteField(),
    })
      .then(() => {
        reset();
        setIsDeletingSignal(false);
        setToastType("success");
        setToastMessage("Signal deleted successfully");
        setOpenToast(true);
        setTimeout(() => {
          setEditSignal(false);
        }, 600);
      })
      .catch((error) => {
        setIsDeletingSignal(false);
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
        open={editSignal}
        onClose={() => setEditSignal(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
          padding: "12px",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Edit {details?.name} signal</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setEditSignal(!editSignal)}
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
                <label htmlFor="address">Signal Name:</label>
                <br />
                <input
                  type="text"
                  placeholder={details.name}
                  onChange={handleName}
                  ref={nameRef}
                />
              </TextBox>

              <MiniAmountBox
                className="amount_box variant"
                // className={
                //   amountError ? "amount_box error variant" : "amount_box variant"
                // }
              >
                <div className="label">
                  <p>Price:</p>
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
                    placeholder={details.price}
                    onChange={handleAmount}
                    ref={amountRef}
                  />

                  <span className="asset">
                    <p>USD</p>
                    {/* <p>{selectedAsset.asset}</p> */}
                  </span>
                </div>
              </MiniAmountBox>
            </div>

            {/* submit */}
            <div
              className="bottom"
              style={{ display: "flex", gap: "12px", alignItems: "center" }}
            >
              <FullButton
                onClick={handleDeleteSignal}
                disabled={
                  isEditingSignal || isDeletingSignal || !name || !amount
                }
                className={
                  isEditingSignal || isDeletingSignal || !name || !amount
                    ? "disabled"
                    : "delete"
                }
              >
                {isDeletingSignal ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Delete</p>
                )}
              </FullButton>

              <FullButton
                onClick={handleEditSignal}
                disabled={
                  isEditingSignal || isDeletingSignal || !name || !amount
                }
                className={
                  (isEditingSignal || isDeletingSignal || !name || !amount) &&
                  "disabled"
                }
              >
                {isEditingSignal ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Save</p>
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

export default EditSignalModal;
