import { useContext, useEffect, useRef, useState } from "react";
import { SettingsFormStandard } from "../../../styled/forms/SettingsFormStandard";
import {
  DropDownIconOutlined,
  FormButton,
  TextFieldOutlined,
} from "../../../styled/input/Input";
import VerificationBoxSettings from "../VerificationBoxSettings";
import CircularLoader from "../../../styled/loaders/CircularLoader";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../../firebase/firebase";
import { styled } from "styled-components";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { context } from "../../../context/context";
import Toast from "../../../hooks/Toast";
import { siteSettings } from "../../../static";
import emailjs from "@emailjs/browser";

const VerificationSettings = ({ userData }) => {
  // verification upload
  const [imageName, setImageName] = useState(undefined);
  const [imageLink, setImageLink] = useState(undefined);
  const [imageSize, setImageSize] = useState(undefined);
  const [imageType, setImageType] = useState(undefined);
  const [isUploadingVerification, setIsUploadingVerification] = useState(false);
  let [uploadVerificationProgress, setUploadVerificationProgress] =
    useState(0.001);
  const [id, setID] = useState(userData.id);
  const { dispatch } = useContext(context);
  const image = userData?.photoURL;
  const firstName = userData?.firstname;
  const lastName = userData?.lastname;

  const [selectedOthers, setSelectedOthers] = useState(false);
  const [verificationType, setVerificationType] = useState("Driver's License");

  const verificationOptions = [
    "Driver's License",
    "Identity Card",
    "Social Security Card",
    "Passport",
    "Other(specify)",
  ];

  const othersRef = useRef();

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  function reset() {
    // if (othersRef) {
    //   othersRef.current.value = "";
    // }

    setImageLink(undefined);
    setImageName(undefined);
    setImageSize(undefined);
    setImageType(undefined);
    setSelectedOthers(false);
    setUploadVerificationProgress(0.001);
    setVerificationType("Driver's License");
    setSelectedOthers(false);
  }

  async function handleVerify() {
    setIsUploadingVerification(true);
    if (imageLink) {
      const storageRef = ref(storage, imageName + new Date());
      const uploadTask = uploadBytesResumable(storageRef, imageLink);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadVerificationProgress(
            uploadVerificationProgress + Number(progress)
          );
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
          setIsUploadingVerification(false);
          setToastType("error");
          setToastMessage("Failed to submit. Please try again later");
          setOpenToast(true);
          // console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log("File available at", downloadURL);
            submitVerification(downloadURL);
          });
        }
      );
    }
  }

  // ref, user, type, date, status
  // admin notification

  async function submitVerification(url) {
    // setIsUploadingVerification(true);
    // reset();
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "verifications", str), {
      ref: str,
      user: id,
      status: "pending",
      date: serverTimestamp(),
      type: verificationType,
      link: url,
      userRef: {
        name: userData.firstname + " " + userData.lastname,
        photo: userData.photoURL ? userData.photoURL : null,
        admin: userData.admin,
        email: userData.email,
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
        setIsUploadingVerification(false);
        setToastType("error");
        setToastMessage("Failed to submit. Please try again later");
        setOpenToast(true);
        // toast.error("There was a problem. Please try again later");
      });
  }

  async function sendAdminEmail() {
    const params = {
      to_name: "Admin",
      details: `A new verification was submitted on your platform.`,
      action_name: "Verification",
      logo_link: `${siteSettings.ogLink}/logo.png`,
      to_login: `${siteSettings.link}`,
      from_name: `${siteSettings.name}`,
      to_email: `${siteSettings.supportEmail}`,
    };

    emailjs
      .send("service_x4dbltd", "template_fwhr0oo", params, "9IOr2_lHheTH7RW1k")
      .then(() => {})
      .catch((error) => {});
  }

  // admin notified
  async function sendAdminNotification(ref, url) {
    const randomOne = Math.floor(Math.random(100, 999) * 1000 + 1);
    const randomTwo = Math.floor(Math.random(100, 999) * 100 + 1);

    const str =
      id.substring(0, 4) + randomOne.toString() + randomTwo.toString();

    await setDoc(doc(db, "adminNotifications", str), {
      ref: str,
      type: "Verification",
      message: "Submitted an account verification document",
      user: id,
      read: false,
      date: serverTimestamp(),
      userRef: {
        name: userData.firstname + " " + userData.lastname,
        photo: userData.photoURL ? userData.photoURL : null,
        email: userData.email,
      },
      verificationRef: {
        link: url,
        ref,
      },
    })
      .then(() => {
        reset();
        setIsUploadingVerification(false);
        setToastType("success");
        setToastMessage("Verification request submitted");
        setOpenToast(true);

        // write admin email
        // sendUserNotification();
      })
      .catch((error) => {
        setIsUploadingVerification(false);
        setToastType("error");
        setToastMessage("Failed to submit. Please try again later");
        setOpenToast(true);
      });
  }

  function handleTypeSelect(e) {
    const { value } = e.target;

    if (value === "Other(specify)") {
      setSelectedOthers(true);
      setVerificationType(undefined);
    } else {
      setSelectedOthers(false);
      setVerificationType(value);
    }
  }

  function handleOther(e) {
    const { value } = e.target;

    if (value) {
      setVerificationType(value);
    } else {
      setVerificationType(undefined);
    }
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

      <VerificationsSettingsStandard>
        {userData && !userData.verified && (
          <SettingsFormStandard>
            <div className="header">
              <p className="title">Verification</p>
              <p className="subtext">
                Check your verification status and request verification.
              </p>
            </div>

            <div className="form">
              {/* status */}
              <div className="section">
                <div className="section_intro">
                  <p className="title">Status</p>

                  <div className="content status">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 11H8M10 15H8M16 7H8M20 12V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H12M16 16L21 21M21 16L16 21"
                        stroke="#ff3344"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <p style={{ color: "#ff3344", marginLeft: "8px" }}>
                      Your account is not verified. To verify, kindly provide
                      your information with a valid means of identification
                      attached as an image document.
                    </p>
                  </div>
                </div>
              </div>

              {/* submit verification */}
              <div className="section">
                <div className="section_intro">
                  <p className="title">Submit verification</p>
                  <p className="subtext">
                    To request an account verification, kindly provide your
                    information with a valid means of Identification attached as
                    an image document.
                  </p>
                </div>

                <div className="form_item">
                  <p className="label">Document type</p>
                  <div className="content" style={{ marginTop: "8px" }}>
                    <DropDownIconOutlined className="select">
                      <div className="wrapper">
                        <div className="content">
                          <div className="main">
                            <select
                              name="verification-options"
                              onChange={(e) => handleTypeSelect(e)}
                            >
                              {verificationOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>

                          <span className="selectors">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 9L12 4L17 9"
                                stroke="#BAC2DE"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 15L12 20L17 15"
                                stroke="#BAC2DE"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </DropDownIconOutlined>
                  </div>
                </div>

                {selectedOthers && (
                  <div className="form_item">
                    <p className="label">Document type</p>
                    <div className="content">
                      <TextFieldOutlined className="variant">
                        <input
                          type="text"
                          ref={othersRef}
                          placeholder="Your document type"
                          onChange={handleOther}
                        />
                      </TextFieldOutlined>
                    </div>
                  </div>
                )}

                <VerificationBoxSettings
                  name={{ imageName, setImageName }}
                  link={{ imageLink, setImageLink }}
                  upload={{
                    isUploadingVerification,
                    setIsUploadingVerification,
                  }}
                  size={{ imageSize, setImageSize }}
                  type={{ imageType, setImageType }}
                  progress={{
                    uploadVerificationProgress,
                    setUploadVerificationProgress,
                  }}
                />
              </div>

              {/* button */}
              <FormButton
                disabled={!imageLink || isUploadingVerification}
                onClick={handleVerify}
                className={
                  !imageLink || isUploadingVerification
                    ? "form_button disabled"
                    : "form_button"
                }
              >
                {isUploadingVerification ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="24" color="#ffffff" />
                  </div>
                ) : (
                  <p>Request verification</p>
                )}
              </FormButton>
            </div>
          </SettingsFormStandard>
        )}

        {userData && userData.verified && (
          <SettingsFormStandard>
            <div className="header">
              <p className="title">Verification</p>
              <p className="subtext">
                Check your verification status and request verification
              </p>
            </div>

            <div className="form">
              {/* status */}
              <div className="section">
                <div className="section_intro">
                  <p className="title">Status</p>

                  <div className="content status">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 12.5V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H12M14 11H8M10 15H8M16 7H8M14.5 19L16.5 21L21 16.5"
                        stroke="#0AC18E"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <p style={{ color: "#0AC18E", marginLeft: "8px" }}>
                      Your account has been verified.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SettingsFormStandard>
        )}
      </VerificationsSettingsStandard>
    </>
  );
};

const VerificationsSettingsStandard = styled.div`
  .form_item {
    margin-top: 24px;
  }

  .status {
    display: grid;
    grid-template-columns: 18px auto;
    gap: 4px;
    margin-top: 16px;
  }

  .status p {
    font-size: 16px;
    color: #ff3344;
    line-height: auto;
    line-height: 20px;
  }
`;

export default VerificationSettings;
