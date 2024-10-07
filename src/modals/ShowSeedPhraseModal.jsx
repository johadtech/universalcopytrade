import { useContext, useEffect, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import { FilledButton, FullButton, TextBox } from "../styled/input/Input";
import CircularLoader from "../styled/loaders/CircularLoader";
import { db, storage } from "../firebase/firebase";
import { deleteField, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { context } from "../context/context";
import Toast from "../hooks/Toast";

const ShowSeedPhraseModal = ({ open, selected }) => {
  const { showPhrase, setShowPhrase } = open;

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useContext(context);

  const { id } = userData;

  const [phrases, setPhrases] = useState([]);
  const [currPhrase, setCurrPhrase] = useState(null);

  useEffect(() => {
    if (userData) {
      const { phrases } = userData;
      setCurrPhrase(phrases[selected]?.phrase);
      setPhrases(phrases);
      setTimeout(() => {
        setIsLoading(false);
      }, 360);
    }
  }, [userData]);

  const [isSaving, setIsSaving] = useState(false);

  //   phrases.

  async function handleSave() {
    setIsSaving(true);
    const profile = doc(db, "users", id);
    const key = `phrases.${selected}`;
    await updateDoc(profile, {
      [key]: {
        name: selected,
        phrase: currPhrase,
      },
    })
      .then(() => {
        setIsSaving(false);
        setToastType("success");
        setTimeout(() => {
          setShowPhrase(false);
        }, 270);
        setToastMessage("Updated successfully");
        setOpenToast(true);
      })
      .catch((error) => {
        setIsSaving(false);
        setToastType("error");
        setToastMessage("Failed to update. Please try again later");
        setOpenToast(true);
      });
  }

  function handlePhrase(e) {
    const value = e.target.value;

    if (value) {
      setCurrPhrase(value);
    } else {
      setCurrPhrase(currPhrase);
    }
  }

  return (
    <Modal
      open={showPhrase}
      onClose={() => setShowPhrase(false)}
      style={{
        display: "flex",
        placeContent: "center",
        zIndex: "10001",
        padding: "12px",
      }}
    >
      <>
        {openToast && (
          <Toast
            open={{ openToast, setOpenToast }}
            message={toastMessage}
            type={toastType}
          />
        )}

        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>{selected} Connection</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setShowPhrase(!showPhrase)}
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

          {isLoading ? (
            <div
              style={{
                backgroundColor: "#151823",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
                padding: "60px",
              }}
            >
              <CircularLoader
                bg="rgba(12, 108, 243, 0.2)"
                size="28"
                color="#0C6CF2"
              />
            </div>
          ) : (
            <div className="modal_content">
              <div className="top">
                <div className="deposit_bottom">
                  <TextBox className="scrollbar-hide">
                    <label htmlFor="address">Wallet:</label>
                    <br />
                    <input
                      type="text"
                      defaultValue={selected}
                      // onChange={handleAddress}
                      disabled
                    />
                  </TextBox>

                  <br />

                  <TextBox className="scrollbar-hide">
                    <label htmlFor="address">{selected} Seed Phrase:</label>
                    <br />
                    <textarea
                      type="text"
                      cols="30"
                      rows="5"
                      onChange={handlePhrase}
                      placeholder={currPhrase || `Your ${selected} seed phrase`}
                    ></textarea>
                  </TextBox>
                </div>
              </div>

              <br />
              <br />

              <div
                className="buttons"
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                {/* <FullButton
                onClick={handleDelete}
                disabled={isSaving || isDeleting}
                className={isSaving || isDeleting ? "disabled" : "delete"}
              >
                {isDeleting ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                  </div>
                ) : (
                  <p>Delete</p>
                )}
              </FullButton> */}

                <FullButton
                  disabled={isSaving}
                  onClick={handleSave}
                  className={isSaving && "disabled"}
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
          )}
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

export default ShowSeedPhraseModal;
