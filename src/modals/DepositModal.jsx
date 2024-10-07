import { useState } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import { DropDownBoxWithIcon, MiniAmountBoxFull } from "../styled/input/Input";
import Toast from "../hooks/Toast";

const DepositModal = ({ open, qr, address, method }) => {
  const { openModal, setOpenModal } = open;

  // copy function
  function copyValue(value, type) {
    navigator.clipboard.writeText(value);
    setToastType("success");
    setToastMessage("Copied " + method + " " + type);
    setOpenToast(true);
    // showToast(true, "hello", "success");
  }

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

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
        open={openModal}
        onClose={() => setOpenModal(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
          padding: "12px",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Pay with {method}</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setOpenModal(!openModal)}
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
              <div className="deposit_bottom">
                <MiniAmountBoxFull
                  className={"amount_box"}
                  // amountError ? "amount_box error" :
                >
                  <div className="label">
                    <p>Address: </p>
                    <img
                      src="./assets/misc/info.svg"
                      alt=""
                      className="error_inform"
                      id="popcorn"
                    />
                  </div>

                  <div className="wrapper">
                    <input
                      type="text"
                      placeholder={address}
                      value={address}
                      disabled
                      onClick={() => copyValue(address, address + " address")}
                    />

                    <span
                      className="asset"
                      style={{ cursor: "pointer" }}
                      onClick={() => copyValue(address, " address")}
                    >
                      <p>Copy</p>
                    </span>
                  </div>
                </MiniAmountBoxFull>

                <div
                  style={{
                    marginTop: "32px",
                    fontSize: "14px",
                    padding: "10px 16px",
                    border: "1px solid #222739",
                    borderRadius: "12px",
                    color: "#d4dcf7",
                    lineHeight: "24px",
                    fontWeight: "500",
                  }}
                >
                  <p>
                    Kindly copy and make your deposit into the provided address
                    and tap the deposit button.{" "}
                    <strong>Or scan the QR Code below</strong>
                  </p>
                </div>

                <img
                  style={{ margin: "40px 0px" }}
                  src={qr}
                  alt=""
                  className="qr-code"
                />
              </div>
            </div>

            <div
              className="buttons"
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setOpenModal(false)}
                style={{
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#0C6CF2",
                  color: "white",
                  width: "100%",
                  placeSelf: "center",
                  cursor: "pointer",
                }}
                className="button"
              >
                <p
                  style={{
                    fontSize: "16px",
                    padding: "12px",
                    fontWeight: "600",
                    fontFamily: "Inter",
                  }}
                >
                  I have made this payment
                </p>
              </button>
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

  .deposit-card {
    width: 396px;
    /* width: 100%; */
    margin: auto auto;
    background-color: #1b1f2d;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    padding: 16px 24px;
    box-sizing: border-box;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    .deposit-card {
      width: 100%;
    }
  }

  .deposit-card span {
    display: grid;
    grid-template-columns: 20px auto;
    gap: 8px;
    align-items: center;
  }

  .deposit-card .bottom {
    display: none;
    margin-top: 32px;
  }

  .deposit-card.active .bottom {
    display: grid;
  }

  .deposit-card img {
    width: 20px;
    height: 20px;
  }

  .caption {
    font-size: 14px;
    font-weight: 600;
    color: #bac2de;
    line-height: 16px;
  }

  .address-box {
    /* margin-top: 24px; */
    position: relative;
    overflow-y: scroll;
  }

  .address-box .icons {
    /* display: flex; */
    /* gap: 8px; */
    /* align-items: center; */
    position: absolute;
    /* right: 10px; */
    /* top: 35px; */
    display: grid;
    place-content: center;
    background-color: #222739;
    border-bottom-right-radius: 12px;
    border-top-right-radius: 12px;
    z-index: 3;
    height: 49px;
    bottom: 0;
    right: 0;
    padding: 0px 12px;
    cursor: pointer;
  }

  .address-box input {
    width: 100%;
    border: none;
    margin-top: 8px;
    font-family: "Inter";
    color: white;
    font-size: 14px;
    display: flex;
    background-color: #222739;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    margin-top: 8px;
    height: fit-content;
    font-weight: 500;
    /* background-color: red; */
  }

  .address-box input::placeholder {
    color: #bac2de;
    font-size: 14px;
    font-weight: 500;
  }

  .address-box label {
    font-weight: 600;
    font-size: 14px;
    color: #bac2de;
  }

  .deposit_bottom {
    display: grid;
  }

  .deposit_bottom .qr-code {
    max-width: 200px;
    width: 100%;
    height: auto;
    place-self: center;
    margin-top: 24px;
  }
`;

export default DepositModal;
