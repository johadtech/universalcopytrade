import { styled } from "styled-components";

export const RealEstateFormStandard = styled.div`
  display: flex;
  gap: 80px;
  width: 100%;

  @media screen and (max-width: 1200px) {
    display: grid;
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
    width: 100%;
  }

  .form_item {
    margin-top: 24px;
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
    font-size: 18px;
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

  .section:nth-child(1) {
    margin-top: 0;
  }

  .section:last-child {
    border-bottom: none;
  }

  .section {
    margin-top: 12px;
    padding-bottom: 32px;
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

  .form_item .label {
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
    color: white;
  }

  .form_item .caption p:nth-child(2) {
    font-weight: 600;
    color: #bac2de;
  }

  /* .form_button {
    max-width: max-content;
    padding: 8px 24px;
    border: none;
    color: white;
    background-color: #0c6ef2;
    font-size: 14px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 24px;
    font-family: "Inter";
  } */

  .delete_button {
    max-width: max-content;
    border: 1px solid rgba(186, 194, 222, 0.1);
    border-radius: 4px;
    padding: 10px 16px;
    font-size: 14px;
    color: #ff3344;
    font-weight: 600;
    background-color: #191f34;
    /* margin: 0; */
  }

  .action_button {
    border-radius: 4px;
    background-color: #191f34;
    border: 1px solid rgba(186, 194, 222, 0.1);
    cursor: pointer;
    padding: 10px 12px;
    white-space: nowrap;
    /* margin-top: 8px; */
    font-size: 14px;
    font-weight: 600;
    color: #bac2de;
    /* margin-top: 24px; */
  }
`;
