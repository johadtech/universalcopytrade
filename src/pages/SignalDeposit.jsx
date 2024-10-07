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
import { AmountBox } from "../styled/input/Input";
import AutomatedDepositSignals from "./inners/deposit/signals/AutomatedDepositSignals";
import ManualDepositSignals from "./inners/deposit/signals/ManualDepositSignals";
import SignalDepositHistory from "../history/SignalDepositHistory";

const SignalDeposit = () => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);
  const [openModal, setOpenModal] = useState(false);
  const { depositSettings, userData, currentPrices, accounts } =
    useContext(context);

  const [regularType, setRegularType] = useState(undefined);
  const [regularApiKey, setRegularApiKey] = useState(undefined);
  const [regularAddresses, setRegularAddresses] = useState({});

  const [repeatRegular, setRepeatRegular] = useState(undefined);
  const [signalsType, setSignalsType] = useState(undefined);
  const [signalsApiKey, setSignalsAPiKey] = useState(undefined);
  const [signalsAddresses, setSignalsAddresses] = useState({});

  const [isLoadingDepositSettings, setIsLoadingDepositSettings] =
    useState(true);

  useEffect(() => {
    if (depositSettings && userData && currentPrices && accounts) {
      const { Regular, Signals } = depositSettings;

      if (Regular && Signals) {
        setRegularType(Regular.type);
        setRegularApiKey(Regular.apiKey);
        setRegularAddresses(Regular.addresses);

        setRepeatRegular(Signals.repeat);
        setSignalsType(Signals.type);
        setSignalsAPiKey(Signals.apiKey);
        setSignalsAddresses(Signals.addresses);

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
    <>
      <ContentTable className="scrollbar-hide">
        <div className="title">
          <p style={{ color: "#bac2de" }}>Deposit methods</p>
        </div>

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
          <DepositContainerStandard>
            {repeatRegular && (
              <>
                {regularType === "automated" && (
                  <AutomatedDepositSignals
                    api={regularApiKey}
                    user={userData}
                    prices={currentPrices}
                    accounts={accounts}
                  />
                )}
                {regularType === "manual" && (
                  <ManualDepositSignals
                    addresses={regularAddresses}
                    user={userData}
                    prices={currentPrices}
                    accounts={accounts}
                  />
                )}
              </>
            )}
            {!repeatRegular && (
              <>
                {signalsType === "automated" && (
                  <AutomatedDepositSignals
                    api={signalsApiKey}
                    user={userData}
                    prices={currentPrices}
                    accounts={accounts}
                  />
                )}
                {signalsType === "manual" && (
                  <ManualDepositSignals
                    addresses={signalsAddresses}
                    user={userData}
                    prices={currentPrices}
                    accounts={accounts}
                  />
                )}
              </>
            )}
          </DepositContainerStandard>
        )}
      </ContentTable>

      <div className="main_title">
        <span>
          <p>Deposit history</p>
        </span>
      </div>

      <SignalDepositHistory user={userData.id} />
    </>
  );
};

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

export default SignalDeposit;
