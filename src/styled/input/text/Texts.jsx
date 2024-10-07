import { styled } from "styled-components";

export const MultiTextBoxOutlined = styled.div`
  display: flex;
  gap: 12px;
  box-sizing: border-box;
  width: 100%;

  @media screen and (max-width: 768px) {
    display: grid;
    gap: 32px;
  }

  &.login {
    display: grid;
    gap: 32px;
  }

  .wrapper {
    /* display: grid; */
    /* gap: 8px; */
    width: 100%;
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

  input {
    margin-top: 8px;
    font-size: 16px;
    border-radius: 8px;
    padding: 10px 12px;
    background-color: rgba(27, 31, 45, 0.3);
    border: 1px solid #222739;
    font-family: "Inter var", Inter, sans-serif;
    width: 100%;
    color: white;
    font-family: Inter, sans-serif;
  }

  input::placeholder {
    color: #bac2de;
    font-size: 16px;
    line-height: 28px;
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

  /* .input_error {
  border: 1px solid #ff3344;
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
`;

export const TextFieldOutlined = styled.div`
  /* margin-top: 32px; */

  .error {
    color: #ff3344;
    font-size: 14px;
    margin-top: 8px;
  }

  .wrapper {
    /* display: grid;
  gap: 8px; */
    width: 100%;
  }

  label {
    font-size: 14px;
    font-weight: 500;
    color: white;
    line-height: 24px;
  }

  input {
    box-sizing: border-box;
    /* background: #0c0f19; */
    font-size: 16px;
    /* border: 1px solid #232738;
  background-color: #151823; */
    border-radius: 8px;
    padding: 12px;
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45, 0.3);
    font-family: "Inter var", Inter, sans-serif;
    color: white;
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

  /* .input_error {
  border: 1px solid #ff3344;
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
`;

export const TextBox = styled.div`
  /* margin-top: 24px; */
  position: relative;
  overflow-y: scroll;

  input {
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    border: none;
    background-color: #1b1f2d;
    margin-top: 8px;
    font-family: "Inter";
    color: white;
    font-size: 16px;
    font-weight: 500;
  }

  input::placeholder {
    color: #bac2de;
    font-size: 16px;
    font-weight: 500;
  }

  textarea {
    width: 100%;
    padding: 16px;
    border-radius: 12px;
    border: none;
    background-color: #1b1f2d;
    margin-top: 8px;
    font-family: "Inter";
    color: white;
    font-size: 16px;
    font-weight: 500;
    min-width: 100%;
    max-width: 348px;
    max-height: 234px;
  }

  textarea::placeholder {
    color: #bac2de;
    font-size: 16px;
    font-weight: 500;
  }

  label {
    font-weight: 600;
    font-size: 14px;
    color: #bac2de;
  }
`;
