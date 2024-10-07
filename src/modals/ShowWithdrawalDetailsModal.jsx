import { useEffect } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import { FilledButton } from "../styled/input/Input";

const ShowWithdrawalDetailsModal = ({ open, info }) => {
  const { showDetails, setShowDetails } = open;

  useEffect(() => {
    console.log("info", info);
  }, []);

  const { type, amount, details, asset } = info;

  return (
    <Modal
      open={showDetails}
      onClose={() => setShowDetails(false)}
      style={{
        display: "flex",
        placeContent: "center",
        zIndex: "10001",
        padding: "12px",
      }}
    >
      <>
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Withdrawal details</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setShowDetails(!showDetails)}
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
              <div
                className="deposit_bottom"
                style={{
                  display: "grid",
                  gap: "12px",
                  marginTop: "24px",
                }}
              >
                <div
                  className="qr-code"
                  style={{
                    border: "1px solid #222739",
                    borderRadius: "12px",
                    cursor: "pointer",
                    position: "relative",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <p
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontSize: "14px",
                      color: "#0c6cf2",
                    }}
                  >
                    Withdrawal type:
                  </p>
                  <p
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontSize: "16px",
                      color: "#d4dcf7",
                    }}
                  >
                    {type}
                  </p>
                </div>

                <div
                  className="qr-code"
                  style={{
                    border: "1px solid #222739",
                    borderRadius: "12px",
                    cursor: "pointer",
                    position: "relative",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <p
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontSize: "14px",
                      color: "#0c6cf2",
                    }}
                  >
                    Withdrawal amount:
                  </p>
                  <p
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontSize: "16px",
                      color: "#d4dcf7",
                    }}
                  >
                    {amount} {asset}
                  </p>
                </div>

                <div
                  className="qr-code"
                  style={{
                    border: "1px solid #222739",
                    borderRadius: "12px",
                    cursor: "pointer",
                    position: "relative",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <p
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontSize: "14px",
                      color: "#0c6cf2",
                    }}
                  >
                    Withdrawal details:
                  </p>
                  <p
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontSize: "16px",
                      color: "#d4dcf7",
                    }}
                  >
                    {details}
                  </p>
                </div>
                {/*  */}
              </div>
            </div>

            <FilledButton
              onClick={() => setShowDetails(false)}
              style={{ marginTop: "32px" }}
            >
              <p>Hide</p>
            </FilledButton>
          </div>
        </ModalStandard>
      </>
    </Modal>
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

  .details_wrapper {
    padding: 24px 0px;
    padding-top: 12px;
  }

  .details {
    margin-top: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    font-weight: 500;
  }

  .title {
    color: #bac2de;
  }

  .detail {
    color: white;
  }

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

export default ShowWithdrawalDetailsModal;
