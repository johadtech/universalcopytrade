import { useContext, useEffect, useState } from "react";
import { AmountBox, DropDownBox, TradeSwitcher } from "../styled/input/Input";
import { context } from "../context/context";
import { LargeDivider } from "../styled/forms/dividers";
import { styled } from "styled-components";
import { Stocks, Crypto, Convert } from "../components/trades/mini-trade";
import Forex from "./trades/mini-trade/Forex";
import { Skeleton } from "@mui/material";

const MiniTrade = ({ symbol }) => {
  const [isLoading, setIsLoading] = useState(true);

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

        // console.log("crypto", Crypto);
        // console.log("stock", Stock);

        setIsLoading(false);
      }
    }
  }, [accounts, currentPrices]);

  function setAccounts() {
    const { live, practice } = accounts;

    if (live) {
      const { Crypto, Currencies, Fiat, Stock } = live;
      setCryptoAccount(Crypto);
      setFiatAccount(Fiat);
      setStockAccount(Stock);
      setCurrenciesAccount(Currencies);
    }
  }

  const actions = ["Buy", "Sell", "Convert"];

  //extra trade options
  // const markets = ["Market", "Limit", "Stop-Limit"];
  // const [selectedMarket, setSelectedMarket] = useState("Market");

  const [selectedAction, setSelectedAction] = useState("Buy");
  const [selectedType, setSelectedType] = useState("Crypto");

  const [changedAction, setChangedAction] = useState(false);

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

export default MiniTrade;

{
  /* {selectedAction !== "Convert" && (
            <SecondarySwitcher className="trade_buttons">
              {markets.map((market) => (
                <span
                  className={market === selectedMarket && "active"}
                  key={market}
                  onClick={() => setSelectedMarket(market)}
                >
                  <p>{market}</p>
                </span>
              ))}

              
            </SecondarySwitcher>
          )} */
}

{
  /* <TextBox className="scrollbar-hide">
            <label htmlFor="address">Name:</label>
            <br />
            <input type="text" placeholder="Crypto" />
          </TextBox> */
}

