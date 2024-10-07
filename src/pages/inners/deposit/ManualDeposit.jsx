import { useContext, useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import {
  AmountBox,
  DropDownBoxWithIcon,
  FilledButton,
  FullButton,
  MiniAmountBoxFull,
} from "../../../styled/input/Input";
import CircularLoader from "../../../styled/loaders/CircularLoader";
import {
  formatFileSize,
  formatter,
  tabMobileCheck,
} from "../../../utils/utils";
import { useDropzone } from "react-dropzone";
import { LargeDivider } from "../../../styled/forms/dividers";
import { context } from "../../../context/context";
import Toast from "../../../hooks/Toast";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../../../firebase/firebase";
import DepositModal from "../../../modals/DepositModal";
import { siteSettings } from "../../../static";
import emailjs from "@emailjs/browser";

const ManualDeposit = ({ addresses, user, prices, accounts }) => {
  const [openModal, setOpenModal] = useState(false);

  const { id } = user;

  const [cryptoAccount, setCryptoAccount] = useState({});

  const [tooltipMessage, setToolTipMessage] = useState("");
  const [showToolTip, setShowToolTip] = useState(false);

  const amountRef = useRef();
  const [amount, setAmount] = useState(undefined);
  const [amountError, setAmountError] = useState(false);

  const [imageName, setImageName] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [imageSize, setImageSize] = useState(undefined);
  const [imageType, setImageType] = useState(undefined);

  const mobile = tabMobileCheck();

  const imageRef = useRef();

  const [isPaying, setIsPaying] = useState(false);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  function reset() {
    if (amountRef) {
      amountRef.current.value = " ";
    }

    setAmount(undefined);
    setAmountError(false);
    setImageLink("");
    setImageName("");
    setImageSize(undefined);
    setImageType(undefined);
  }

  // manual
  // automated

  // manual && submitImage, submit deposit, then admin notifications
  // automated && submitDeposit, adminNotifications, then redirect to coinbase

  // deposits
  // ref userRef amount asset total (USD) date status type?"manual or automated"

  // copy function
  function copyValue(value, type) {
    navigator.clipboard.writeText(value);
    setToastType("success");
    setToastMessage("Copied " + selectedMethod.name + " " + type);
    setOpenToast(true);
    // showToast(true, "hello", "success");
  }

  function handleImageURL(e) {
    const file = e.target.files[0];

    if (file) {
      setImageLink(file);
      setImageName(file.name);
      setImageSize(formatFileSize(file.size));
      setImageType(file.type?.slice(file.type?.indexOf("/") + 1));
    }
  }

  function handleImageChange() {
    imageRef.current.click();
  }

  useEffect(() => {
    const live = accounts?.live;
    const { Crypto } = live;
    setCryptoAccount(Crypto);
  }, []);

  const [selectedMethod, setSelectedMethod] = useState(
    Object.values(addresses)[0]
  );

  function handleAmount(e) {
    const { value } = e.target;

    if (value) {
      setAmount(value);
    } else {
      setAmount("");
    }
  }

  function handleAsset(e) {
    Object.values(addresses).forEach((address) => {
      if (address.name === e.target.value) {
        setSelectedMethod(address);
      }
    });
  }

  const { getRootProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".png", ".svg", ".gif"],
    },
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) => {
        setImageLink(file);
        setImageName(file.name);
        setImageSize(formatFileSize(file.size));
        setImageType(file.type?.slice(file.type?.indexOf("/") + 1));
      });
    },
  });

  // submit payment
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);

  function handleManualPayment() {
    setIsSubmittingDeposit(true);

    submitProof();
    // submit proof
    // create deposit ref
    // create admin notifications
    // create admin email
  }

  async function submitProof() {
    if (imageLink) {
      const storageRef = ref(storage, imageName + new Date());
      const uploadTask = uploadBytesResumable(storageRef, imageLink);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
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
          setIsSubmittingDeposit(false);
          setToastType("error");
          setToastMessage("Failed to deposit. Please try again later.");
          setOpenToast(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log("File available at", downloadURL);
            submitDeposit(downloadURL);
          });
        }
      );
    }
  }

  // reset();
  // setIsEditingExpert(false);
  // setToastType("success");
  // setToastMessage("Expert edited successfully");
  // setOpenToast(true);

  // deposits
  // ref userRef amount asset total (USD) date status type?"manual or automated"

  async function submitDeposit(url) {
    const { symbol } = selectedMethod;

    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "deposits", str), {
      ref: str,
      user: id,
      amount: Number(amount),
      asset: symbol,
      totalInUSD: prices[symbol] * Number(amount),
      date: serverTimestamp(),
      status: "pending",
      class: "Regular",
      type: "manual",
      link: url,
      userRef: {
        name: user.firstname + " " + user.lastname,
        photo: user.photoURL ? user.photoURL : null,
        admin: user.admin,
        email: user.email,
      },
    })
      .then(() => {
        sendAdminNotification(str, url);
        sendAdminEmail();
        // toast.success("Verification request submitted");
        // sendAdminEmail();
        // setIsSubmitting(false);
      })
      .catch((error) => {
        setIsSubmittingDeposit(false);
        setToastType("error");
        setToastMessage("Failed to deposit. Please try again later.");
        setOpenToast(true);
      });
  }

  async function sendAdminEmail() {
    const params = {
      to_name: "Admin",
      details: `A new deposit request was submitted on your platform.`,
      action_name: "Deposit",
      logo_link: `${siteSettings.ogLink}/logo.png`,
      to_login: `${siteSettings.link}`,
      from_name: `${siteSettings.name}`,
      to_email: `${siteSettings.supportEmail}`,
    };

    emailjs
      .send("service_veufzcm", "template_fwhr0oo", params, "9IOr2_lHheTH7RW1k")
      .then(() => {})
      .catch((error) => {});
  }

  // admin notified
  async function sendAdminNotification(ref, url) {
    const { symbol } = selectedMethod;

    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "adminNotifications", str), {
      ref: str,
      type: "Deposit",
      message: "Made a deposit of " + amount + " " + symbol,
      user: id,
      read: false,
      date: serverTimestamp(),
      userRef: {
        name: user.firstname + " " + user.lastname,
        photo: user.photoURL ? user.photoURL : null,
        email: user.email,
      },
      depositRef: {
        type: "manual",
        class: "Regular",
        link: url,
        ref,
      },
    })
      .then(() => {
        setIsSubmittingDeposit(false);
        setToastType("success");
        setToastMessage("Deposit request submitted");
        setOpenToast(true);
        setTimeout(() => {
          reset();
        }, 400);
        // write admin email
        // sendUserNotification();
      })
      .catch((error) => {
        setIsSubmittingDeposit(false);
        setToastType("error");
        setToastMessage("Failed to deposit. Please try again later.");
        setOpenToast(true);
      });
  }

  // show QR
  const [displayedMethod, setDisplayedMethod] = useState(undefined);
  const [displayedAddress, setDisplayedAddress] = useState(undefined);
  const [displayedQR, setDisplayedQR] = useState(undefined);
  function showQRCode() {
    setDisplayedAddress(selectedMethod.address);
    setDisplayedQR(selectedMethod.QR);
    setDisplayedMethod(selectedMethod.symbol);
    setOpenModal(true);
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

      {openModal && (
        <DepositModal
          open={{ openModal, setOpenModal }}
          qr={displayedQR}
          address={displayedAddress}
          method={displayedMethod}
        />
      )}

      <DepositContainerStandard>
        <p className="instruction">
          To make a deposit, choose your preferred method, enter an amount and
          upload a corresponding payment proof.
        </p>

        <LargeDivider>
          <DropDownBoxWithIcon className="type_select">
            <div className="wrapper">
              <p className="label">Type:</p>
              <span className="content">
                <div className="icon_wrap">
                  <img
                    src={`./asseticons/${selectedMethod.symbol}.svg`}
                    alt=""
                  />
                  <select name="assets" id="" onChange={handleAsset}>
                    {Object.values(addresses)?.map((address) => (
                      <option key={address.symbol} value={address.name}>
                        {address.name}
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
                type="text"
                placeholder={selectedMethod.address}
                value={selectedMethod.address}
                disabled
                onClick={() =>
                  copyValue(
                    selectedMethod.address,
                    selectedMethod.address + " address"
                  )
                }
              />

              <span
                className="asset"
                style={{ cursor: "pointer" }}
                onClick={() => copyValue(selectedMethod.address, " address")}
              >
                <p>Copy</p>
              </span>
            </div>
          </MiniAmountBoxFull>

          {selectedMethod.QR && (
            <p
              style={{
                color: "#0c6ef2",
                // marginTop: "8px",
                maxWidth: "max-content",
                marginLeft: "auto",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={() => showQRCode()}
            >
              Or tap to reveal QR Code
            </p>
          )}

          <AmountBox
            className={amountError ? "amount_box error" : "amount_box"}
          >
            <div className="label">
              <p>Amount:</p>
              <img
                src="./assets/misc/info.svg"
                alt=""
                className="error_inform"
                id="popcorn"
                onClick={() => setShowToolTip(!showToolTip)}
              />
              {showToolTip && (
                <div className="tooltip" id="tooltip">
                  {tooltipMessage}
                </div>
              )}
            </div>

            <div className="wrapper">
              <input
                type="number"
                placeholder="1000"
                onChange={handleAmount}
                ref={amountRef}
              />

              <span className="asset">
                <span>
                  <img
                    src={`./asseticons/${selectedMethod.symbol}.svg`}
                    alt=""
                  />
                  <p>{selectedMethod.symbol}</p>
                </span>
              </span>
            </div>

            {amount && selectedMethod && (
              <div className="captions">
                <span>
                  <p className="caption">Current balance</p>
                  <p className="value">
                    {cryptoAccount[selectedMethod.symbol].value}{" "}
                    {selectedMethod.symbol}{" "}
                  </p>
                </span>

                <span>
                  <p className="caption">Total in USD</p>
                  <p className="value" style={{ color: "#5BDE4C" }}>
                    {formatter.format(prices[selectedMethod.symbol] * amount)}
                  </p>
                </span>
              </div>
            )}
          </AmountBox>

          <DropBoxStandard>
            <div className="box_item" style={{ marginTop: " 24px" }}>
              <p className="label">Payment proof:</p>

              {!mobile && (
                <button
                  className={isPaying ? "upload_box disabled" : "upload_box"}
                  onClick={handleImageChange}
                  disabled={isPaying}
                  {...getRootProps()}
                  accept="image/png, image/gif, image/jpeg"
                >
                  <>
                    <span className="upload_icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.66699 13.3333L10.0003 10M10.0003 10L13.3337 13.3333M10.0003 10V17.5M16.667 13.9524C17.6849 13.1117 18.3337 11.8399 18.3337 10.4167C18.3337 7.88536 16.2816 5.83333 13.7503 5.83333C13.5682 5.83333 13.3979 5.73833 13.3054 5.58145C12.2187 3.73736 10.2124 2.5 7.91699 2.5C4.46521 2.5 1.66699 5.29822 1.66699 8.75C1.66699 10.4718 2.3632 12.0309 3.48945 13.1613"
                          stroke="#BAC2DE"
                          stroke-width="1.66667"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <span>
                      <p>Click to upload</p>
                      <p>or drag and drop</p>
                    </span>
                    <p className="allowed">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </p>
                    <input
                      onChange={handleImageURL}
                      type="file"
                      style={{
                        opacity: "0",
                        position: "absolute",
                        pointerEvents: "none",
                      }}
                      ref={imageRef}
                      accept="image/png, image/gif, image/jpeg, image/svg"
                    />
                  </>
                </button>
              )}

              {mobile && (
                <button
                  className={isPaying ? "upload_box disabled" : "upload_box"}
                  onClick={handleImageChange}
                  disabled={isPaying}
                  accept="image/png, image/gif, image/jpeg"
                >
                  <>
                    <span className="upload_icon">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.66699 13.3333L10.0003 10M10.0003 10L13.3337 13.3333M10.0003 10V17.5M16.667 13.9524C17.6849 13.1117 18.3337 11.8399 18.3337 10.4167C18.3337 7.88536 16.2816 5.83333 13.7503 5.83333C13.5682 5.83333 13.3979 5.73833 13.3054 5.58145C12.2187 3.73736 10.2124 2.5 7.91699 2.5C4.46521 2.5 1.66699 5.29822 1.66699 8.75C1.66699 10.4718 2.3632 12.0309 3.48945 13.1613"
                          stroke="#BAC2DE"
                          stroke-width="1.66667"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <span>
                      <p>Click to upload</p>
                    </span>
                    <p className="allowed">SVG, PNG, JPG or GIF (max. 10 MB)</p>
                    <input
                      onChange={handleImageURL}
                      type="file"
                      style={{
                        opacity: "0",
                        position: "absolute",
                        pointerEvents: "none",
                      }}
                      ref={imageRef}
                      accept="image/png, image/gif, image/jpeg, image/svg"
                    />
                  </>
                </button>
              )}

              {imageLink && (
                <div className="file_box">
                  <div className="left display_box">
                    <span>
                      <svg
                        width="32"
                        height="40"
                        viewBox="0 0 32 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M28 39.25H4C2.20507 39.25 0.75 37.7949 0.75 36V4C0.75 2.20508 2.20508 0.75 4 0.75H20C20.1212 0.75 20.2375 0.798159 20.3232 0.883883L31.1161 11.6768C31.2018 11.7625 31.25 11.8788 31.25 12V36C31.25 37.7949 29.7949 39.25 28 39.25Z"
                          fill="white"
                          stroke="#D0D5DD"
                          stroke-width="1.5"
                        />
                        <path
                          d="M20 0.5V8C20 10.2091 21.7909 12 24 12H31.5"
                          stroke="#D0D5DD"
                          stroke-width="1.5"
                        />
                      </svg>
                    </span>
                    <div className="detail_wrapper">
                      <p style={{ textTransform: "uppercase" }}>{imageType}</p>
                    </div>
                  </div>
                  <div className="right">
                    <div className="details">
                      <span>
                        <p className="file_name">{imageName}</p>
                        <p className="file_size">{imageSize}</p>
                      </span>
                      {/* <img src="./assets/settings/trash.svg" alt="" /> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DropBoxStandard>

          <FullButton
            style={{ marginTop: "32px" }}
            className={
              (!amount ||
                !selectedMethod ||
                isSubmittingDeposit ||
                !imageLink) &&
              "disabled"
            }
            disabled={
              !amount || !selectedMethod || isSubmittingDeposit || !imageLink
            }
            onClick={handleManualPayment}
          >
            {isSubmittingDeposit ? (
              <div style={{ padding: "8px" }}>
                <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
              </div>
            ) : (
              <p>Deposit</p>
            )}
          </FullButton>
        </LargeDivider>
      </DepositContainerStandard>
    </>
  );
};

const DepositContainerStandard = styled.div`
  display: grid;
  gap: 12px;
  /* padding: 32px 24px;
  max-width: 500px;
  width: 100%;
  margin: auto auto; */

  @media screen and (max-width: 768px) {
    width: 100%;
  }

  .instruction {
    /* white-space: nowrap; */
    font-size: 16px;
    font-weight: 500;
    color: #bac2de;
    line-height: 20px;
  }

  .deposit-card {
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

  .bottom .qr-code {
    max-width: 200px;
    width: 100%;
    height: auto;
    place-self: center;
    margin-top: 24px;
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
    margin-top: 24px;
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

  .deposit_bottom .qr-code {
    max-width: 200px;
    width: 100%;
    height: auto;
    place-self: center;
    margin-top: 24px;
  }
`;

const DropBoxStandard = styled.div`
  .file_upload {
    margin-top: 12px;
    max-width: 512px;
    width: 100%;
  }

  .label {
    font-size: 14px;
    margin-bottom: 8px;
    font-weight: 500;
    color: #bac2de;
  }

  .display_box {
    position: relative;
  }

  .display_box .detail_wrapper {
    position: absolute;
    left: -10px;
    bottom: 8px;
  }

  .display_box .detail_wrapper p {
    font-size: 12px;
    line-height: 12px;
    font-weight: bold;
    padding: 2px 3px;
    border-radius: 2px;
    background-color: #155eef;
    max-width: max-content;
  }

  .upload_box {
    width: 100%;
    padding: 30px;
    display: block;
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45, 0.3);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
    cursor: pointer;
  }

  .upload_box.disabled {
    opacity: 0.7;
    user-select: none;
    pointer-events: none;
    cursor: not-allowed;
  }

  .file_box {
    width: 100%;
    padding: 16px;
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45, 0.3);
    border-radius: 12px;
    margin-top: 16px;
    display: grid;
    grid-template-columns: 40px auto;
    align-items: center;
    gap: 12px;
  }

  .file_box .right {
    display: grid;
    gap: 4px;
  }

  .file_box .right .details {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .bars {
    position: relative;
    width: 100%;
    height: 8px;
    background-color: transparent;
    /* border-radius: 8px; */
  }

  .bars .bar {
    width: 100%;
    position: absolute;
    background-color: #eaecf0;
    height: 100%;
    border-radius: 8px;
    top: 0;
    left: 0;
    box-sizing: border-box;
  }

  .bars .progress {
    /* width: ${(props) => `calc(${props.width} + 1px)`}; */
    position: absolute;
    background-color: #0c6ef2;
    height: 100%;
    border-radius: 8px;
    top: 0;
    left: 0;
    z-index: 33;
    margin-left: -1px;
    box-sizing: border-box;
  }

  .file_box .right .percent {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    gap: 12px;
    align-items: center;
  }

  .file_box .right span p:nth-child(1) {
    font-size: 16px;
    color: white;
    font-weight: 500;
    line-height: 20px;
  }

  .file_box .right span p:nth-child(2) {
    font-size: 14px;
    color: #bac2de;
    line-height: 20px;
  }

  .upload_box span {
    margin-top: 8px;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .upload_box span p:nth-child(1) {
    color: #0c6ef2;
    font-weight: 600;
    font-weight: 16px;
    line-height: 20px;
    font-size: 16px;
  }

  .upload_box span p:nth-child(2) {
    color: white;
    font-weight: 16px;
    line-height: 20px;
    font-size: 16px;
    font-weight: 500;
  }

  .upload_icon {
    padding: 10px;
    border: 1px solid #222739;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }

  .upload_box:hover .upload_icon {
    background-color: rgba(27, 31, 45);
  }

  .upload_box .allowed {
    color: #bac2de;
    font-size: 14px;
    line-height: 18px;
  }
`;
export default ManualDeposit;
