// styled/input/Input.jsx
//import styled from 'styled-components';
import { styled } from "styled-components";

// Create a styled container for the tooltip
// ToolTipContainer component
export const ToolTipContainer = styled.div`
  position: relative;
  
  .tooltip {
    position: absolute;
    background-color: #333;
    color: #fff;
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    opacity: 0.9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

// AmountBox component
export const AmountBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

// DropDownBox component
export const DropDownBox = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
`;

// DropDownBoxWithIcon component
export const DropDownBoxWithIcon = styled(DropDownBox)`
  background-image: url('path/to/icon.svg');
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px; // Adjust to make space for the icon
`;

// FullButton component
export const FullButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &.disabled,
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

// MiniAmountBox component
export const MiniAmountBox = styled(AmountBox)`
  padding: 5px;
  font-size: 12px;
`;

// MiniAmountBoxFull component
export const MiniAmountBoxFull = styled(MiniAmountBox)`
  width: 100%;
`;

// SelectorBoxes component
export const SelectorBoxes = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    flex: 1;
  }
`;

// TradeDropDown component
export const TradeDropDown = styled(DropDownBox)`
  width: 100%;
`;

// TradeSwitcher component
export const TradeSwitcher = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1b1f2d;
  padding: 10px;
  border-radius: 4px;
  color: #fff;

  .switcher-button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    background-color: #007bff;
    color: #fff;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

// PrimarySwitcher component
export const PrimarySwitcher = styled.div`
  display: flex;
  gap: 8px;

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: #f3f4f6;
    color: #333;
    cursor: pointer;
    transition: background-color 0.3s;

    &.active {
      background-color: #007bff;
      color: #fff;
    }

    &:hover {
      background-color: #e2e6ea;
    }
  }
`;

// Search component
export const Search = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  background-color: #fff;
  gap: 8px;

  img {
    width: 16px;
    height: 16px;
  }

  input {
    border: none;
    outline: none;
    padding: 4px;
    flex: 1;
  }
`;

// WatchlistStar component
export const WatchlistStar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  background-color: #f3f4f6;
  cursor: pointer;
  transition: background-color 0.3s;

  &.variant {
    background-color: #ffd700;
  }

  &:hover {
    background-color: #e2e6ea;
  }

  svg {
    fill: #ffdf00;
  }
`;

// TextBox component
export const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  label {
    font-size: 14px;
    margin-bottom: 4px;
  }

  input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }
`;

// FilledButton component
export const FilledButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:disabled,
  &.disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:hover:enabled {
    background-color: #0056b3;
  }
`;

// OutlinedIconBoxWithIcon component
export const OutlinedIconBoxWithIcon = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;

  input {
    border: none;
    outline: none;
    flex: 1;
    padding: 8px;
  }

  .box {
    display: flex;
    align-items: center;
    gap: 4px;

    img {
      width: 20px;
      height: 20px;
    }

    p {
      font-size: 14px;
      margin: 0;
    }
  }
`;

// FormButton component
export const FormButton = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 16px;

  &:hover {
    background-color: #0056b3;
  }

  &.disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

