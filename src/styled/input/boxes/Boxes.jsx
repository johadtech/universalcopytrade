import { styled } from "styled-components";

export const CheckBoxInput = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
  align-items: flex-start;

  input {
    background: red;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    border: 1px solid #323e67;
    outline: none;
    accent-color: #0c6ef2;
    margin: 0;
    cursor: pointer;
  }

  div {
    background: red;
    width: 12px !important;
    height: 12px !important;
    min-height: 12px;
    min-width: 12px;
    border-radius: 2px;
    border: 1px solid #323e67;
    outline: none;
    accent-color: #0c6ef2;
    cursor: pointer;
  }

  p {
    font-size: 14px;
    color: white;
    font-family: Inter;
    line-height: 24px;
  }
`;

export const OutlinedIconBoxWithButton = styled.div`
  display: flex;
  height: fit-content;
  width: 100%;
  gap: 8px;

  .left {
    display: flex;
    margin-top: 8px;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45, 0.3);
    padding: 0px 12px;
    color: white;
    font-family: Inter, sans-serif;
    margin-top: 8px;
    width: 100%;
  }

  .left img {
    height: 22px;
    width: 22px;
    /* margin-left: 4px; */
  }

  input {
    font-size: 16px;
    height: 100%;
    background-color: transparent;
    border: none;
    outline: none;
    width: 100%;
    color: white;
    padding-left: 12px;
    font-weight: 500;
    font-size: 16px;
    line-height: 28px;
    border: none;
    padding: 12px;
    /* background-color: red; */
  }

  &.variant .left {
    padding: 0px;
  }

  &.variant input {
    padding: 12px;
  }

  input::placeholder {
    color: #bac2de;
    font-size: 16px;
    line-height: 28px;
  }

  input:not(:placeholder-shown) {
    background: rgba(12, 110, 242, 0.1);
    border: none;
  }

  &.variant input:not(:placeholder-shown) {
    /* border: 1px solid #222739; */
    background-color: rgba(27, 31, 45, 0.3);
    border: none;
  }

  input.input_error:hover {
    background: rgba(12, 110, 242, 0.1);
    border: 1px solid #ff3344;
  }

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

  button {
    border-radius: 8px;
    border: none;
    font-family: "Inter";
    background-color: #222739;
    padding: 12px;
    cursor: pointer;
    white-space: nowrap;
    margin-top: 8px;
    font-size: 14px;
    font-weight: 600;
    color: white;
  }

  button:hover {
    background-color: rgba(27, 31, 45);
  }
`;

export const OutlinedIconBoxWithIcon = styled.div`
  display: flex;
  height: fit-content;
  width: 100%;
  /* max-width: 70%; */

  /* border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid #222739;
  background-color: rgba(27, 31, 45, 0.3); */

  input {
    padding: 10px 12px;
    font-size: 16px;
    box-sizing: border-box;
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45, 0.3);
    color: white;
    font-family: Inter, sans-serif;
    margin-top: 8px;
    width: 100%;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  input::placeholder {
    color: #bac2de;
  }

  input:not(:placeholder-shown) {
    background: rgba(12, 110, 242, 0.1);
    border: 1px solid #0c6ef2;
  }

  input.input_error:hover {
    background: rgba(12, 110, 242, 0.1);
    border: 1px solid #ff3344;
  }

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

  .box {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    /* background-color: #191f34;
  border: 1px solid rgba(186, 194, 222, 0.1); */
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45);
    cursor: pointer;
    padding: 10px 12px;
    white-space: nowrap;
    margin-top: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #bac2de;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .box img {
    width: 22px;
    height: 22px;
  }

  .box p {
    font-size: 16px;
    font-weight: 500;
    color: white;
  }
