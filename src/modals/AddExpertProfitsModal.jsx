import { useContext, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import {
  AmountBox,
  DropDownBoxWithIcon,
  DropDownIcon,
  FullButton,
  MiniAmountBox,
  MiniAmountBoxFull,
  TextBox,
  ToolTipContainer,
} from "../styled/input/Input";
import { ClickAwayListener } from "@mui/material";
import { context } from "../context/context";
import Toast from "../hooks/Toast";
import { formatter, formatterZero } from "../utils/utils";
import {
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import CircularLoader from "../styled/loaders/CircularLoader";

const AddExpertProfitsModal = ({ open, ogProfits, user, expert }) => {
  const { addProfits, setAddProfits } = open;
  const { profits, setProfits } = ogProfits;
  const { currentPrices } = useContext(context);
  const { userDetails, setUserDetails } = user;

  const { id } = userDetails;

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const addable = ["USD", "BTC", "ETH"];

  // asset
  const [selectedAsset, setSelectedAsset] = useState(addable[0]);
  function handleAddAsset(e) {
    const { value } = e.target;
    if (value) {
      setSelectedAsset(value);
    }
  }

  // amount
  const amountRef = useRef();
  const [amount, setAmount] = useState("");
  function handleAmount(e) {
    const { value } = e.target;

    if (value) {
      // console.log(value);
      setAmount(value);
    } else {
      setAmount("");
    }
  }

  // current profits = from parent
  // user from parent

  // prices from context

  //
  // amount

  // submit
  // async function handleAddProfits() {}

  // async function incrementCrypto() {}
  // async function incrementFiat() {}

  const [isAddingProfits, setIsAddingProfits] = useState(false);
  async function handleAddProfits() {
    setIsAddingProfits(true);
    const profile = doc(db, "profits", id);
    await updateDoc(profile, {
      profits: increment(currentPrices[selectedAsset] * amount),
    })
      .then(() => {
        if (selectedAsset === "USD") {
          incrementFiat();
        } else {
          incrementCrypto();
        }
      })
      .catch((error) => {
        setIsAddingProfits(false);
        setToastType("error");
        setToastMessage("Failed to add. Please try again later");
        setOpenToast(true);
      });
  }

  // increment crypto
  async function incrementCrypto() {
    const q = doc(db, "accounts", id);
    const key = `live.Crypto.${selectedAsset}.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(amount)),
      }).then(() => {
        sendUserNotification();
      });
    } catch (error) {
      setIsAddingProfits(false);
      setToastType("error");
      setToastMessage("Failed to add. Please try again later");
      setOpenToast(true);
    }
  }

  // increment fiat
  async function incrementFiat() {
    const q = doc(db, "accounts", id);
    const key = `live.Fiat.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(amount)),
      }).then(() => {
        sendUserNotification();
      });
    } catch (error) {
      setIsAddingProfits(false);
      setToastType("error");
      setToastMessage("Failed to add. Please try again later");
      setOpenToast(true);
    }
  }

  // user notified
  async function sendUserNotification() {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "notifications", str), {
      ref: str,
      type: "Profits",
      message:
        selectedAsset === "USD"
          ? "You earned profits of " +
            formatter.format(amount) +
            " from " +
            expert
          : "You earned profits of " +
            amount +
            " " +
            selectedAsset +
            " from " +
            expert,
      user: id,
      read: false,
      date: serverTimestamp(),
    })
      .then(() => {
        setIsAddingProfits(false);
        setToastType("success");
        setToastMessage("Profits added successfully");
        setOpenToast(true);

        setTimeout(() => {
          setAddProfits(false);
        }, 400);
      })
      .catch((error) => {
        setIsAddingProfits(false);
        setToastType("error");
        setToastMessage("Failed to add. Please try again later");
        setOpenToast(true);
      });
  }

  // take profits value
  // add profits value
  //  increment fiat or crypto
  // send notifications on increment (positiive amount)

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
        open={addProfits}
        onClose={() => setAddProfits(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
          padding: "12px",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Add profits</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setAddProfits(!addProfits)}
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

              <TextBox className="scrollbar-hide">
                <label htmlFor="address">Expert:</label>
                <br />
                <input
                  type="text"
                  placeholder={expert}
                  value={expert}
                  defaultValue={expert}
                  disabled
                />
              </TextBox>

              <DropDownBoxWithIcon className="type_select">
                <div className="wrapper">
                  <p className="label">Asset:</p>
                  <span className="content">
                    <div className="icon_wrap">
                      <img src={`./asseticons/${selectedAsset}.svg`} alt="" />
                      <select
                        name="assets"
                        id=""
                        onChange={(e) => handleAddAsset(e)}
                      >
                        {addable.map((curr) => (
                          <option value={curr} key={curr}>
                            {curr}
                          </option>
                        ))}
                      </select>
                    </div>
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
              </DropDownBoxWithIcon>

              <MiniAmountBoxFull className={"amount_box variant"}>
                <div className="label">
                  <p>
                    Current profits:{" "}
                    <strong style={{ color: "#5BDE4C", fontWeight: "600" }}>
                      {formatterZero.format(profits)}
                    </strong>
                  </p>
                  <img
                    src="./assets/misc/info.svg"
                    alt=""
                    className="error_inform"
                    id="popcorn"
                    // onClick={() => setShowToolTip(!showToolTip)}
                  />
                </div>

                <div className="wrapper">
                  <input
                    type="number"
                    placeholder="1000"
                    onChange={handleAmount}
                    ref={amountRef}
                  />

                  <span className="asset">
                    <p>{selectedAsset}</p>
                  </span>
                </div>

                <div className="captions">
                  {amount && selectedAsset && (
                    <span>
                      <p className="caption">Total in USD</p>
                      <p className="value" style={{ color: "#5BDE4C" }}>
                        {formatter.format(
                          currentPrices[selectedAsset] * amount
                        )}
                      </p>
                    </span>
                  )}
                </div>
              </MiniAmountBoxFull>
            </div>

            <div className="bottom">
              <FullButton
                onClick={handleAddProfits}
                disabled={!selectedAsset || !amount || isAddingProfits}
                className={
                  (!selectedAsset || !amount || isAddingProfits) && "disabled"
                }
              >
                {isAddingProfits ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Add</p>
                )}
              </FullButton>
              {/* <button>Add</button> */}
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

export default AddExpertProfitsModal;