// DropDownIconOutlined component
export const DropDownIconOutlined = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;

  .wrapper {
    display: flex;
    flex-direction: column;
  }

  .content {
    display: flex;
    justify-content: space-between;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;

    .main {
      flex: 1;

      select {
        width: 100%;
        border: none;
        outline: none;
        font-size: 14px;
        padding: 8px;
        cursor: pointer;
        background-color: transparent;
        appearance: none;
      }
    }

    .selectors {
      display: flex;
      gap: 4px;

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }

  .menu {
    position: absolute;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
    margin-top: 8px;
  }
`;

// MultiTextBoxOutlined component
export const MultiTextBoxOutlined = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;

  .wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;

    label {
      font-size: 14px;
      margin-bottom: 4px;
      color: #ccc; /* Label color for consistency */
    }

    input {
      padding: 12px;
      border: 1px solid #444; /* Dark border color */
      border-radius: 6px;
      outline: none;
      font-size: 14px;
      background-color: #1c1e21; /* Dark input background */
      color: #fff; /* White text color */
      transition: border 0.2s ease-in-out;

      &:focus {
        border-color: #3d6aff;
        box-shadow: 0px 0px 4px 1px #3d6aff; /* Glowing effect on focus */
      }

      &:hover {
        border-color: #3d6aff; /* Blue outline on focus */
        box-shadow: 0px 0px 4px 1px #3d6aff; /* Add glowing effect */
      }
    }

    .input_error {
      border-color: red;
    }

    .error {
      color: red;
      font-size: 12px;
      margin-top: 4px;
    }

    textarea {
      border: none;
      outline: none;
      padding: 8px;
      resize: none;
      width: 100%;
      height: 80px;
      background-color: #1c1e21; /* Dark background for textarea */
      color: #fff; /* White text for textarea */
    }

    /* Media queries for responsiveness */
    @media (max-width: 768px) {
      margin-bottom: 18px;
    }
  }

  /* Media queries for responsiveness */
  @media (max-width: 768px) {
    flex-direction: column; /* Stack fields vertically on mobile */
    gap: 0; /* Remove gap on mobile for a more compact layout */
    margin-bottom: -28px;
  }

  @media (min-width: 769px) {
    flex-direction: row; /* Side by side layout for desktop */
    gap: 8px; /* Maintain gap between fields on desktop */
  }
`;

// PasswordBox component
export const PasswordBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;

  label {
    font-size: 14px;
    margin-bottom: 4px;
    color: #ccc; /* Gray label */
  }

  input {
    padding: 12px;
    border: 1px solid #444;
    border-radius: 6px;
    font-size: 14px;
    background-color: #1c1e21; /* Dark input background */
    color: #fff; /* White text */
    outline: none;
    transition: border 0.2s ease-in-out;

    &:focus {
      /**border-color: #3d6aff;**/
      /**box-shadow: 0px 0px 4px 1px #3d6aff;**/ /* Glowing border on focus */
    }
  }

  .box {
    display: flex;
    align-items: center;
    border: 1px solid #444;
    border-radius: 6px;
    background-color: #1c1e21; /* Dark background for the input container */
    padding: 0;
    margin-top: 8px;

    input {
      padding: 8px;
      border: none;
      outline: none;
      flex: 1;
      background-color: #1c1e21; /* Input background */
      color: #fff; /* Input text color */
    }

    .show_btn {
      padding: 8px;
      cursor: pointer;
      background-color: #1c1e21; /* Match the input background */
      /**border-left: 1px solid #444;**/
      border-radius: 0 6px 6px 0;
      font-size: 12px;
      color: #3d6aff; /* Blue color for the "Show" button */

      &:hover {
        background-color: #2a2d31; /* Slightly darker on hover */
      }
    }

    &:hover {
      border-color: #3d6aff; /* Blue outline on focus */
      box-shadow: 0px 0px 4px 1px #3d6aff; /* Add glowing effect */
    }
  }

  .error {
    color: red;
    font-size: 12px;
    margin-top: 4px;
  }

  .password-placement {
    margin-top: 4px;
    font-size: 12px;
    color: #666;
  }
`;

// TextFieldOutlined component
export const TextFieldOutlined = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 3px;

  .wrapper {
    display: flex;
    flex-direction: column;

    label {
      font-size: 14px;
      margin-bottom: -20px;
      color: #ccc; /* Make label text color grayish */
    }

    input {
      padding: 12px;
      border: 1px solid #444; /* Dark border color */
      border-radius: 6px; /* Slightly round corners */
      outline: none;
      font-size: 14px;
      color: #fff; /* White text inside the input */
      background-color: #1c1e21; /* Dark background for inputs */
      transition: border 0.2s ease-in-out;

      &:focus {
        border-color: #3d6aff; /* Blue outline on focus */
        box-shadow: 0px 0px 4px 1px #3d6aff; /* Add glowing effect */
      }

      &:hover {
        border-color: #3d6aff; /* Blue outline on focus */
        box-shadow: 0px 0px 4px 1px #3d6aff; /* Add glowing effect */
      }
    }

    .input_error {
      border-color: red;
    }

    .error {
      color: red;
      font-size: 12px;
      margin-top: 4px;
    }
  }
`;

// PageButton component
export const PageButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }

  &.disabled,
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

// PhoneNumberBox component
export const PhoneNumberBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  position: relative; /* Important for positioning the dropdown menu */

  label {
    font-size: 14px;
    margin-bottom: 8px;
    color: #ccc; /* Light label text */
  }

  .wrapper {
    display: flex;
    align-items: center;
    border: 1px solid #444; /* Unified border for the whole input box */
    border-radius: 6px; /* Rounded corners */
    overflow: hidden; /* Ensure the border applies consistently */
    background-color: #1c1e21; /* Dark background for both inputs */

    .code {
      display: flex;
      align-items: center;
      padding: 3px;
      background-color: #1c1e21; /* Match the background */
      border-right: 1px solid #444; /* Border separating the country code from the input */
      cursor: pointer;

      input {
        border: none;
        outline: none;
        width: 70px; /* Increased width for better visibility of country code */
        text-align: center;
        background-color: transparent;
        color: #ccc; /* Light text for the country code */
      }

      .arrow-down {
        width: 16px;
        height: 16px;
        margin-left: 4px;
        filter: invert(100%); /* White arrow icon */
        cursor: pointer;
        transition: transform 0.3s ease;
      }

      .arrow-down.active {
        transform: rotate(180deg); /* Rotate the arrow when dropdown is active */
      }
    }

    input {
      flex: 1;
      padding: 12px;
      border: none; /* Remove double border */
      outline: none;
      color: #ccc; /* Light text for the phone number */
      background-color: transparent; /* Match background with the dark theme */
    }

    &:hover {
      border-color: #3d6aff; /* Blue outline on hover */
      box-shadow: 0px 0px 4px 1px #3d6aff; /* Add glowing effect */
    }
  }

  .error {
    color: red;
    font-size: 12px;
    margin-top: 4px;
  }

  .phone-placement {
    margin-top: 4px;
    font-size: 12px;
    color: #666;
  }

  .menu {
    position: absolute;
    top: calc(100% + 8px); /* Position dropdown below the phone number input */
    left: 0;
    right: 0;
    background-color: #1c1e21;
    border: 1px solid #444;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
    margin-top: 8px;

    .search {
      padding: 8px;

      input {
        width: 100%;
        padding: 8px;
        border: 1px solid #444;
        border-radius: 6px;
        outline: none;
        background-color: #1c1e21;
        color: #ccc;
      }
    }

    .scrollable {
      max-height: 150px;
      overflow-y: auto;

      span {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        cursor: pointer;
        background-color: #1c1e21;

        &:hover {
          background-color: #2a2d31;
        }

        p {
          margin: 0;
          font-size: 14px;
          color: #ccc;
        }
      }
    }
  }
