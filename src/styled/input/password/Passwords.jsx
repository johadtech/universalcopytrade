import { styled } from "styled-components";

export const PasswordBox = styled.div`
  display: grid;
  gap: 8px;

  .error {
    color: #ff3344;
    font-size: 14px;
    margin-top: 8px;
  }

  label {
    /* font-size: 14px;
  font-weight: 500;
  color: #bac2de; */

    font-size: 14px;
    font-weight: 500;
    color: white;
    line-height: 24px;
  }

  .main {
    width: 100%;
    /* position: relative; */
  }

  .box {
    position: relative;
  }

  input {
    padding: 12px;
    font-size: 16px;
    box-sizing: border-box;
    font-size: 16px;
    border-radius: 8px;
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45, 0.3);
    font-family: Inter, sans-serif;
    color: white;
    font-family: Inter, sans-serif;
    margin-top: 8px;
    width: 100%;
  }

  input::placeholder {
    color: #bac2de;
  }

  input:hover {
    background: rgba(12, 110, 242, 0.1);
    border: 1px solid #0c6ef2;
  }

  input:not(:placeholder-shown) {
    background: rgba(12, 110, 242, 0.1);
    border: 1px solid #0c6ef2;
  }

  input.input_error:hover {
    background: rgba(12, 110, 242, 0.1);
    border: 1px solid #ff3344;
  }

  /* input.field:hover {
  background: rgba(12, 110, 242, 0.1);
  border: 1px solid #0c6ef2;
} */

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    border: 1px solid white;
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0px 1000px rgba(12, 110, 242, 0.1) inset;
    transition: background-color 5000s ease-in-out 0s;
    border: 1px solid #0c6ef2;
  }

  .show_btn {
    font-size: 14px;
    color: #0c6ef2;
    cursor: pointer;
    user-select: none;
    position: absolute;
    right: 10px;
    bottom: 12%;
  }

  &.variant input:not(:placeholder-shown) {
    background-color: rgba(27, 31, 45, 0.3);
    border: 1px solid #222739;
  }

  &.variant input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    border: 1px solid #222739;
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0px 1000px rgba(12, 110, 242, 0.1) inset;
    transition: background-color 5000s ease-in-out 0s;
    border: 1px solid #222739;
  }

  /* .show_btn.btn_error {
  bottom: 30px;
} */
`;
