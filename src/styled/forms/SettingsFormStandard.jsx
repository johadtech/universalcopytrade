import { styled } from "styled-components";

export const SettingsFormStandard = styled.div`
  .profile_card_top {
    display: flex;
    gap: 24px;
    align-items: center;
    padding-bottom: 24px;
    /* border-bottom: 1px solid #293456; */
    max-width: 650px;
  }

  @media screen and (max-width: 768px) {
    .profile_card_top {
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }
  }

  .profile_card_top span {
    width: 160px;
    height: 160px;
    position: relative;
  }

  .profile_card_top span img:nth-child(1) {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }

  .profile_card_top span img:nth-child(2) {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .user_detail {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #bac2de;
    font-size: 16px;
    place-content: center;
    white-space: nowrap;
  }

  .user_detail p:nth-child(1) {
    font-size: 30px;
    font-weight: 600;
    color: white;
  }

  .primary_button {
    background-color: #0c6ef2;
    margin-top: 24px;
    outline: none;
    border: none;
    border-radius: 8px;
    padding: 10px 16px;
    font-weight: 600;
    color: white;
    font-size: 14px;
    margin-bottom: 24px;
  }

  .form {
    max-width: 650px;
    /* display: grid; */
    /* gap: 32px; */
    /* margin-top: 32px; */
  }

  .balance {
    display: grid;
    gap: 4px;
    margin-top: 48px;
    padding-bottom: 24px;
  }

  .balance p:nth-child(1) {
    font-size: 16px;
    color: #bac2de;
    font-weight: 500;
  }

  .balance p:nth-child(2) {
    font-size: 28px;
    color: #ffffff;
    font-weight: 600;
  }

  .header {
    /* margin-top: 48px; */
    max-width: 650px;
    padding-bottom: 24px;
    /* border-bottom: 1px solid #293456; */
  }

  .header .title {
    /* font-size: 18px;
    font-weight: 500;
    color: white; */
    font-size: 16px;
    font-weight: 600;
    color: white;
    line-height: 28px;
  }

  .header .subtext {
    /* font-size: 14px;
    color: #bac2de;
    margin-top: 4px; */
    font-size: 14px;
    color: #bac2de;
    margin-top: 4px;
    line-height: 24px;
  }

  .section:last-child {
    border-bottom: none;
  }

  .section {
    margin-top: 24px;
    padding-bottom: 32px;
    /* border-bottom: 1px solid rgba(27, 31, 45, 0.8); */
  }

  .section_intro {
    /* border-bottom: 1px solid #293456; */
  }

  .section_intro .title {
    font-size: 16px;
    font-weight: 600;
    color: white;
    line-height: 28px;
  }

  .section_intro .subtext {
    font-size: 14px;
    color: #bac2de;
    margin-top: 4px;
    line-height: 24px;
  }

  .form_item {
    /* margin-top: 24px; */
  }

  .form_item .label {
    /* font-size: 14px;
    color: #bac2de;
    font-weight: 500; */
    /* background-color: red; */
    font-size: 14px;
    font-weight: 500;
    color: white;
    line-height: 24px;
  }

  .form_item .content {
    /* background-color: blue; */
    max-height: max-content;
    box-sizing: border-box;
    /* margin-top: 8px; */
  }

  .form_item .caption {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
  }

  .form_item .caption p:nth-child(2) {
    font-weight: 600;
    color: #bac2de;
  }

  .form_button {
    border-radius: 8px;
    border: none;
    margin-top: 24px;
    background-color: #0c6cf2;
    color: white;
    // maxWidth: 400px;
    width: 100%;
    place-self: center;
    cursor: pointer;
    text-align: center;

    /* max-width: 50%; */
  }

  .form_button.disabled {
    background-color: #9999a1;
    color: white;
    cursor: not-allowed;
    user-select: none;
  }

  .form_button p {
    font-size: 16px;
    padding: 12px;
    font-weight: 600;
    font-family: Inter;
  }

  .delete_button {
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
    transition: all 0.3s ease-in-out;
  }

  /* button {
    
    } */

  .delete_button:hover {
    background-color: #ff3344;
    color: white;
  }

  .action_button {
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
    transition: all 0.3s ease-in-out;
  }

  .action_button:hover {
    background-color: rgba(27, 31, 45);
  }
`;
