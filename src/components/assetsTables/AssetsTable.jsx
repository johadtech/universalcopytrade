import { styled } from "styled-components";
import { ContentTable } from "../../styled/templates/ContentTable";
import { useContext, useEffect, useRef, useState } from "react";
import CircularLoader from "../../styled/loaders/CircularLoader";
import { context } from "../../context/context";
import { PrimarySwitcher, Search } from "../../styled/input/Input";
import { formatter } from "../../utils/utils";

const AssetsTable = ({ crypto, fiat, stocks }) => {
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [allCurrenciesList, setAllCurrenciesList] = useState([]);
  const [loader, setLoader] = useState(true);

  const { currentPrices } = useContext(context);

  const assetCategories = ["All", "Fiat", "Crypto", "Stocks"];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [CryptoAccounts, setCryptoAccounts] = useState([]);
  const [fiatAccounts, setFiatAccounts] = useState([]);
  const [stockAccounts, setStockAccounts] = useState([]);

  useEffect(() => {
    if (crypto && fiat && stocks) {
      setAllCurrencies([...fiat, ...crypto, ...stocks]);
      setAllCurrenciesList([...fiat, ...crypto, ...stocks]);
      setCryptoAccounts([...crypto]);
      setFiatAccounts([...fiat]);
      setStockAccounts([...stocks]);
      setLoader(false);
    }
  }, [crypto, fiat, stocks]);

  // useEffect(() => {
  //   console.log("prices", currentPrices);
  // }, []);

  const marketOptions = ["All", "Crypto", "Stocks", "Currencies"];

  const [selectedMo, setSelectedMo] = useState("All");

  const [searchNoFiat, setSearchNoFiat] = useState([]);
  const [searchNoCrypto, setSearchNoCrypto] = useState([]);
  const [searchNoStocks, setSearchNoStocks] = useState([]);
  const [searchValue, setSearchValue] = useState(false);

  const searchRef = useRef();

  function handleCurrencySearch(e) {
    const { value } = e.target;
    let filteredAssets;

    if (value) {
      if (selectedCategory === "Stocks") {
        setSearchValue(true);
        filteredAssets = allCurrenciesList.filter(
          (assets) =>
            (assets.type === "Stock" &&
              assets.name.toLowerCase().includes(value.toLowerCase())) ||
            (assets.type === "Stock" &&
              assets.asset.toLowerCase().includes(value.toLowerCase()))
        );
        setAllCurrencies(filteredAssets);
      }

      if (selectedCategory === "Crypto") {
        setSearchValue(true);
        filteredAssets = allCurrenciesList.filter(
          (assets) =>
            (assets.type === "Crypto" &&
              assets.name.toLowerCase().includes(value.toLowerCase())) ||
            (assets.type === "Crypto" &&
              assets.asset.toLowerCase().includes(value.toLowerCase()))
        );
        setAllCurrencies(filteredAssets);
      }

      if (selectedCategory === "Fiat") {
        setSearchValue(true);
        filteredAssets = allCurrenciesList.filter(
          (assets) =>
            (assets.type === "Fiat" &&
              assets.name.toLowerCase().includes(value.toLowerCase())) ||
            assets.name.toLowerCase().includes(value.toLowerCase()) ||
            (assets.type === "Fiat" &&
              assets.asset.toLowerCase().includes(value.toLowerCase()))
        );
        setAllCurrencies(filteredAssets);
      }

      if (selectedCategory === "All") {
        setSearchValue(true);
        filteredAssets = allCurrenciesList.filter(
          (assets) =>
            assets.name.toLowerCase().includes(value.toLowerCase()) ||
            assets.asset.toLowerCase().includes(value.toLowerCase())
        );
        setAllCurrencies(filteredAssets);
      }
    } else {
      setSearchValue(false);
      setAllCurrencies(allCurrenciesList);
    }
  }

  function handleSelectCategory(ac) {
    if (searchRef) {
      searchRef.current.value = "";
    }

    setAllCurrencies(allCurrenciesList);

    setSearchValue(false);
    // setSearchNoFiat([]);
    // setSearchNoCrypto([]);
    // setSearchNoStocks([]);

    setSelectedCategory(ac);
  }

  return (
    <>
      {loader ? (
        <>
          <div className="page_top">
            <Search>
              <img src="./assets/misc/search.svg" alt="" />
              <input
                type="text"
                name=""
                id=""
                placeholder="Search"
                // ref={searchRef}
              />
            </Search>

            <PrimarySwitcher
              className="scrollbar-hide"
              style={{ userSelect: "none", pointerEvents: "none" }}
            >
              {marketOptions.map((mo) => (
                <button
                  key={mo}
                  className={selectedMo === mo && "active"}
                  onClick={() => setSelectedMo(mo)}
                >
                  {mo}
                </button>
              ))}
            </PrimarySwitcher>
          </div>

          <ContentTable className="scrollbar-hide">
            {/* top */}

            <div className="title">
              <p>Assets</p>
            </div>
            <div style={{ padding: "64px 0px" }}>
              <CircularLoader
                bg="rgba(12, 108, 243, 0.2)"
                size="40"
                color="#0C6CF2"
              />
            </div>
          </ContentTable>
        </>
      ) : (
        <>
          <div className="page_top">
            <Search>
              <img src="./assets/misc/search.svg" alt="" />
              <input
                type="text"
                name=""
                id=""
                placeholder="Search"
                onChange={handleCurrencySearch}
                ref={searchRef}
              />
            </Search>

            <PrimarySwitcher className="scrollbar-hide">
              {assetCategories.map((ac) => (
                <button
                  key={ac}
                  className={selectedCategory === ac && "active"}
                  onClick={() => handleSelectCategory(ac)}
                >
                  {ac}
                </button>
              ))}
            </PrimarySwitcher>
          </div>

          <ContentTable className="scrollbar-hide">
            <div className="title">
              <p>Assets</p>
            </div>

            {selectedCategory === "All" && (
              <>
                <TradesTableDesktop>
                  <th
                    style={{
                      borderBottom:
                        allCurrencies?.length > 0 && "1px solid #212945",
                    }}
                  >
                    <td className="head-cell symbol">
                      <div>
                        <p>Asset</p>
                      </div>
                    </td>
                    <td className="head-cell name">
                      <p>Symbol</p>
                    </td>
                    <td className="head-cell price">
                      <p>Current Value</p>
                    </td>
                    <td className="head-cell change">
                      <p>Estimated</p>
                    </td>
                  </th>

                  {(!searchValue ||
                    (searchValue && searchNoFiat.length > 0)) && (
                    <div className="section_divider">
                      <p>Fiat</p>
                    </div>
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Fiat" &&
                      currency.value > 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <span>
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                  className="asset-icon"
                                />
                                <p>{currency.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className="row-cell name">
                            <p> {currency.asset}</p>
                          </td>
                          <td className="row-cell price">
                            <p className="feature">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </td>
                          <td className="row-cell change">
                            <p className="feature">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                          </td>
                        </tr>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Fiat" &&
                      currency.value <= 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <span>
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                  className="asset-icon"
                                />
                                <p>{currency.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className="row-cell name">
                            <p> {currency.asset}</p>
                          </td>
                          <td className="row-cell price">
                            <p className="feature">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </td>
                          <td className="row-cell change">
                            <p className="feature">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                          </td>
                        </tr>
                      )
                  )}

                  {(!searchValue ||
                    (searchValue && searchNoCrypto.length > 0)) && (
                    <div className="section_divider">
                      <p>Crypto</p>
                    </div>
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Crypto" &&
                      currency.value > 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <span>
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                  className="asset-icon"
                                />
                                <p>{currency.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className="row-cell name">
                            <p> {currency.asset}</p>
                          </td>
                          <td className="row-cell price">
                            <p className="feature">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </td>
                          <td className="row-cell change">
                            <p className="feature">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                          </td>
                        </tr>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Crypto" &&
                      currency.value <= 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <span>
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                  className="asset-icon"
                                />
                                <p>{currency.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className="row-cell name">
                            <p> {currency.asset}</p>
                          </td>
                          <td className="row-cell price">
                            <p className="feature">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </td>
                          <td className="row-cell change">
                            <p className="feature">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                          </td>
                        </tr>
                      )
                  )}

                  {(!searchValue ||
                    (searchValue && searchNoStocks.length > 0)) && (
                    <div className="section_divider">
                      <p>Stocks</p>
                    </div>
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Stock" &&
                      currency.value > 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <span>
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                  className="asset-icon"
                                />
                                <p>{currency.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className="row-cell name">
                            <p> {currency.asset}</p>
                          </td>
                          <td className="row-cell price">
                            <p className="feature">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </td>
                          <td className="row-cell change">
                            <p className="feature">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                          </td>
                        </tr>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Stock" &&
                      currency.value <= 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <span>
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                  className="asset-icon"
                                />
                                <p>{currency.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className="row-cell name">
                            <p> {currency.asset}</p>
                          </td>
                          <td className="row-cell price">
                            <p className="feature">
                              {formatter.format(currentPrices[currency.asset])}
                            </p>
                          </td>
                          <td className="row-cell change">
                            <p className="feature">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </td>
                        </tr>
                      )
                  )}
                </TradesTableDesktop>

                <TradesTableMobile>
                  {(!searchValue ||
                    (searchValue && searchNoFiat.length > 0)) && (
                    <div className="section_divider">
                      <p>Fiat</p>
                    </div>
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Fiat" &&
                      currency.value > 0 && (
                        <div className="table-cell" key={currency.name}>
                          <div className="left">
                            <div>
                              <img
                                src={`./asseticons/${currency.asset}.svg`}
                                alt=""
                              />
                              <span className="asset">
                                <p className="name">{currency.name}</p>
                                <p className="symbol">{currency.asset}</p>
                              </span>
                            </div>
                          </div>

                          <span className="right">
                            <p className="price">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                            <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </span>
                        </div>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Fiat" &&
                      currency.value <= 0 && (
                        <div className="table-cell" key={currency.name}>
                          <div className="left">
                            <div>
                              <img
                                src={`./asseticons/${currency.asset}.svg`}
                                alt=""
                              />
                              <span className="asset">
                                <p className="name">{currency.name}</p>
                                <p className="symbol">{currency.asset}</p>
                              </span>
                            </div>
                          </div>

                          <span className="right">
                            <p className="price">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                            <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </span>
                        </div>
                      )
                  )}

                  {(!searchValue ||
                    (searchValue && searchNoCrypto.length > 0)) && (
                    <div className="section_divider">
                      <p>Crypto</p>
                    </div>
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Crypto" &&
                      currency.value > 0 && (
                        <div className="table-cell" key={currency.name}>
                          <div className="left">
                            <div>
                              <img
                                src={`./asseticons/${currency.asset}.svg`}
                                alt=""
                              />
                              <span className="asset">
                                <p className="name">{currency.name}</p>
                                <p className="symbol">{currency.asset}</p>
                              </span>
                            </div>
                          </div>

                          <span className="right">
                            <p className="price">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                            <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </span>
                        </div>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Crypto" &&
                      currency.value <= 0 && (
                        <div className="table-cell" key={currency.name}>
                          <div className="left">
                            <div>
                              <img
                                src={`./asseticons/${currency.asset}.svg`}
                                alt=""
                              />
                              <span className="asset">
                                <p className="name">{currency.name}</p>
                                <p className="symbol">{currency.asset}</p>
                              </span>
                            </div>
                          </div>

                          <span className="right">
                            <p className="price">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                            <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </span>
                        </div>
                      )
                  )}

                  {(!searchValue ||
                    (searchValue && searchNoStocks.length > 0)) && (
                    <div className="section_divider">
                      <p>Stocks</p>
                    </div>
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Stock" &&
                      currency.value > 0 && (
                        <div className="table-cell" key={currency.name}>
                          <div className="left">
                            <div>
                              <img
                                src={`./asseticons/${currency.asset}.svg`}
                                alt=""
                              />
                              <span className="asset">
                                <p className="name">{currency.name}</p>
                                <p className="symbol">{currency.asset}</p>
                              </span>
                            </div>
                          </div>

                          <span className="right">
                            <p className="price">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                            <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </span>
                        </div>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Stock" &&
                      currency.value <= 0 && (
                        <div className="table-cell" key={currency.name}>
                          <div className="left">
                            <div>
                              <img
                                src={`./asseticons/${currency.asset}.svg`}
                                alt=""
                              />
                              <span className="asset">
                                <p className="name">{currency.name}</p>
                                <p className="symbol">{currency.asset}</p>
                              </span>
                            </div>
                          </div>

                          <span className="right">
                            <p className="price">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                            <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </span>
                        </div>
                      )
                  )}
                </TradesTableMobile>
              </>
            )}

            {selectedCategory === "Crypto" && (
              <>
                <TradesTableDesktop>
                  <th
                    style={{
                      borderBottom:
                        allCurrencies?.length > 0 && "1px solid #212945",
                    }}
                  >
                    <td className="head-cell symbol">
                      <div>
                        <p>Asset</p>
                      </div>
                    </td>
                    <td className="head-cell name">
                      <p>Symbol</p>
                    </td>
                    <td className="head-cell price">
                      <p>Current Price</p>
                    </td>
                    <td className="head-cell change">
                      <p>Current Value</p>
                    </td>
                  </th>

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Crypto" &&
                      currency.value > 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <span>
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                  className="asset-icon"
                                />
                                <p>{currency.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className="row-cell name">
                            <p> {currency.asset}</p>
                          </td>
                          <td className="row-cell price">
                            <p className="feature">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </td>
                          <td className="row-cell change">
                            <p className="feature">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                          </td>
                        </tr>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Crypto" &&
                      currency.value <= 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <span>
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                  className="asset-icon"
                                />
                                <p>{currency.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className="row-cell name">
                            <p> {currency.asset}</p>
                          </td>
                          <td className="row-cell price">
                            <p className="feature">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </td>
                          <td className="row-cell change">
                            <p className="feature">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                          </td>
                        </tr>
                      )
                  )}
                </TradesTableDesktop>

                <TradesTableMobile>
                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Crypto" &&
                      currency.value > 0 && (
                        <div className="table-cell" key={currency.name}>
                          <div className="left">
                            <div>
                              <img
                                src={`./asseticons/${currency.asset}.svg`}
                                alt=""
                              />
                              <span className="asset">
                                <p className="name">{currency.name}</p>
                                <p className="symbol">{currency.asset}</p>
                              </span>
                            </div>
                          </div>

                          <span className="right">
                            <p className="price">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                            <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </span>
                        </div>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Crypto" &&
                      currency.value <= 0 && (
                        <div className="table-cell" key={currency.name}>
                          <div className="left">
                            <div>
                              <img
                                src={`./asseticons/${currency.asset}.svg`}
                                alt=""
                              />
                              <span className="asset">
                                <p className="name">{currency.name}</p>
                                <p className="symbol">{currency.asset}</p>
                              </span>
                            </div>
                          </div>

                          <span className="right">
                            <p className="price">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                            <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </span>
                        </div>
                      )
                  )}
                </TradesTableMobile>
              </>
            )}

            {selectedCategory === "Stocks" && (
              <>
                <TradesTableDesktop>
                  <th
                    style={{
                      borderBottom:
                        allCurrencies?.length > 0 && "1px solid #212945",
                    }}
                  >
                    <td className="head-cell symbol">
                      <div>
                        <p>Asset</p>
                      </div>
                    </td>
                    <td className="head-cell name">
                      <p>Symbol</p>
                    </td>
                    <td className="head-cell price">
                      <p>Current Price</p>
                    </td>
                    <td className="head-cell change">
                      <p>Current Value</p>
                    </td>
                  </th>

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Stock" &&
                      currency.value > 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <span>
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                  className="asset-icon"
                                />
                                <p>{currency.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className="row-cell name">
                            <p> {currency.asset}</p>
                          </td>
                          <td className="row-cell price">
                            <p className="feature">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </td>
                          <td className="row-cell change">
                            <p className="feature">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                          </td>
                        </tr>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Stock" &&
                      currency.value <= 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <span>
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                  className="asset-icon"
                                />
                                <p>{currency.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className="row-cell name">
                            <p> {currency.asset}</p>
                          </td>
                          <td className="row-cell price">
                            <p className="feature">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </td>
                          <td className="row-cell change">
                            <p className="feature">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                          </td>
                        </tr>
                      )
                  )}
                </TradesTableDesktop>

                <TradesTableMobile>
                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Stock" &&
                      currency.value > 0 && (
                        <div className="table-cell" key={currency.name}>
                          <div className="left">
                            <div>
                              <img
                                src={`./asseticons/${currency.asset}.svg`}
                                alt=""
                              />
                              <span className="asset">
                                <p className="name">{currency.name}</p>
                                <p className="symbol">{currency.asset}</p>
                              </span>
                            </div>
                          </div>

                          <span className="right">
                            <p className="price">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                            <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </span>
                        </div>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Stock" &&
                      currency.value <= 0 && (
                        <div className="table-cell" key={currency.name}>
                          <div className="left">
                            <div>
                              <img
                                src={`./asseticons/${currency.asset}.svg`}
                                alt=""
                              />
                              <span className="asset">
                                <p className="name">{currency.name}</p>
                                <p className="symbol">{currency.asset}</p>
                              </span>
                            </div>
                          </div>

                          <span className="right">
                            <p className="price">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                            <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </span>
                        </div>
                      )
                  )}
                </TradesTableMobile>
              </>
            )}

            {selectedCategory === "Fiat" && (
              <>
                <TradesTableDesktop>
                  <th
                    style={{
                      borderBottom:
                        allCurrencies?.length > 0 && "1px solid #212945",
                    }}
                  >
                    <td className="head-cell symbol">
                      <div>
                        <p>Asset</p>
                      </div>
                    </td>
                    <td className="head-cell name">
                      <p>Symbol</p>
                    </td>
                    <td className="head-cell price">
                      <p>Current Price</p>
                    </td>
                    <td className="head-cell change">
                      <p>Current Value</p>
                    </td>
                  </th>

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Fiat" &&
                      currency.value > 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <span>
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                  className="asset-icon"
                                />
                                <p>{currency.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className="row-cell name">
                            <p> {currency.asset}</p>
                          </td>
                          <td className="row-cell price">
                            <p className="feature">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </td>
                          <td className="row-cell change">
                            <p className="feature">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                          </td>
                        </tr>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Fiat" &&
                      currency.value <= 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <span>
                                <img
                                  src={`./asseticons/${currency.asset}.svg`}
                                  alt=""
                                  className="asset-icon"
                                />
                                <p>{currency.name}</p>
                              </span>
                            </div>
                          </td>
                          <td className="row-cell name">
                            <p> {currency.asset}</p>
                          </td>
                          <td className="row-cell price">
                            <p className="feature">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </td>
                          <td className="row-cell change">
                            <p className="feature">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                          </td>
                        </tr>
                      )
                  )}
                </TradesTableDesktop>

                <TradesTableMobile>
                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Fiat" &&
                      currency.value > 0 && (
                        <div className="table-cell" key={currency.name}>
                          <div className="left">
                            <div>
                              <img
                                src={`./asseticons/${currency.asset}.svg`}
                                alt=""
                              />
                              <span className="asset">
                                <p className="name">{currency.name}</p>
                                <p className="symbol">{currency.asset}</p>
                              </span>
                            </div>
                          </div>

                          <span className="right">
                            <p className="price">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                            <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </span>
                        </div>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Fiat" &&
                      currency.value <= 0 && (
                        <div className="table-cell" key={currency.name}>
                          <div className="left">
                            <div>
                              <img
                                src={`./asseticons/${currency.asset}.svg`}
                                alt=""
                              />
                              <span className="asset">
                                <p className="name">{currency.name}</p>
                                <p className="symbol">{currency.asset}</p>
                              </span>
                            </div>
                          </div>

                          <span className="right">
                            <p className="price">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                            <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p>
                          </span>
                        </div>
                      )
                  )}
                </TradesTableMobile>
              </>
            )}
          </ContentTable>
        </>
      )}
    </>
  );
};

