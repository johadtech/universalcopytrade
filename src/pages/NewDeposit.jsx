import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { MainContainer } from "../styled/templates/MainContainer";
import { MainPage } from "../styled/templates/MainPage";
import { ContentTable } from "../styled/templates/ContentTable";
import { styled } from "styled-components";
import PaymentsTable from "../tables/PaymentsTables";
import { LargeDivider } from "../styled/forms/dividers";
import { Skeleton, useMediaQuery } from "@mui/material";
import DepositModal from "../modals/DepositModal";
import { context } from "../context/context";
import AutomatedDeposit from "./inners/deposit/AutomatedDeposit";
import ManualDeposit from "./inners/deposit/ManualDeposit";
import {
  AmountBox,
  DropDownIconOutlined,
  FormButton,
  OutlinedIconBoxWithButton,
  OutlinedIconBoxWithIcon,
} from "../styled/input/Input";
import { SettingsFormStandard } from "../styled/forms/SettingsFormStandard";
import PaymentsHistory from "../history/PaymentsHistory";

const NewDeposit = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);
  const [openModal, setOpenModal] = useState(false);
  const { depositSettings, userData, currentPrices, accounts } =
    useContext(context);
  const [type, setType] = useState(undefined);
  const [apiKey, setApiKey] = useState(undefined);
  const [addresses, setAddresses] = useState({});
  const [isLoadingDepositSettings, setIsLoadingDepositSettings] =
    useState(true);

  useEffect(() => {
    if (depositSettings && userData && currentPrices && accounts) {
      const { Regular } = depositSettings;

      if (Regular) {
        const { type, apiKey, addresses } = Regular;
        setType(type);
        setApiKey(apiKey);
        setAddresses(addresses);
        setTimeout(() => {
          setIsLoadingDepositSettings(false);
        }, 500);
      }
    }
  }, [depositSettings, userData, currentPrices, accounts]);

  // manual
  // automated

  // manual && submitImage, submit deposit, then admin notifications
  // automated && submitDeposit, adminNotifications, then redirect to coinbase

  // deposits
  // ref userRef amount asset total (USD) date status

  return (
    <MainContainer>
      {openModal && <DepositModal open={{ openModal, setOpenModal }} />}

      <Sidebar
        selected="Deposit"
        hidden={{ sidebarHidden, setSidebarHidden }}
      />
      <MainPage className="style-4">
        <Header sidebar={{ sidebarHidden, setSidebarHidden }} />

        <div className="content" style={{ padding: "0px 48px" }}>
          <h1 className="page_title">Deposit</h1>
          {/* <p className="page_context">
            Earn stable profits with professional asset management
          </p> */}

          <div className="main">
            {/* <div className="main_title">
              <span>
                <p>Methods</p>
              </span>
            </div> */}

            {/* <ContentTable className="scrollbar-hide"> */}
            {/* <div className="title">
                <p style={{ color: "#bac2de" }}>Deposit methods</p>
              </div> */}

            {isLoadingDepositSettings ? (
              <DepositContainerStandard>
                <LargeDivider>
                  <Skeleton
                    variant="rounded"
                    height={54}
                    sx={{ backgroundColor: "#1b1f2d" }}
                  />
                  <Skeleton
                    variant="rounded"
                    height={54}
                    sx={{ backgroundColor: "#1b1f2d" }}
                  />

                  <Skeleton
                    variant="rounded"
                    height={54}
                    sx={{ backgroundColor: "#1b1f2d" }}
                  />

                  <AmountBox
                    className="amount_box"
                    style={{
                      opacity: "0",
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  >
                    <div className="label">
                      <p>Amount:</p>
                      <img
                        src="./assets/misc/info.svg"
                        alt=""
                        className="error_inform"
                        id="popcorn"
                      />
                    </div>

                    <div className="wrapper">
                      <input type="number" placeholder="1000" />

                      <span className="asset">
                        <span>
                          <img src="./assets/asset/bitcoin.svg" alt="" />
                          <p>BTC</p>
                        </span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 9L12 15L18 9"
                            stroke="#5C6175"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </AmountBox>
                </LargeDivider>
              </DepositContainerStandard>
            ) : (
              <DepositStandard>
                <SettingsFormStandard>
                  <div>
                    <div className="section">
                      <div className="section_intro">
                        <p className="title">Methods</p>
                        <p className="subtext">
                          To make a deposit, choose your preferred method, enter
                          an amount and upload a corresponding payment proof.
                        </p>
                      </div>

                      <div className="form_item">
                        <DropDownIconOutlined>
                          <div
                            className="wrapper"
                            // onClick={() => setShowCountries(!showCountries)}
                          >
                            <label for="country" className="label">
                              Asset
                            </label>
                            <div className="content">
                              <div className="main">
                                <img
                                  style={{ width: "22px" }}
                                  src="./assets/asset/bitcoin.svg"
                                  className="asset"
                                />
                                <input
                                  type="text"
                                  name="country"
                                  id=""
                                  defaultValue="Bitcoin"
                                  autoComplete="off"
                                  className="country_search_ref"
                                  disabled
                                />
                              </div>

                              <span
                                // className={showUserTab ? "selectors tab" : "selectors"}
                                className="selectors"
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7 9L12 4L17 9"
                                    stroke="#BAC2DE"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>

                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M7 15L12 20L17 15"
                                    stroke="#BAC2DE"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </DropDownIconOutlined>
                      </div>

                      <div className="form_item">
                        <p className="label">Address</p>
                        <div className="address">
                          <div className="content">
                            <OutlinedIconBoxWithButton className="variant">
                              <div className="left">
                                <img
                                  src={`./asseticons/${"BTC"}.svg`}
                                  style={{ marginLeft: "12px" }}
                                  // ./asseticons/${selectedMethod}.svg

                                  alt=""
                                />
                                <input
                                  type="text"
                                  placeholder="bc1qsry6jka8t3qms0tl9t3p5n25fwnsj0wl9m6t00"
                                  disabled
                                />
                              </div>
                              <button
                              // onClick={() =>
                              //   handleEditAddress(address, "Regular")
                              // }
                              >
                                Copy address
                              </button>
                            </OutlinedIconBoxWithButton>
                          </div>
                        </div>

                        <p
                          style={{
                            color: "#0c6ef2",
                            marginTop: "8px",
                            maxWidth: "max-content",
                            marginLeft: "auto",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                          // onClick={() => showQRCode()}
                        >
                          Or tap to reveal QR Code
                        </p>
                      </div>

                      <div className="form_item">
                        <p className="label">Amount</p>
                        <div className="content">
                          <OutlinedIconBoxWithIcon>
                            <input type="number" placeholder="0.01" />
                            <div className="box">
                              <img src="./assets/asset/bitcoin.svg" alt="" />
                              <p>BTC</p>
                            </div>
                          </OutlinedIconBoxWithIcon>
                        </div>
                      </div>

                      <div className="form_item">
                        <p className="label">Payment proof:</p>
                        <button
                          className={"upload_box"}
                          accept="image/png, image/gif, image/jpeg"
                        >
                          <>
                            <span className="upload_icon">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.66699 13.3333L10.0003 10M10.0003 10L13.3337 13.3333M10.0003 10V17.5M16.667 13.9524C17.6849 13.1117 18.3337 11.8399 18.3337 10.4167C18.3337 7.88536 16.2816 5.83333 13.7503 5.83333C13.5682 5.83333 13.3979 5.73833 13.3054 5.58145C12.2187 3.73736 10.2124 2.5 7.91699 2.5C4.46521 2.5 1.66699 5.29822 1.66699 8.75C1.66699 10.4718 2.3632 12.0309 3.48945 13.1613"
                                  stroke="#BAC2DE"
                                  stroke-width="1.66667"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </span>
                            <span>
                              <p>Click to upload</p>
                              <p>or drag and drop</p>
                            </span>
                            <p className="allowed">
                              SVG, PNG, JPG or GIF (max. 10 MB)
                            </p>
                            <input
                              type="file"
                              style={{
                                opacity: "0",
                                position: "absolute",
                                pointerEvents: "none",
                              }}
                              accept="image/png, image/gif, image/jpeg, image/svg"
                            />
                          </>
                        </button>
                      </div>

                      <FormButton>
                        <p>Deposit</p>
                      </FormButton>
                    </div>

                    <div className="section">
                      <div className="section_intro">
                        <p className="title">History</p>
                        <p className="subtext">Your recent deposit activity.</p>
                      </div>

                      <PaymentsHistory />
                    </div>

                    {/* form end */}
                  </div>
                </SettingsFormStandard>
              </DepositStandard>
              // <DepositContainerStandard>
              //   {type === "automated" && (
              //     <AutomatedDeposit
              //       api={apiKey}
              //       user={userData}
              //       prices={currentPrices}
              //       accounts={accounts}
              //     />
              //   )}
              //   {type === "manual" && (
              //     <ManualDeposit
              //       addresses={addresses}
              //       user={userData}
              //       prices={currentPrices}
              //       accounts={accounts}
              //     />
              //   )}
              // </DepositContainerStandard>
            )}
            {/* </ContentTable> */}

            {/* <div className="main_title">
              <span>
                <p>Deposit history</p>
              </span>
            </div> */}

            {/* <PaymentsTable /> */}
          </div>
        </div>
      </MainPage>
    </MainContainer>
  );
};

const DepositStandard = styled.div`
  /* margin-left: 50px; */
  /* display: grid; */
  /* place-content: center; */

  .form_item {
    margin-top: 24px;
  }

  .upload_box {
    width: 100%;
    padding: 30px;
    display: block;
    border: 1px solid #222739;
    background-color: rgba(27, 31, 45, 0.3);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;
    cursor: pointer;
  }

  .upload_box.disabled {
    opacity: 0.7;
    user-select: none;
    pointer-events: none;
    cursor: not-allowed;
  }

  .upload_box span {
    margin-top: 8px;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .upload_box span p:nth-child(1) {
    color: #0c6ef2;
    font-weight: 600;
    font-weight: 16px;
    line-height: 20px;
    font-size: 16px;
  }

  .upload_box span p:nth-child(2) {
    color: white;
    font-weight: 16px;
    line-height: 20px;
    font-size: 16px;
    font-weight: 500;
  }

  .upload_icon {
    padding: 10px;
    border: 1px solid #222739;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }

  .upload_box:hover .upload_icon {
    background-color: rgba(27, 31, 45);
  }

  .upload_box .allowed {
    color: #bac2de;
    font-size: 14px;
    line-height: 18px;
  }
`;

const SettingsStandard = styled.div`
  color: white;
  /* display: none; */

  .title {
    font-size: 28px;
    font-weight: 600;
  }

  .settings {
    display: grid;
    grid-template-columns: 220px auto;
    margin-top: 24px;
    gap: 48px;
  }

  .switcher-desktop {
  }

  .switcher-mobile {
    width: 100%;
    display: none;
  }

  .switcher-mobile .selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border: 1px solid #323e67;
    border-radius: 8px;
    background-color: #0c0f19;
    cursor: pointer;
  }

  .switcher-mobile .selector p {
    font-weight: 600;
  }

  .switcher-mobile .selector img {
    filter: invert(0%) sepia(0%) saturate(0%) hue-rotate(334deg)
      brightness(200%) contrast(100%);
  }

  .switcher-mobile .selector span {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  @media screen and (max-width: 1100px) {
    .settings {
      grid-template-columns: auto;
      gap: 32px;
    }

    .switcher-desktop {
      display: none;
    }

    .switcher-mobile {
      display: block;
    }
  }

  .wrapper {
    height: 100%;
  }
`;

const DepositContainerStandard = styled.div`
  display: grid;
  gap: 12px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  margin: auto auto;

  @media screen and (max-width: 768px) {
    width: 100%;
  }

  .instruction {
    /* white-space: nowrap; */
    font-size: 14px;
    font-weight: 600;
    color: #bac2de;
    line-height: 16px;
  }

  .deposit-card {
    /* width: 100%; */
    margin: auto auto;
    background-color: #1b1f2d;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    padding: 16px 24px;
    box-sizing: border-box;
    cursor: pointer;
  }

  .deposit-card span {
    display: grid;
    grid-template-columns: 20px auto;
    gap: 8px;
    align-items: center;
  }

  .deposit-card .bottom {
    display: none;
    margin-top: 32px;
  }

  .deposit-card.active .bottom {
    display: grid;
  }

  .deposit-card img {
    width: 20px;
    height: 20px;
  }

  .bottom .qr-code {
    max-width: 200px;
    width: 100%;
    height: auto;
    place-self: center;
    margin-top: 24px;
  }

  .deposit-card {
    width: 396px;
    /* width: 100%; */
    margin: auto auto;
    background-color: #1b1f2d;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    padding: 16px 24px;
    box-sizing: border-box;
    cursor: pointer;
  }

  @media screen and (max-width: 768px) {
    .deposit-card {
      width: 100%;
    }
  }

  .deposit-card span {
    display: grid;
    grid-template-columns: 20px auto;
    gap: 8px;
    align-items: center;
  }

  .deposit-card .bottom {
    display: none;
    margin-top: 32px;
  }

  .deposit-card.active .bottom {
    display: grid;
  }

  .deposit-card img {
    width: 20px;
    height: 20px;
  }

  .caption {
    font-size: 14px;
    font-weight: 600;
    color: #bac2de;
    line-height: 16px;
  }

  .address-box {
    margin-top: 24px;
    position: relative;
    overflow-y: scroll;
  }

  .address-box .icons {
    /* display: flex; */
    /* gap: 8px; */
    /* align-items: center; */
    position: absolute;
    /* right: 10px; */
    /* top: 35px; */
    display: grid;
    place-content: center;
    background-color: #222739;
    border-bottom-right-radius: 12px;
    border-top-right-radius: 12px;
    z-index: 3;
    height: 49px;
    bottom: 0;
    right: 0;
    padding: 0px 12px;
    cursor: pointer;
  }

  .address-box input {
    width: 100%;
    border: none;
    margin-top: 8px;
    font-family: "Inter";
    color: white;
    font-size: 14px;
    display: flex;
    background-color: #222739;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    margin-top: 8px;
    height: fit-content;
    font-weight: 500;
    /* background-color: red; */
  }

  .address-box input::placeholder {
    color: #bac2de;
    font-size: 14px;
    font-weight: 500;
  }

  .address-box label {
    font-weight: 600;
    font-size: 14px;
    color: #bac2de;
  }

  .deposit_bottom .qr-code {
    max-width: 200px;
    width: 100%;
    height: auto;
    place-self: center;
    margin-top: 24px;
  }
`;

export default NewDeposit;
