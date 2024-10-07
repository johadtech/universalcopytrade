import { useState } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import {
  AmountBox,
  DropDownBox,
  DropDownIcon,
  FilledButton,
  FullButton,
  MiniAmountBox,
  MiniAmountBoxFull,
  TextBox,
} from "../styled/input/Input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Toast from "../hooks/Toast";
import CircularLoader from "../styled/loaders/CircularLoader";

const UpgradeAccountModal = ({ open, ogAccountType, user }) => {
  const { upgradeAccount, setUpgradeAccount } = open;
  const { userDetails, setUserDetails } = user;
  const { currentAccountType, setCurrentAccountType } = ogAccountType;

  const { id } = userDetails;

  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  //
  const [newAccount, setNewAccount] = useState("Starter");
  function handleNewAccount(e) {
    const { value } = e.target;

    if (value) {
      // console.log(value);
      setNewAccount(value);
    } else {
      setNewAccount("");
    }
  }

  const [isUpgrading, setIsUpgrading] = useState(false);
  async function upgradeUserAccount() {
    setIsUpgrading(true);
    const profile = doc(db, "users", id);
    await updateDoc(profile, {
      accountType: newAccount,
    })
      .then(() => {
        setIsUpgrading(false);
        setToastType("success");
        setToastMessage("Upgraded successfully");
        setOpenToast(true);
        setTimeout(() => {
          setUpgradeAccount(false);
        }, 400);
      })
      .catch((error) => {
        setIsUpgrading(false);
        setToastType("error");
        setToastMessage("Failed to upgrade. Please try again later");
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
        open={upgradeAccount}
        onClose={() => setUpgradeAccount(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
          padding: "12px",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Upgrade account</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setUpgradeAccount(!upgradeAccount)}
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
                <label htmlFor="address">Current account:</label>
                <br />
                <input
                  type="text"
                  placeholder={currentAccountType}
                  value={currentAccountType}
                  defaultValue={currentAccountType}
                  disabled
                />
              </TextBox>

              <DropDownBox className="type_select">
                <div className="wrapper">
                  <p className="label">New account:</p>
                  <span className="content">
                    <select name="" id="" onChange={handleNewAccount}>
                      <option value="Starter">Starter</option>
                      <option value="Premium">Premium</option>
                      <option value="Platinum">Platinum</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
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
            </div>

            <div className="bottom">
              {/* <FilledButton>Send</FilledButton> */}
              <FullButton
                onClick={upgradeUserAccount}
                disabled={!newAccount || isUpgrading}
                className={(!newAccount || isUpgrading) && "disabled"}
              >
                {isUpgrading ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Upgrade</p>
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

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
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

export default UpgradeAccountModal;
