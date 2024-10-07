import { useState } from "react";
import "../styles/pages/questionnaire.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { countryFlags } from "../static";
import {
  FilledButton,
  MultiTextBoxOutlined,
  PasswordBox,
  TextFieldOutlined,
} from "../styled/input/Input";
import { useNavigate } from "react-router-dom";

const Questionnaire = () => {
  // show password
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="container">
      <form className="questionnaire__form">
        <h1>Extra information</h1>

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
                <div style={{ display: "grid", gap: "32px" }}>
                  <div
                    style={{
                      backgroundColor: "transparent",
                      border: " 1px solid #BAC2DE",
                      borderRadius: "8px",
                      padding: "16px 24px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: "12px", width: "100%" }}
                    >
                      <img
                        src="./assets/icons/person.svg"
                        style={{
                          padding: "10px",
                          border: " 1px solid #BAC2DE",
                          borderRadius: "4px",
                        }}
                      />

                      <span style={{ display: "grid", gap: "6px" }}>
                        <p
                          style={{
                            color: "#FFFFFF",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          I'm a solo creator
                        </p>
                        <p style={{ fontSize: "15px", color: "#BAC2DE" }}>
                          I’m setting up a storefront for myself
                        </p>
                      </span>
                    </div>

                    <img
                      src="./assets/icons/check-blue.svg"
                      style={{ marginLeft: "48px" }}
                    />
                  </div>

                  <div
                    style={{
                      backgroundColor: "transparent",
                      border: " 1px solid #0C6EF2",
                      borderRadius: "8px",
                      padding: "16px 24px",
                      display: "flex",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{ display: "flex", gap: "12px", width: "100%" }}
                    >
                      <img
                        src="./assets/icons/users.svg"
                        style={{
                          padding: "10px",
                          border: " 1px solid #BAC2DE",
                          borderRadius: "4px",
                        }}
                      />

                      <span style={{ display: "grid", gap: "6px" }}>
                        <p
                          style={{
                            color: "#FFFFFF",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          I'm part of a team
                        </p>
                        <p style={{ fontSize: "15px", color: "#BAC2DE" }}>
                          I’m setting up a storefront for a team
                        </p>
                      </span>
                    </div>

                    {/* <img
                      src="./assets/icons/check-blue.svg"
                      style={{ marginLeft: "48px" }}
                    /> */}
                  </div>

                  <FilledButton onClick={() => navigate("/register")}>
                    <p>Continue</p>
                  </FilledButton>
                </div>
              </Form>
            );
          }}
        </Formik>
      </form>
    </div>
  );
};

export default Questionnaire;
