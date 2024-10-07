import { styled } from "styled-components";

export const MainPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  padding-top: 0;
  /* background-color: rgb(17 24 39); */
  background-color: #0c0f19;
  max-height: 100vh;
  overflow-y: auto;
  width: 100%;
  height: 100vh;
  /* max-width: 2360px; */

  .page_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
  }

  @media screen and (max-width: 1200px) {
    padding-bottom: 165px;

    /* .wrapper {
      padding-bottom: 100px;
    } */

    .page_top {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }
  }

  .page_content {
    padding-bottom: 48px;
  }

  .page_title {
    font-size: 24px;
    color: white;
    font-weight: 600;
  }

  .page_context {
    color: #bac2de;
    font-size: 16px;
    /* font-weight: 500; */
    margin-top: 8px;
    line-height: 20px;
    /* padding-bottom: 32px; */
  }

  .main_title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 48px;
  }

  .main_title span {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .main_title span p {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }

  .main_title button {
    border-radius: 32px;
    cursor: pointer;
    color: #fff;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 600;
    font-family: Inter;
    background-color: #0c6cf2;
    outline: none;
    border: none;
  }

  .main_title button.variant {
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

  .main_title button.variant.active {
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

  .main_title button.variant.active svg path {
    fill: #0c6cf2;
  }

  .title {
  }
`;
