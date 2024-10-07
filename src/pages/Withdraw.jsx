import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { MainContainer } from "../styled/templates/MainContainer";
import { MainPage } from "../styled/templates/MainPage";
import { ContentTable } from "../styled/templates/ContentTable";
import { styled } from "styled-components";
import { AmountBox, DropDownBox } from "../styled/input/Input";
import { Skeleton, useMediaQuery } from "@mui/material";
import CryptoWithdrawal from "./inners/withdrawal/page/CryptoWithdrawal";
import { context } from "../context/context";
import BankWithdrawal from "./inners/withdrawal/page/BankWithdrawal";
import PayPalWithdrawal from "./inners/withdrawal/page/PayPalWithdrawal";
import SkrillWithdrawal from "./inners/withdrawal/page/SkrillWithdrawal";
import WesternUnionWithdrawal from "./inners/withdrawal/page/WesternUnionWithdrawal";
import NetellerWithdrawal from "./inners/withdrawal/page/NetellerWithdrawal";
import MoneyGramWithdrawal from "./inners/withdrawal/page/MoneyGramWithdrawal";
import PerfectMoneyWithdrawal from "./inners/withdrawal/page/PerfectMoneyWithdrawal";
import { LargeDivider } from "../styled/forms/dividers";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import CircularLoader from "../styled/loaders/CircularLoader";
import StakeHistory from "../history/StakeHistory";
import WithdrawalHistory from "../history/WithdrawalHistory";