`;

export const MultiItemBoxOutlined = styled.div`
  display: flex;
  height: fit-content;
  /* max-width: 70%; */
  justify-content: space-between;
  border: 1px solid #222739;
  border-radius: 8px;
  align-items: center;
  padding: 10px 12px;
  background-color: rgba(27, 31, 45, 0.2);

  /* border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid #222739;
  background-color: rgba(27, 31, 45, 0.3); */

  .left {
    font-size: 16px;
    line-height: 28px;
    box-sizing: border-box;
    background-color: transparent;
    /* background: #0c0f19; */
    color: white;
    font-family: Inter, sans-serif;
    /* margin-top: 8px; */
    width: 100%;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .left img {
    width: 22px;
    height: 22px;
  }

  .left p {
    font-size: 16px;
    line-height: 28px;
    font-weight: 500;
    color: white;
  }

  .right {
    /* padding: 10px 12px; */
    white-space: nowrap;
  }

  .right p {
    font-size: 16px;
    line-height: 28px;
    font-weight: 600;
    color: #bac2de;
  }

  /* .box {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: #191f34;
  border: 1px solid rgba(186, 194, 222, 0.1);
  cursor: pointer;
  padding: 10px 12px;
  white-space: nowrap;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #bac2de;
  display: flex;
  gap: 8px;
  align-items: center;
} */
`;

export const OutlinedBoxWithButton = styled.div`
  display: flex;
  height: fit-content;
  /* max-width: 70%; */
  gap: 4px;

  input {
    padding: 10px 12px;
    font-size: 16px;
    box-sizing: border-box;

    border-radius: 8px;
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45, 0.3);
    padding: 10px 12px;

    color: white;
    font-family: Inter, sans-serif;
    margin-top: 8px;
    width: 100%;

    /* border: 1px solid #323e67;
  background: #0c0f19; */
    /* border-top-left-radius: 8px;
  border-bottom-left-radius: 8px; */
  }

  input::placeholder {
    color: #bac2de;
  }

  input:not(:placeholder-shown) {
    background: rgba(12, 110, 242, 0.1);
    border: 1px solid #0c6ef2;
  }

  input.input_error:hover {
    background: rgba(12, 110, 242, 0.1);
    border: 1px solid #ff3344;
  }

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

  button {
    /* border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: #191f34;
  border: 1px solid rgba(186, 194, 222, 0.1); */

    /* padding: 10px 12px; */
    border-radius: 8px;
    border: none;
    font-family: "Inter";
    background-color: #222739;
    padding: 12px;
    /* border: 1px solid #222739; */

    cursor: pointer;
    white-space: nowrap;
    margin-top: 8px;
    font-size: 14px;
    font-weight: 600;
    color: white;
  }

  button:hover {
    background-color: rgba(27, 31, 45);
  }
`;

export const SelectorBoxes = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  margin-top: -12px;

  span {
    background-color: #07080d;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    display: grid;
    place-content: center;
    cursor: pointer;
  }

  span.active {
    background-color: #222739;
    border: 2px solid #505771;
  }

  span p {
    padding: 8px 12px;
    border-radius: 12px;
    color: #5c6175;
    /* line-height: 18px; */
  }

  span.active p {
    color: white;
  }
`;

export const Search = styled.div`
  display: flex;
  gap: 8px;
  background-color: #1b1f2d;
  padding: 8px 12px;
  border-radius: 32px;
  align-items: center;
  max-width: fit-content;

  img {
    width: 20px;
    height: 20px;
  }

  input {
    background-color: transparent;
    outline: none;
    border: none;
    color: #bac2de;
    font-size: 16px;
    font-weight: 500;
    width: 100%;
    font-family: "Inter";
  }
`;

export const TradeSwitcher = styled.div`
  padding: 4px;
  background-color: #080a11;
  display: flex;
  border-radius: 12px;
  /* max-width: 400px; */
  width: 100%;
  place-self: center;

  span {
    width: 100%;
    text-align: center;
    height: 100%;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }

  span p {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: #bac2de;
    background-color: transparent;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid transparent;
    transition: all 0.1s ease-in-out;
  }

  .buy.active p {
    color: white;
    background-color: #222739;
    border-color: #00994c;
  }

  .sell.active p {
    color: white;
    background-color: #222739;
    border-color: #ff3344;
  }

  .convert.active p {
    color: white;
    background-color: #222739;
    border-color: #0c6cf2;
  }
`;

export const PrimarySwitcher = styled.div`
  display: flex;
  background-color: #1b1f2d;
  max-width: max-content;
  border-radius: 8px;
  padding: 4px;
  overflow-x: scroll;
  white-space: nowrap;
  margin: 24px 0px;

  button {
    font-family: Inter;
    padding: 8px 12px;
    background-color: #1b1f2d;
    color: #bac2de;
    outline: none;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: grid;
    place-content: center;
  }

  button.active {
    font-family: Inter;
    /* padding: 8px; */
    background-color: #0c0d0d;
    color: #0c6cf2;
    outline: none;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
  }

  button.active svg path {
    fill: #0c6cf2;
  }
`;

export const SecondarySwitcher = styled.div`
  padding: 4px;
  background-color: #1b1f2d;
  display: flex;
  border-radius: 8px;
  width: 100%;
  place-self: center;

  span {
    width: 100%;
    text-align: center;
    height: 100%;
  }

  span p {
    font-size: 16px;
    font-weight: 600;
    color: white;
    background-color: transparent;
    padding: 12px;
    border-radius: 6px;
    cursor: pointer;
    color: #bac2de;
    font-family: "Inter";
  }

  span.active p {
    font-size: 16px;
    font-weight: 600;
    color: #0c6cf2;
    background-color: #0c0d0d;
    padding: 12px;
    cursor: pointer;
    border-radius: 6px;
  }
`;
