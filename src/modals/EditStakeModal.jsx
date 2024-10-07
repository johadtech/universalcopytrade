import { useContext, useEffect, useState, useRef } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import { ClickAwayListener } from "@mui/material";
import Box from "@mui/material/Box";
import { LargeDivider } from "../styled/forms/dividers";
import {
  DropDownBoxWithIcon,
  FullButton,
  MiniAmountBox,
  ToolTipContainer,
} from "../styled/input/Input";

import { context } from "../context/context";

import CircularLoader from "../styled/loaders/CircularLoader";
import { deleteField, doc, setDoc, updateDoc } from "@firebase/firestore";
import { db } from "../firebase/firebase";
import Toast from "../hooks/Toast";

const EditStakeModal = ({ open, pool }) => {
  const { editStake, setEditStake } = open;
  //   const {asset, duration, maximum, }

  const { dispatch } = useContext(context);

  const [tooltipMessage, setToolTipMessage] = useState("");

  const { asset, name } = pool;
  const [minimum, setMinumum] = useState(pool.minimum);
  const [maximum, setMaximum] = useState(pool.maximum);
  const [duration, setDuration] = useState(pool.duration);
  const [roi, setRoi] = useState(pool.roi);
  const [compiledTotal, setCompiledTotal] = useState(undefined);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // minimum
  const minimumRef = useRef();
  function handleMinimum(e) {
    const { value } = e.target;

    if (value) {
      setMinumum(value);
    } else {
      setMinumum("");
    }
  }

  // maximum
  const maximumRef = useRef();
  function handleMaximum(e) {
    const { value } = e.target;

    if (value) {
      setMaximum(value);
    } else {
      setMaximum("");
    }
  }

  // duration
  const durationRef = useRef();
  function handleDuration(e) {
    // console.log(e.target.value);
    const { value } = e.target;

    if (value) {
      setDuration(value);
    } else {
      setDuration("");
    }
  }

  // roi
  const roiRef = useRef();
  function handleROI(e) {
    const { value } = e.target;

    if (value) {
      setRoi(value);
    } else {
      setRoi("");
    }
  }

  function reset() {
    if (minimumRef) {
      minimumRef.current.value = "";
    }

    if (maximumRef) {
      maximumRef.current.value = "";
    }

    if (durationRef) {
      durationRef.current.value = "";
    }

    if (roiRef) {
      roiRef.current.value = "";
    }
  }

  // duration tooltip
  const [showCompiledToolTip, setShowCompiledToolTip] = useState(false);
  const [showMaxiDaysInfoToolTip, setShowMaxiDaysInfoToolTip] = useState(false);
  function showMaxiInfo() {
    setToolTipMessage(
      "This is the maximum number of days a user can stake for. The minimum is always one day."
    );
    setShowMaxiDaysInfoToolTip(!showMaxiDaysInfoToolTip);
  }

  const [compiledTooltipMessage, setCompiledTooltipMessage] =
    useState(undefined);

  // compile total
  useEffect(() => {
    if (roi && duration && minimum) {
      setCompiledTooltipMessage(
        `This is the amount a user will earn if they stake ${minimum} ${asset}`
      );
      setCompiledTotal((minimum / 100) * roi);
    } else {
      setCompiledTotal(undefined);
    }
  }, [roi, duration, minimum]);

  // edit pool
  const [isEditingPool, setIsEditingPool] = useState(false);
  async function handleEditPool() {
    setIsEditingPool(true);

    await updateDoc(doc(db, "admin", "pools"), {
      [asset]: {
        name,
        asset,
        minimum: Number(minimum),
        maximum: Number(maximum),
        duration: Number(duration),
        roi: Number(roi),
      },
    })
      .then(() => {
        setIsEditingPool(false);
        setToastType("success");
        setToastMessage("Pool edited successfully");
        setOpenToast(true);
        reset();
        setTimeout(() => {
          setEditStake(false);
        }, 400);
      })
      .catch((error) => {
        setIsEditingPool(false);
        setToastType("error");
        setToastMessage("Failed to edit. Please try again later");
        setOpenToast(true);
        console.log("error", error);
      });
  }

  // delete pool
  const [isDeletingPool, setIsDeletingPool] = useState(false);
  async function handleDeletePool() {
    setIsDeletingPool(true);

    await updateDoc(doc(db, "admin", "pools"), {
      [asset]: deleteField(),
    })
      .then(() => {
        setIsDeletingPool(false);
        setToastType("success");
        setToastMessage("Pool deleted successfully");
        setOpenToast(true);
        reset();
        setTimeout(() => {
          setEditStake(false);
        }, 400);
      })
      .catch((error) => {
        setIsDeletingPool(false);
        setToastType("error");
        setToastMessage("Failed to delete. Please try again later");
        setOpenToast(true);
        console.log("error", error);
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
        open={editStake}
        onClose={() => setEditStake(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Edit {asset} pool</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setEditStake(!editStake)}
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
                {/* minimum */}
                <MiniAmountBox className={"amount_box variant"}>
                  <div className="label">
                    <p>Minumum:</p>
                    <img
                      src="./assets/misc/info.svg"
                      alt=""
                      className="error_inform"
                      id="popcorn"
                      // onClick={() => setShowMinumumToolTip(!showMinumumToolTip)}
                    />
                    {/* {showMinumumToolTip && (
                    <div className="tooltip" id="tooltip">
                      {tooltipMessage}
                    </div>
                  )} */}
                  </div>

                  <div className="wrapper">
                    <input
                      ref={minimumRef}
                      type="number"
                      placeholder={minimum}
                      onChange={handleMinimum}
                    />

                    <span className="asset">
                      <p>{asset}</p>
                    </span>
                  </div>
                </MiniAmountBox>

                {/* maximum */}
                <MiniAmountBox className={"amount_box variant"}>
                  <div className="label">
                    <p>Maximum:</p>
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
                      ref={maximumRef}
                      placeholder={maximum}
                      onChange={handleMaximum}
                    />

                    <span className="asset">
                      <p>{asset}</p>
                    </span>
                  </div>
                </MiniAmountBox>

                {/* duration */}
                <MiniAmountBox className={"amount_box variant"}>
                  <div className="label">
                    <p>Maximum Duration:</p>
                    <img
                      src="./assets/misc/info.svg"
                      alt=""
                      className="error_inform"
                      id="popcorn"
                      style={{ display: "block" }}
                      onClick={() => showMaxiInfo()}
                    />
                    {showMaxiDaysInfoToolTip && (
                      <ClickAwayListener
                        onClickAway={() => setShowMaxiDaysInfoToolTip(false)}
                      >
                        <div
                          className="tooltip"
                          id="tooltip"
                          style={{ left: "30px" }}
                        >
                          {tooltipMessage}
                        </div>
                      </ClickAwayListener>
                    )}
                  </div>

                  <div className="wrapper">
                    <input
                      type="number"
                      placeholder={duration}
                      ref={durationRef}
                      onChange={(e) => handleDuration(e)}
                    />

                    <span className="asset">
                      <p>DAYS</p>
                    </span>
                  </div>
                </MiniAmountBox>

                {/* roi */}
                <MiniAmountBox className={"amount_box variant"}>
                  <div className="label">
                    <p>ROI:</p>
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
                      placeholder={roi}
                      ref={roiRef}
                      onChange={handleROI}
                    />

                    <span className="asset">
                      <p>%</p>
                    </span>
                  </div>
                </MiniAmountBox>

                {/* compiled total */}
                {compiledTotal && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        maxWidth: "180px",
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      {showCompiledToolTip && (
                        <ClickAwayListener
                          onClickAway={() => setShowCompiledToolTip(false)}
                        >
                          <ToolTipContainer>
                            <div
                              className="tooltip"
                              id="tooltip"
                              style={{ bottom: "33px", left: "43px" }}
                            >
                              {compiledTooltipMessage}
                            </div>
                          </ToolTipContainer>
                        </ClickAwayListener>
                      )}
                      <p
                        style={{
                          color: "#bac2de",
                          fontSize: "14px",
                          lineHeight: "20px",
                        }}
                      >
                        Least possible rewards after staking session completes
                        <span
                          style={{ position: "absolute", marginLeft: "4px" }}
                        >
                          <img
                            src="./assets/misc/info.svg"
                            alt=""
                            className="error_inform"
                            id="popcorn"
                            onClick={() =>
                              setShowCompiledToolTip(!showCompiledToolTip)
                            }
                          />
                        </span>
                      </p>
                    </span>
                    <span>
                      <p
                        style={{
                          fontSize: "20px",
                          color: "#5BDE4C",
                          fontWeight: "600",
                        }}
                      >
                        ~{Number(compiledTotal).toFixed(3)} {asset}
                      </p>
                    </span>
                  </div>
                )}
              </LargeDivider>
            </div>

            {/* button */}

            <div
              className="bottom"
              style={{ display: "flex", gap: "12px", alignItems: "center" }}
            >
              <FullButton
                onClick={handleDeletePool}
                disabled={
                  isEditingPool ||
                  isDeletingPool ||
                  !asset ||
                  !name ||
                  !minimum ||
                  !maximum ||
                  !duration ||
                  !roi
                }
                className={
                  isEditingPool ||
                  isDeletingPool ||
                  !asset ||
                  !name ||
                  !minimum ||
                  !maximum ||
                  !duration ||
                  !roi
                    ? "disabled"
                    : "delete"
                }
              >
                {isDeletingPool ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Delete</p>
                )}
              </FullButton>

              <FullButton
                onClick={handleEditPool}
                disabled={
                  isEditingPool ||
                  isDeletingPool ||
                  !asset ||
                  !name ||
                  !minimum ||
                  !maximum ||
                  !duration ||
                  !roi
                }
                className={
                  (isEditingPool ||
                    isDeletingPool ||
                    !asset ||
                    !name ||
                    !minimum ||
                    !maximum ||
                    !duration ||
                    !roi) &&
                  "disabled"
                }
              >
                {isEditingPool ? (
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
    margin-top: 32px;
  }

  .bottom button:hover {
    background-color: #ff3344;
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

export default EditStakeModal;
