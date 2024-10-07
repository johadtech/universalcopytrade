import React, { useContext, useEffect, useRef, useState } from "react";
import { SettingsFormStandard } from "../../../styled/forms/SettingsFormStandard";
import {
  ActionButton,
  FormButton,
  PasswordBox,
  TextFieldOutlined,
} from "../../../styled/input/Input";
import { styled } from "styled-components";
import * as EmailValidator from "email-validator";
import {
  EmailAuthProvider,
  deleteUser,
  getAuth,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import CircularLoader from "../../../styled/loaders/CircularLoader";
import { context } from "../../../context/context";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import Toast from "../../../hooks/Toast";
import { useNavigate } from "react-router-dom";

const SecuritySettings = ({ userData }) => {
  const [emailAddress, setEmailAddress] = useState(userData.email);
  const { dispatch } = useContext(context);
  const auth = getAuth();
  const [id, setID] = useState(userData.id);

  const navigate = useNavigate();

  // const { isDeletingUser, setIsDeletingUser } = deleting;

  // useEffect(() => {
  //   console.log("del", deleting);
  // }, []);

  // handleEmail
  const [emailChanged, setEmailChanged] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const passwordValueRef = useRef();

  function resetEmail() {
    if (passwordValueRef) {
      passwordValueRef.current.value = "";
    }

    setEmailChanged(false);
    setEmailError(false);
    setPasswordValue("");
  }

  // handlePasswordValue
  function handlePasswordValue(e) {
    const { value } = e.target;

    if (value) {
      setPasswordValue(value);
    } else {
      setPasswordValue("");
    }
  }

  // extra function for email
  function handleEmailAddress(e) {
    const { value } = e.target;

    if (value) {
      setEmailAddress(value);

      if (value === userData.email) {
        setEmailChanged(false);
        setEmailError(false);
      } else {
        setEmailAddress(value);
        setEmailChanged(true);
      }

      if (!EmailValidator.validate(value)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    } else {
      setEmailChanged(false);
      setEmailAddress(emailAddress);
    }
  }

  // handleEmailSubmit
  async function handleEmailSubmit() {
    setIsChangingEmail(true);

    const auth = getAuth();
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      passwordValue
    );

    const result = await reauthenticateWithCredential(
      auth.currentUser,
      credential
    )
      .then(() => {
        updateEmail(auth.currentUser, emailAddress)
          .then(() => {
            changeDataEmail();
          })
          .catch((error) => {
            const { code } = error;
            setIsChangingEmail(false);
            // console.log(code);
            if (code === "auth/email-already-in-use") {
              setToastType("error");
              setToastMessage("This email address cannot be used");
              setOpenToast(true);
            } else if (code === "auth/wrong-password") {
              setToastType("error");
              setToastMessage(
                "Invalid credentials. Check your password and try again"
              );
              setOpenToast(true);
            } else if (code === "auth/network-request-failed") {
              // console.log("network problems");
              setToastType("error");
              setToastMessage(
                "Network request failed. Check your network and retry"
              );
              setOpenToast(true);
            } else {
              setToastType("error");
              setToastMessage(
                "There was an error with your request. Please try again later"
              );
              setOpenToast(true);
            }
          });
      })
      .catch((error) => {
        const { code } = error;
        // console.log(code);
        setIsChangingEmail(false);
        if (code === "auth/wrong-password") {
          setToastType("error");
          setToastMessage(
            "Invalid credentials. Check your password and try again"
          );
          setOpenToast(true);
        } else if (code === "auth/network-request-failed") {
          // console.log("network problems");
          setToastType("error");
          setToastMessage(
            "Network request failed. Check your network and retry"
          );
          setOpenToast(true);
        } else {
          setToastType("error");
          setToastMessage(
            "There was an error with your request. Please try again later"
          );
          setOpenToast(true);
        }
      });
  }

  async function changeDataEmail() {
    const profile = doc(db, "users", id);
    await updateDoc(profile, {
      email: emailAddress,
    })
      .then(() => {
        setIsChangingEmail(false);
        resetEmail();

        setToastType("success");
        setToastMessage("Email address successfully changed");
        setOpenToast(true);
      })
      .catch((error) => {
        setIsChangingEmail(false);
        console.log(error);
        setToastType("error");
        setToastMessage(
          "There was an error with your request. Please try again later"
        );
        setOpenToast(true);
      });
  }

  // password
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [password, setPassword] = useState(undefined);
  const [confirm, setConfirm] = useState(undefined);
  const [newPassword, setNewPassword] = useState(undefined);

  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] =
    useState("");

  const [newErrorMessage, setNewErrorMessage] = useState("");
  const [newError, setNewError] = useState(false);

  const passwordRef = useRef();
  const confirmRef = useRef();
  const newRef = useRef();

  function resetPassword() {
    if (passwordRef) {
      passwordRef.current.value = "";
    }

    if (confirmRef) {
      confirmRef.current.value = "";
    }

    if (newRef) {
      newRef.current.value = "";
    }

    setPassword(undefined);
    setPasswordError(false);
    setConfirm(undefined);
    setConfirmError(false);
    setNewPassword(undefined);
    setNewError(false);
  }

  // handlePassword
  function handlePassword(e) {
    const { value } = e.target;

    if (value) {
      setPassword(value);

      if (Number(value.length) < 6) {
        setPasswordErrorMessage("Password should be at least 6 characters");
        setPasswordError(true);
      } else {
        setPasswordErrorMessage("");
        setPasswordError(false);
      }
    } else {
      setPassword(undefined);
    }
  }

  // handleConfirm
  function handleConfirm(e) {
    const { value } = e.target;

    if (value) {
      setConfirm(value);

      if (
        newPassword &&
        Number(newPassword.length) > 5 &&
        newPassword !== value
      ) {
        setPasswordConfirmErrorMessage("Passwords do not match");
        setConfirmError(true);
      } else {
        setPasswordConfirmErrorMessage("h");
        setConfirmError(false);
      }
    } else {
      setConfirm(undefined);
    }
  }

  // handleNewPassword
  function handleNewPassword(e) {
    const { value } = e.target;

    if (value) {
      setNewPassword(value);

      if (Number(value.length) < 6) {
        setNewErrorMessage("Password should be at least 6 characters");
        setNewError(true);
      } else {
        setNewErrorMessage("");
        setNewError(false);
      }
    } else {
      setNewPassword(undefined);
    }
  }

  async function handlePasswordSubmit() {
    setIsChangingPassword(true);

    const auth = getAuth();
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );

    const result = await reauthenticateWithCredential(
      auth.currentUser,
      credential
    )
      .then(() => {
        updatePassword(auth.currentUser, newPassword)
          .then(() => {
            changeDataPassword();
          })
          .catch((error) => {
            setToastType("error");
            setToastMessage(
              "There was an error with your request. Please try again later"
            );
            setOpenToast(true);
            // console.log("error changing", error);
            // console.log("changing error", error.code);
          });
      })
      .catch((error) => {
        // const { code } = error;

        setIsChangingPassword(false);
        // console.log("auth", error);
        // console.log("error with reauthentication", error.code);

        if (error.code === "auth/network-request-failed") {
          // console.log("network problems");
          setToastType("error");
          setToastMessage(
            "Network request failed. Check your network and retry"
          );
          setOpenToast(true);
        }
        if (error.code === "auth/wrong-password") {
          // console.log("wrong password");
          setToastType("error");
          setToastMessage(
            "Invalid credentials. Check your password and try again"
          );
          setOpenToast(true);
        }
        if (error.code === "auth/too-many-requests") {
          // console.log("too many attempts");
          setToastType("error");
          setToastMessage("Too many attempts. Try again after a while");
          setOpenToast(true);
        }
        // error with reauthentication auth/wrong-password
      });
  }

  async function changeDataPassword() {
    const profile = doc(db, "users", id);
    await updateDoc(profile, {
      userPass: newPassword,
    })
      .then(() => {
        resetPassword();
        setIsChangingPassword(false);
        setToastType("success");
        setToastMessage("Password changed successfully");
        setOpenToast(true);
        // dispatch({
        //   type: "toast",
        //   payload: JSON.stringify({
        //     open: true,
        //     message: "",
        //     type: "success",
        //   }),
        // });
      })
      .catch((error) => {
        setIsChangingPassword(false);
        setToastType("error");
        setToastMessage(
          "There was an error with your request. Please try again later"
        );
        setOpenToast(true);
        // dispatch({
        //   type: "toast",
        //   payload: JSON.stringify({
        //     open: true,
        //     message:
        //       "There was an error with your request. Please try again later",
        //     type: "error",
        //   }),
        // });
      });
  }

  // delete
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);
  const [deletePasswordValue, setDeletePasswordValue] = useState("");
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const deletePasswordRef = useRef();

  // handlePasswordValue
  function handleDeletePasswordValue(e) {
    const { value } = e.target;

    if (value) {
      setDeletePasswordValue(value);
      setShowDeleteButton(true);
    } else {
      setDeletePasswordValue("");
      setShowDeleteButton(false);
      setDeleteButtonClicked(false);
    }
  }

  function handleDeleteUser() {
    setDeleteButtonClicked(true);
    // delete user
  }

  async function deleteUserFirebase() {
    setIsDeleting(true);
    // setIsDeletingUser(true);

    const profile = doc(db, "users", id);
    await deleteDoc(profile)
      .then(() => {
        // console.log("deleted");
        deleteUserData();
      })
      .catch((error) => {
        console.log(error);
        setIsDeleting(false);
        setToastType("error");
        setToastMessage(
          "There was an error with your request. Please try again later"
        );
        setOpenToast(true);
      });
  }

  async function deleteUserData() {
    const auth = getAuth();
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      deletePasswordValue
    );

    const result = await reauthenticateWithCredential(
      auth.currentUser,
      credential
    )
      .then(() => {
        deleteUser(auth.currentUser)
          .then((result) => {
            setIsDeleting(false);
            dispatch({ type: "logout" });
            navigate("/login");
          })
          .catch((error) => {
            console.log(error);
            setIsDeleting(false);
            setToastType("error");
            setToastMessage(
              "There was an error with your request. Please try again later"
            );
            setOpenToast(true);
          });
      })
      .catch((error) => {
        // const { code } = error;

        setIsDeleting(false);
        // console.log("auth", error);
        // console.log("error with reauthentication", error.code);

        if (error.code === "auth/network-request-failed") {
          // console.log("network problems");
          setToastType("error");
          setToastMessage(
            "Network request failed. Check your network and retry"
          );
          setOpenToast(true);
        }
        if (error.code === "auth/wrong-password") {
          // console.log("wrong password");
          setToastType("error");
          setToastMessage(
            "Invalid credentials. Check your password and try again"
          );
          setOpenToast(true);
        }
        if (error.code === "auth/too-many-requests") {
          // console.log("too many attempts");
          setToastType("error");
          setToastMessage("Too many attempts. Try again after a while");
          setOpenToast(true);
        }
        // error with reauthentication auth/wrong-password
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

      <SecuritySettingsStandard>
        <SettingsFormStandard>
          <div className="form">
            <div className="section">
              <div className="section_intro">
                <p className="label">Email</p>
                <p className="subtext">
                  Your email address is an essential part of your sign in
                  process.
                </p>
              </div>

              <div className="form_item">
                <p className="label">Email</p>
                <div className="content">
                  <TextFieldOutlined className="variant">
                    <input
                      type="email"
                      placeholder={emailAddress}
                      value={emailAddress}
                      onChange={handleEmailAddress}
                    />
                    {emailError && (
                      <p className="error">
                        Please enter a valid email address
                      </p>
                    )}
                  </TextFieldOutlined>
                </div>
              </div>

              {emailChanged && (
                <div className="form_item">
                  <p className="label">Enter your password to reauthenticate</p>
                  <div className="content">
                    <PasswordBox className="variant">
                      <input
                        type="password"
                        onChange={handlePasswordValue}
                        ref={passwordValueRef}
                        placeholder="Password (Min. of 6 characters)"
                      />
                    </PasswordBox>
                  </div>
                </div>
              )}

              <FormButton
                onClick={handleEmailSubmit}
                disabled={
                  emailError ||
                  (emailChanged && !passwordValue) ||
                  !emailChanged ||
                  isChangingEmail ||
                  isChangingPassword ||
                  isDeleting
                }
                className={
                  (emailError ||
                    isChangingEmail ||
                    isChangingPassword ||
                    isDeleting ||
                    (emailChanged && !passwordValue) ||
                    !emailChanged) &&
                  "disabled"
                }
              >
                {isChangingEmail ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="24" color="#ffffff" />
                  </div>
                ) : (
                  <p>Save</p>
                )}
              </FormButton>
            </div>

            <div className="section">
              <div className="section_intro">
                <p className="label">Password</p>
                <p className="subtext">Edit your sign-in password.</p>
              </div>

              <div className="form_item">
                <p className="label">Current password</p>
                <div className="content">
                  <PasswordBox className="variant">
                    <input
                      type="password"
                      ref={passwordRef}
                      onChange={handlePassword}
                      placeholder="Password (Min. of 6 characters)"
                    />
                    {passwordError && (
                      <p className="error">{passwordErrorMessage}</p>
                    )}
                  </PasswordBox>
                </div>
              </div>

              <div className="form_item">
                <p className="label">New password</p>
                <div className="content">
                  <PasswordBox className="variant">
                    <input
                      type="password"
                      ref={newRef}
                      onChange={handleNewPassword}
                      placeholder="Your new password (Min. of 6 characters)"
                    />
                    {newError && <p className="error">{newErrorMessage}</p>}
                  </PasswordBox>
                </div>
              </div>

              <div className="form_item">
                <p className="label">Confirm new password</p>
                <div className="content">
                  <PasswordBox className="variant">
                    <input
                      type="password"
                      ref={confirmRef}
                      placeholder="Retype your new password"
                      onChange={handleConfirm}
                    />
                    {confirmError && (
                      <p className="error">{passwordConfirmErrorMessage}</p>
                    )}
                  </PasswordBox>
                </div>
              </div>

              <FormButton
                disabled={
                  !password ||
                  passwordError ||
                  !confirm ||
                  confirmError ||
                  !newPassword ||
                  newError ||
                  isChangingPassword ||
                  isChangingEmail ||
                  isDeleting
                }
                className={
                  (!password ||
                    passwordError ||
                    !confirm ||
                    confirmError ||
                    !newPassword ||
                    newError ||
                    isChangingPassword ||
                    isChangingEmail ||
                    isDeleting) &&
                  "disabled"
                }
                onClick={handlePasswordSubmit}
              >
                {isChangingPassword ? (
                  <div style={{ padding: "8px" }}>
                    <CircularLoader bg="#cccccc" size="24" color="#ffffff" />
                  </div>
                ) : (
                  <p>Save</p>
                )}
              </FormButton>
            </div>

            {/* delete */}
            {/* <div className="section">
              <div className="section_intro">
                <p className="title">Delete account</p>
                <p className="subtext">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
              </div>

              <div className="form_item">
                <div className="content">
                  <button className="delete_button" onClick={handleDeleteUser}>
                    Delete your account
                  </button>
                </div>
              </div>

              <div
                className={
                  deleteButtonClicked
                    ? "form_item"
                    : "form_item delete_password_confirm"
                }
              >
                <p className="label">Enter your password to reauthenticate</p>
                <div className="content">
                  <PasswordBox className="variant">
                    <input
                      type="password"
                      onChange={handleDeletePasswordValue}
                      ref={deletePasswordRef}
                      placeholder="Password (Min. of 6 characters)"
                    />
                  </PasswordBox>
                </div>
              </div>


              <div className={!showDeleteButton && "delete_button_confirm"}>
                <ActionButton
                  onClick={deleteUserFirebase}
                  disabled={isDeleting || isChangingEmail || isChangingPassword}
                  className={
                    (isDeleting || isChangingEmail || isChangingPassword) &&
                    "blink_me"
                  }
                >
                  Delete account
                </ActionButton>
              </div>
    
            </div> */}
          </div>
        </SettingsFormStandard>
      </SecuritySettingsStandard>
    </>
  );
};

const SecuritySettingsStandard = styled.div`
  .form_item {
    margin-top: 24px;
  }

  .delete_button_confirm,
  .delete_password_confirm {
    opacity: 0;
    user-select: none;
    pointer-events: none;
  }

  .multi_factor {
    margin-top: 48px;
  }
`;

export default SecuritySettings;