`;

// CheckBoxInput component
export const CheckBoxInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #333;

    u {
      cursor: pointer;
      color: #007bff;
    }
  }

  div {
    width: 16px;
    height: 16px;
    border: 1px solid #ccc;
    border-radius: 2px;
    cursor: pointer;
  }
`;

// CountryDropDown component
export const CountryDropDown = styled.div`
  position: relative;
  margin-bottom: 16px;

  .wrapper {
    display: flex;
    flex-direction: column;
    cursor: pointer;

    label {
      font-size: 14px;
      color: #ccc;
      margin-bottom: 4px;
    }

    .content {
      display: flex;
      align-items: center;
      justify-content: space-between; /* Aligns flag and arrow at ends */
      gap: 8px;
      border: 1px solid #444;
      border-radius: 6px;
      padding: 12px 16px; /* Increase padding to match target design */
      background-color: #1c1e21;
      position: relative;

      &:hover {
        border-color: #3d6aff; /* Blue outline on hover */
        box-shadow: 0px 0px 4px 1px #3d6aff; /* Add glowing effect */
      }
    }

    .main {
      display: flex;
      align-items: center;
      gap: 8px; /* Space between flag and country input */

      img {
        width: 20px;
        height: 20px;
      }

      input {
        border: none;
        outline: none;
        width: 100%;
        padding-left: 8px;
        font-size: 14px;
        background-color: transparent;
        color: #ccc;
        cursor: pointer; /* Pointer for consistency with the dropdown */
      }

      input:focus {
        cursor: text; /* Change to text when focused */
      }

      input::placeholder {
        color: #666; /* Dim placeholder color */
      }
    }

    .arrow-down {
      width: 16px; /* Larger arrow for better visibility */
      height: 16px;
      filter: invert(100%);
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .arrow-down.active {
      transform: rotate(180deg); /* Flip arrow when active */
    }
  }

  .menu {
    position: absolute;
    top: calc(100% + 8px); /* Position below the dropdown */
    left: 0;
    right: 0;
    background-color: #1c1e21;
    border: 1px solid #444;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 240px;
    overflow-y: auto;
    z-index: 10;

    .search {
      padding: 8px 16px;

      input {
        width: 100%;
        padding: 8px;
        border: 1px solid #444;
        border-radius: 6px;
        outline: none;
        background-color: #1c1e21;
        color: #ccc;
      }

      input::placeholder {
        color: #666; /* Match the placeholder color */
      }
    }

    .scrollable {
      max-height: 180px;
      overflow-y: auto;

      span {
        display: flex;
        align-items: center;
        gap: 12px; /* Space between flag and country text */
        padding: 10px 16px; /* Increase padding to match target design */
        cursor: pointer;
        background-color: #1c1e21;

        &:hover {
          background-color: #2a2d31;
        }

        img {
          width: 20px;
          height: 20px;
        }

        p {
          margin: 0;
          font-size: 14px;
          color: #ccc;
        }
      }
    }
  }
`;

// MultiItemBoxOutlined component
export const MultiItemBoxOutlined = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;

  .left {
    display: flex;
    align-items: center;
    gap: 8px;

    img {
      width: 18px;
      height: 18px;
    }

    p {
      font-size: 14px;
      color: #333;
    }
  }

  .right {
    p {
      font-size: 14px;
      color: #333;
    }
  }
`;

// OutlinedIconBoxWithButton component
export const OutlinedIconBoxWithButton = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;

  .left {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;

    input {
      flex: 1;
      padding: 8px;
      border: none;
      outline: none;
      font-size: 14px;
    }

    img {
      width: 16px;
      height: 16px;
    }
  }

  .box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;

    img {
      width: 16px;
      height: 16px;
    }

    p {
      font-size: 14px;
    }
  }

  button {
    padding: 8px 16px;
    border: none;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

export const OutlinedBoxWithButton = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #bac2de;
  border-radius: 6px;
  padding: 8px;
  gap: 8px;
  
  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: #bac2de;
    font-size: 14px;
  }
  
  button {
    background-color: #0c6ef2;
    border: none;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    
    &:disabled {
      background-color: #666;
      cursor: not-allowed;
    }
  }
`;