const Withdraw = () => {
  // value unread
  const [allAccounts, setAllAccounts] = useState({});

  const mobile = useMediaQuery("(max-width: 768px)");
  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    currentPrices,
    accounts,
    depositSettings,
    withdrawalSettings,
    userData,
  } = useContext(context);
  const [withdrawalOptions, setWithdrawalOptions] = useState({});
  const [selectedWithdrawalOption, setSelectedWithdrawalOption] =
    useState(undefined);
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      setLoader(false);
    }

    if (loading && !user) {
      setLoader(true);
    }

    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (
      currentPrices &&
      accounts &&
      depositSettings &&
      withdrawalSettings &&
      userData
    ) {
      setAllAccounts(accounts);
      const { methods } = withdrawalSettings;
      if (methods) {
        setWithdrawalOptions(methods);
        setSelectedWithdrawalOption(selectedWithdrawalOption || methods[0]);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    }
  }, [currentPrices, depositSettings, userData]);

  return (
    <MainContainer>
      {loader ? (
        <MainPage>
          <CircularLoader
            bg="rgba(12, 108, 243, 0.2)"
            size="44"
            color="#0C6CF2"
          />
        </MainPage>
      ) : (
        <>
          <Sidebar
            selected="Withdraw"
            hidden={{ sidebarHidden, setSidebarHidden }}
          />

          <MainPage className="style-4">
            <Header sidebar={{ sidebarHidden, setSidebarHidden }} />

            <div className="content">
              <h1 className="page_title">Withdraw</h1>
              <p className="page_context">
                Withdraw from your trading accounts
              </p>

              <div className="main">
                <div className="main_title">
                  <span>
                    <p>Withdraw</p>
                  </span>
                </div>

                <ContentTable className="scrollbar-hide">
                  <div className="title">
                    <p>Submit withdrawal</p>
                  </div>

                  {isLoading ? (
                    <WithdrawalContainerStandard>
                      <LargeDivider>
                        <Skeleton
                          variant="rounded"
                          height={54}
                          sx={{ backgroundColor: "rgba(27, 31, 45, 0.3" }}
                        />
                        <Skeleton
                          variant="rounded"
                          height={54}
                          sx={{ backgroundColor: "rgba(27, 31, 45, 0.3" }}
                        />

                        <Skeleton
                          variant="rounded"
                          height={54}
                          sx={{ backgroundColor: "rgba(27, 31, 45, 0.3" }}
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
                    </WithdrawalContainerStandard>
                  ) : (
                    <WithdrawalContainerStandard>
                      <p className="instruction">
                        To make a withdrawal, select your balance, amount and
                        verify the address you wish for payment to be made into.
                      </p>

                      <DropDownBox className="type_select">
                        <div className="wrapper">
                          <p className="label">Type:</p>
                          <span className="content">
                            <select
                              name="options"
                              onChange={(e) =>
                                setSelectedWithdrawalOption(e.target.value)
                              }
                            >
                              {withdrawalOptions.map((option) => (
                                <option value={option} key={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
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
                      </DropDownBox>

                      {selectedWithdrawalOption === "Crypto" && (
                        <CryptoWithdrawal
                          select={{
                            selectedWithdrawalOption,
                            setSelectedWithdrawalOption,
                          }}
                          user={userData}
                          accounts={accounts}
                          prices={currentPrices}
                          settings={depositSettings}
                        />
                      )}

                      {selectedWithdrawalOption === "Bank Transfer" && (
                        <BankWithdrawal
                          select={{
                            selectedWithdrawalOption,
                            setSelectedWithdrawalOption,
                          }}
                          user={userData}
                          accounts={accounts}
                          prices={currentPrices}
                          settings={depositSettings}
                        />
                      )}

                      {selectedWithdrawalOption === "PayPal" && (
                        <PayPalWithdrawal
                          select={{
                            selectedWithdrawalOption,
                            setSelectedWithdrawalOption,
                          }}
                          user={userData}
                          accounts={accounts}
                          prices={currentPrices}
                          settings={depositSettings}
                        />
                      )}

                      {selectedWithdrawalOption === "Skrill" && (
                        <SkrillWithdrawal
                          select={{
                            selectedWithdrawalOption,
                            setSelectedWithdrawalOption,
                          }}
                          user={userData}
                          accounts={accounts}
                          prices={currentPrices}
                          settings={depositSettings}
                        />
                      )}

                      {selectedWithdrawalOption === "Western Union" && (
                        <WesternUnionWithdrawal
                          select={{
                            selectedWithdrawalOption,
                            setSelectedWithdrawalOption,
                          }}
                          user={userData}
                          accounts={accounts}
                          prices={currentPrices}
                          settings={depositSettings}
                        />
                      )}

                      {selectedWithdrawalOption === "Neteller" && (
                        <NetellerWithdrawal
                          select={{
                            selectedWithdrawalOption,
                            setSelectedWithdrawalOption,
                          }}
                          user={userData}
                          accounts={accounts}
                          prices={currentPrices}
                          settings={depositSettings}
                        />
                      )}

                      {selectedWithdrawalOption === "MoneyGram" && (
                        <MoneyGramWithdrawal
                          select={{
                            selectedWithdrawalOption,
                            setSelectedWithdrawalOption,
                          }}
                          user={userData}
                          accounts={accounts}
                          prices={currentPrices}
                          settings={depositSettings}
                        />
                      )}

                      {selectedWithdrawalOption === "Perfect Money" && (
                        <PerfectMoneyWithdrawal
                          select={{
                            selectedWithdrawalOption,
                            setSelectedWithdrawalOption,
                          }}
                          user={userData}
                          accounts={accounts}
                          prices={currentPrices}
                          settings={depositSettings}
                        />
                      )}
                    </WithdrawalContainerStandard>
                  )}
                </ContentTable>

                {isLoading && (
                  <>
                    <div className="main_title">
                      <span>
                        <p>Withdrawals</p>
                      </span>
                    </div>

                    <WithdrawalHistory user={userData.id} />
                  </>
                )}

                {!isLoading && (
                  <>
                    <div className="main_title">
                      <span>
                        <p>Withdrawals</p>
                      </span>
                    </div>

                    <WithdrawalHistory user={userData.id} />
                  </>
                )}
              </div>
            </div>
          </MainPage>
        </>
      )}
    </MainContainer>
  );
};

const WithdrawalContainerStandard = styled.div`
  display: grid;
  gap: 12px;
  padding: 32px 24px;
  max-width: 650px;
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
`;

export default Withdraw;
