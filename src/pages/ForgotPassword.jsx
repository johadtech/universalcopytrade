import { useContext, useEffect, useState } from "react";
import "../styles/pages/forgot-password.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { countryFlags } from "../static";
import {
  FilledButton,
  MultiTextBoxOutlined,
  PasswordBox,
  TextFieldOutlined,
} from "../styled/input/Input";
import { Link, useNavigate } from "react-router-dom";
import { context, themeContext } from "../context/context";
import { ThemedPage } from "../styled/templates/ThemedPage";
import Toast from "../hooks/Toast";
import { auth } from "../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import CircularLoader from "../styled/loaders/CircularLoader";

const ForgotPassword = () => {
  // show password
  const [showPassword, setShowPassword] = useState(false);

  // const { theme } = useContext(themeContext);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const navigate = useNavigate();

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(true);

  return (
    <>
      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      <ThemedPage>
        {/* {theme === "standard" && ( */}
        <div className="container scrollbar-hide">
          <div className="forgot__top__standard">
            <img src="./logo.svg" alt="logo" className="logo" />
            <Link to="/register" className="link">
              Create account
            </Link>
          </div>
          <div className="forgot__form__standard">
            <h1>Forgot your password?</h1>
            <p className="desc">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <Formik
              initialValues={{ email: "", password: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Required";
                  setError(true);
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address";
                  setError(true);
                } else {
                  setError(false);
                }
                return errors;
              }}
              onSubmit={async (values) => {
                const { email } = values;

                setIsSending(true);
                await sendPasswordResetEmail(auth, email)
                  .then((data) => {
                    setToastType("success");
                    setToastMessage("Password reset sent successfully");
                    setOpenToast(true);

                    values.email = "";
                    setIsSending(false);
                  })
                  .catch((error) => {
                    setIsSending(false);
                    if (
                      error.message === "Firebase: Error (auth/user-not-found)."
                    ) {
                      setToastType("error");
                      setToastMessage(
                        "User credentials not found in our records"
                      );
                      setOpenToast(true);
                    } else {
                      setToastType("error");
                      setToastMessage("Request failed. Please try again later");
                      setOpenToast(true);
                    }
                  });
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form className="form">
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

                    <FilledButton
                      type="submit"
                      className={(error || isSending) && "disabled"}
                    >
                      {isSending ? (
                        <CircularLoader
                          bg="#cccccc"
                          size="28"
                          color="#ffffff"
                        />
                      ) : (
                        <p>Reset password</p>
                      )}
                    </FilledButton>

                    <Link to="/login" className="forgot_password">
                      Back to log in
                    </Link>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
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

export default ForgotPassword;

// names, country, email address, phone number, password => create
// email, password => login

// add forgot password & 2fa
