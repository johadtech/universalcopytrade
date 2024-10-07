import { useContext, useEffect, useState } from "react";
import "../styles/pages/login.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  FilledButton,
  PasswordBox,
  TextFieldOutlined,
} from "../styled/input/Input";
import { Link, useNavigate } from "react-router-dom";
import { context, themeContext } from "../context/context";
import { ThemedPage } from "../styled/templates/ThemedPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase/firebase";
import { doc, serverTimestamp, updateDoc } from "@firebase/firestore";
import CircularLoader from "../styled/loaders/CircularLoader";
import { signInWithEmailAndPassword } from "@firebase/auth";
import Toast from "../hooks/Toast";

const Login = () => {
  // show password
  const [showPassword, setShowPassword] = useState(false);
  // const { theme } = useContext(
  //   themeContext || localStorage.getItem("themeName")
  // );
  const [CodeEnabled, setCodeEnabled] = useState(false);
  const [error, setError] = useState(true);
  const navigate = useNavigate();

  const [loader, setLoader] = useState(true);

  const [user, loading] = useAuthState(auth);
  const { userData } = useContext(context);
  //const { userData = {} } = useContext(context);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // navigate user on logged in state
  useEffect(() => {
    console.log("Loading:", loading);
    console.log("User:", user);
    console.log("UserData:", userData);

    if (!loading && user && userData) {  // Check if userData is not undefined
      if (userData.blocked) {
        setLoader(false);
        setToastType("error");
        setToastMessage("Your account has been disabled. Please contact support");
        setOpenToast(true);
      } else {
        navigate("/dashboard");
        setLoader(false);
      }
    }

    if (!loading && !user) {
      // console.log("no user no loading");
      setLoader(false);
    }
  }, [user, loading, userData]);

  // set user last login
  async function setLoginStatus(userid) {
    const profile = doc(db, "users", userid);
    await updateDoc(profile, {
      lastLogin: serverTimestamp(),
      presence: "online",
    })
      .then(() => {})
      .catch((error) => {});
  }

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [formFilled, setFormFilled] = useState(false);

  // !formFilled || error || !countryValue || isSigningUp

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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
              <Link to="/register" className="link">
                Create account
              </Link>
            </div>
            <div className="login__form__standard">
              <h1>Log in to your account</h1>

              <Formik
                initialValues={{ email: "", password: "" }}
                validate={(values) => {
                  const errors = {};
                  if (!values.email) {
                    errors.email = "Please enter your email address";
                    setEmailError(true);
                    setError(true);
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                      values.email
                    )
                  ) {
                    errors.email = "Please enter a valid email address";
                    setEmailError(true);
                    setError(true);
                  }
                  if (values.password && values.password.length < 6) {
                    errors.password =
                      "Your password must have at least 6 characters";
                    setPasswordError(true);
                    setError(true);
                  } else {
                    setError(false);
                  }

                  if (values.email && values.password) {
                    setFormFilled(true);
                  }

                  return errors;
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  setIsSigningIn(true);

                  const { email, password } = values;

                  try {
                    const user = await signInWithEmailAndPassword(
                      auth,
                      email,
                      password
                    );
                    if (user) {
                      // setIsSigningIn(false);
                      // const { verified } = userData;

                      // if (verified) {
                      navigate("/dashboard");
                      // } else {
                      //   navigate("/verify");
                      // }

                      // toast.success("Welcome back!");
                      setLoginStatus(user.user.uid);
                    }
                  } catch (error) {
                    setIsSigningIn(false);
                    console.log(error.message);

                    if (
                      error.message === "Firebase: Error (auth/user-not-found)."
                    ) {
                      setToastType("error");
                      setToastMessage(
                        "User credentials not found in our records"
                      );
                      setOpenToast(true);
                    } else if (
                      error.message === "Firebase: Error (auth/wrong-password)."
                    ) {
                      setToastType("error");
                      setToastMessage("Check your login details and try again");
                      setOpenToast(true);
                    } else if (
                      error.message ===
                      "Firebase: Error (auth/network-request-failed)."
                    ) {
                      // console.log("network problems");
                      setToastType("error");
                      setToastMessage(
                        "Network request failed. Check your network and retry"
                      );
                      setOpenToast(true);
                    } else if (
                      error.message ===
                      "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
                    ) {
                      // console.log("too many attempts");
                      setToastType("error");
                      setToastMessage(
                        "Too many attempts. Try again after a while"
                      );
                      setOpenToast(true);
                    } else {
                      setToastType("error");
                      setToastMessage(
                        "Failed to log in. Please try again later"
                      );
                      setOpenToast(true);
                    }

                    // if (
                    //   error.message === "Firebase: Error (auth/user-not-found)."
                    // ) {
                    //   toast.error("User credentials not found in our records.");
                    // } else if (
                    //   error.message === "Firebase: Error (auth/wrong-password)."
                    // ) {
                    //   toast.error(
                    //     "Please check your login information and try again."
                    //   );
                    // } else if (
                    //   error.message ===
                    //   "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."
                    // ) {
                    //   toast.error("Too many attempts. Try again later.");
                    // } else {
                    //   toast.error(error.message);
                    // }
                  }
                }}
              >
                {({ isSubmitting }) => {
                  return (
                    <Form className="form">
                      <TextFieldOutlined>
                        <div className="wrapper">
                          <label htmlFor="emailAddress">Email address</label>
                          <br />
                          <Field
                            type="email"
                            name="email"
                            placeholder="Email address"
                            className={emailError && "input_error"}
                          />
                          <ErrorMessage
                            className="error"
                            name="email"
                            component="p"
                          />
                          <p className="email-placement">heylo</p>
                        </div>
                      </TextFieldOutlined>

                      <PasswordBox>
                        <div className="main">
                          <label htmlFor="password">Password</label>
                          <br />
                          <span className="box">
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="Password (min. of 6 characters)"
                              className={passwordError && "input_error"}
                            />
                            <p
                              className="show_btn"
                              onClick={() =>
                                setShowPassword(
                                  showPassword === false ? true : false
                                )
                              }
                            >
                              {showPassword ? "Hide" : "Show"}
                            </p>
                          </span>
                          <ErrorMessage
                            className="error"
                            name="password"
                            component="p"
                          />
                          <p className="password-placement">heylo</p>
                        </div>
                      </PasswordBox>

                      {CodeEnabled && (
                        <TextFieldOutlined>
                          <div className="wrapper">
                            <label for="emailAddress">2fa code</label>
                            <Field
                              type="text"
                              name="code"
                              placeholder="Enter your 6 digit code"
                            />
                          </div>
                        </TextFieldOutlined>
                      )}
                      <FilledButton
                        className={
                          !formFilled || error || isSigningIn ? "disabled" : " "
                        }
                        disabled={!formFilled || error || isSigningIn}
                        // onClick={() => navigate("/register")}
                      >
                        {isSigningIn ? (
                          <CircularLoader
                            bg="#cccccc"
                            size="28"
                            color="#ffffff"
                          />
                        ) : (
                          <p>Log in</p>
                        )}
                      </FilledButton>

                      <div className="captions">
                        <span>
                          Forgot your password?{" "}
                          <Link to="/forgot" className="forgot_password">
                            {" "}
                            Reset it here
                          </Link>
                        </span>

                        {/* <span>
                      Don't have your phone?{" "}
                      <span className="colored_link">Enter a backup code</span>{" "}
                    </span> */}
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        )}
        {/* )} */}

        {/* {theme === "new" && (
        <form className="login__form__new">
          <span className="title">
            <h1>Sign in to your account</h1>

            <p className="login__form__new__supporting__text">
              Dont have an account? <span>Create free account</span>
            </p>
          </span>

          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  <TextFieldOutlined>
                    <div className="wrapper">
                      <label for="emailAddress">Email address</label>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email address"
                      />
                    </div>
                  </TextFieldOutlined>

                  <PasswordBox>
                    <div className="password__box__top">
                      <label for="password">Password</label>
                      <span>
                        <div
                          style={{
                            width: "15px",
                            height: "15px",
                            border: "1px solid #9999A1",
                            borderRadius: "4px",
                          }}
                          onClick={() => setShowPassword(!showPassword)}
                        ></div>
                        <p>Show Password</p>
                      </span>
                    </div>
                    <div className="main valid">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password (min. of 8 characters)"
                      />
                    </div>
                  </PasswordBox>

                  <FilledButton onClick={() => navigate("/register")}>
                    <p>Log in</p>
                  </FilledButton>
                </Form>
              );
            }}
          </Formik>
        </form>
      )} */}
      </ThemedPage>
    </>
  );
};

export default Login;

// names, country, email address, phone number, password => create
// email, password => login

// add forgot password & 2fa
