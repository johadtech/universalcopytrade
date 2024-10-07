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

const EditDepositAddressModal = ({ open, selected, type }) => {
  const { editAddress, setEditAddress } = open;

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState(undefined);
  const [symbol, setSymbol] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const [qr, setQR] = useState(undefined);
  const [imageName, setImageName] = useState("");
  const [imageLink, setImageLink] = useState("");
  const { dispatch } = useContext(context);
  const [tempUrl, setTempUrl] = useState("");

  const imageRef = useRef();

  function handleImageChange() {
    imageRef.current.click();
  }

  function handleImageURL(e) {
    const file = e.target.files[0];

    if (file) {
      setImageLink(file);
      setImageName(file.name);
      const url = URL.createObjectURL(file);
      setTempUrl(url);
    }
  }

  useEffect(() => {
    if (selected && type) {
      const { name, symbol, address, QR } = selected;
      setName(name);
      setSymbol(symbol);
      setAddress(address);
      setQR(QR);
      setIsLoading(false);
    }
  }, [selected, type]);

  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);

    if (imageLink) {
      submitQR();
    } else {
      handleEditAddress();
    }
  }

  async function submitQR() {
    // setIsUploadingVerification(true);
    if (imageLink) {
      const storageRef = ref(storage, imageName + new Date());
      const uploadTask = uploadBytesResumable(storageRef, imageLink);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // const progress =
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          // console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log("File available at", downloadURL);
            // submitVerification(downloadURL);
            handleEditAddressQR(downloadURL);
          });
        }
      );
    }
  }

  async function handleEditAddressQR(url) {
    let namekey;

    switch (type) {
      case "Regular":
        namekey = `Regular.addresses.${symbol}`;
        break;
      case "Signals":
        namekey = `Signals.addresses.${symbol}`;
      default:
        break;
    }

    // const namekey = type === "Regular "`Regular.addresses.${symbol}`;

    const q = doc(db, "admin", "deposit");
    try {
      await updateDoc(q, {
        [namekey]: {
          QR: url,
          address,
          name,
          symbol,
        },
      });
      switchType();
    } catch (error) {
      setIsSaving(false);
      console.log(error);
      setToastType("error");
      setToastMessage("Could not save. Please try again later");
      setOpenToast(true);
      // toast.error("Could not update. Please try again later");
    }
  }

  async function handleEditAddress() {
    let namekey;

    switch (type) {
      case "Regular":
        namekey = `Regular.addresses.${symbol}`;
        break;
      case "Signals":
        namekey = `Signals.addresses.${symbol}`;
      default:
        break;
    }

    // const namekey = type === "Regular "`Regular.addresses.${symbol}`;

    const q = doc(db, "admin", "deposit");
    try {
      await updateDoc(q, {
        [namekey]: {
          QR: qr,
          address,
          name,
          symbol,
        },
      });
      switchType();
    } catch (error) {
      setIsSaving(false);
      setToastType("error");
      setToastMessage("Could not save. Please try again later");
      setOpenToast(true);
    }
  }

  async function switchType() {
    const namekey = `Signals.type`;

    const q = doc(db, "admin", "deposit");
    try {
      await updateDoc(q, {
        [namekey]: "manual",
      });
      setIsSaving(false);
      // console.log("saved");

      setToastType("success");
      setToastMessage("Successfully edited address");
      setOpenToast(true);

      setTimeout(() => {
        setEditAddress(false);
      }, 600);
      // console.log("error", error);
    } catch (error) {
      // console.log(error);
      setIsSaving(false);

      setToastType("error");
      setToastMessage("Could not save. Please try again later");
      setOpenToast(true);
      // console.log("error", error);
    }
  }

  function handleAddress(e) {
    const value = e.target.value;

    if (value) {
      setAddress(value);
    } else {
      setAddress(address);
    }
  }

  // delete
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    let namekey;

    switch (type) {
      case "Regular":
        namekey = `Regular.addresses.${symbol}`;
        break;
      case "Signals":
        namekey = `Signals.addresses.${symbol}`;
      default:
        break;
    }

    const q = doc(db, "admin", "deposit");
    try {
      await updateDoc(q, {
        [namekey]: deleteField(),
      });

      setIsDeleting(false);
      setToastType("success");
      setToastMessage("Deleted successfully");
      setOpenToast(true);
      setTimeout(() => {
        setEditAddress(false);
      }, 600);
      // switchType();
    } catch (error) {
      setIsDeleting(false);
      setToastType("error");
      setToastMessage("Could not delete. Please try again later");
      setOpenToast(true);
    }
  }

  return (
    <Modal
      open={editAddress}
      onClose={() => setEditAddress(false)}
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
            <p>Edit {name ? name : " "} Address</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setEditAddress(!editAddress)}
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
                    <label htmlFor="address">Address:</label>
                    <br />
                    <input
                      type="text"
                      placeholder={address}
                      onChange={handleAddress}
                    />
                  </TextBox>

                  <div
                    className="qr-code"
                    style={{
                      margin: "40px 0px",
                      height: "250px",
                      border: "1px solid #222739",
                      borderRadius: "12px",
                      display: "grid",
                      cursor: "pointer",
                      placeContent: "center",
                      margin: "40px 0px",
                      position: "relative",
                    }}
                    onClick={handleImageChange}
                  >
                    {/* <img
                    src="./assets/misc/info.svg"
                    alt=""
                    className="error_inform"
                    id="popcorn"
                    style={{
                      position: "absolute",
                      right: "-30px",
                    }}
                  /> */}

                    {qr && !tempUrl && (
                      <span
                        style={{
                          maxHeight: "250px",
                          overflow: "hidden",
                          padding: "8px",
                          height: "100%",
                        }}
                      >
                        <img
                          style={{ margin: "0px" }}
                          src={qr}
                          alt=""
                          className="qr-code"
                        />
                      </span>
                    )}

                    {qr && tempUrl && (
                      <span
                        style={{
                          maxHeight: "250px",
                          overflow: "hidden",
                          padding: "8px",
                          height: "100%",
                        }}
                      >
                        <img
                          style={{ margin: "0px" }}
                          src={tempUrl}
                          alt=""
                          className="qr-code"
                        />
                      </span>
                    )}

                    {!qr && tempUrl && (
                      <span
                        style={{
                          maxHeight: "250px",
                          overflow: "hidden",
                          padding: "8px",
                          height: "100%",
                        }}
                      >
                        <img
                          style={{ margin: "0px" }}
                          src={tempUrl}
                          alt=""
                          className="qr-code"
                        />
                      </span>
                    )}

                    {!qr && !tempUrl && (
                      <p
                        style={{
                          padding: "8px",
                          color: "white",
                          lineHeight: "20px",
                          fontWeight: "500",
                          fontSize: "14px",
                          color: "#d4dcf7",
                        }}
                      >
                        Tap here to add or change QR code. Leave empty to save
                        address without QR code.
                      </p>
                    )}

                    <input
                      type="file"
                      style={{
                        opacity: "0",
                        position: "absolute",
                        pointerEvents: "none",
                        top: "0",
                        left: "0",
                        height: "100%",
                        maxWidth: "100%",
                      }}
                      ref={imageRef}
                      onChange={handleImageURL}
                      accept="image/png, image/gif, image/jpeg, image/svg"
                    />
                  </div>
                  {/*  */}
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
                <FullButton
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
                </FullButton>

                <FullButton
                  disabled={isSaving || isDeleting}
                  onClick={handleSave}
                  className={(isSaving || isDeleting) && "disabled"}
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

export default EditDepositAddressModal;
