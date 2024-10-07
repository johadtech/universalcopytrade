import { useContext, useEffect, useRef, useState } from "react";
// import TradingViewWidget from "./NewChart";
// import NewChartTwo from "./NewChartTwo";
import TradeChart from "./TradeChart";
import { styled } from "styled-components";
import { context } from "../context/context";
import { ClickAwayListener, Skeleton } from "@mui/material";
import { formatter, formatterZero, toFixedIfNecessary } from "../utils/utils";
import { TradeDropDown } from "../styled/input/Input";
import { MainPage } from "../styled/templates/MainPage";
// import CircularLoader from "../styled/loaders/CircularLoader";
import DummyChart from "./DummyChart";

const TradeChartContainer = ({ symbol, asset }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAssetsDropdown, setShowAssetsDropdown] = useState(false);
  const { selectedSymbol, setSelectedSymbol } = symbol;
  const { selectedAsset, setSelectedAsset } = asset;
  const [selectedName, setSelectedName] = useState(selectedSymbol);

  const { currentPrices, accounts, userData } = useContext(context);

  const [allAccounts, setAllAccounts] = useState(undefined);
  const [accountsList, setAccountsList] = useState(undefined);

  useEffect(() => {
    if (accounts && currentPrices && userData) {
      const { live, practice } = accounts;
      if (live) {
        const { Crypto, Currencies, Stock } = live;
        // setCryptoAccount(Crypto);
        // setFiatAccount(Fiat);
        // setStockAccount(Stock);
        // setCurrenciesAccount(Currencies);
        setAllAccounts([
          ...Object.values(Crypto),
          ...Object.values(Stock),
          ...Object.values(Currencies),
        ]);
        setAccountsList([
          ...Object.values(Crypto),
          ...Object.values(Stock),
          ...Object.values(Currencies),
        ]);
        // setAllCurrenciesList([...fiat, ...crypto, ...stocks]);
        // console.log("crypto", Crypto);
        // console.log("stock", Stock);

        setIsLoading(false);
      }
    }
  }, [accounts, currentPrices, userData]);

  const searchRef = useRef();
  function handleCurrencySearch(e) {
    const { value } = e.target;

    // console.log(allAssets);

    let filteredAssets;

    if (value) {
      filteredAssets = Object.values(accountsList).filter(
        (assets) =>
          assets.name.toLowerCase().includes(value.toLowerCase()) ||
          assets.asset.toLowerCase().includes(value.toLowerCase())
      );
      setAllAccounts(filteredAssets);
    } else {
      setAllAccounts(accountsList);
    }
  }

  function handleAssetSelect(asset) {
    const { type } = asset;

    if (type === "Crypto") {
      setSelectedSymbol(asset.asset);
    } else {
      setSelectedSymbol(asset.asset);
    }

    reset();
    setSelectedAsset(asset);
    setSelectedName(asset.alt);
    setAllAccounts(accountsList);
    if (searchRef) {
      searchRef.current.value = "";
    }
    setShowAssetsDropdown(false);
  }

  function reset() {
    if (searchRef) {
      searchRef.current.value = "";
    }
  }

  return (
    <>
      {isLoading ? (
        <>
          <DummyChart symbol={{ selectedSymbol, setSelectedSymbol }} />
        </>
      ) : (
        <div
          style={{
            gridArea: "chart",
            backgroundColor: "#151823",
            height: "100%",
            borderRadius: "12px",
            width: "100%",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            padding: "12px",
            gap: "16px",
            minHeight: "462px",
            // maxHeight: "500px",
          }}
        >
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <MarketSwitcherStandard>
              {showAssetsDropdown && (
                <ClickAwayListener
                  onClickAway={() => setShowAssetsDropdown(!showAssetsDropdown)}
                >
                  <TradeDropDown className="dropdown">
                    <div className="dropdown_top">
                      <p>Select an asset</p>
                      <svg
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() =>
                          setShowAssetsDropdown(!showAssetsDropdown)
                        }
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.8647 0.366365C12.3532 -0.122122 13.1451 -0.122122 13.6336 0.366365C14.1221 0.854853 14.1221 1.64685 13.6336 2.13533L8.88929 6.87968L13.8743 11.8647C14.3628 12.3532 14.3628 13.1451 13.8743 13.6336C13.3858 14.1221 12.5938 14.1221 12.1053 13.6336L7.12032 8.64864L2.13533 13.6336C1.64685 14.1221 0.854853 14.1221 0.366366 13.6336C-0.122122 13.1451 -0.122122 12.3532 0.366366 11.8647L5.35136 6.87968L0.607014 2.13533C0.118527 1.64685 0.118527 0.854853 0.607014 0.366365C1.0955 -0.122122 1.8875 -0.122122 2.37598 0.366365L7.12032 5.11071L11.8647 0.366365Z"
                          fill="#858DAD"
                        />
                      </svg>
                    </div>

                    <div className="container">
                      <div className="search">
                        <input
                          type="text"
                          placeholder="Search for assets.."
                          ref={searchRef}
                          onChange={handleCurrencySearch}
                        />
                      </div>
                    </div>

                    <div className="scrollable style-4">
                      {Object.values(allAccounts).map(
                        (currency) =>
                          currency.value > 0 && (
                            <div
                              className="asset_box"
                              onClick={() => handleAssetSelect(currency)}
                            >
                              <span className="asset_box_left">
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                />
                                <span>
                                  <p>{currency.name} </p>
                                </span>
                              </span>

                              <span className="asset_box_right">
                                <p>
                                  {formatterZero.format(
                                    currency.value *
                                      currentPrices[currency.asset]
                                  )}
                                </p>
                                <p>
                                  {toFixedIfNecessary(currency.value, 5)}{" "}
                                  {currency.asset}
                                </p>
                              </span>
                            </div>
                          )
                      )}

                      {Object.values(allAccounts).map(
                        (currency) =>
                          currency.value <= 0 && (
                            <div
                              className="asset_box"
                              onClick={() => handleAssetSelect(currency)}
                            >
                              <span className="asset_box_left">
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                />
                                <span>
                                  <p>{currency.name} </p>
                                </span>
                              </span>

                              <span className="asset_box_right">
                                <p>
                                  {formatter.format(
                                    currency.value *
                                      currentPrices[currency.asset]
                                  )}
                                </p>
                                <p>
                                  {currency.value} {currency.asset}
                                </p>
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  </TradeDropDown>
                </ClickAwayListener>
              )}
              <span
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <img
                  src={`./asseticons/${selectedSymbol}.svg`}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
                <span style={{ display: "grid", gap: "4px" }}>
                  <p style={{ fontSize: "14px", color: "#BAC2DE" }}>Market</p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    {selectedSymbol}
                  </p>
                </span>
              </span>

              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() =>
                  setShowAssetsDropdown(!showAssetsDropdown && true)
                }
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="#5C6175"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              {/* <img
                src="./assets/icons/chevron-down.svg"
                alt=""
              
              /> */}
            </MarketSwitcherStandard>

            <div
              style={{
                display: "flex",
                gap: "16px",
                width: "100%",
                overflowY: "scroll",
              }}
              className="scrollbar-hide"
            >
              <span>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#5BDE4C",
                  }}
                >
                  {Number(currentPrices[selectedAsset?.asset]).toFixed(3)}
                </p>
                <p
                  style={{
                    color: "#BAC2DE",
                    fontWeight: "500",
                    fontSize: "14px",
                    marginTop: "4px",
                  }}
                >
                  Current Price
                </p>
              </span>
            </div>
          </div>
          <TradeChart symbol={{ selectedSymbol, setSelectedSymbol }} />
        </div>
      )}
    </>
  );
};

const MarketSwitcherStandard = styled.div`
  display: flex;
  gap: 48px;
  padding: 8px 12px;
  background-color: #1b1f2d;
  max-width: max-content;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  align-items: center;

  &:hover svg {
    cursor: pointer;
    /* margin-left: 4px; */
    /* width: 20px; */
    /* stroke-width: 3px; */
    /* height: 20px; */
  }

  &:hover svg path {
    stroke: #bac2de;
  }

  .dropdown {
    min-width: 450px;
  }

  @media screen and (max-width: 768px) {
    .dropdown {
      min-width: unset;
      width: 100%;
    }
  }
`;

export default TradeChartContainer;
