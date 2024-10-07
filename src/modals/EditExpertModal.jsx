import { useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import { LargeDivider } from "../styled/forms/dividers";
import { MiniAmountBox, TextBox } from "../styled/input/Input";
import { ActionButton, FullButton } from "../styled/input/buttons/Buttons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase/firebase";
import CircularLoader from "../styled/loaders/CircularLoader";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import Toast from "../hooks/Toast";

const EditExpertModal = ({ open, expert }) => {
  const { editExpert, setEditExpert } = open;

  // name
  const nameRef = useRef();
  const [name, setName] = useState(expert.name);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  function handleName(e) {
    const { value } = e.target;

    if (value) {
      setName(value);
    } else {
      setName(expert.name);
    }
  }

  // wins
  const winsRef = useRef();
  const [wins, setWins] = useState(expert.wins);

  function handleWins(e) {
    const { value } = e.target;

    if (value) {
      setWins(value);
    } else {
      setWins(expert.wins);
    }
  }

  // losses
  const lossesRef = useRef();
  const [losses, setLosses] = useState(expert.losses);

  function handleLosses(e) {
    const { value } = e.target;

    if (value) {
      setLosses(value);
    } else {
      setLosses(expert.wins);
    }
  }

  // winRate
  const winRateRef = useRef();
  const [winRate, setWinRate] = useState(expert.winRate);

  function handleWinRate(e) {
    const { value } = e.target;

    if (value) {
      setWinRate(value);
    } else {
      setWinRate(expert.winRate);
    }
  }

  // profitShare
  const profitShareRef = useRef();
  const [profitShare, setProfitShare] = useState(expert.profitShare);

  function handleProfitShare(e) {
    const { value } = e.target;

    if (value) {
      setProfitShare(value);
    } else {
      setProfitShare(expert.profitShare);
    }
  }

  function reset() {
    if (nameRef) {
      nameRef.current.value = "";
    }

    if (winsRef) {
      winsRef.current.value = "";
    }

    if (lossesRef) {
      lossesRef.current.value = " ";
    }

    if (winRateRef) {
      winRateRef.current.value = " ";
    }

    if (profitShareRef) {
      profitShareRef.current.value = "";
    }
  }

  // image
  const [image, setImage] = useState(expert.picture || null);
  const [imageLink, setImageLink] = useState(undefined);
  const [imageName, setImageName] = useState(undefined);

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // image
  const imageRef = useRef();

  function handleImageURL(e) {
    const file = e.target.files[0];

    if (file) {
      setImageLink(file);
      setImageName(file.name);
      handleImageUpload(file, file.name);
    }
  }

  function handleImageChange() {
    imageRef.current.click();
  }

  //  handleImageUpload
  async function handleImageUpload(link, name) {
    setIsUploadingImage(true);
    // console.log(link);
    if (link) {
      const storageRef = ref(storage, name + new Date());
      const uploadTask = uploadBytesResumable(storageRef, link);
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
            setImage(downloadURL);
            setIsUploadingImage(false);
          });
        }
      );
    }
  }

  // submit
  const [isEditingExpert, setIsEditingExpert] = useState(false);
  async function handleEditExpert() {
    setIsEditingExpert(true);

    await updateDoc(doc(db, "admin", "experts"), {
      [expert.ref]: {
        name,
        ref: expert.ref,
        wins: Number(wins),
        losses: Number(losses) || 0,
        winRate: Number(winRate),
        profitShare: Number(profitShare),
        picture: image ? image : null,
        subscriberList: [],
      },
    })
      .then(() => {
        reset();
        setIsEditingExpert(false);
        setToastType("success");
        setToastMessage("Expert edited successfully");
        setOpenToast(true);
        setTimeout(() => {
          setEditExpert(false);
        }, 600);
      })
      .catch((error) => {
        // console.log(error);
        setIsEditingExpert(false);
        setToastType("error");
        setToastMessage("Failed to edit. Please try again later");
        setOpenToast(true);
      });
  }

  // delete expert
  const [isDeletingExpert, setIsDeletingExpert] = useState(false);
  async function handleDeleteExpert() {
    setIsDeletingExpert(true);

    await updateDoc(doc(db, "admin", "experts"), {
      [expert.ref]: deleteField(),
    })
      .then(() => {
        reset();
        setIsDeletingExpert(false);
        setToastType("success");
        setToastMessage("Expert deleted successfully");
        setOpenToast(true);
        setTimeout(() => {
          setEditExpert(false);
        }, 600);
      })
      .catch((error) => {
        setIsDeletingExpert(false);
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
        open={editExpert}
        onClose={() => setEditExpert(false)}
        style={{
          display: "flex",
          placeContent: "center",
          zIndex: "10001",
        }}
      >
        <ModalStandard className="scrollbar-hide">
          <div className="modal_top">
            <p>Edit {expert.name}</p>

            <svg
              width="15"
              height="14"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setEditExpert(!editExpert)}
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
                {/* name */}
                <TextBox className="scrollbar-hide">
                  <label htmlFor="address">Expert Name:</label>
                  <input
                    type="text"
                    placeholder={expert.name}
                    onChange={handleName}
                    ref={nameRef}
                  />
                </TextBox>

                {/* picture */}
                <div>
                  <p className="label">Profile photo</p>
                  <ImageChangerStandard>
                    {image && <img src={image} alt="profile" className="img" />}

                    {!image && (
                      <img
                        src={
                          "https://riverlegacy.org/wp-content/uploads/2021/07/blank-profile-photo.jpeg"
                        }
                        alt="profile"
                        className="img"
                      />
                    )}

                    <div style={{ position: "relative" }}>
                      <ActionButton
                        className={
                          (isUploadingImage ||
                            isEditingExpert ||
                            isDeletingExpert) &&
                          "blink_me"
                        }
                        onClick={handleImageChange}
                        disabled={
                          isUploadingImage ||
                          isEditingExpert ||
                          isDeletingExpert
                        }
                      >
                        Change
                      </ActionButton>

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
                  </ImageChangerStandard>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto auto",
                    gap: "12px",
                    // margin: "24px 0px",
                    width: "100%",
                  }}
                >
                  {/* wins */}
                  <MiniAmountBox className={"amount_box variant"}>
                    <div className="label">
                      <p>Wins:</p>
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

                    <div className="wrapper" style={{ padding: "24px" }}>
                      <input
                        type="number"
                        placeholder={expert.wins}
                        onChange={handleWins}
                        ref={winsRef}
                        // onChange={handleMinimum}
                      />
                    </div>
                  </MiniAmountBox>

                  {/* losses */}
                  <MiniAmountBox className={"amount_box variant"}>
                    <div className="label">
                      <p>Losses:</p>
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

                    <div className="wrapper" style={{ padding: "24px" }}>
                      <input
                        type="number"
                        placeholder={expert.losses}
                        onChange={handleLosses}
                        ref={lossesRef}
                        // onChange={handleMinimum}
                      />

                      {/* <span className="asset" > */}
                      {/* <p>USD</p> */}
                      {/* </span> */}
                    </div>
                  </MiniAmountBox>
                </div>
                {/* win rate */}
                <MiniAmountBox className={"amount_box variant"}>
                  <div className="label">
                    <p>Win rate </p>
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
                      placeholder={expert.winRate}
                      ref={winRateRef}
                      onChange={handleWinRate}
                    />

                    <span className="asset">
                      <p>%</p>
                    </span>
                  </div>
                </MiniAmountBox>

                {/* profit share */}
                <MiniAmountBox className={"amount_box variant"}>
                  <div className="label">
                    <p>Profit Share: </p>
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
                      placeholder={expert.profitShare}
                      ref={profitShareRef}
                      onChange={handleProfitShare}
                    />

                    <span className="asset">
                      <p>%</p>
                    </span>
                  </div>
                </MiniAmountBox>
              </LargeDivider>
            </div>

            <div className="bottom">
              <div
                className="bottom"
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                <FullButton
                  disabled={
                    isEditingExpert ||
                    isDeletingExpert ||
                    isUploadingImage ||
                    !name ||
                    !wins ||
                    !winRate ||
                    !profitShare
                  }
                  className={
                    isEditingExpert ||
                    isDeletingExpert ||
                    isUploadingImage ||
                    !name ||
                    !wins ||
                    !winRate ||
                    !profitShare
                      ? "delete disabled"
                      : "delete"
                  }
                  onClick={handleDeleteExpert}
                >
                  {isDeletingExpert ? (
                    <div style={{ padding: "8px" }}>
                      <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                    </div>
                  ) : (
                    <p>Delete</p>
                  )}
                </FullButton>

                <FullButton
                  onClick={handleEditExpert}
                  disabled={
                    isEditingExpert ||
                    isDeletingExpert ||
                    isUploadingImage ||
                    !name ||
                    !wins ||
                    !Number(losses) ||
                    !winRate ||
                    !profitShare
                  }
                  className={
                    (isEditingExpert ||
                      isDeletingExpert ||
                      isUploadingImage ||
                      !name ||
                      !wins ||
                      !Number(losses) ||
                      !winRate ||
                      !profitShare) &&
                    "disabled"
                  }
                >
                  {isEditingExpert ? (
                    <div style={{ padding: "8px" }}>
                      <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                    </div>
                  ) : (
                    <p>Save</p>
                  )}
                </FullButton>
              </div>
            </div>
          </div>
        </ModalStandard>
      </Modal>
    </>
  );
};

const ImageChangerStandard = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  .img {
    width: 48px;
    height: 48px;
    border-radius: 100%;
    object-fit: cover;
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

  p.label {
    font-weight: 600;
    font-size: 14px;
    color: #bac2de;
    margin-bottom: 8px;
  }

  .bottom {
    margin-top: 32px;
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

// const SubscriptionCardStandard = styled.div`
//   background-color: #151823;
//   height: 100;
//   border-radius: 12px;
// `;

export default EditExpertModal;

// outlinedModal
// filledModal
