import { styled } from "styled-components";
import { ContentTable } from "../../styled/templates/ContentTable";
import { useContext, useEffect, useRef, useState } from "react";
import CircularLoader from "../../styled/loaders/CircularLoader";
import { context } from "../../context/context";
import {
  PrimarySwitcher,
  Search,
  WatchlistStar,
} from "../../styled/input/Input";
import { useNavigate } from "react-router-dom";
import { formatter } from "../../utils/utils";
import Toast from "../../hooks/Toast";
import { db } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const AllMarketsTable = ({ crypto, fiat, stocks, currencies }) => {
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [allCurrenciesList, setAllCurrenciesList] = useState([]);
  const [loader, setLoader] = useState(true);

  const { currentPrices, userData } = useContext(context);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  useEffect(() => {
    if (crypto && fiat && stocks && currencies) {
      setLoader(false);
      setAllCurrencies([...crypto, ...stocks, ...currencies]);
      setAllCurrenciesList([...crypto, ...stocks, ...currencies]);
    }
  }, [crypto, fiat, stocks, currencies]);

  const searchRef = useRef();

  const marketOptions = ["All", "Crypto", "Stocks", "Currencies"];

  const [selectedMo, setSelectedMo] = useState("All");

  function handleCurrencySearch(e) {
    const { value } = e.target;
    let filteredAssets;

    if (value) {
      if (selectedMo === "Stocks") {
        filteredAssets = allCurrenciesList.filter(
          (assets) =>
            (assets.type === "Stock" &&
              assets.name?.toLowerCase().includes(value.toLowerCase())) ||
            (assets.type === "Stock" &&
              assets.asset?.toLowerCase().includes(value.toLowerCase()))
        );
        setAllCurrencies(filteredAssets);
      }

      if (selectedMo === "Crypto") {
        filteredAssets = allCurrenciesList.filter(
          (assets) =>
            (assets.type === "Crypto" &&
              assets.name?.toLowerCase().includes(value.toLowerCase())) ||
            (assets.type === "Crypto" &&
              assets.asset?.toLowerCase().includes(value.toLowerCase()))
        );
        setAllCurrencies(filteredAssets);
      }

      if (selectedMo === "Fiat") {
        filteredAssets = allCurrenciesList.filter(
          (assets) =>
            (assets.type === "Fiat" &&
              assets.name?.toLowerCase().includes(value.toLowerCase())) ||
            assets.name?.toLowerCase().includes(value.toLowerCase()) ||
            (assets.type === "Fiat" &&
              assets.asset?.toLowerCase().includes(value.toLowerCase()))
        );
        setAllCurrencies(filteredAssets);
      }

      if (selectedMo === "All") {
        filteredAssets = allCurrenciesList.filter(
          (assets) =>
            assets.name?.toLowerCase().includes(value.toLowerCase()) ||
            assets.asset?.toLowerCase().includes(value.toLowerCase())
        );
        setAllCurrencies(filteredAssets);
      }

      if (selectedMo === "Currencies") {
        filteredAssets = allCurrenciesList.filter(
          (assets) =>
            (assets.type === "Currencies" &&
              assets.name?.toLowerCase().includes(value.toLowerCase())) ||
            assets.name?.toLowerCase().includes(value.toLowerCase()) ||
            (assets.type === "Currencies" &&
              assets.asset?.toLowerCase().includes(value.toLowerCase()))
        );
        setAllCurrencies(filteredAssets);
      }
    } else {
      setAllCurrencies(allCurrenciesList);
    }
  }

  const navigate = useNavigate();

  function handleAssetSelect(asset) {
    localStorage.setItem("selectedTradeAsset", JSON.stringify(asset));
    navigate("/trade");
    // console.log(asset);
  }

  function handleStarClick(curr) {
    // console.log(asset);

    if (searchRef) {
      searchRef.current.value = " ";
    }

    const { type, asset, watching } = curr;

    switch (type) {
      case "Crypto":
        if (watching) {
          unwatchCrypto(asset);
        } else {
          watchCrypto(asset);
        }
        break;
      case "Currencies":
        if (watching) {
          unwatchCurrency(asset);
        } else {
          watchCurrency(asset);
        }
        break;
      case "Stock":
        if (watching) {
          unwatchStock(asset);
        } else {
          watchStock(asset);
        }
        break;

      default:
        break;
    }
  }

  // unwatch crypto
  async function unwatchCrypto(asset) {
    const q = doc(db, "accounts", userData.id);
    const key = `live.Crypto.${asset}.watching`;

    try {
      await updateDoc(q, {
        [key]: false,
      }).then(() => {
        setToastType("success");
        setToastMessage("Removed from watchlist");
        setOpenToast(true);
      });
    } catch (error) {
      // console.log(error);
      setToastType("error");
      setToastMessage(
        "Failed to remove from watchlist. Please try again later"
      );
      setOpenToast(true);
    }
  }

  // watch crypto
  async function watchCrypto(asset) {
    const q = doc(db, "accounts", userData.id);
    const key = `live.Crypto.${asset}.watching`;

    try {
      await updateDoc(q, {
        [key]: true,
      }).then(() => {
        setToastType("success");
        setToastMessage("Added to watchlist");
        setOpenToast(true);
      });
    } catch (error) {
      // console.log(error);
      setToastType("error");
      setToastMessage("Failed to add to watchlist. Please try again later");
      setOpenToast(true);
    }
  }

  // unwatch stock
  async function unwatchStock(asset) {
    const q = doc(db, "accounts", userData.id);
    const key = `live.Stock.${asset}.watching`;

    try {
      await updateDoc(q, {
        [key]: false,
      }).then(() => {
        setToastType("success");
        setToastMessage("Removed from watchlist");
        setOpenToast(true);
      });
    } catch (error) {
      // console.log(error);
      setToastType("error");
      setToastMessage(
        "Failed to remove from watchlist. Please try again later"
      );
      setOpenToast(true);
    }
  }

  // watch stock
  async function watchStock(asset) {
    const q = doc(db, "accounts", userData.id);
    const key = `live.Stock.${asset}.watching`;

    try {
      await updateDoc(q, {
        [key]: true,
      }).then(() => {
        setToastType("success");
        setToastMessage("Added to watchlist");
        setOpenToast(true);
      });
    } catch (error) {
      // console.log(error);
      setToastType("error");
      setToastMessage("Failed to add to watchlist. Please try again later");
      setOpenToast(true);
    }
  }

  // unwatch currency
  async function unwatchCurrency(asset) {
    const q = doc(db, "accounts", userData.id);
    const key = `live.Currencies.${asset}.watching`;

    try {
      await updateDoc(q, {
        [key]: false,
      }).then(() => {
        setToastType("success");
        setToastMessage("Removed from watchlist");
        setOpenToast(true);
      });
    } catch (error) {
      // console.log(error);
      setToastType("error");
      setToastMessage(
        "Failed to remove from watchlist. Please try again later"
      );
      setOpenToast(true);
    }
  }

  // watch currency
  async function watchCurrency(asset) {
    const q = doc(db, "accounts", userData.id);
    const key = `live.Currencies.${asset}.watching`;

    try {
      await updateDoc(q, {
        [key]: true,
      }).then(() => {
        setToastType("success");
        setToastMessage("Added to watchlist");
        setOpenToast(true);
      });
    } catch (error) {
      // console.log(error);
      setToastType("error");
      setToastMessage("Failed to add to watchlist. Please try again later");
      setOpenToast(true);
    }
  }

  function handleRowClick(curr, e) {
    const { localName } = e.target;

    if (localName === "svg" || localName === "path") {
      handleStarClick(curr);
    } else {
      localStorage.setItem("selectedTradeAsset", JSON.stringify(curr));
      navigate("/trade");
    }
  }

  return (
    <>
      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      {loader ? (
        <>
          <div className="page_top">
            <Search>
              <img src="./assets/misc/search.svg" alt="" />
              <input type="text" name="" id="" defaultValue="Search" disabled />
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
              <p>Markets</p>
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
              <button
                className={selectedMo === "Star" && "star active"}
                onClick={() => setSelectedMo("Star")}
              >
                <WatchlistStar className="variant">
                  <svg
                    width="16px"
                    height="16px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                    ></path>
                  </svg>
                </WatchlistStar>
              </button>
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
            <div className="title">
              {selectedMo === "Star" && <p>Watchlist</p>}
              {selectedMo !== "Star" && <p>{selectedMo} Markets</p>}
            </div>

            {selectedMo === "Star" && (
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
                        <WatchlistStar className="filled">
                          <svg
                            width="16px"
                            height="16px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                            ></path>
                          </svg>
                        </WatchlistStar>
                        <p>Name</p>
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

                    <td className="head-cell action"></td>
                  </th>

                  {allCurrencies.map(
                    (currency) =>
                      currency.watching &&
                      currency.value > 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <WatchlistStar
                                className="pressed"
                                onClick={() => handleStarClick(currency)}
                              >
                                <svg
                                  width="16px"
                                  height="16px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                  ></path>
                                </svg>
                              </WatchlistStar>
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
                          {
                            <td className="row-cell price">
                              <p className="feature">
                                {currency.value.toFixed(2)} {currency.asset}
                              </p>
                            </td>
                          }
                          <td className="row-cell change">
                            <p className="feature">
                              {formatter.format(
                                currentPrices[currency.asset] * currency.value
                              )}
                            </p>
                          </td>

                          <td className="row-cell action">
                            <button onClick={() => handleAssetSelect(currency)}>
                              <p>Trade</p>
                            </button>
                          </td>
                        </tr>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.watching &&
                      currency.value <= 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <WatchlistStar className="pressed">
                                <svg
                                  width="16px"
                                  height="16px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                  ></path>
                                </svg>
                              </WatchlistStar>
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

                          <td className="row-cell action">
                            <button>
                              <p>Trade</p>
                            </button>
                          </td>
                        </tr>
                      )
                  )}
                </TradesTableDesktop>
                <TradesTableMobile>
                  {allCurrencies.map(
                    (currency) =>
                      currency.watching &&
                      currency.value > 0 && (
                        <div
                          className="table-cell"
                          key={currency.name}
                          onClick={(e) => handleRowClick(currency, e)}
                        >
                          <div className="left">
                            <WatchlistStar className="pressed">
                              <svg
                                width="16px"
                                height="16px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                ></path>
                              </svg>
                            </WatchlistStar>
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
                      currency.watching &&
                      currency.value <= 0 && (
                        <div
                          className="table-cell"
                          key={currency.name}
                          onClick={(e) => handleRowClick(currency, e)}
                        >
                          <div className="left">
                            <WatchlistStar className="pressed">
                              <svg
                                width="16px"
                                height="16px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                ></path>
                              </svg>
                            </WatchlistStar>
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

            {selectedMo === "Crypto" && (
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
                        <WatchlistStar className="filled">
                          <svg
                            width="16px"
                            height="16px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                            ></path>
                          </svg>
                        </WatchlistStar>
                        <p>Name</p>
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

                    <td className="head-cell action"></td>
                  </th>

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Crypto" &&
                      currency.value > 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <WatchlistStar
                                className={currency.watching && "pressed"}
                                onClick={() => handleStarClick(currency)}
                              >
                                <svg
                                  width="16px"
                                  height="16px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                  ></path>
                                </svg>
                              </WatchlistStar>
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

                          <td className="row-cell action">
                            <button onClick={() => handleAssetSelect(currency)}>
                              <p>Trade</p>
                            </button>
                          </td>
                        </tr>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Crypto" &&
                      currency.value <= 0 && (
                        <tr
                          key={currency.asset}
                          // className={currency.watching && "pressed"}
                        >
                          <td className="row-cell symbol">
                            <div>
                              <WatchlistStar
                                className={currency.watching && "pressed"}
                              >
                                <svg
                                  width="16px"
                                  height="16px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                  ></path>
                                </svg>
                              </WatchlistStar>
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

                          <td className="row-cell action">
                            <button onClick={() => handleAssetSelect(currency)}>
                              <p>Trade</p>
                            </button>
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
                        <div
                          className="table-cell"
                          key={currency.name}
                          onClick={(e) => handleRowClick(currency, e)}
                        >
                          <div className="left">
                            <WatchlistStar
                              className={currency.watching && "pressed"}
                            >
                              <svg
                                width="16px"
                                height="16px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                ></path>
                              </svg>
                            </WatchlistStar>
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
                        <div
                          className="table-cell"
                          key={currency.name}
                          onClick={(e) => handleRowClick(currency, e)}
                        >
                          <div className="left">
                            <WatchlistStar
                              className={currency.watching && "pressed"}
                            >
                              <svg
                                width="16px"
                                height="16px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                ></path>
                              </svg>
                            </WatchlistStar>
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

            {selectedMo === "Stocks" && (
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
                        <WatchlistStar className="filled">
                          <svg
                            width="16px"
                            height="16px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                            ></path>
                          </svg>
                        </WatchlistStar>
                        <p>Name</p>
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

                    <td className="head-cell action"></td>
                  </th>

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Stock" &&
                      currency.value > 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <WatchlistStar
                                className={currency.watching && "pressed"}
                                onClick={() => handleStarClick(currency)}
                              >
                                <svg
                                  width="16px"
                                  height="16px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                  ></path>
                                </svg>
                              </WatchlistStar>
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

                          <td className="row-cell action">
                            <button onClick={() => handleAssetSelect(currency)}>
                              <p>Trade</p>
                            </button>
                          </td>
                        </tr>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Stock" &&
                      currency.value <= 0 && (
                        <tr
                          key={currency.asset}
                          // className={currency.watching && "pressed"}
                        >
                          <td className="row-cell symbol">
                            <div>
                              <WatchlistStar
                                className={currency.watching && "pressed"}
                                onClick={() => handleStarClick(currency)}
                              >
                                <svg
                                  width="16px"
                                  height="16px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                  ></path>
                                </svg>
                              </WatchlistStar>
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

                          <td className="row-cell action">
                            <button onClick={() => handleAssetSelect(currency)}>
                              <p>Trade</p>
                            </button>
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
                        <div
                          className="table-cell"
                          key={currency.name}
                          onClick={(e) => handleRowClick(currency, e)}
                        >
                          <div className="left">
                            <WatchlistStar
                              className={currency.watching && "pressed"}
                            >
                              <svg
                                width="16px"
                                height="16px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                ></path>
                              </svg>
                            </WatchlistStar>
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
                        <div
                          className="table-cell"
                          key={currency.name}
                          onClick={(e) => handleRowClick(currency, e)}
                        >
                          <div className="left">
                            <WatchlistStar
                              className={currency.watching && "pressed"}
                            >
                              <svg
                                width="16px"
                                height="16px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                ></path>
                              </svg>
                            </WatchlistStar>
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

            {selectedMo === "Currencies" && (
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
                        <WatchlistStar className="filled">
                          <svg
                            width="16px"
                            height="16px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                            ></path>
                          </svg>
                        </WatchlistStar>
                        <p>Name</p>
                      </div>
                    </td>
                    <td className="head-cell name">
                      <p>Symbol</p>
                    </td>
                    {/* <td className="head-cell price">
                      <p>Current Value</p>
                    </td> */}
                    <td className="head-cell change">
                      <p>Current price</p>
                    </td>

                    <td className="head-cell action"></td>
                  </th>

                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Currencies" &&
                      currency.value <= 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <WatchlistStar
                                className={currency.watching && "pressed"}
                                onClick={() => handleStarClick(currency)}
                              >
                                <svg
                                  width="16px"
                                  height="16px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                  ></path>
                                </svg>
                              </WatchlistStar>
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
                              {currentPrices[currency.asset]}
                            </p>
                          </td>

                          <td className="row-cell action">
                            <button onClick={() => handleAssetSelect(currency)}>
                              <p>Trade</p>
                            </button>
                          </td>
                        </tr>
                      )
                  )}
                </TradesTableDesktop>
                <TradesTableMobile>
                  {allCurrencies.map(
                    (currency) =>
                      currency.type === "Currencies" &&
                      currency.value <= 0 && (
                        <div
                          className="table-cell"
                          key={currency.name}
                          onClick={(e) => handleRowClick(currency, e)}
                        >
                          <div className="left">
                            <WatchlistStar
                              className={currency.watching && "pressed"}
                            >
                              <svg
                                width="16px"
                                height="16px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                ></path>
                              </svg>
                            </WatchlistStar>
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
                              {currentPrices[currency.asset]}
                            </p>
                            {/* <p className="change">
                              {currency.value.toFixed(2)} {currency.asset}
                            </p> */}
                          </span>
                        </div>
                      )
                  )}
                </TradesTableMobile>
              </>
            )}

            {selectedMo === "All" && (
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
                        <WatchlistStar className="filled">
                          <svg
                            width="16px"
                            height="16px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                            ></path>
                          </svg>
                        </WatchlistStar>
                        <p>Name</p>
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

                    <td className="head-cell action"></td>
                  </th>

                  {allCurrencies.map(
                    (currency) =>
                      currency.type !== "Currencies" &&
                      currency.value > 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <WatchlistStar
                                className={currency.watching && "pressed"}
                                onClick={() => handleStarClick(currency)}
                              >
                                <svg
                                  width="16px"
                                  height="16px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                  ></path>
                                </svg>
                              </WatchlistStar>
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

                          <td className="row-cell action">
                            <button onClick={() => handleAssetSelect(currency)}>
                              <p>Trade</p>
                            </button>
                          </td>
                        </tr>
                      )
                  )}

                  {allCurrencies.map(
                    (currency) =>
                      currency.type !== "Currencies" &&
                      currency.value <= 0 && (
                        <tr key={currency.asset}>
                          <td className="row-cell symbol">
                            <div>
                              <WatchlistStar
                                className={currency.watching && "pressed"}
                                onClick={() => handleStarClick(currency)}
                              >
                                <svg
                                  width="16px"
                                  height="16px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                  ></path>
                                </svg>
                              </WatchlistStar>
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

                          <td className="row-cell action">
                            <button onClick={() => handleAssetSelect(currency)}>
                              <p>Trade</p>
                            </button>
                          </td>
                        </tr>
                      )
                  )}
                </TradesTableDesktop>
                <TradesTableMobile>
                  {allCurrencies.map(
                    (currency) =>
                      currency.value > 0 && (
                        <div
                          className="table-cell"
                          key={currency.name}
                          onClick={(e) => handleRowClick(currency, e)}
                        >
                          <div className="left">
                            <WatchlistStar
                              className={currency.watching && "pressed"}
                            >
                              <svg
                                width="16px"
                                height="16px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                ></path>
                              </svg>
                            </WatchlistStar>
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
                      currency.value <= 0 && (
                        <div
                          className="table-cell"
                          key={currency.name}
                          onClick={(e) => handleRowClick(currency, e)}
                        >
                          <div className="left">
                            <WatchlistStar
                              className={currency.watching && "pressed"}
                            >
                              <svg
                                width="16px"
                                height="16px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M22.4658 9.44699C22.3832 9.18105 22.1641 8.9871 21.9009 8.94669L15.4932 7.96959L12.6281 1.87633C12.3922 1.37456 11.6082 1.37456 11.3723 1.87633L8.50729 7.96959L2.09959 8.94669C1.83639 8.9871 1.61729 9.18105 1.5347 9.44699C1.4521 9.71294 1.5207 10.0046 1.71179 10.2L6.34852 14.943L5.25444 21.6409C5.20964 21.9164 5.31744 22.1948 5.53303 22.3594C5.74933 22.5239 6.03493 22.5445 6.27012 22.4152L12.0002 19.2532L17.7311 22.4152C17.8332 22.4718 17.9452 22.4997 18.0565 22.4997C18.2014 22.4997 18.3463 22.4527 18.4681 22.3594C18.6837 22.1948 18.7915 21.9164 18.7467 21.6409L17.6527 14.943L22.2894 10.2C22.4798 10.0046 22.5484 9.71294 22.4658 9.44699Z"
                                ></path>
                              </svg>
                            </WatchlistStar>
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
  }

  th {
    display: flex;
    justify-content: space-between;
    width: 100%;
    /* border-bottom: 1px solid #212945; */
  }

  tr {
    display: flex;
    justify-content: space-between;
    width: 100%;
    transition: all 0.1s ease-in-out;
    cursor: pointer;
  }

  tr:hover {
    background-color: rgba(27, 31, 45, 0.8);
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
    display: grid;
    grid-template-columns: 20px auto;
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
    max-width: 250px;
    width: 100%;
  }

  .price {
    max-width: 120px;
    width: 100%;
  }

  .change {
    max-width: 120px;
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

  .table-cell {
    padding: 24px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
  }

  .right {
    text-align: right;
  }

  .table-cell:hover {
    background-color: rgba(27, 31, 45, 0.8);
  }

  .left {
    display: grid;
    grid-template-columns: 20px auto;
    gap: 16px;
    align-items: center;
  }

  .left div {
    display: flex;
    gap: 8px;
    align-items: center;
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

export default AllMarketsTable;
