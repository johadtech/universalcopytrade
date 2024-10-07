import { useContext, useEffect, useState } from "react";
import { AmountBox, DropDownBox, TradeSwitcher } from "../styled/input/Input";
import { context } from "../context/context";
import { LargeDivider } from "../styled/forms/dividers";
import { styled } from "styled-components";
import { Stocks, Crypto, Convert, Forex } from "../components/trades/trade";
// import Forex from "./trades/mini-trade/Forex";
import { Skeleton } from "@mui/material";

const TradeCard = ({ type, symbol }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { selectedType, setSelectedType } = type;

  // const { selectedAsset, setSelectedAsset } = asset;

  const { selectedSymbol, setSelectedSymbol } = symbol;
  const { currentPrices, accounts, userData } = useContext(context);

  const [cryptoAccount, setCryptoAccount] = useState([]);
  const [fiatAccount, setFiatAccount] = useState([]);
  const [stockAccount, setStockAccount] = useState([]);
  const [currenciesAccount, setCurrenciesAccount] = useState([]);

  // const [live, setLive] = useState([]);
  // const [practice, setPractice] = useState([]);

  useEffect(() => {
    if (accounts && currentPrices && userData) {
      const { live, practice } = accounts;
      if (live) {
        const { Crypto, Currencies, Fiat, Stock } = live;
        setCryptoAccount(Crypto);
        setFiatAccount(Fiat);
        setStockAccount(Stock);
        setCurrenciesAccount(Currencies);

        setIsLoading(false);
      }
    }
  }, [accounts, currentPrices, userData]);

  const actions = ["Buy", "Sell", "Convert"];

  //extra trade options
  // const markets = ["Market", "Limit", "Stop-Limit"];
  // const [selectedMarket, setSelectedMarket] = useState("Market");

  const [selectedAction, setSelectedAction] = useState("Buy");
  // const [selectedType, setSelectedType] = useState("Crypto");

  // const [changedAction, setChangedAction] = useState(false);

  // const handleButtonSwitch = () => {
  //   setSelectedSymbol(selectedSymbol === "BTC" ? "ETH" : "BTC");
  // };

  const marketTypes = ["Crypto", "Stocks", "Forex"];

  function handleActionChange(action) {
    if (selectedAction === "Convert" && action === "Buy") {
      setSelectedType("Crypto");
    }

    if (selectedAction === "Convert" && action === "Sell") {
      setSelectedType("Crypto");
    }
    setSelectedAction(action);
  }

  return (
    <ContainerStandard>
      {isLoading ? (
        <div
          // style={{ padding: "24px", opacity: "0.9" }}
          className="trade_wrapper"
        >
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

            <Skeleton
              variant="rounded"
              height={54}
              width={200}
              sx={{ backgroundColor: "rgba(27, 31, 45, 0.3", width: "70%" }}
            />

            <TradeSwitcher
              className="trade_buttons"
              style={{
                opacity: "0",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              {actions.map((action) => (
                <span
                  key={action}
                  onClick={() => setSelectedAction(action)}
                  className={
                    action === selectedAction
                      ? `${action.toLowerCase()} active`
                      : action.toLowerCase()
                  }
                >
                  <p>{action}</p>
                </span>
              ))}
            </TradeSwitcher>

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
        </div>
      ) : (
        <div className="trade_wrapper">
          <LargeDivider>
            <TradeSwitcher className="trade_buttons">
              {actions.map((action) => (
                <span
                  key={action}
                  onClick={() => handleActionChange(action)}
                  className={
                    action === selectedAction
                      ? `${action.toLowerCase()} active`
                      : action.toLowerCase()
                  }
                >
                  <p>{action}</p>
                </span>
              ))}
            </TradeSwitcher>

            {/* amount box for fixed card width */}
            <AmountBox
              className="amount_box stuffer"
              style={{
                opacity: "0",
                marginBottom: "-105px",
                userSelect: "none",
                pointerEvents: "none",
                width: "100%",
                position: "sticky",
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

            {selectedAction !== "Convert" && (
              <DropDownBox className="type_select">
                <div className="wrapper">
                  <p className="label">Type:</p>
                  <span className="content">
                    <select
                      name=""
                      id=""
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      {selectedType && (
                        <option value={selectedType} disabled>
                          {selectedType && selectedType}
                        </option>
                      )}
                      {marketTypes.map((type) => (
                        <option value={type} key={type}>
                          {type}
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
            )}

            {selectedAction !== "Convert" && selectedType === "Crypto" && (
              <Crypto
                account={cryptoAccount}
                prices={currentPrices}
                action={selectedAction}
                user={userData}
                fiat={fiatAccount}
                symbol={{ selectedSymbol, setSelectedSymbol }}
              />
            )}

            {selectedAction !== "Convert" && selectedType === "Forex" && (
              <Forex
                account={currenciesAccount}
                prices={currentPrices}
                action={selectedAction}
                user={userData}
                fiat={fiatAccount}
                symbol={{ selectedSymbol, setSelectedSymbol }}
              />
            )}

            {selectedAction !== "Convert" && selectedType === "Stocks" && (
              <Stocks
                account={stockAccount}
                prices={currentPrices}
                action={selectedAction}
                user={userData}
                fiat={fiatAccount}
                symbol={{ selectedSymbol, setSelectedSymbol }}
              />
            )}

            {selectedAction === "Convert" && (
              <Convert
                crypto={cryptoAccount}
                stock={stockAccount}
                fiat={fiatAccount}
                prices={currentPrices}
                action={selectedAction}
                user={userData}
                symbol={{ selectedSymbol, setSelectedSymbol }}
              />
            )}
          </LargeDivider>
        </div>
      )}
    </ContainerStandard>
  );
};

const ContainerStandard = styled.div`
  grid-area: trade;
  background-color: #151823;
  border-radius: 12px;
  max-width: 100%;
  box-sizing: border-box;

  @media screen and (max-width: 1000px) {
    .stuffer {
      display: none;
    }
  }

  .trade_wrapper {
    display: grid;
    gap: 16px;
    padding: 24px;
    padding-top: 0px;
    position: relative;
  }
`;

export default TradeCard;