const TradesTableDesktop = styled.table`
  width: 100%;
  display: none;

  @media screen and (min-width: 1000px) {
    display: block;
  }

  .feature {
    font-feature-settings: "tnum", "lnum", "zero", "ss01";
    /* text-align: right; */
  }

  .section_divider {
    background-color: rgba(27, 31, 45);
    padding: 16px 24px;
    color: #bac2de;
    font-size: 16px;
    font-weight: 600;
  }

  .section_divider p {
  }

  th {
    display: flex;
    justify-content: space-between;
    width: 100%;
    /* border-bottom: 1px solid #212945; */
    /* padding: 0px 24px; */
  }

  tr {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-weight: 500;
    /* padding: 0px 24px; */
  }

  .head-cell {
    padding: 0px 24px;
    height: 44px;
    white-space: nowrap;
    text-align: left;
    display: grid;
    align-content: center;
    color: #bac2de;
    font-size: 14px;
    font-weight: 600;
  }

  .row-cell {
    padding: 0px 24px;
    height: 72px;
    white-space: nowrap;
    text-align: left;
    display: grid;
    align-content: center;
    color: white;
  }

  .symbol div {
    /* display: grid; */
    /* grid-template-columns: 20px auto; */
    gap: 12px;
    align-items: center;
    white-space: nowrap;
  }

  .symbol div .checkbox {
    width: 20px;
    height: 20px;
    /* border: 1px solid #acb3cd; */
    /* border-radius: 6px; */
    box-sizing: border-box;
  }

  .symbol div span {
    display: grid;
    grid-template-columns: 20px auto;
    gap: 4px;
    align-items: center;
  }

  .asset-icon {
    width: 20px;
    height: 20px;
  }

  .symbol {
    max-width: 200px;
    width: 100%;
  }

  .name {
    max-width: 100px;
    width: 100%;
  }

  .price {
    max-width: 120px;
    width: 100%;
  }

  .change {
    max-width: 250px;
    width: 100%;
  }

  .volume {
    max-width: 150px;
    width: 100%;
  }

  .action {
    max-width: 120px;
    width: 100%;
    /* background-color: yellow; */
    display: grid;
    justify-content: start;
  }

  .action button {
    padding: 8px 16px;
    color: white;
    background-color: #0c6ef2;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
`;

const TradesTableMobile = styled.div`
  display: none;

  @media screen and (max-width: 1000px) {
    display: block;
  }

  .section_divider {
    background-color: rgba(27, 31, 45, 0.65);
    padding: 16px 24px;
    color: #bac2de;
    font-size: 16px;
    font-weight: 600;
  }

  .section_divider p {
  }

  .table-cell {
    padding: 24px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .left {
    /* display: grid; */
    /* grid-template-columns: 20px auto; */
    /* gap: 16px; */
    /* align-items: center; */
  }

  .left div {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .right {
    text-align: right;
  }

  .name {
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    color: white;
  }

  .symbol {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #bac2de;
  }

  .price {
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    color: white;
  }

  .change {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #bac2de;
    text-align: right;
  }
`;

export default AssetsTable;
