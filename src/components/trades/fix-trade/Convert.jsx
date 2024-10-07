import { useEffect, useRef, useState } from "react";
import {
  AmountBox,
  FullButton,
  SelectorBoxes,
  TradeDropDown,
} from "../../../styled/input/Input";
import { ClickAwayListener } from "@mui/material";
import {
  formatter,
  formatterZero,
  toFixedIfNecessary,
} from "../../../utils/utils";
import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import Toast from "../../../hooks/Toast";
import CircularLoader from "../../../styled/loaders/CircularLoader";

const Convert = ({ crypto, stock, fiat, prices, action, user, open }) => {
  const { fixTrade, setFixTrade } = open;

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // amount
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false);
  const amountRef = useRef();

  const toAmountRef = useRef();

  const [showToolTip, setShowToolTip] = useState(false);
  const [tooltipMessage, setToolTipMessage] = useState("");

  // assets
  const [selectedToAsset, setSelectedToAsset] = useState(undefined);

  const [showFromAssetsDropdown, setShowFromAssetsDropdown] = useState(false);
  const [showToAssetsDropdown, setShowToAssetsDropdown] = useState(false);

  const [selectedAsset, setSelectedAsset] = useState(undefined);
  const [showAssetsDropdown, setShowAssetsDropdown] = useState(false);

  const [allAssets, setAllAssets] = useState([]);
  const [allAssetsList, setAllAssetsList] = useState([]);

  const [toAssetError, setToAssetError] = useState(false);
  const [showToErrorTooltip, setShowErrorTooltip] = useState(false);
  const [errorTooltipMessage, setErrorTooltipMessage] = useState(" ");

  const percentOptions = [25, 50, 75, "MAX"];
  const [selectedPercentOption, setSelectedPercentOption] = useState(undefined);

  const searchRef = useRef();
  function handleCurrencySearch(e) {
    const { value } = e.target;

    // console.log(allAssets);

    let filteredAssets;

    if (value) {
      filteredAssets = allAssetsList.filter(
        (assets) =>
          assets.name.toLowerCase().includes(value.toLowerCase()) ||
          assets.asset.toLowerCase().includes(value.toLowerCase())
      );
      setAllAssets(filteredAssets);
    } else {
      setAllAssets(allAssetsList);
    }
  }

  function reset() {
    setAmount(undefined);
    setAmountError(false);
    setToAssetError(false);

    setSelectedPercentOption("custom");

    if (amountRef) {
      amountRef.current.value = "";
    }

    if (toAmountRef) {
      toAmountRef.current.value = "";
    }
  }

  useEffect(() => {
    setSelectedAsset(crypto["BTC"]);
    setSelectedToAsset(crypto["ETH"]);
    setAllAssets([fiat, ...Object.values(crypto), ...Object.values(stock)]);
    setAllAssetsList([fiat, ...Object.values(crypto), ...Object.values(stock)]);
  }, [crypto, fiat, stock, prices, action, user]);

  useEffect(() => {
    if (action) {
      reset();
    }
  }, [action]);

  function handleAmount(e) {
    const { value } = e.target;

    if (Number(value) && Number(value) > 0) {
      setAmount(Number(value));
      setSelectedPercentOption(undefined);
      checkToValue(value);

      const balance = selectedAsset?.value;
      if (value > balance) {
        setToolTipMessage(
          `Your current balance is ${balance} ${selectedAsset.asset}. You have selected an amount greater than your current balance.`
        );
        setAmountError(true);
      } else {
        setAmountError(false);
      }
    } else {
      setAmount("");
    }
  }

  function handlePercentSelect(option) {
    if (option === "MAX") {
      if (amountRef) {
        amountRef.current.value = Number(selectedAsset?.value);
        setAmount(Number(selectedAsset?.value));
        checkToValue(Number(selectedAsset?.value));
      }
    } else {
      amountRef.current.value = (option / 100) * Number(selectedAsset?.value);
      setAmount((option / 100) * Number(selectedAsset?.value));
      checkToValue((option / 100) * Number(selectedAsset?.value));
    }

    setSelectedPercentOption(option);
  }

  function handleFromAssetSelect(asset) {
    reset();
    setSelectedAsset(asset);
    setSelectedPercentOption("custom");

    if (selectedToAsset) {
      if (selectedToAsset === asset) {
        setErrorTooltipMessage("Cannot convert to the same asset");
        setToAssetError(true);
      }
    }

    if (searchRef) {
      searchRef.current.value = "";
    }
    setAllAssets(allAssetsList);

    setShowAssetsDropdown(false);
  }

  function handleToAssetSelect(asset) {
    reset();

    setSelectedToAsset(asset);
    setSelectedPercentOption("custom");

    if (selectedAsset) {
      if (selectedAsset === asset) {
        setErrorTooltipMessage("Cannot convert to the same asset");
        setToAssetError(true);
      }
    }

    if (searchRef) {
      searchRef.current.value = "";
    }
    setAllAssets(allAssetsList);

    setShowToAssetsDropdown(false);
  }

  const [converted, setConverted] = useState(undefined);
  const [isConverting, setIsConverting] = useState(false);

  async function handleConvert() {
    if (!user.tradeEnabled) {
      setToastType("error");
      setToastMessage("Trading is disabled for your account");
      setOpenToast(true);
      return;
    }

    setIsConverting(true);
    const { id } = user;

    if (selectedAsset.type === "Crypto") {
      if (selectedToAsset.type === "Stock") {
        await decrementCrypto(selectedAsset.asset, amount, id)
          .then(async () => {
            await incrementStock(selectedToAsset.asset, converted, id)
              .then(() => {
                reset();
                setIsConverting(false);
                setToastType("success");
                setToastMessage("Converted successfully");
                setOpenToast(true);
                setTimeout(() => {
                  setFixTrade(false);
                }, 500);
              })
              .catch((error) => {
                console.log("error", error);
                setIsConverting(false);
                setToastType("error");
                setToastMessage("Failed to convert. Please try again later");
                setOpenToast(true);
              });
          })
          .catch((error) => {
            console.log("error", error);
            setIsConverting(false);
            setToastType("error");
            setToastMessage("Failed to convert. Please try again later");
            setOpenToast(true);
          });
      }

      if (selectedToAsset.type === "Fiat") {
        await decrementCrypto(selectedAsset.asset, amount, id)
          .then(async () => {
            await incrementFiat(converted, id)
              .then(() => {
                reset();
                setIsConverting(false);
                setToastType("success");
                setToastMessage("Converted successfully");
                setOpenToast(true);
                setTimeout(() => {
                  setFixTrade(false);
                }, 500);
              })
              .catch((error) => {
                console.log("error", error);
                setIsConverting(false);
                setToastType("error");
                setToastMessage("Failed to convert. Please try again later");
                setOpenToast(true);
              });
          })
          .catch((error) => {
            console.log("error", error);
            setIsConverting(false);
            setToastType("error");
            setToastMessage("Failed to convert. Please try again later");
            setOpenToast(true);
          });
      }

      if (selectedToAsset.type === "Crypto") {
        await decrementCrypto(selectedAsset.asset, amount, id)
          .then(async () => {
            await incrementCrypto(selectedToAsset.asset, converted, id)
              .then(() => {
                reset();
                setIsConverting(false);
                setToastType("success");
                setToastMessage("Converted successfully");
                setOpenToast(true);
                setTimeout(() => {
                  setFixTrade(false);
                }, 500);
              })
              .catch((error) => {
                console.log("error", error);
                setIsConverting(false);
                setToastType("error");
                setToastMessage("Failed to convert. Please try again later");
                setOpenToast(true);
              });
          })
          .catch((error) => {
            console.log("error", error);
            setIsConverting(false);
            setToastType("error");
            setToastMessage("Failed to convert. Please try again later");
            setOpenToast(true);
          });
      }
    }

    if (selectedAsset.type === "Stock") {
      if (selectedToAsset.type === "Crypto") {
        await decrementStock(selectedAsset.asset, amount, id)
          .then(async () => {
            await incrementCrypto(selectedToAsset.asset, converted, id)
              .then(() => {
                reset();
                setIsConverting(false);
                setToastType("success");
                setToastMessage("Converted successfully");
                setOpenToast(true);
                setTimeout(() => {
                  setFixTrade(false);
                }, 500);
              })
              .catch((error) => {
                console.log("error", error);
                setIsConverting(false);
                setToastType("error");
                setToastMessage("Failed to convert. Please try again later");
                setOpenToast(true);
              });
          })
          .catch((error) => {
            console.log("error", error);
            setIsConverting(false);
            setToastType("error");
            setToastMessage("Failed to convert. Please try again later");
            setOpenToast(true);
          });
      }

      if (selectedToAsset.type === "Fiat") {
        await decrementStock(selectedAsset.asset, amount, id)
          .then(async () => {
            await incrementFiat(converted, id)
              .then(() => {
                reset();
                setIsConverting(false);
                setToastType("success");
                setToastMessage("Converted successfully");
                setOpenToast(true);
                setTimeout(() => {
                  setFixTrade(false);
                }, 500);
              })
              .catch((error) => {
                console.log("error", error);
                setIsConverting(false);
                setToastType("error");
                setToastMessage("Failed to convert. Please try again later");
                setOpenToast(true);
              });
          })
          .catch((error) => {
            console.log("error", error);
            setIsConverting(false);
            setToastType("error");
            setToastMessage("Failed to convert. Please try again later");
            setOpenToast(true);
          });
      }

      if (selectedToAsset.type === "Stock") {
        await decrementStock(selectedAsset.asset, amount, id)
          .then(async () => {
            await incrementStock(selectedToAsset.asset, converted, id)
              .then(() => {
                reset();
                setIsConverting(false);
                setToastType("success");
                setToastMessage("Converted successfully");
                setOpenToast(true);
                setTimeout(() => {
                  setFixTrade(false);
                }, 500);
              })
              .catch((error) => {
                console.log("error", error);
                setIsConverting(false);
                setToastType("error");
                setToastMessage("Failed to convert. Please try again later");
                setOpenToast(true);
              });
          })
          .catch((error) => {
            console.log("error", error);
            setIsConverting(false);
            setToastType("error");
            setToastMessage("Failed to convert. Please try again later");
            setOpenToast(true);
          });
      }
    }

    if (selectedAsset.type === "Fiat") {
      if (selectedToAsset.type === "Crypto") {
        await decrementFiat(amount, id)
          .then(async () => {
            await incrementCrypto(selectedToAsset.asset, converted, id)
              .then(() => {
                reset();
                setIsConverting(false);
                setToastType("success");
                setToastMessage("Converted successfully");
                setOpenToast(true);
                setTimeout(() => {
                  setFixTrade(false);
                }, 500);
              })
              .catch((error) => {
                console.log("error", error);
                setIsConverting(false);
                setToastType("error");
                setToastMessage("Failed to convert. Please try again later");
                setOpenToast(true);
              });
          })
          .catch((error) => {
            console.log("error", error);
            setIsConverting(false);
            setToastType("error");
            setToastMessage("Failed to convert. Please try again later");
            setOpenToast(true);
          });
      }

      if (selectedToAsset.type === "Stock") {
        await decrementFiat(amount, id)
          .then(async () => {
            await incrementStock(selectedToAsset.asset, converted, id)
              .then(() => {
                reset();
                setIsConverting(false);
                setToastType("success");
                setToastMessage("Converted successfully");
                setOpenToast(true);
                setTimeout(() => {
                  setFixTrade(false);
                }, 500);
              })
              .catch((error) => {
                console.log("error", error);
                setIsConverting(false);
                setToastType("error");
                setToastMessage("Failed to convert. Please try again later");
                setOpenToast(true);
              });
          })
          .catch((error) => {
            console.log("error", error);
            setIsConverting(false);
            setToastType("error");
            setToastMessage("Failed to convert. Please try again later");
            setOpenToast(true);
          });
      }
    }
  }

  // decrement fiat
  async function decrementFiat(amount, user) {
    const q = doc(db, "accounts", user);
    const key = `live.Fiat.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(-amount)),
      }).then(() => {
        return;
      });
    } catch (error) {
      return;
    }
  }

  // increment fiat
  async function incrementFiat(amount, user) {
    const q = doc(db, "accounts", user);
    const key = `live.Fiat.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(amount)),
      }).then(() => {
        return;
      });
    } catch (error) {
      return;
    }
  }

  // decrement crypto
  async function decrementCrypto(asset, amount, user) {
    const q = doc(db, "accounts", user);
    const key = `live.Crypto.${asset}.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(-amount)),
      }).then(() => {
        return;
      });
    } catch (error) {
      console.log("error", error);
      return;
    }
  }

  // increment crypto
  async function incrementCrypto(asset, amount, user) {
    const q = doc(db, "accounts", user);
    const key = `live.Crypto.${asset}.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(amount)),
      }).then(() => {
        // placeTrade();
        return;
      });
    } catch (error) {
      // console.log("error", error);
      return;
    }
  }

  // decrement stock
  async function decrementStock(asset, amount, user) {
    const q = doc(db, "accounts", user);
    const key = `live.Stock.${asset}.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(-amount)),
      }).then(() => {
        return;
      });
    } catch (error) {
      return;
    }
  }

  // increment stock
  async function incrementStock(asset, amount, user) {
    const q = doc(db, "accounts", user);
    const key = `live.Stock.${asset}.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(amount)),
      }).then(() => {
        return;
      });
    } catch (error) {
      return;
    }
  }

  function checkToValue(val) {
    if (selectedAsset.type === "Crypto") {
      if (selectedToAsset.type === "Stock") {
        const convertValue = cryptoToStock(
          prices[selectedAsset.asset] * Number(val),
          prices[selectedToAsset.asset]
        );
        toAmountRef.current.value = Number(convertValue).toFixed(4);
      }

      if (selectedToAsset.type === "Fiat") {
        const convertValue = cryptoToFiat(
          prices[selectedAsset.asset],
          Number(val)
        );
        toAmountRef.current.value = Number(convertValue).toFixed(4);
      }

      if (selectedToAsset.type === "Crypto") {
        const convertValue = cryptoToCrypto(
          prices[selectedAsset.asset],
          prices[selectedToAsset.asset],
          Number(val)
        );
        toAmountRef.current.value = Number(convertValue).toFixed(4);
      }
    }

    if (selectedAsset.type === "Stock") {
      if (selectedToAsset.type === "Crypto") {
        const convertValue = stockToCrypto(
          prices[selectedAsset.asset] * Number(val),
          prices[selectedToAsset.asset]
        );
        toAmountRef.current.value = Number(convertValue).toFixed(4);
      }

      if (selectedToAsset.type === "Fiat") {
        const convertValue = stockToFiat(
          prices[selectedAsset.asset],
          Number(val)
        );
        toAmountRef.current.value = Number(convertValue).toFixed(4);
      }

      if (selectedToAsset.type === "Stock") {
        const convertValue = stockToStock(
          prices[selectedAsset.asset],
          prices[selectedToAsset.asset],
          Number(val)
        );
        toAmountRef.current.value = Number(convertValue).toFixed(4);
      }
    }

    if (selectedAsset.type === "Fiat") {
      if (selectedToAsset.type === "Crypto") {
        // console.log("val", Number(val));
        // console.log(prices[selectedAsset.asset]);

        const convertValue = fiatToCrypto(
          prices[selectedToAsset.asset],
          Number(val)
        );

        toAmountRef.current.value = Number(convertValue).toFixed(4);
      }

      if (selectedToAsset.type === "Stock") {
        const convertValue = fiatToStock(
          prices[selectedToAsset.asset],
          Number(val)
        );

        toAmountRef.current.value = Number(convertValue).toFixed(4);
      }
    }

    function fiatToStock(worth, price) {
      setConverted(price / worth);
      return price / worth;
    }

    function fiatToCrypto(worth, price) {
      setConverted(price / worth);
      return price / worth;
    }

    function cryptoToFiat(worth, value) {
      setConverted(worth * value);
      return worth * value;
    } // valid

    function cryptoToCrypto(fromPrice, toPrice, value) {
      setConverted((fromPrice / toPrice) * value);
      return (fromPrice / toPrice) * value;
    } // valid

    function cryptoToStock(worth, price) {
      setConverted(worth / price);
      return worth / price;
    } // valid

    function stockToFiat(worth, value) {
      setConverted(worth * value);
      return worth * value;
    } // valid

    function stockToStock(fromPrice, toPrice, value) {
      setConverted((fromPrice / toPrice) * value);
      return (fromPrice / toPrice) * value;
    } // valid

    function stockToCrypto(worth, price) {
      setConverted(worth / price);
      return worth / price;
    } // valid
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

      {/* from */}
      <AmountBox
        className={amountError ? "amount_box error" : "amount_box"}
        style={{ position: "relative" }}
      >
        <div className="label">
          <p>From:</p>
          <img
            src="./assets/misc/info.svg"
            alt=""
            className="error_inform"
            id="popcorn"
            onClick={() => setShowToolTip(!showToolTip)}
          />
          {showToolTip && (
            <ClickAwayListener onClickAway={() => setShowToolTip(false)}>
              <div className="tooltip" id="tooltip">
                {tooltipMessage}
              </div>
            </ClickAwayListener>
          )}
        </div>

        <div className="wrapper">
          <input
            type="number"
            placeholder="0.5"
            onChange={handleAmount}
            ref={amountRef}
          />

          <span
            className="asset"
            onClick={() => setShowAssetsDropdown(!showAssetsDropdown)}
          >
            <span>
              <img src={`./asseticons/${selectedAsset?.asset}.svg`} alt="" />
              <p>{selectedAsset?.asset}</p>
            </span>
            {/* <img src="./assets/icons/chevron-down.svg" alt="" /> */}
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

        <div className="captions">
          {selectedAsset && (
            <span>
              <p className="caption">Current balance</p>
              <p className="value">
                {action === "Buy"
                  ? fiat?.value + " USD"
                  : selectedAsset?.value + " " + selectedAsset?.asset}
              </p>
            </span>
          )}

          {selectedAsset && (
            <span>
              <p className="caption">Current {selectedAsset.asset} price</p>
              <p className="value" style={{ color: "#5BDE4C" }}>
                {formatter.format(prices[selectedAsset?.asset])}
              </p>
            </span>
          )}

          {amount > 0 && selectedAsset && (
            <span>
              <p className="caption">Total in USD</p>
              <p className="value" style={{ color: "#5BDE4C" }}>
                {action === "Buy"
                  ? formatter.format(amount)
                  : formatter.format(prices[selectedAsset?.asset] * amount)}
              </p>
            </span>
          )}
        </div>

        {showAssetsDropdown && (
          <ClickAwayListener
            onClickAway={() => setShowAssetsDropdown(!showAssetsDropdown)}
          >
            <TradeDropDown>
              <div className="dropdown_top">
                <p>Select an asset</p>
                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => setShowAssetsDropdown(!showAssetsDropdown)}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
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
                    onChange={handleCurrencySearch}
                    ref={searchRef}
                  />
                </div>

                {/* <div className="switcher scrollbar-hide">
                  <button>All</button>
                  <button className="active">Crypto</button>
                  <button>Stocks</button>
                  <button>Currencies</button>
                </div> */}
              </div>

              <div className="scrollable style-4">
                {Object.values(allAssets)?.map(
                  (currency) =>
                    currency.value > 0 && (
                      <div
                        className="asset_box"
                        onClick={() => handleFromAssetSelect(currency)}
                        key={currency.name}
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
                              currency.value * prices[currency.asset]
                            )}
                          </p>
                          <p>
                            {toFixedIfNecessary(currency.value, 4)}{" "}
                            {currency.asset}
                          </p>
                        </span>
                      </div>
                    )
                )}

                {Object.values(allAssets)?.map(
                  (currency) =>
                    currency.value <= 0 && (
                      <div
                        className="asset_box"
                        onClick={() => handleFromAssetSelect(currency)}
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
                              currency.value * prices[currency.asset]
                            )}
                          </p>
                          <p>
                            {toFixedIfNecessary(currency.value, 4)}{" "}
                            {currency.asset}
                          </p>
                        </span>
                      </div>
                    )
                )}
              </div>
            </TradeDropDown>
          </ClickAwayListener>
        )}
      </AmountBox>

      {/* select option */}
      <SelectorBoxes style={{ marginTop: "8px" }}>
        {percentOptions.map((option) => (
          <span
            className={selectedPercentOption === option && "active"}
            key={option}
            onClick={() => handlePercentSelect(option)}
          >
            <p>{option === "MAX" ? "MAX" : option + "%"} </p>
          </span>
        ))}
      </SelectorBoxes>

      {/* to */}
      <AmountBox
        className={
          toAssetError ? "amount_box error convert" : "amount_box convert"
        }
        style={{ position: "relative" }}
      >
        <div className="label">
          <p>To:</p>
          <img
            src="./assets/misc/info.svg"
            alt=""
            className="error_inform"
            id="popcorn"
            onClick={() => setShowErrorTooltip(!showToErrorTooltip)}
          />
          {showToErrorTooltip && (
            <ClickAwayListener onClickAway={() => setShowErrorTooltip(false)}>
              <div className="tooltip" id="tooltip">
                {errorTooltipMessage}
              </div>
            </ClickAwayListener>
          )}
        </div>

        <div className="wrapper">
          <input type="number" placeholder="0" disabled ref={toAmountRef} />

          <span
            className="asset"
            onClick={() => setShowToAssetsDropdown(!showToAssetsDropdown)}
          >
            <span>
              <img src={`./asseticons/${selectedToAsset?.asset}.svg`} alt="" />
              <p>{selectedToAsset?.asset}</p>
            </span>
            {/* <img src="./assets/icons/chevron-down.svg" alt="" /> */}
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

        <div className="captions">
          {selectedToAsset && (
            <span>
              <p className="caption">Current balance</p>
              <p className="value">
                {action === "Buy"
                  ? fiat?.value + " USD"
                  : selectedToAsset?.value + " " + selectedToAsset?.asset}
              </p>
            </span>
          )}

          {selectedToAsset && (
            <span>
              <p className="caption">Current {selectedToAsset.asset} price</p>
              <p className="value" style={{ color: "#5BDE4C" }}>
                {formatter.format(prices[selectedToAsset?.asset])}
              </p>
            </span>
          )}
        </div>

        {showToAssetsDropdown && (
          <ClickAwayListener
            onClickAway={() => setShowToAssetsDropdown(!showToAssetsDropdown)}
          >
            <TradeDropDown>
              <div className="dropdown_top">
                <p>Select an asset</p>
                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => setShowToAssetsDropdown(!showToAssetsDropdown)}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
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
                    onChange={handleCurrencySearch}
                    ref={searchRef}
                  />
                </div>
              </div>

              <div className="scrollable style-4">
                {Object.values(allAssets)?.map(
                  (currency) =>
                    currency.value > 0 && (
                      <div
                        className="asset_box"
                        onClick={() => handleToAssetSelect(currency)}
                        key={currency.asset}
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
                              currency.value * prices[currency.asset]
                            )}
                          </p>
                          <p>
                            {toFixedIfNecessary(currency.value, 4)}{" "}
                            {currency.asset}
                          </p>
                        </span>
                      </div>
                    )
                )}

                {Object.values(allAssets)?.map(
                  (currency) =>
                    currency.value <= 0 && (
                      <div
                        className="asset_box"
                        onClick={() => handleToAssetSelect(currency)}
                        key={currency.asset}
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
                              currency.value * prices[currency.asset]
                            )}
                          </p>
                          <p>
                            {toFixedIfNecessary(currency.value, 4)}{" "}
                            {currency.asset}
                          </p>
                        </span>
                      </div>
                    )
                )}
              </div>
            </TradeDropDown>
          </ClickAwayListener>
        )}
      </AmountBox>

      <FullButton
        disabled={
          !amount ||
          amountError ||
          !converted ||
          toAssetError ||
          !selectedAsset ||
          !selectedToAsset ||
          isConverting
        }
        className={
          (!amount ||
            amountError ||
            !converted ||
            toAssetError ||
            !selectedAsset ||
            !selectedToAsset ||
            isConverting) &&
          "disabled"
        }
        onClick={handleConvert}
      >
        {isConverting ? (
          <div style={{ padding: "8px" }}>
            <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
          </div>
        ) : (
          <p>Convert</p>
        )}
      </FullButton>
    </>
  );
};

export default Convert;
