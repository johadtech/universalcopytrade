import { useContext, useEffect, useRef, useState } from "react";
import "../styles/pages/login.scss";
import {
  DropDownIconOutlined,
  FormButton,
  TextFieldOutlined,
} from "../styled/input/Input";
import { SettingsFormStandard } from "../styled/forms/SettingsFormStandard";
import { Link, useNavigate } from "react-router-dom";
import { ThemedPage } from "../styled/templates/ThemedPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase/firebase";
import { doc, serverTimestamp, updateDoc, setDoc } from "@firebase/firestore";
import CircularLoader from "../styled/loaders/CircularLoader";
import Toast from "../hooks/Toast";
import VerificationBoxSettings from "./inners/VerificationBoxSettings";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { styled } from "styled-components";
import { context } from "../context/context";
import { siteSettings } from "../static";
import emailjs from "@emailjs/browser";

const Verification = () => {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(true);

  const [user, loading] = useAuthState(auth);
  const { userData } = useContext(context);

  // navigate user on logged in state
  useEffect(() => {
    if (!loading && user && userData.blocked) {
      setToastType("error");
      setToastMessage("Your account has been disabled. Please contact support");
      setOpenToast(true);
      setLoader(false);
      // toast.error("Your account has been banned.");
    }

    if (!loading && user && !userData.blocked && !userData.verified) {
      setLoader(false);
    }

    if (!loading && user && !userData.blocked && userData.verified) {
      setLoader(true);
      navigate("/dashboard");
    }

    if (!loading && !user) {
      // console.log("no user no loading");
      setLoader(false);
    }
  }, [user, loading]);

  useEffect(() => {
    if (userData && userData.verified) {
      navigate("/dashboard");
    }
  }, [userData]);

  const [imageName, setImageName] = useState(undefined);
  const [imageLink, setImageLink] = useState(undefined);
  const [imageSize, setImageSize] = useState(undefined);
  const [imageType, setImageType] = useState(undefined);
  const [isUploadingVerification, setIsUploadingVerification] = useState(false);
  let [uploadVerificationProgress, setUploadVerificationProgress] =
    useState(0.001);
  const [id, setID] = useState(userData.id);

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
        setVerification(str, url);
      })
      .catch((error) => {
        setIsUploadingVerification(false);
        setToastType("error");
        setToastMessage("Failed to submit. Please try again later");
        setOpenToast(true);
        // toast.error("There was a problem. Please try again later");
      });
  }

  async function setVerification(str, url) {
    const profile = doc(db, "users", id);
    await updateDoc(profile, {
      verificationSubmitted: true,
    })
      .then(() => {
        sendAdminNotification(str, url);
        sendAdminEmail();
      })
      .catch((error) => {
        setIsUploadingVerification(false);
        setToastType("error");
        setToastMessage("Failed to submit. Please try again later");
        setOpenToast(true);
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

      <ThemedPage className="scrollbar-hide">
        {/* {theme === "standard" && ( */}
        {loader ? (
          <div className="container scrollbar-hide" style={{ display: "grid" }}>
            <CircularLoader
              bg="rgba(12, 108, 243, 0.2)"
              size="44"
              color="#0C6CF2"
            />
            {/* <p style={{ placeSelf: "center" }}>loader...</p> */}
          </div>
        ) : (
          <div className="container scrollbar-hide">
            <div className="login__top__standard">
              <img src="./logo.svg" alt="logo" className="logo" />
              <Link to="/login" className="link">
                Back to login
              </Link>
            </div>
            <div
              className="login__form__standard"
              style={{
                maxWidth: "650px",
                width: "100%",
                marginTop: "100px",
                padding: "0px 24px",
              }}
            >
              <h1>Verify your account</h1>
              <VerificationsSettingsStandard>
                {userData &&
                  !userData.verified &&
                  !userData.verificationSubmitted && (
                    <SettingsFormStandard>
                      {/* <div className="header">
                      <p className="title">Verification</p>
                      <p className="subtext">
                        Check your verification status and request verification.
                      </p>
                    </div> */}

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

                              <p
                                style={{ color: "#ff3344", marginLeft: "8px" }}
                              >
                                Your account is not verified. To verify, kindly
                                provide your information with a valid means of
                                identification attached as an image document.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* submit verification */}
                        <div className="section">
                          <div className="section_intro">
                            <p className="title">Submit verification</p>
                            <p className="subtext">
                              To request an account verification, kindly provide
                              your information with a valid means of
                              Identification attached as an image document.
                            </p>
                          </div>

                          <div className="form_item">
                            <p className="label">Document type</p>
                            <div
                              className="content"
                              style={{ marginTop: "8px" }}
                            >
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
                              <CircularLoader
                                bg="#cccccc"
                                size="24"
                                color="#ffffff"
                              />
                            </div>
                          ) : (
                            <p>Request verification</p>
                          )}
                        </FormButton>
                      </div>
                    </SettingsFormStandard>
                  )}

                {userData &&
                  !userData.verified &&
                  userData.verificationSubmitted && (
                    <SettingsFormStandard>
                      {/* <div className="header">
                        <p className="title">Verification</p>
                        <p className="subtext">
                          Check your verification status and request
                          verification
                        </p>
                      </div> */}

                      <div className="form">
                        {/* status */}
                        <div className="section">
                          <div className="section_intro">
                            <p className="title">Status</p>

                            <div className="content status">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20 9.5V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H14M14 11H8M10 15H8M16 7H8M16.5 15.0022C16.6762 14.5014 17.024 14.079 17.4817 13.81C17.9395 13.5409 18.4777 13.4426 19.001 13.5324C19.5243 13.6221 19.999 13.8942 20.3409 14.3004C20.6829 14.7066 20.87 15.2207 20.8692 15.7517C20.8692 17.2506 18.6209 18 18.6209 18M18.6499 21H18.6599"
                                  stroke="#F7931A"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>

                              <p
                                style={{ color: "#F7931A", marginLeft: "8px" }}
                              >
                                Your verification has been submitted and is
                                currently pending. You will be automatically
                                redirected to your dashboard once your account
                                is verified.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SettingsFormStandard>
                  )}
              </VerificationsSettingsStandard>
            </div>
          </div>
        )}
      </ThemedPage>
    </>
  );
};

const VerificationsSettingsStandard = styled.div`
  margin: 0 auto;
  /* background-color: red; */
  max-width: max-content;

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

export default Verification;