{
  /* <DropDownIcon>
            <div
              onClick={() => setShowAssetsDropdown(!showAssetsDropdown)}
              className="wrapper"
            >
              <p className="label">Asset</p>
              <span className="content">
                <span>
                  <img src="./assets/asset/bitcoin.svg" alt="" />
                  <p>BTC</p>
                </span>

                <img src="./assets/icons/chevron-down.svg" alt="" />
              </span>
            </div>

            {showAssetsDropdown && (
              <div className="menu">
                <div className="search">
                  <input type="text" defaultValue="Search for assets.." />
                </div>
                <div className="search_items style-4">
                  <span className="active">
                    <img src="./assets/asset/bitcoin.svg" alt="" />
                    <p>Bitcoin</p>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      gap: "4px",
                      padding: "12px",
                      // backgroundColor: "#222739",
                      borderRadius: "6px",
                    }}
                  >
                    <img
                      src="./assets/asset/avax.svg"
                      alt=""
                      style={{ width: "16px", height: "16px" }}
                    />
                    <p style={{ color: "#BAC2DE", fontWeight: "500" }}>
                      Avalanche
                    </p>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      gap: "4px",
                      padding: "12px",
                      // backgroundColor: "#222739",
                      borderRadius: "6px",
                    }}
                  >
                    <img
                      src="./assets/asset/bch.svg"
                      alt=""
                      style={{ width: "16px", height: "16px" }}
                    />
                    <p style={{ color: "#BAC2DE", fontWeight: "500" }}>
                      Bitcoin Cash
                    </p>
                  </span>
                </div>
              </div>
              // <div
              //   style={{
              //     position: "absolute",
              //     width: "100%",
              //     backgroundColor: "#1B1F2D",
              //     left: "0",
              //     borderRadius: "12px",
              //     zIndex: "3333",
              //     top: "80px",
              //     padding: "12px",
              //     boxShadow:
              //       "0px 4px 6px -2px rgba(16, 24, 40, 0.03),0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
              //   }}
              // >
              //   <div className="search">
              //     <input
              //       type="text"
              //       style={{
              //         padding: "12px",
              //         background: "#0C0D0D",
              //         width: "100%",
              //         color: "#BAC2DE",
              //         border: "none",
              //         fontSize: "16px",
              //         fontFamily: "Inter",
              //         fontWeight: "500",
              //         borderRadius: "6px",
              //       }}
              //       defaultValue="Search for assets.."
              //       // placeholder="Search.."
              //     />
              //   </div>

              //   <div
              //     style={{
              //       display: "flex",
              //       backgroundColor: "#222739",
              //       maxWidth: "max-content",
              //       borderRadius: "8px",
              //       padding: "4px",
              //       marginTop: "12px",
              //     }}
              //   >
              //     <button
              //       style={{
              //         fontFamily: "Inter",
              //         padding: "8px",
              //         backgroundColor: "#0C0D0D",
              //         color: "#0C6CF2",
              //         outline: "none",
              //         border: "none",
              //         borderRadius: "8px",
              //         fontSize: "16px",
              //         fontWeight: "600",
              //       }}
              //     >
              //       Crypto
              //     </button>
              //     <button
              //       style={{
              //         fontFamily: "Inter",
              //         padding: "8px",
              //         backgroundColor: "#222739",
              //         color: "#BAC2DE",
              //         outline: "none",
              //         border: "none",
              //         borderRadius: "8px",
              //         fontSize: "16px",
              //         fontWeight: "600",
              //       }}
              //     >
              //       Stocks
              //     </button>
              //     <button
              //       style={{
              //         fontFamily: "Inter",
              //         padding: "8px",
              //         backgroundColor: "#222739",
              //         color: "#BAC2DE",
              //         outline: "none",
              //         border: "none",
              //         borderRadius: "8px",
              //         fontSize: "16px",
              //         fontWeight: "600",
              //       }}
              //     >
              //       Currencies
              //     </button>
              //   </div>

              //   <div
              //     className="search_items style-4"
              //     style={{
              //       display: "grid",
              //       maxHeight: "300px",
              //       height: "100%",
              //       overflowY: "auto",
              //       marginTop: "12px",
              //     }}
              //   >
              //     <span
              //       style={{
              //         display: "flex",
              //         gap: "4px",
              //         padding: "12px",
              //         backgroundColor: "#222739",
              //         borderRadius: "6px",
              //       }}
              //     >
              //       <img
              //         src="./assets/asset/bitcoin.svg"
              //         alt=""
              //         style={{ width: "16px", height: "16px" }}
              //       />
              //       <p style={{ color: "white", fontWeight: "500" }}>Bitcoin</p>
              //     </span>
              //     <span
              //       style={{
              //         display: "flex",
              //         gap: "4px",
              //         padding: "12px",
              //         // backgroundColor: "#222739",
              //         borderRadius: "6px",
              //       }}
              //     >
              //       <img
              //         src="./assets/asset/avax.svg"
              //         alt=""
              //         style={{ width: "16px", height: "16px" }}
              //       />
              //       <p style={{ color: "#BAC2DE", fontWeight: "500" }}>
              //         Avalanche
              //       </p>
              //     </span>
              //     <span
              //       style={{
              //         display: "flex",
              //         gap: "4px",
              //         padding: "12px",
              //         // backgroundColor: "#222739",
              //         borderRadius: "6px",
              //       }}
              //     >
              //       <img
              //         src="./assets/asset/bch.svg"
              //         alt=""
              //         style={{ width: "16px", height: "16px" }}
              //       />
              //       <p style={{ color: "#BAC2DE", fontWeight: "500" }}>
              //         Bitcoin Cash
              //       </p>
              //     </span>
              //   </div>
              // </div>
            )}
          </DropDownIcon> */
}

{
  /* <PrimarySwitcher>
            <button className="active">Market</button>
            <button>Limit</button>
            <button>Stop-Limit</button>
          </PrimarySwitcher> */
}

{
  /* <div
        style={{
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          backgroundColor: "#1B1F2D",
          width: "100%",
          padding: "12px 16px",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      >
        Trade
      </div> */
}

{
  /* <div
          className="type_select"
          style={{
            display: "grid",
            gap: "4px",
            maxWidth: "400px",
            width: "100%",
            placeSelf: "center",
          }}
        > */
}
{
  /* <p style={{ fontWeight: "600", fontSize: "14px", color: "#BAC2DE" }}>
            Trade
          </p> */
}
{
  /* <div
            className="trade_buttons"
            style={{
              padding: "4px",
              backgroundColor: "#1B1F2D",
              display: "flex",
              borderRadius: "12px",
              // display: "grid",
              // gridTemplateColumns: "auto auto",
              // width: "100%",
            }}
          >
            <span
              className="buy"
              style={{
                width: "100%",
                textAlign: "center",
                height: "100%",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#00994C",
                  backgroundColor: "#080A11",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                Simple
              </p>
            </span>
            <span
              className="buy"
              style={{
                width: "100%",
                textAlign: "center",

                height: "100%",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "white",
                  padding: "12px",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                }}
              >
                Advanced
              </p>
            </span>
          </div> */
}
{
  /* </div> */
}
