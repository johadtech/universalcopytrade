import { useContext, useEffect, useRef, useState } from "react";
import { SettingsFormStandard } from "../../../styled/forms/SettingsFormStandard";
import { styled } from "styled-components";
import {
  DropDownIconOutlined,
  FormButton,
  MultiItemBoxOutlined,
  MultiTextBoxOutlined,
  OutlinedIconBoxWithIcon,
} from "../../../styled/input/Input";
import { ClickAwayListener, Skeleton } from "@mui/material";
import Toast from "../../../hooks/Toast";
import { context } from "../../../context/context";
import { doc, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import CountUp from "react-countup";
import CircularLoader from "../../../styled/loaders/CircularLoader";
import { toFixedIfNecessary } from "../../../utils/utils";

const BalancesManage = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { userDetails, setUserDetails } = user;
  const { currentPrices } = useContext(context);

  const [id, setID] = useState(userDetails.id);

  const [showCountries, setShowCountries] = useState(false);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const [cryptoAccount, setCryptoAccount] = useState([]);
  const [fiatAccount, setFiatAccount] = useState([]);
  const [stockAccount, setStockAccount] = useState([]);
  const [currenciesAccount, setCurrenciesAccount] = useState([]);

  const [accounts, setAccounts] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [accountsList, setAccountsList] = useState([]);

  // selected asset
  const [balance, setBalance] = useState(undefined);
  const [selectedAsset, setSelectedAsset] = useState(undefined);

  useEffect(() => {
    // if (id) {
    fetchBalances();
    // }
  }, []);

  function fetchBalances() {
    onSnapshot(doc(db, "accounts", id), (doc) => {
      const data = doc.data();

      if (data) {
        setAccounts(data);
        const { live, practice } = data;
        if (live) {
          const { Crypto, Fiat, Stock } = live;
          const StockAccount = Object.values(Stock);
          const CryptoAccount = Object.values(Crypto);
          setSelectedAsset(selectedAsset);
          setAllAccounts([...CryptoAccount, ...StockAccount, Fiat]);
          setAccountsList([...CryptoAccount, ...StockAccount, Fiat]);
          setTimeout(() => {
            setIsLoading(false);
          }, 400);
        }
      }
    });
  }

  function handleAssetSelect(asset) {
    setSelectedAsset(asset);
    setShowCountries(false);
    // reset();
  }

  // totals
  const [fiatTotal, setFiatTotal] = useState("");
  const [stockTotal, setStockTotal] = useState("");
  const [cryptoTotal, setCryptoTotal] = useState("");

  useEffect(() => {
    if (accounts) {
      const { live } = accounts;
      if (live) {
        const { Stock, Crypto, Fiat } = live;
        setStockAccount(Object.values(Stock));
        setCryptoAccount(Object.values(Crypto));
        setFiatTotal(Fiat.value);
      }
    }
  }, [allAccounts, accounts]);

  useEffect(() => {
    function getTotalCrypto() {
      let CryptoTotal = 0;
      for (let i = 0; i < cryptoAccount.length; i++) {
        const price =
          currentPrices[cryptoAccount[i].asset] * cryptoAccount[i].value;
        CryptoTotal = CryptoTotal + price;
      }
      setCryptoTotal(CryptoTotal);
    }

    function getTotalStocks() {
      let StockTotal = 0;
      for (let i = 0; i < stockAccount.length; i++) {
        const price =
          currentPrices[stockAccount[i].asset] * stockAccount[i].value;
        StockTotal = StockTotal + price;
      }
      setStockTotal(StockTotal);
    }

    getTotalCrypto();
    getTotalStocks();
  }, [stockAccount, cryptoAccount, fiatTotal]);

  // total balance
  const [totalBalance, setTotalBalance] = useState(undefined);

  useEffect(() => {
    setTotalBalance(stockTotal + cryptoTotal + fiatTotal);
  }, [stockTotal, cryptoTotal, fiatTotal, totalBalance]);

  useEffect(() => {
    if (selectedAsset && allAccounts) {
      allAccounts.forEach((acc) => {
        if (acc.asset === selectedAsset.asset) {
          setBalance(acc.value);
        }
      });
    }
  }, [selectedAsset, allAccounts]);

  // copy function
  function copyValue(value, type) {
    navigator.clipboard.writeText(value);
    setToastType("success");
    setToastMessage("Copied" + type);
    setOpenToast(true);
  }

  function handleAssetSearch(e) {
    const { value } = e.target;
    // let accountsList = allAccounts;

    let filteredAccounts;

    if (value) {
      filteredAccounts = accountsList.filter(
        (accounts) =>
          accounts.asset.toLowerCase().includes(value.toLowerCase()) ||
          accounts.name.toLowerCase().includes(value.toLowerCase())
      );
      setAllAccounts(filteredAccounts);
    } else {
      setAllAccounts(accountsList);
    }
  }

  const emptySearchRef = useRef();
  const searchRef = useRef();

  // type
  const [selectedModifyType, setSelectedModifyType] = useState("add");

  const amountRef = useRef();
  const [amount, setAmount] = useState(undefined);
  function handleAmount(e) {
    const { value } = e.target;

    if (value) {
      setAmount(Number(value));
    } else {
      setAmount("");
    }
  }

  function reset() {
    // if (emptySearchRef) {
    //   emptySearchRef.current.value = "";
    // }

    if (searchRef) {
      searchRef.current.value = "";
    }

    // if (amountRef) {
    //   amountRef.current.value = "";
    // }

    setAmount(undefined);

    // setAllAccounts(accountsList);
  }

  // modify
  const [isModifying, setIsModifying] = useState(false);
  function handleModify() {
    const { type, asset } = selectedAsset;
    setIsModifying(true);

    if (selectedModifyType === "add") {
      switch (type) {
        case "Crypto":
          incrementCrypto(asset);
          break;
        case "Fiat":
          incrementFiat();
          break;
        case "Stock":
          incrementStock(asset);
          break;
        default:
          return;
        // break;
      }
    }

    if (selectedModifyType === "remove") {
      switch (type) {
        case "Crypto":
          decrementCrypto(asset);
          break;
        case "Fiat":
          decrementFiat();
          break;
        case "Stock":
          decrementStock(asset);
          break;
        default:
          return;
      }
    }

    // console.log(selectedAsset);
    // console.log(amount);
    // console.log(selectedModifyType);
  }

  // decrement fiat
  async function decrementFiat() {
    const q = doc(db, "accounts", id);
    const key = `live.Fiat.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(-amount)),
      }).then(() => {
        reset();
        setIsModifying(false);
        setToastType("success");
        setToastMessage("Modified successfully");
        setOpenToast(true);
      });
    } catch (error) {
      console.log("error", error);
      setIsModifying(false);
      setToastType("error");
      setToastMessage(`Failed to modify. Please try again later`);
      setOpenToast(true);
    }
  }

  // increment fiat
  async function incrementFiat() {
    const q = doc(db, "accounts", id);
    const key = `live.Fiat.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(amount)),
      }).then(() => {
        reset();
        setIsModifying(false);
        setToastType("success");
        setToastMessage("Modified successfully");
        setOpenToast(true);
      });
    } catch (error) {
      console.log("error", error);
      setIsModifying(false);
      setToastType("error");
      setToastMessage(`Failed to modify. Please try again later`);
      setOpenToast(true);
    }
  }

  // decrement crypto
  async function decrementCrypto(asset) {
    const q = doc(db, "accounts", id);
    const key = `live.Crypto.${asset}.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(-amount)),
      }).then(() => {
        reset();
        setIsModifying(false);
        setToastType("success");
        setToastMessage("Modified successfully");
        setOpenToast(true);
      });
    } catch (error) {
      console.log("error", error);
      setIsModifying(false);
      setToastType("error");
      setToastMessage(`Failed to modify. Please try again later`);
      setOpenToast(true);
    }
  }

  // increment crypto
  async function incrementCrypto(asset) {
    const q = doc(db, "accounts", id);
    const key = `live.Crypto.${asset}.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(amount)),
      }).then(() => {
        reset();
        setIsModifying(false);
        setToastType("success");
        setToastMessage("Modified successfully");
        setOpenToast(true);
      });
    } catch (error) {
      console.log("error", error);
      setIsModifying(false);
      setToastType("error");
      setToastMessage(`Failed to modify. Please try again later`);
      setOpenToast(true);
    }
  }

  // decrement stock
  async function decrementStock(asset) {
    const q = doc(db, "accounts", id);
    const key = `live.Stock.${asset}.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(-amount)),
      }).then(() => {
        reset();
        setIsModifying(false);
        setToastType("success");
        setToastMessage("Modified successfully");
        setOpenToast(true);
      });
    } catch (error) {
      console.log("error", error);
      setIsModifying(false);
      setToastType("error");
      setToastMessage(`Failed to modify. Please try again later`);
      setOpenToast(true);
    }
  }

  // increment stock
  async function incrementStock(asset) {
    const q = doc(db, "accounts", id);
    const key = `live.Stock.${asset}.value`;

    try {
      await updateDoc(q, {
        [key]: increment(Number(amount)),
      }).then(() => {
        reset();
        setIsModifying(false);
        setToastType("success");
        setToastMessage("Modified successfully");
        setOpenToast(true);
      });
    } catch (error) {
      console.log("error", error);
      setIsModifying(false);
      setToastType("error");
      setToastMessage(`Failed to modify. Please try again later`);
      setOpenToast(true);
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

      {isLoading ? (
        <BalancesSettingsStandard>
          <SettingsFormStandard>
            <div className="form">
              <div className="section">
                <div className="section_intro">
                  <p className="title">
                    <Skeleton
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "20%",
                      }}
                    />
                  </p>
                  <div className="subtext">
                    <Skeleton
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "40%",
                      }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="form_item">
                  <UserSummaryStandard>
                    <div className="wrapper">
                      <div className="item">
                        <Skeleton
                          variant="circular"
                          width={24}
                          height={24}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />

                        <p>
                          <Skeleton
                            variant="rounded"
                            width={120}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "100%",
                            }}
                          />
                        </p>
                      </div>
                      <div className="item">
                        <span>
                          <Skeleton
                            variant="circular"
                            width={24}
                            height={24}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "100%",
                            }}
                          />
                        </span>
                        <p>
                          <Skeleton
                            variant="rounded"
                            width={180}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "100%",
                            }}
                          />
                        </p>
                      </div>
                      <div className="item">
                        <span>
                          <Skeleton
                            variant="circular"
                            width={24}
                            height={24}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "100%",
                            }}
                          />
                        </span>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            lineHeight: "28px",
                          }}
                        >
                          <Skeleton
                            variant="rounded"
                            width={100}
                            sx={{
                              backgroundColor: "rgba(27, 31, 45)",
                              maxWidth: "100%",
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  </UserSummaryStandard>
                </div>
              </div>

              <div className="section">
                <div className="section_intro">
                  <p className="title">
                    <Skeleton
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "20%",
                      }}
                    />
                  </p>
                  <div className="subtext">
                    <Skeleton
                      variant="rounded"
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "40%",
                      }}
                    />
                  </div>
                </div>

                <div className="form_item name">
                  <BalanceCardStandard>
                    <div className="wrapper">
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "10%",
                          }}
                        />
                      </p>
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          height={30}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "30%",
                          }}
                        />
                      </p>
                    </div>
                  </BalanceCardStandard>
                </div>
              </div>
            </div>
          </SettingsFormStandard>
        </BalancesSettingsStandard>
      ) : (
        <BalancesSettingsStandard>
          <SettingsFormStandard>
            <div className="form">
              <div className="section">
                <div className="section_intro">
                  <p className="title">User</p>
                  <div className="subtext">
                    User information and profile photo
                  </div>
                </div>

                <div className="form_item">
                  <UserSummaryStandard>
                    <div className="wrapper">
                      <div className="item">
                        {userDetails.photoURL ? (
                          <img
                            src={userDetails.photoURL}
                            alt=""
                            srcSet={userDetails.photoURL}
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        )}

                        <span style={{ display: "flex", gap: "8px" }}>
                          <p
                            onClick={() =>
                              copyValue(
                                `${userDetails.firstname} ${userDetails.lastname}`,
                                " full name"
                              )
                            }
                          >
                            {userDetails.firstname} {userDetails.lastname}
                          </p>

                          {userDetails.verified && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="#0c6ef2"
                              class="w-6 h-6"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          )}
                        </span>
                      </div>
                      <div className="item">
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#BAC2DE"
                            class="w-6 h-6"
                          >
                            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                          </svg>
                        </span>
                        <p
                          onClick={() =>
                            copyValue(`${userDetails.email}`, " email address")
                          }
                        >
                          {userDetails.email}
                        </p>
                      </div>
                      <div className="item">
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#BAC2DE"
                            class="w-6 h-6"
                            style={{ width: "22px" }}
                          >
                            <path
                              fill-rule="evenodd"
                              d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </span>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            lineHeight: "28px",
                          }}
                          onClick={() =>
                            copyValue(`${userDetails.phone}`, " phone number")
                          }
                        >
                          {userDetails.phone}
                        </p>
                      </div>
                    </div>
                  </UserSummaryStandard>
                </div>
              </div>

              <div className="section">
                <div className="section_intro">
                  <p className="title">Balances</p>
                  <div className="subtext">
                    Total sum of user's trading assets
                  </div>
                </div>

                <div className="form_item">
                  <BalanceCardStandard>
                    {/* <div className="wrapper"> */}

                    <CountUp
                      end={totalBalance}
                      duration={1}
                      decimals={2}
                      delay={0}
                      separator=","
                      prefix="$"
                    >
                      {({ countUpRef }) => (
                        // <div>
                        //   <span className="bottomText bigText" ref={countUpRef} />
                        // </div>

                        <div className="wrapper">
                          <p>Total Balance</p>
                          <p ref={countUpRef}></p>
                        </div>
                      )}
                    </CountUp>

                    {/* <p>Total Balance</p>
                      <p>$10,560.00</p> */}

                    {/* </div> */}
                  </BalanceCardStandard>
                </div>
              </div>

              <div className="section">
                <div className="section_intro">
                  <div className="title">Edit Balance</div>
                  <div className="subtext">
                    Manage the user's balances and modify account
                  </div>

                  <div className="form_item">
                    {!selectedAsset ? (
                      <DropDownIconOutlined>
                        <div className="wrapper">
                          <label for="country" className="label">
                            Asset
                          </label>
                          <div
                            className="content"
                            onClick={() =>
                              setShowCountries(showCountries ? false : true)
                            }
                          >
                            <div className="main">
                              {/* <img
                                src={`./asseticons/${selectedAsset?.asset}.svg`}
                                className="asset"
                              /> */}
                              <input
                                type="text"
                                name="country"
                                id=""
                                placeholder="Select an asset"
                                value="Select an asset"
                                autoComplete="off"
                                className="country_search_ref"
                                ref={searchRef}
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

                        {showCountries && (
                          <ClickAwayListener
                            onClickAway={() => setShowCountries(false)}
                          >
                            <div
                              className="menu style-4"
                              style={{ display: "block" }}
                            >
                              <div className="search">
                                <input
                                  type="text"
                                  placeholder="Search for assets..."
                                  onChange={handleAssetSearch}
                                  ref={emptySearchRef}
                                />
                              </div>

                              <div className="scrollable style-4">
                                {allAccounts.map((acc) => (
                                  <span
                                    onClick={() => handleAssetSelect(acc)}
                                    key={acc.name}
                                  >
                                    <p>{acc.asset}</p>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </ClickAwayListener>
                        )}
                      </DropDownIconOutlined>
                    ) : (
                      <DropDownIconOutlined>
                        <div
                          className="wrapper"
                          // onClick={() => setShowCountries(!showCountries)}
                        >
                          <label for="country" className="label">
                            Asset
                          </label>
                          <div
                            className="content"
                            onClick={() =>
                              setShowCountries(showCountries ? false : true)
                            }
                          >
                            <div className="main">
                              <img
                                src={`./asseticons/${selectedAsset?.asset}.svg`}
                                className="asset"
                              />
                              <input
                                type="text"
                                name="country"
                                id=""
                                placeholder={selectedAsset?.asset}
                                value={selectedAsset?.asset}
                                ref={searchRef}
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

                        {showCountries && (
                          <ClickAwayListener
                            onClickAway={() => setShowCountries(false)}
                          >
                            <div
                              className="menu style-4"
                              style={{ display: "block" }}
                            >
                              <div className="search">
                                <input
                                  type="text"
                                  placeholder="Search for assets..."
                                  onChange={handleAssetSearch}
                                  r
                                  ref={searchRef}
                                />
                              </div>

                              <div className="scrollable style-4">
                                {allAccounts.map((acc) => (
                                  <span
                                    onClick={() => handleAssetSelect(acc)}
                                    key={acc.name}
                                  >
                                    <p>{acc.asset}</p>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </ClickAwayListener>
                        )}
                      </DropDownIconOutlined>
                    )}
                  </div>

                  <div className="form_item">
                    <p className="label">Type</p>
                    <div className="content" style={{ marginTop: "8px" }}>
                      <DropDownIconOutlined className="select">
                        <div className="wrapper">
                          <div className="content">
                            <div className="main">
                              <select
                                name="verification-options"
                                onChange={(e) =>
                                  setSelectedModifyType(e.target.value)
                                }
                              >
                                <option value="add">Add</option>
                                <option value="remove">Remove</option>
                              </select>
                            </div>

                            <span className="selectors">
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
                  </div>

                  {selectedAsset && (
                    <div className="form_item">
                      <p className="label">Value</p>
                      <div className="content">
                        <OutlinedIconBoxWithIcon>
                          <input
                            type="number"
                            placeholder="0.01"
                            ref={amountRef}
                            onChange={handleAmount}
                          />
                          <div className="box">
                            <img
                              src={`./asseticons/${selectedAsset.asset}.svg`}
                              alt=""
                            />
                            <p>{selectedAsset?.asset}</p>
                          </div>
                        </OutlinedIconBoxWithIcon>

                        <span className="caption">
                          <p>Current balance</p>
                          <p>
                            {balance} {selectedAsset?.asset}{" "}
                          </p>
                        </span>
                      </div>
                    </div>
                  )}
                  <FormButton
                    disabled={!amount || !selectedAsset || isModifying}
                    className={
                      !amount || !selectedAsset || isModifying
                        ? "form_button disabled"
                        : "form_button"
                    }
                    style={{ marginTop: "48px" }}
                    onClick={handleModify}
                  >
                    {isModifying ? (
                      <div style={{ padding: "8px" }}>
                        <CircularLoader
                          bg="#cccccc"
                          size="24"
                          color="#ffffff"
                        />
                      </div>
                    ) : (
                      <p>Modify</p>
                    )}
                  </FormButton>
                </div>
              </div>

              <div className="section">
                <div className="section_intro">
                  <p className="title">Assets</p>
                  <p className="subtext">
                    Available assets in user's trading accounts
                  </p>
                </div>

                {accountsList.map(
                  (acc) =>
                    acc.value > 0 && (
                      <div className="mini_form_item">
                        <p className="label"></p>
                        <div className="content">
                          <MultiItemBoxOutlined>
                            <div className="left">
                              <img
                                src={`./asseticons/${acc.asset}.svg`}
                                style={{ width: "18px", height: "18px" }}
                              />
                              <p>{acc.name}</p>
                            </div>

                            <div className="right">
                              <p>
                                {toFixedIfNecessary(acc.value, 6)} {acc.asset}
                              </p>
                            </div>
                          </MultiItemBoxOutlined>
                        </div>
                      </div>
                    )
                )}

                {/* <div className="mini_form_item">
                  <p className="label"></p>

                  <div className="content">
                    <MultiItemBoxOutlined>
                      <div className="left">
                        <img
                          src={`./assets/asset/eth.svg`}
                          style={{ width: "18px", height: "18px" }}
                        />
                        <p>Ethereum</p>
                      </div>

                      <div className="right">
                        <p>3.1 ETH</p>
                      </div>
                    </MultiItemBoxOutlined>
                  </div>
                </div> */}
              </div>
            </div>
          </SettingsFormStandard>
        </BalancesSettingsStandard>
      )}
    </>
  );
};

const BalanceCardStandard = styled.div`
  background-color: rgba(27, 31, 45, 0.3);
  border-radius: 12px;
  border: 1px solid #222739;

  .wrapper {
    padding: 24px;
  }

  .wrapper p:nth-child(1) {
    font-size: 14px;
    line-height: 24px;
    font-weight: 600;
    color: #bac2de;
  }

  .wrapper p:nth-child(2) {
    margin-top: 4px;
    font-size: 18px;
    font-weight: 600;
    line-height: 32px;
  }
`;

const UserSummaryStandard = styled.div`
  background-color: rgba(27, 31, 45, 0.3);
  border-radius: 12px;
  border: 1px solid #222739;

  .wrapper {
    padding: 24px 0px;
  }

  .item {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 0px 24px;
    margin-top: 16px;
    color: #bac2de;
    cursor: pointer;
  }

  .item:hover {
    color: #939bb8;
  }

  .item:hover svg {
    fill: #939bb8;
  }

  .item:nth-child(1) {
    margin-top: 0px;
  }

  .item svg {
    width: 24px;
  }

  .item img {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    object-fit: cover;
  }

  .item p {
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
  }
`;

const BalancesSettingsStandard = styled.div`
  .form_item {
    margin-top: 24px;
  }

  .mini_form_item {
    margin-top: 12px;
  }

  .asset {
    width: 20px;
    height: 20px;
  }
`;

export default BalancesManage;
