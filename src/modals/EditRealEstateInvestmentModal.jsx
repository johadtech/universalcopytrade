import { useEffect, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import { ClickAwayListener } from "@mui/material";
import { LargeDivider } from "../styled/forms/dividers";
import {
  AmountBox,
  DropDownBox,
  FullButton,
  MiniAmountBox,
  MiniAmountBoxFull,
  ToolTipContainer,
} from "../styled/input/Input";

import {
  doc,
  deleteField,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../firebase/firebase";
import CircularLoader from "../styled/loaders/CircularLoader";
import Toast from "../hooks/Toast";
import { formatterZero } from "../utils/utils";

const EditRealEstateInvestmentModal = ({ details, open }) => {
  const { stake, setStake } = open;
  const { editInvestment, setEditInvestment } = open;

  const { minimum, roi, title, description, thumbnail, ref, status } = details;

  const [balance, setBalance] = useState(undefined);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // minimum
  const amountRef = useRef();
  const [amount, setAmount] = useState(minimum);
  const [amountError, setAmountError] = useState(false);
  function handleAmount(e) {
    const { value } = e.target;

    if (value) {
      setAmount(Number(value));
    } else {
      setAmount(minimum); // empty value
    }
  }
  const [showToolTip, setShowToolTip] = useState(false);
  const [tooltipMessage, setToolTipMessage] = useState("");

  // roi
  const roiRef = useRef();
  const [selectedRoi, setSelectedRoi] = useState(roi);
  function handleRoi(e) {
    const { value } = e.target;

    if (value) {
      setSelectedRoi(Number(value));
    } else {
      setSelectedRoi(roi); // empty value
    }
  }

  // status
  const [selectedStatus, setSelectedStatus] = useState("open");
  function handleStatus(e) {
    const { value } = e.target;

    if (value) {
      setSelectedStatus(value);
    } else {
      setSelectedStatus(undefined); // empty value
    }
  }

  // investing
  const [isSaving, setIsSaving] = useState(false);
  async function handleSave() {
    setIsSaving(true);

    await updateDoc(doc(db, "admin", "projects"), {
      [`${ref}.minimum`]: Number(amount),
      [`${ref}.roi`]: Number(selectedRoi),
      [`${ref}.status`]: selectedStatus,
    })
      .then(() => {
        setIsSaving(false);
        setToastType("success");
        setToastMessage("Project edited successfully");
        setOpenToast(true);
        setTimeout(() => {
          setEditInvestment(false);
        }, 400);
      })
      .catch((error) => {
        setIsSaving(false);
        setToastType("error");
        setToastMessage("Failed to edit. Please try again later");
        setOpenToast(true);
        console.log("error", error);
      });
    // decrementFiat(id);
  }

  // deleting
  const [isDeleting, setIsDeleting] = useState(false);
  async function handleDelete() {
    setIsDeleting(true);

    await updateDoc(doc(db, "admin", "projects"), {
      [ref]: deleteField(),
    })
      .then(() => {
        setIsDeleting(false);
        setToastType("success");
        setToastMessage("Project deleted successfully");
        setOpenToast(true);
        setTimeout(() => {
          setEditInvestment(false);
        }, 400);
      })
      .catch((error) => {
        setIsDeleting(false);
        setToastType("error");
        setToastMessage("Failed to delete. Please try again later");
        setOpenToast(true);
        console.log("error", error);
      });
  }

  const [showRoiTooltip, setShowRoiTooltip] = useState(false);
  const roiTooltipMessage =
    "This is the total % of profits to be gained on this project";

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
        open={editInvestment}
        onClose={() => setEditInvestment(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Edit {title}</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setEditInvestment(!editInvestment)}
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
              <LargeDivider className="variant">
                <MiniAmountBoxFull
                  className={
                    amountError ? "amount_box error" : "amount_box variant"
                  }
                >
                  <div className="label">
                    <p>Minimum:</p>
                    <img
                      src="./assets/misc/info.svg"
                      alt=""
                      className="error_inform"
                      id="popcorn"
                      onClick={() => setShowToolTip(!showToolTip)}
                    />
                    {showToolTip && (
                      <ClickAwayListener
                        onClickAway={() => setShowToolTip(false)}
                      >
                        <div
                          className="tooltip"
                          id="tooltip"
                          style={{ left: "1px" }}
                        >
                          {tooltipMessage}
                        </div>
                      </ClickAwayListener>
                    )}
                  </div>

                  <div className="wrapper">
                    <input
                      type="number"
                      placeholder={minimum}
                      onChange={handleAmount}
                      ref={amountRef}
                    />

                    <span className="asset">
                      <span>
                        <p>USD</p>
                      </span>
                    </span>
                  </div>

                  {balance && (
                    <div className="captions">
                      <span>
                        <p className="caption">Current balance</p>
                        <p className="value">{formatterZero.format(balance)}</p>
                      </span>
                    </div>
                  )}
                </MiniAmountBoxFull>

                <MiniAmountBoxFull
                  className={
                    amountError ? "amount_box error" : "amount_box variant"
                  }
                >
                  <div className="label">
                    <p>ROI:</p>
                    <img
                      src="./assets/misc/info.svg"
                      alt=""
                      className="error_inform"
                      id="popcorn"
                      onClick={() => setShowToolTip(!showToolTip)}
                    />
                    {showToolTip && (
                      <ClickAwayListener
                        onClickAway={() => setShowToolTip(false)}
                      >
                        <div
                          className="tooltip"
                          id="tooltip"
                          style={{ left: "1px" }}
                        >
                          {tooltipMessage}
                        </div>
                      </ClickAwayListener>
                    )}
                  </div>

                  <div className="wrapper">
                    <input
                      type="number"
                      placeholder={roi}
                      onChange={handleRoi}
                      ref={roiRef}
                    />

                    <span className="asset">
                      <span>
                        <p>%</p>
                      </span>
                    </span>
                  </div>
                </MiniAmountBoxFull>

                <DropDownBox className="type_select">
                  <div className="wrapper">
                    <p className="label">
                      Status: Currently{" "}
                      <strong style={{ textTransform: "capitalize" }}>
                        {status}
                      </strong>
                    </p>
                    <span className="content">
                      <select name="options" onChange={(e) => handleStatus(e)}>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="#5C6175"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </DropDownBox>
              </LargeDivider>
            </div>

            <div
              className="bottom"
              style={{ display: "flex", gap: "12px", alignItems: "center" }}
            >
              <FullButton
                className={isDeleting || isSaving ? "disabled" : "delete"}
                onClick={handleDelete}
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
                onClick={handleSave}
                disabled={isSaving || !amount || !roi || isDeleting}
                className={
                  (isSaving || !amount || !roi || isDeleting) && "disabled"
                }
              >
                {isSaving ? (
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

  .bottom button {
    cursor: pointer;
    width: 100%;
    background-color: #0c6cf2;
    padding: 12px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
  }

  .bottom button:hover {
    background-color: #ff3344;
  }

  .bottom {
    margin-top: 32px;
  }

  @media screen and (max-width: 768px) {
    width: 100vw;
    max-width: unset;
    height: fit-content;
    max-height: 90vh;
    position: fixed;
    left: 0;
    bottom: 0;
    padding-bottom: 48px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    overflow-y: scroll;

    .bottom button {
      margin: 0;
    }

    .top {
      margin-bottom: 52px;
    }

    .bottom {
      position: fixed;
      bottom: 0px;
      right: 0px;
      width: 100%;
      padding: 12px 24px;
      height: fit-content;
      background-color: #151823;
      z-index: 999;
      border: none;
      outline: none;
      /* display: none; */
    }
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
`;

// const SubscriptionCardStandard = styled.div`
//   background-color: #151823;
//   height: 100;
//   border-radius: 12px;
// `;

export default EditRealEstateInvestmentModal;

// outlinedModal
// filledModal
