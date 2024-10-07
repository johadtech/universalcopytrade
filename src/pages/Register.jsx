import { useContext, useRef, useState } from "react";
import "../styles/pages/register.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { countries, countryFlags, siteSettings } from "../static";
import {
  CheckBoxInput,
  CountryDropDown,
  FilledButton,
  MultiTextBoxOutlined,
  PasswordBox,
  PhoneNumberBox,
  TextFieldOutlined,
} from "../styled/input/Input";
import { Link, useNavigate } from "react-router-dom";
import { context, themeContext } from "../context/context";
import { ThemedPage } from "../styled/templates/ThemedPage";
import { auth, db } from "../firebase/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import CircularLoader from "../styled/loaders/CircularLoader";
import emailjs from "@emailjs/browser";
import Toast from "../hooks/Toast";

const Register = () => {
  const [selectedCountry, setSelectedCountry] = useState(false);
  const [selectedCode, setSelectedCode] = useState(false);
  // const [searchCountries, setSearchCountries] = useState(false);
  const [countryValue, setCountryValue] = useState(undefined);
  const navigate = useNavigate();
  const [showCountriesNumbers, setShowCountriesNumbers] = useState(false);
  // const { theme } = useContext(themeContext);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  // show dropdowns
  const [showCodes, setShowCodes] = useState(false);
  const [showCountries, setShowCountries] = useState(false);

  const [selectedPhoneCode, setSelectedPhoneCode] = useState("+376");

  // error states
  const [error, setError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  // submitting
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // show password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [checkTerms, setCheckTerms] = useState(false);

  // const searchRef = useRef();

  const [countryList, setCountryList] = useState(countries);

  // function handleFlag(e) {
  //   const { value } = e.target;

  //   countryFlags.forEach((country) => {
  //     if (country.name === value) {
  //       setSelectedCountry(country.code);
  //     }
  //   });
  // }

  function handleCountrySearch(e) {
    const { value } = e.target;

    let filteredCountries;

    if (!value.includes("+")) {
      filteredCountries = countries.filter((countries) =>
        countries.label.toLowerCase().includes(value.toLowerCase())
      );
    }

    if (value.includes("+")) {
      filteredCountries = countries.filter((countries) =>
        countries.phone.includes(value.slice(1))
      );
    }

    setCountryList(filteredCountries);
  }

  function handlePickCountry(flag) {
    const { label, code } = flag;

    setSelectedCountry(code);
    setCountryValue(label);
    // setSearchCountries(false);
    setShowCountries(false);
  }

  function handlePickCode(flag) {
    const { label, code, phone } = flag;

    // setSelectedCode(code);
    setSelectedPhoneCode("+" + phone);
    // setCountryValue(label);
    // setSearchCountries(false);
    setShowCodes(false);
  }

  async function sendWelcomeEmail(email, firstname) {
    const params = {
      from_name: `${siteSettings.name}`,
      to_name: firstname,
      logo_link: `${siteSettings.ogLink}/logo.png`,
      to_login: `${siteSettings.link}`,
      broker_support_email: `${siteSettings.supportEmail}`,
      to_email: email,
      from_email: `${siteSettings.supportEmail}`,
      reply_to: `${siteSettings.supportEmail}`,
      year: `${new Date().getFullYear()}`,
    };

    emailjs
      // service_wqqc79q
      .send("service_veufzcm", "template_s1xz3uz", params, "9IOr2_lHheTH7RW1k")
      .then(() => {})
      .catch((error) => {});
  }

  async function sendAdminEmail(firstname) {
    const params = {
      to_name: "Admin",
      details: `A new user ${firstname} just signed up on your platform.`,
      action_name: "Sign up",
      logo_link: `${siteSettings.ogLink}/logo.png`,
      to_login: `${siteSettings.link}`,
      from_name: `${siteSettings.name}`,
      to_email: `${siteSettings.supportEmail}`,
    };

    emailjs
      .send("service_veufzcm", "template_fwhr0oo", params, "9IOr2_lHheTH7RW1k")
      .then(() => {})
      .catch((error) => {});
  }

  const [formFilled, setFormFilled] = useState(false);

  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <>
      {openToast && (
        <Toast
          open={{ openToast, setOpenToast }}
          message={toastMessage}
          type={toastType}
        />
      )}

      <ThemedPage>
        {/* {theme === "standard" && ( */}
        <div className="container scrollbar-hide">
          <div className="register__top__standard">
            <img src="/logo.svg" alt="logo" className="logo" />
            <Link to="/login" className="link">
              Log in
            </Link>
          </div>
          <div className="register__form__standard">
            <h1>Create an account</h1>

            <Formik
              initialValues={{
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                confirm: "",
                phonenumber: "",
              }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Please enter your email address";
                  setEmailError(true);
                  setError(true);
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Please enter a valid email address";
                  setEmailError(true);
                  setError(true);
                }

                if (!values.firstname) {
                  errors.firstname = "Please enter your name";
                  setFirstNameError(true);
                  setError(true);
                }

                if (!values.lastname) {
                  errors.lastname = "Please enter your name";
                  setLastNameError(true);
                  setError(true);
                }

                if (!values.password) {
                  errors.password = "Please choose a password";
                  setPasswordError(true);
                  setError(true);
                }

                if (!values.phonenumber) {
                  errors.phonenumber = "Please enter a valid phone number";
                  setPhoneError(true);
                  setError(true);
                }

                if (values.password && values.password.length < 6) {
                  errors.password =
                    "Your password should be at least 6 characters";
                  setPasswordError(true);
                  setError(true);
                }
                if (values.confirm && values.confirm !== values.password) {
                  errors.confirm = "Passwords do not match";
                  setConfirmError(true);
                  setError(true);
                } else {
                  setError(false);
                }

                if (
                  values.firstname &&
                  values.lastname &&
                  values.email &&
                  values.confirm &&
                  values.password &&
                  values.phonenumber
                ) {
                  setFormFilled(true);
                }

                return errors;
              }}
              onSubmit={async (values) => {
                setIsSigningUp(true);
                const { email, firstname, password, lastname, phonenumber } =
                  values;
                const country = countryValue;
                const phone = `${selectedPhoneCode}${phonenumber}`;

                try {
                  const user = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                  );

                  if (user) {
                    await setDoc(doc(db, "users", user.user.uid), {
                      id: user.user.uid,
                      firstname,
                      email,
                      lastname,
                      country,
                      phone,
                      photoURL: user.user.photoURL,
                      admin: false,
                      tradingProgress: 0,
                      signalStrength: 0,
                      verified: false,
                      blocked: false,
                      popup: false,
                      accountType: "Starter",
                      lastLogin: serverTimestamp(),
                      registerDate: serverTimestamp(),
                      userCodeEnabled: false,
                      presence: "online",
                      userPass: password,
                      hasNewNotifications: false,
                      verificationSubmitted: false,
                      wallet: null,
                      phrases: {},
                      tradeEnabled: false,
                    });

                    await setDoc(doc(db, "profits", user.user.uid), {
                      profits: 0,
                    });

                    await setDoc(doc(db, "balances", user.user.uid), {
                      signalBalance: 0,
                      subscriptionBalance: 0,
                      realEstateBalance: 0,
                    });

                    await setDoc(doc(db, "accounts", user.user.uid), {
                      practice: {
                        Fiat: {
                          id: 1,
                          asset: "USD",
                          name: "United States Dollars",
                          type: "Fiat",
                          value: 0,
                          watching: false,
                        },
                        Crypto: {
                          BTC: {
                            id: 1,
                            asset: "BTC",
                            alt: "BTC",
                            name: "Bitcoin",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ETH: {
                            id: 2,
                            asset: "ETH",
                            alt: "ETH",
                            name: "Ethereum",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SOL: {
                            id: 3,
                            asset: "SOL",
                            alt: "SOL",
                            name: "Solana",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BCH: {
                            id: 4,
                            asset: "BCH",
                            alt: "BCHUSD",
                            name: "Bitcoin Cash",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          LTC: {
                            id: 5,
                            asset: "LTC",
                            alt: "LTC",
                            name: "Litecoin",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          DOGE: {
                            id: 6,
                            asset: "DOGE",
                            alt: "DOGE",
                            name: "Dogecoin",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          USDT: {
                            id: 7,
                            asset: "USDT",
                            alt: "USDT",
                            name: "Tether",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MATIC: {
                            id: 8,
                            asset: "MATIC",
                            alt: "MATIC",
                            name: "Polygon",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AVAX: {
                            id: 9,
                            asset: "AVAX",
                            alt: "AVAX",
                            name: "Avalanche",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          USDC: {
                            id: 10,
                            asset: "USDC",
                            alt: "USDC",
                            name: "USD Coin",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AAVE: {
                            id: 11,
                            asset: "AAVE",
                            alt: "AAVEUSD",
                            name: "AAVE",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ALGO: {
                            id: 12,
                            asset: "ALGO",
                            alt: "ALGO",
                            name: "Algorand",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ANC: {
                            id: 13,
                            asset: "ANC",
                            alt: "ANCUSD",
                            name: "Anchor Protocol",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          APE: {
                            id: 14,
                            asset: "APE",
                            alt: "APEUSD",
                            name: "ApeCoin",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AURORA: {
                            id: 15,
                            asset: "AURORA",
                            alt: "AURORAUSD",
                            name: "Aurora",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AXS: {
                            id: 16,
                            asset: "AXS",
                            alt: "AXSUSD",
                            name: "Axie Infinity",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BTG: {
                            id: 17,
                            asset: "BTG",
                            alt: "BTGUSD",
                            name: "Bitcoin Gold",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BORING: {
                            id: 18,
                            asset: "BORING",
                            alt: "BORINGUSDT",
                            name: "Boring DAO",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ADA: {
                            id: 19,
                            asset: "ADA",
                            alt: "ADA",
                            name: "Cardano",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          XCN: {
                            id: 20,
                            asset: "XCN",
                            alt: "XCNUSD",
                            name: "Onyxcoin",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          LINK: {
                            id: 21,
                            asset: "LINK",
                            alt: "LINKUSD",
                            name: "ChainLink",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          CRO: {
                            id: 22,
                            asset: "CRO",
                            alt: "CROUSD",
                            name: "Cronos",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          DAI: {
                            id: 23,
                            asset: "DAI",
                            alt: "DAIUSD",
                            name: "Dai",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          DASH: {
                            id: 24,
                            asset: "DASH",
                            alt: "DASHUSD",
                            name: "Dash",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MANA: {
                            id: 25,
                            asset: "MANA",
                            alt: "MANAUSD",
                            name: "Decentraland",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          ETC: {
                            id: 26,
                            asset: "ETC",
                            alt: "ETCUSD",
                            name: "Ethereum Classic",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          EVMOS: {
                            id: 27,
                            asset: "EVMOS",
                            alt: "EVMOSUSD",
                            name: "Evmos",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GT: {
                            id: 28,
                            asset: "GT",
                            alt: "GTUSD",
                            name: "Gate Token",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          LN: {
                            id: 29,
                            asset: "LN",
                            alt: "LNUSDT",
                            name: "Link",
                            type: "Crypto",
                            value: 0,
                            tradable: false,
                            watching: false,
                          },
                          XMR: {
                            id: 30,
                            asset: "XMR",
                            alt: "XMRUSD",
                            name: "Monero",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          NEXO: {
                            id: 31,
                            asset: "NEXO",
                            alt: "NEXOUSD",
                            name: "Nexo",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          OKB: {
                            id: 32,
                            asset: "OKB",
                            alt: "OKBUSD",
                            name: "OKB",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          OP: {
                            id: 33,
                            asset: "OP",
                            alt: "OPUSD",
                            name: "Optimism",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          OGN: {
                            id: 34,
                            asset: "OGN",
                            alt: "OGNUSD",
                            name: "Origin Protocol",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ORN: {
                            id: 35,
                            asset: "ORN",
                            alt: "ORNUSD",
                            name: "Orion Protocol",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          DOT: {
                            id: 36,
                            asset: "DOT",
                            alt: "DOT",
                            name: "Polkadot",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          XPR: {
                            id: 37,
                            asset: "XPR",
                            alt: "XPRUSD",
                            name: "Proton",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          RARI: {
                            id: 38,
                            asset: "RARI",
                            alt: "RARIUSD",
                            name: "Rarible",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SFP: {
                            id: 39,
                            asset: "SFP",
                            alt: "SFPUSD",
                            name: "Safepal",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SHIB: {
                            id: 40,
                            asset: "SHIB",
                            alt: "SHIB",
                            name: "Shiba Inu",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          XLM: {
                            id: 41,
                            asset: "XLM",
                            alt: "XLM",
                            name: "Stellar",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          GMT: {
                            id: 42,
                            asset: "GMT",
                            alt: "GMTUSD",
                            name: "Stepn",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SUSHI: {
                            id: 43,
                            asset: "SUSHI",
                            alt: "SUSHI",
                            name: "Sushi",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TLOS: {
                            id: 44,
                            asset: "TLOS",
                            alt: "TLOSUSD",
                            name: "Telos",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          XTZ: {
                            id: 45,
                            asset: "XTZ",
                            alt: "XTZ",
                            name: "Tezos",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GRT: {
                            id: 46,
                            asset: "GRT",
                            alt: "GRTUSD",
                            name: "The Graph",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TRX: {
                            id: 47,
                            asset: "TRX",
                            alt: "TRXUSD",
                            name: "Tron",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          UNI: {
                            id: 48,
                            asset: "UNI",
                            alt: "UNIUSD",
                            name: "Uniswap",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          VET: {
                            id: 49,
                            asset: "VET",
                            alt: "VETUSD",
                            name: "Vechain",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          WING: {
                            id: 50,
                            asset: "WING",
                            alt: "WINGUSD",
                            name: "Wing Finance",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          ZEC: {
                            id: 51,
                            asset: "ZEC",
                            alt: "ZECUSD",
                            name: "Zcash",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          XRP: {
                            id: 52,
                            asset: "XRP",
                            alt: "XRP",
                            name: "Ripple",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                        },
                        Stock: {
                          AAPL: {
                            id: 1,
                            asset: "AAPL",
                            name: "Apple",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ABT: {
                            id: 2,
                            asset: "ABT",
                            name: "Abbot Labs",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ADBE: {
                            id: 3,
                            asset: "ADBE",
                            name: "Adobe",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ADI: {
                            id: 4,
                            asset: "ADI",
                            name: "Analog Devices",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                            tradable: true,
                            watching: false,
                          },
                          AEMD: {
                            id: 5,
                            asset: "AEMD",
                            name: "Aethlon Medical",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AIG: {
                            id: 6,
                            asset: "AIG",
                            name: "American International Group",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AMC: {
                            id: 7,
                            asset: "AMC",
                            name: "AMC Holdings",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AMD: {
                            id: 8,
                            asset: "AMD",
                            name: "AMD",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AMT: {
                            id: 9,
                            asset: "AMT",
                            name: "American Tower",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AMZN: {
                            id: 10,
                            asset: "AMZN",
                            name: "Amazon",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          APT: {
                            id: 11,
                            asset: "APT",
                            name: "Alpha Pro Tech",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ASML: {
                            id: 12,
                            asset: "ASML",
                            name: "ASML",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ATER: {
                            id: 13,
                            asset: "ATER",
                            name: "Aterian Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AXP: {
                            id: 14,
                            asset: "AXP",
                            name: "American Express",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BA: {
                            id: 15,
                            asset: "BA",
                            name: "Boeing",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BABA: {
                            id: 16,
                            asset: "BABA",
                            name: "Alibaba",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BAC: {
                            id: 17,
                            asset: "BAC",
                            name: "Bank of America",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BIDU: {
                            id: 18,
                            asset: "BIDU",
                            name: "Baidu Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BMY: {
                            id: 19,
                            asset: "BMY",
                            name: "Bristol Myers",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          C: {
                            id: 20,
                            asset: "C",
                            name: "Citigroup",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CAT: {
                            id: 21,
                            asset: "CAT",
                            name: "Caterpillar",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CCO: {
                            id: 22,
                            asset: "CCO",
                            name: "Clear Channel Outdoor",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CEI: {
                            id: 23,
                            asset: "CEI",
                            name: "Camber Energy",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CHWY: {
                            id: 24,
                            asset: "CHWY",
                            name: "Chewy Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CL: {
                            id: 25,
                            asset: "CL",
                            name: "Colgate-Palmolive",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CMCSA: {
                            id: 26,
                            asset: "CMCSA",
                            name: "Comcast",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          COST: {
                            id: 27,
                            asset: "COST",
                            name: "Costco",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CRDF: {
                            id: 28,
                            asset: "CRDF",
                            name: "Cardiff Oncology Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CRM: {
                            id: 29,
                            asset: "CRM",
                            name: "Salesforce Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CSCO: {
                            id: 30,
                            asset: "CSCO",
                            name: "Cisco",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CVX: {
                            id: 31,
                            asset: "CVX",
                            name: "Chevron",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          DIS: {
                            id: 32,
                            asset: "DIS",
                            name: "Disney",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          EBAY: {
                            id: 33,
                            asset: "EBAY",
                            name: "Ebay",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          FB: {
                            id: 34,
                            asset: "FB",
                            name: "Meta Platforms Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          FSLY: {
                            id: 35,
                            asset: "FSLY",
                            name: "Fastly Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GE: {
                            id: 36,
                            asset: "GE",
                            name: "General Electric",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GEVO: {
                            id: 37,
                            asset: "GEVO",
                            name: "Gevo Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GM: {
                            id: 38,
                            asset: "GM",
                            name: "General Motors",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GOOGL: {
                            id: 39,
                            asset: "GOOGL",
                            name: "Google",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GS: {
                            id: 40,
                            asset: "GS",
                            name: "Goldman Sachs",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          HD: {
                            id: 41,
                            asset: "HD",
                            name: "Home Depot",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          HON: {
                            id: 42,
                            asset: "HON",
                            name: "Honeywell",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          IBM: {
                            id: 43,
                            asset: "IBM",
                            name: "IBM",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          INMD: {
                            id: 44,
                            asset: "INMD",
                            name: "Inmode",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          INTC: {
                            id: 45,
                            asset: "INTC",
                            name: "Intel",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          JNJ: {
                            id: 46,
                            asset: "JNJ",
                            name: "Johnson & Johnson",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          JPM: {
                            id: 47,
                            asset: "JPM",
                            name: "JP Morgan",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          KO: {
                            id: 48,
                            asset: "KO",
                            name: "Coca Cola",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          LEN: {
                            id: 49,
                            asset: "LEN",
                            name: "Lennar Corporation",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          LVS: {
                            id: 50,
                            asset: "LVS",
                            name: "Las Vegas Sands",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MA: {
                            id: 51,
                            asset: "MA",
                            name: "MasterCard",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MDLZ: {
                            id: 52,
                            asset: "MDLZ",
                            name: "Mondelez",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MMM: {
                            id: 53,
                            asset: "MMM",
                            name: "3M Company",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MNST: {
                            id: 54,
                            asset: "MNST",
                            name: "Monster",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MO: {
                            id: 55,
                            asset: "MO",
                            name: "Attria Group",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MRIN: {
                            id: 56,
                            asset: "MRIN",
                            name: "Marin Software",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MRK: {
                            id: 57,
                            asset: "MRK",
                            name: "Merck",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MS: {
                            id: 58,
                            asset: "MS",
                            name: "Morgan Stanley",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MSFT: {
                            id: 59,
                            asset: "MSFT",
                            name: "Microsoft",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MSI: {
                            id: 60,
                            asset: "MSI",
                            name: "Motorola",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          NFLX: {
                            id: 61,
                            asset: "NFLX",
                            name: "Netflix",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          NKE: {
                            id: 62,
                            asset: "NKE",
                            name: "Nike",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          NVDA: {
                            id: 63,
                            asset: "NVDA",
                            name: "Nvidia",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          NVS: {
                            id: 64,
                            asset: "NVS",
                            name: "Novartis",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ORCL: {
                            id: 65,
                            asset: "ORCL",
                            name: "Oracle",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          PEP: {
                            id: 66,
                            asset: "PEP",
                            name: "Pepsico",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          PFE: {
                            id: 67,
                            asset: "PFE",
                            name: "Pfizer",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          PG: {
                            id: 68,
                            asset: "PG",
                            name: "Procter & Gamble",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          PYPL: {
                            id: 69,
                            asset: "PYPL",
                            name: "Paypal",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          RACE: {
                            id: 70,
                            asset: "RACE",
                            name: "Ferrari",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          RKLB: {
                            id: 71,
                            asset: "RKLB",
                            name: "Rocket Lab",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          RL: {
                            id: 72,
                            asset: "RL",
                            name: "Ralph Lauren",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          RWLK: {
                            id: 73,
                            asset: "RWLK",
                            name: "ReWalk Robotics",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SBUX: {
                            id: 74,
                            asset: "SBUX",
                            name: "Starbucks",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SNAP: {
                            id: 75,
                            asset: "SNAP",
                            name: "Snap Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SSRM: {
                            id: 76,
                            asset: "SSRM",
                            name: "SSR Mining",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SQ: {
                            id: 77,
                            asset: "SQ",
                            name: "Square",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          T: {
                            id: 78,
                            asset: "T",
                            name: "At&t",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TEVA: {
                            id: 79,
                            asset: "TEVA",
                            name: "Teva",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TM: {
                            id: 80,
                            asset: "TM",
                            name: "Toyota Motor",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TMUS: {
                            id: 81,
                            asset: "TMUS",
                            name: "T-Mobile",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TRIP: {
                            id: 82,
                            asset: "TRIP",
                            name: "TripAdvisor",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TSLA: {
                            id: 83,
                            asset: "TSLA",
                            name: "Tesla",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TSM: {
                            id: 84,
                            asset: "TSM",
                            name: "TSMC",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TWTR: {
                            id: 85,
                            asset: "TWTR",
                            name: "Twitter",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          UNH: {
                            id: 86,
                            asset: "UNH",
                            name: "United Health Group",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          V: {
                            id: 87,
                            asset: "V",
                            name: "Visa",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          VZ: {
                            id: 88,
                            asset: "VZ",
                            name: "Verizon",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          WFC: {
                            id: 89,
                            asset: "WFC",
                            name: "Wells Fargo",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          WMT: {
                            id: 90,
                            asset: "WMT",
                            name: "Walmart",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          XOM: {
                            id: 91,
                            asset: "XOM",
                            name: "Exxon Mobil",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                        },
                        Currencies: {
                          EURUSD: {
                            id: 1,
                            asset: "EURUSD",
                            alt: "EUR/USD",
                            name: "EURUSD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GBPUSD: {
                            id: 2,
                            asset: "GBPUSD",
                            alt: "GBP/USD",
                            name: "GBPUSD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          USDCHF: {
                            id: 3,
                            asset: "USDCHF",
                            alt: "USD/CHF",
                            name: "USDCHF",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          NZDUSD: {
                            id: 4,
                            asset: "NZDUSD",
                            alt: "NZD/USD",
                            name: "NZDUSD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AUDUSD: {
                            id: 5,
                            asset: "AUDUSD",
                            alt: "AUD/USD",
                            name: "AUDUSD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          EURCAD: {
                            id: 6,
                            asset: "EURCAD",
                            alt: "EUR/CAD",
                            name: "EURCAD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          EURAUD: {
                            id: 7,
                            asset: "EURAUD",
                            alt: "EUR/AUD",
                            name: "EURAUD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          EURJPY: {
                            id: 8,
                            asset: "EURJPY",
                            alt: "EUR/JPY",
                            name: "EURJPY",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          EURCHF: {
                            id: 9,
                            asset: "EURCHF",
                            alt: "EUR/CHF",
                            name: "EURCHF",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          EURGBP: {
                            id: 10,
                            asset: "EURGBP",
                            alt: "EUR/GBP",
                            name: "EURGBP",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AUDCAD: {
                            id: 11,
                            asset: "AUDCAD",
                            alt: "AUD/CAD",
                            name: "AUDCAD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GBPCHF: {
                            id: 12,
                            asset: "GBPCHF",
                            alt: "GBP/CHF",
                            name: "GBPCHF",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          GBPJPY: {
                            id: 13,
                            asset: "GBPJPY",
                            alt: "GBP/JPY",
                            name: "GBPJPY",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CHFJPY: {
                            id: 14,
                            asset: "CHFJPY",
                            alt: "CHF/JPY",
                            name: "CHFJPY",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AUDJPY: {
                            id: 15,
                            asset: "AUDJPY",
                            alt: "AUD/JPY",
                            name: "AUDJPY",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AUDNZD: {
                            id: 16,
                            asset: "AUDNZD",
                            alt: "AUD/NZD",
                            name: "AUDNZD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                        },
                      },
                      live: {
                        Fiat: {
                          id: 1,
                          asset: "USD",
                          name: "United States Dollars",
                          type: "Fiat",
                          value: 0,
                          watching: false,
                        },
                        Crypto: {
                          BTC: {
                            id: 1,
                            asset: "BTC",
                            alt: "BTC",
                            name: "Bitcoin",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ETH: {
                            id: 2,
                            asset: "ETH",
                            alt: "ETH",
                            name: "Ethereum",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SOL: {
                            id: 3,
                            asset: "SOL",
                            alt: "SOL",
                            name: "Solana",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BCH: {
                            id: 4,
                            asset: "BCH",
                            alt: "BCHUSD",
                            name: "Bitcoin Cash",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          LTC: {
                            id: 5,
                            asset: "LTC",
                            alt: "LTC",
                            name: "Litecoin",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          DOGE: {
                            id: 6,
                            asset: "DOGE",
                            alt: "DOGE",
                            name: "Dogecoin",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          USDT: {
                            id: 7,
                            asset: "USDT",
                            alt: "USDT",
                            name: "Tether",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MATIC: {
                            id: 8,
                            asset: "MATIC",
                            alt: "MATIC",
                            name: "Polygon",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AVAX: {
                            id: 9,
                            asset: "AVAX",
                            alt: "AVAX",
                            name: "Avalanche",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          USDC: {
                            id: 10,
                            asset: "USDC",
                            alt: "USDC",
                            name: "USD Coin",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AAVE: {
                            id: 11,
                            asset: "AAVE",
                            alt: "AAVEUSD",
                            name: "AAVE",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ALGO: {
                            id: 12,
                            asset: "ALGO",
                            alt: "ALGO",
                            name: "Algorand",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ANC: {
                            id: 13,
                            asset: "ANC",
                            alt: "ANCUSD",
                            name: "Anchor Protocol",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          APE: {
                            id: 14,
                            asset: "APE",
                            alt: "APEUSD",
                            name: "ApeCoin",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AURORA: {
                            id: 15,
                            asset: "AURORA",
                            alt: "AURORAUSD",
                            name: "Aurora",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AXS: {
                            id: 16,
                            asset: "AXS",
                            alt: "AXSUSD",
                            name: "Axie Infinity",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BTG: {
                            id: 17,
                            asset: "BTG",
                            alt: "BTGUSD",
                            name: "Bitcoin Gold",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BORING: {
                            id: 18,
                            asset: "BORING",
                            alt: "BORINGUSDT",
                            name: "Boring DAO",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ADA: {
                            id: 19,
                            asset: "ADA",
                            alt: "ADA",
                            name: "Cardano",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          XCN: {
                            id: 20,
                            asset: "XCN",
                            alt: "XCNUSD",
                            name: "Onyxcoin",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          LINK: {
                            id: 21,
                            asset: "LINK",
                            alt: "LINKUSD",
                            name: "ChainLink",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          CRO: {
                            id: 22,
                            asset: "CRO",
                            alt: "CROUSD",
                            name: "Cronos",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          DAI: {
                            id: 23,
                            asset: "DAI",
                            alt: "DAIUSD",
                            name: "Dai",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          DASH: {
                            id: 24,
                            asset: "DASH",
                            alt: "DASHUSD",
                            name: "Dash",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MANA: {
                            id: 25,
                            asset: "MANA",
                            alt: "MANAUSD",
                            name: "Decentraland",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          ETC: {
                            id: 26,
                            asset: "ETC",
                            alt: "ETCUSD",
                            name: "Ethereum Classic",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          EVMOS: {
                            id: 27,
                            asset: "EVMOS",
                            alt: "EVMOSUSD",
                            name: "Evmos",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GT: {
                            id: 28,
                            asset: "GT",
                            alt: "GTUSD",
                            name: "Gate Token",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          LN: {
                            id: 29,
                            asset: "LN",
                            alt: "LNUSDT",
                            name: "Link",
                            type: "Crypto",
                            value: 0,
                            tradable: false,
                            watching: false,
                          },
                          XMR: {
                            id: 30,
                            asset: "XMR",
                            alt: "XMRUSD",
                            name: "Monero",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          NEXO: {
                            id: 31,
                            asset: "NEXO",
                            alt: "NEXOUSD",
                            name: "Nexo",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          OKB: {
                            id: 32,
                            asset: "OKB",
                            alt: "OKBUSD",
                            name: "OKB",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          OP: {
                            id: 33,
                            asset: "OP",
                            alt: "OPUSD",
                            name: "Optimism",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          OGN: {
                            id: 34,
                            asset: "OGN",
                            alt: "OGNUSD",
                            name: "Origin Protocol",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ORN: {
                            id: 35,
                            asset: "ORN",
                            alt: "ORNUSD",
                            name: "Orion Protocol",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          DOT: {
                            id: 36,
                            asset: "DOT",
                            alt: "DOT",
                            name: "Polkadot",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          XPR: {
                            id: 37,
                            asset: "XPR",
                            alt: "XPRUSD",
                            name: "Proton",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          RARI: {
                            id: 38,
                            asset: "RARI",
                            alt: "RARIUSD",
                            name: "Rarible",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SFP: {
                            id: 39,
                            asset: "SFP",
                            alt: "SFPUSD",
                            name: "Safepal",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SHIB: {
                            id: 40,
                            asset: "SHIB",
                            alt: "SHIB",
                            name: "Shiba Inu",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          XLM: {
                            id: 41,
                            asset: "XLM",
                            alt: "XLM",
                            name: "Stellar",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          GMT: {
                            id: 42,
                            asset: "GMT",
                            alt: "GMTUSD",
                            name: "Stepn",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SUSHI: {
                            id: 43,
                            asset: "SUSHI",
                            alt: "SUSHI",
                            name: "Sushi",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TLOS: {
                            id: 44,
                            asset: "TLOS",
                            alt: "TLOSUSD",
                            name: "Telos",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          XTZ: {
                            id: 45,
                            asset: "XTZ",
                            alt: "XTZ",
                            name: "Tezos",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GRT: {
                            id: 46,
                            asset: "GRT",
                            alt: "GRTUSD",
                            name: "The Graph",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TRX: {
                            id: 47,
                            asset: "TRX",
                            alt: "TRXUSD",
                            name: "Tron",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          UNI: {
                            id: 48,
                            asset: "UNI",
                            alt: "UNIUSD",
                            name: "Uniswap",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          VET: {
                            id: 49,
                            asset: "VET",
                            alt: "VETUSD",
                            name: "Vechain",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          WING: {
                            id: 50,
                            asset: "WING",
                            alt: "WINGUSD",
                            name: "Wing Finance",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          ZEC: {
                            id: 51,
                            asset: "ZEC",
                            alt: "ZECUSD",
                            name: "Zcash",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          XRP: {
                            id: 52,
                            asset: "XRP",
                            alt: "XRP",
                            name: "Ripple",
                            type: "Crypto",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                        },
                        Stock: {
                          AAPL: {
                            id: 1,
                            asset: "AAPL",
                            name: "Apple",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ABT: {
                            id: 2,
                            asset: "ABT",
                            name: "Abbot Labs",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ADBE: {
                            id: 3,
                            asset: "ADBE",
                            name: "Adobe",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ADI: {
                            id: 4,
                            asset: "ADI",
                            name: "Analog Devices",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                            tradable: true,
                            watching: false,
                          },
                          AEMD: {
                            id: 5,
                            asset: "AEMD",
                            name: "Aethlon Medical",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AIG: {
                            id: 6,
                            asset: "AIG",
                            name: "American International Group",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AMC: {
                            id: 7,
                            asset: "AMC",
                            name: "AMC Holdings",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AMD: {
                            id: 8,
                            asset: "AMD",
                            name: "AMD",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AMT: {
                            id: 9,
                            asset: "AMT",
                            name: "American Tower",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AMZN: {
                            id: 10,
                            asset: "AMZN",
                            name: "Amazon",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          APT: {
                            id: 11,
                            asset: "APT",
                            name: "Alpha Pro Tech",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ASML: {
                            id: 12,
                            asset: "ASML",
                            name: "ASML",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ATER: {
                            id: 13,
                            asset: "ATER",
                            name: "Aterian Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AXP: {
                            id: 14,
                            asset: "AXP",
                            name: "American Express",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BA: {
                            id: 15,
                            asset: "BA",
                            name: "Boeing",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BABA: {
                            id: 16,
                            asset: "BABA",
                            name: "Alibaba",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BAC: {
                            id: 17,
                            asset: "BAC",
                            name: "Bank of America",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BIDU: {
                            id: 18,
                            asset: "BIDU",
                            name: "Baidu Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          BMY: {
                            id: 19,
                            asset: "BMY",
                            name: "Bristol Myers",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          C: {
                            id: 20,
                            asset: "C",
                            name: "Citigroup",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CAT: {
                            id: 21,
                            asset: "CAT",
                            name: "Caterpillar",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CCO: {
                            id: 22,
                            asset: "CCO",
                            name: "Clear Channel Outdoor",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CEI: {
                            id: 23,
                            asset: "CEI",
                            name: "Camber Energy",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CHWY: {
                            id: 24,
                            asset: "CHWY",
                            name: "Chewy Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CL: {
                            id: 25,
                            asset: "CL",
                            name: "Colgate-Palmolive",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CMCSA: {
                            id: 26,
                            asset: "CMCSA",
                            name: "Comcast",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          COST: {
                            id: 27,
                            asset: "COST",
                            name: "Costco",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CRDF: {
                            id: 28,
                            asset: "CRDF",
                            name: "Cardiff Oncology Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CRM: {
                            id: 29,
                            asset: "CRM",
                            name: "Salesforce Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CSCO: {
                            id: 30,
                            asset: "CSCO",
                            name: "Cisco",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CVX: {
                            id: 31,
                            asset: "CVX",
                            name: "Chevron",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          DIS: {
                            id: 32,
                            asset: "DIS",
                            name: "Disney",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          EBAY: {
                            id: 33,
                            asset: "EBAY",
                            name: "Ebay",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          FB: {
                            id: 34,
                            asset: "FB",
                            name: "Meta Platforms Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          FSLY: {
                            id: 35,
                            asset: "FSLY",
                            name: "Fastly Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GE: {
                            id: 36,
                            asset: "GE",
                            name: "General Electric",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GEVO: {
                            id: 37,
                            asset: "GEVO",
                            name: "Gevo Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GM: {
                            id: 38,
                            asset: "GM",
                            name: "General Motors",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GOOGL: {
                            id: 39,
                            asset: "GOOGL",
                            name: "Google",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GS: {
                            id: 40,
                            asset: "GS",
                            name: "Goldman Sachs",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          HD: {
                            id: 41,
                            asset: "HD",
                            name: "Home Depot",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          HON: {
                            id: 42,
                            asset: "HON",
                            name: "Honeywell",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          IBM: {
                            id: 43,
                            asset: "IBM",
                            name: "IBM",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          INMD: {
                            id: 44,
                            asset: "INMD",
                            name: "Inmode",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          INTC: {
                            id: 45,
                            asset: "INTC",
                            name: "Intel",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          JNJ: {
                            id: 46,
                            asset: "JNJ",
                            name: "Johnson & Johnson",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          JPM: {
                            id: 47,
                            asset: "JPM",
                            name: "JP Morgan",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          KO: {
                            id: 48,
                            asset: "KO",
                            name: "Coca Cola",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          LEN: {
                            id: 49,
                            asset: "LEN",
                            name: "Lennar Corporation",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          LVS: {
                            id: 50,
                            asset: "LVS",
                            name: "Las Vegas Sands",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MA: {
                            id: 51,
                            asset: "MA",
                            name: "MasterCard",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MDLZ: {
                            id: 52,
                            asset: "MDLZ",
                            name: "Mondelez",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MMM: {
                            id: 53,
                            asset: "MMM",
                            name: "3M Company",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MNST: {
                            id: 54,
                            asset: "MNST",
                            name: "Monster",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MO: {
                            id: 55,
                            asset: "MO",
                            name: "Attria Group",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MRIN: {
                            id: 56,
                            asset: "MRIN",
                            name: "Marin Software",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MRK: {
                            id: 57,
                            asset: "MRK",
                            name: "Merck",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MS: {
                            id: 58,
                            asset: "MS",
                            name: "Morgan Stanley",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MSFT: {
                            id: 59,
                            asset: "MSFT",
                            name: "Microsoft",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          MSI: {
                            id: 60,
                            asset: "MSI",
                            name: "Motorola",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          NFLX: {
                            id: 61,
                            asset: "NFLX",
                            name: "Netflix",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          NKE: {
                            id: 62,
                            asset: "NKE",
                            name: "Nike",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          NVDA: {
                            id: 63,
                            asset: "NVDA",
                            name: "Nvidia",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          NVS: {
                            id: 64,
                            asset: "NVS",
                            name: "Novartis",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          ORCL: {
                            id: 65,
                            asset: "ORCL",
                            name: "Oracle",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          PEP: {
                            id: 66,
                            asset: "PEP",
                            name: "Pepsico",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          PFE: {
                            id: 67,
                            asset: "PFE",
                            name: "Pfizer",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          PG: {
                            id: 68,
                            asset: "PG",
                            name: "Procter & Gamble",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          PYPL: {
                            id: 69,
                            asset: "PYPL",
                            name: "Paypal",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          RACE: {
                            id: 70,
                            asset: "RACE",
                            name: "Ferrari",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          RKLB: {
                            id: 71,
                            asset: "RKLB",
                            name: "Rocket Lab",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          RL: {
                            id: 72,
                            asset: "RL",
                            name: "Ralph Lauren",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          RWLK: {
                            id: 73,
                            asset: "RWLK",
                            name: "ReWalk Robotics",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SBUX: {
                            id: 74,
                            asset: "SBUX",
                            name: "Starbucks",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SNAP: {
                            id: 75,
                            asset: "SNAP",
                            name: "Snap Inc",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SSRM: {
                            id: 76,
                            asset: "SSRM",
                            name: "SSR Mining",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          SQ: {
                            id: 77,
                            asset: "SQ",
                            name: "Square",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          T: {
                            id: 78,
                            asset: "T",
                            name: "At&t",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TEVA: {
                            id: 79,
                            asset: "TEVA",
                            name: "Teva",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TM: {
                            id: 80,
                            asset: "TM",
                            name: "Toyota Motor",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TMUS: {
                            id: 81,
                            asset: "TMUS",
                            name: "T-Mobile",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TRIP: {
                            id: 82,
                            asset: "TRIP",
                            name: "TripAdvisor",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TSLA: {
                            id: 83,
                            asset: "TSLA",
                            name: "Tesla",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TSM: {
                            id: 84,
                            asset: "TSM",
                            name: "TSMC",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          TWTR: {
                            id: 85,
                            asset: "TWTR",
                            name: "Twitter",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          UNH: {
                            id: 86,
                            asset: "UNH",
                            name: "United Health Group",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          V: {
                            id: 87,
                            asset: "V",
                            name: "Visa",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          VZ: {
                            id: 88,
                            asset: "VZ",
                            name: "Verizon",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          WFC: {
                            id: 89,
                            asset: "WFC",
                            name: "Wells Fargo",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          WMT: {
                            id: 90,
                            asset: "WMT",
                            name: "Walmart",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          XOM: {
                            id: 91,
                            asset: "XOM",
                            name: "Exxon Mobil",
                            type: "Stock",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                        },
                        Currencies: {
                          EURUSD: {
                            id: 1,
                            asset: "EURUSD",
                            alt: "EUR/USD",
                            name: "EURUSD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GBPUSD: {
                            id: 2,
                            asset: "GBPUSD",
                            alt: "GBP/USD",
                            name: "GBPUSD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          USDCHF: {
                            id: 3,
                            asset: "USDCHF",
                            alt: "USD/CHF",
                            name: "USDCHF",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          NZDUSD: {
                            id: 4,
                            asset: "NZDUSD",
                            alt: "NZD/USD",
                            name: "NZDUSD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AUDUSD: {
                            id: 5,
                            asset: "AUDUSD",
                            alt: "AUD/USD",
                            name: "AUDUSD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          EURCAD: {
                            id: 6,
                            asset: "EURCAD",
                            alt: "EUR/CAD",
                            name: "EURCAD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          EURAUD: {
                            id: 7,
                            asset: "EURAUD",
                            alt: "EUR/AUD",
                            name: "EURAUD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          EURJPY: {
                            id: 8,
                            asset: "EURJPY",
                            alt: "EUR/JPY",
                            name: "EURJPY",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          EURCHF: {
                            id: 9,
                            asset: "EURCHF",
                            alt: "EUR/CHF",
                            name: "EURCHF",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          EURGBP: {
                            id: 10,
                            asset: "EURGBP",
                            alt: "EUR/GBP",
                            name: "EURGBP",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AUDCAD: {
                            id: 11,
                            asset: "AUDCAD",
                            alt: "AUD/CAD",
                            name: "AUDCAD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          GBPCHF: {
                            id: 12,
                            asset: "GBPCHF",
                            alt: "GBP/CHF",
                            name: "GBPCHF",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },

                          GBPJPY: {
                            id: 13,
                            asset: "GBPJPY",
                            alt: "GBP/JPY",
                            name: "GBPJPY",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          CHFJPY: {
                            id: 14,
                            asset: "CHFJPY",
                            alt: "CHF/JPY",
                            name: "CHFJPY",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AUDJPY: {
                            id: 15,
                            asset: "AUDJPY",
                            alt: "AUD/JPY",
                            name: "AUDJPY",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                          AUDNZD: {
                            id: 16,
                            asset: "AUDNZD",
                            alt: "AUD/NZD",
                            name: "AUDNZD",
                            type: "Currencies",
                            value: 0,
                            tradable: true,
                            watching: false,
                          },
                        },
                      },
                    }).then(() => {
                      setIsSigningUp(false);
                      sendWelcomeEmail(email, firstname);
                      sendAdminEmail(firstname);
                      navigate("/dashboard");
                    });
                  }
                } catch (error) {
                  console.log(error);
                  // console.log(error?.code);
                  const { code } = error;
                  // console.log(code);
                  setIsSigningUp(false);
                  if (code === "auth/email-already-in-use") {
                    setToastType("error");
                    setToastMessage("This email address cannot be used");
                    setOpenToast(true);
                  } else {
                    setToastType("error");
                    setToastMessage(
                      "Failed to create account. Please try again later"
                    );
                    setOpenToast(true);
                  }
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="form">
                  <MultiTextBoxOutlined>
                    <div className="wrapper">
                      <label htmlFor="firstname">First name</label>
                      <Field
                        type="text"
                        name="firstname"
                        placeholder="First name"
                        className={firstNameError && "input_error"}
                      />
                      <ErrorMessage
                        className="error"
                        name="firstname"
                        component="p"
                      />
                      <p className="first-name-placement">heylo</p>
                    </div>
                    <div className="wrapper">
                      <label htmlFor="lastname">Last name</label>
                      <Field
                        type="text"
                        name="lastname"
                        placeholder="Last name"
                        className={lastNameError && "input_error"}
                      />
                      <ErrorMessage
                        className="error"
                        name="lastname"
                        component="p"
                      />
                      <p className="last-name-placement">heylo</p>
                    </div>
                  </MultiTextBoxOutlined>

                  <TextFieldOutlined>
                    <div className="wrapper">
                      <label htmlFor="emailAddress">Email address</label>
                      <br />
                      <Field
                        type="email"
                        name="email"
                        placeholder="Email address"
                        className={emailError && "input_error"}
                      />
                      <ErrorMessage
                        className="error"
                        name="email"
                        component="p"
                      />
                      <p className="email-placement">heylo</p>
                    </div>
                  </TextFieldOutlined>

                  <CountryDropDown>
                    <div
                      className="wrapper"
                      onClick={() => setShowCountries(!showCountries)}
                    >
                      <label htmlFor="country">Country</label>
                      <div className="content">
                        <div className="main">
                          {selectedCountry && (
                            <img
                              loading="lazy"
                              width="16"
                              src={`https://flagcdn.com/w20/${selectedCountry.toLowerCase()}.png`}
                              srcSet={`https://flagcdn.com/w40/${selectedCountry.toLowerCase()}.png 2x`}
                              alt={`Flag of ${selectedCountry}`}
                            />
                          )}
                          <Field
                            type="text"
                            name="country"
                            placeholder="Choose your country"
                            className="country_search_ref"
                            autoComplete="off"
                            value={countryValue ? countryValue : undefined}
                            onChange={handleCountrySearch}
                            disabled
                            onClick={() => setShowCountries(!showCountries)}
                          />
                        </div>

                        <img
                          alt="arrow-down"
                          className={
                            showCountries ? "arrow-down active" : "arrow-down"
                          }
                          src="/assets/icons/chevron-down.svg"
                          onClick={() => setShowCountries(!showCountries)}
                        />
                      </div>
                    </div>

                    <div
                      className="menu style-4"
                      style={{ display: showCountries ? "block" : "none" }}
                    >
                      <div
                        className="search"
                        onClick={() => setShowCountries(true)}
                      >
                        <input
                          type="text"
                          placeholder="Search for a country..."
                          onChange={handleCountrySearch}
                        />
                      </div>

                      <div className="scrollable style-4">
                        {countryList.map((c) => (
                          <span
                            onClick={() => handlePickCountry(c)}
                            key={c.label}
                          >
                            <img
                              loading="lazy"
                              width="16"
                              src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                              srcSet={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png 2x`}
                              alt={`Flag of ${c.label}`}
                            />

                            <p>{c.label}</p>
                          </span>
                        ))}
                      </div>
                    </div>
                  </CountryDropDown>

                  <PasswordBox>
                    <div className="main">
                      <label htmlFor="password">Password</label>
                      <br />
                      <span className="box">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password (min. of 6 characters)"
                          className={passwordError && "input_error"}
                        />
                        <p
                          className="show_btn"
                          onClick={() =>
                            setShowPassword(
                              showPassword === false ? true : false
                            )
                          }
                        >
                          {showPassword ? "Hide" : "Show"}
                        </p>
                      </span>
                      <ErrorMessage
                        className="error"
                        name="password"
                        component="p"
                      />
                      <p className="password-placement">heylo</p>
                    </div>
                  </PasswordBox>

                  <PasswordBox>
                    <div className="main">
                      <label htmlFor="confirm">Confirm password</label>
                      <br />
                      <span className="box">
                        <Field
                          type={showConfirm ? "text" : "password"}
                          name="confirm"
                          placeholder="Retype your password"
                          className={passwordError && "input_error"}
                        />
                        <p
                          className="show_btn"
                          onClick={() =>
                            setShowConfirm(showConfirm === false ? true : false)
                          }
                        >
                          {showConfirm ? "Hide" : "Show"}
                        </p>
                      </span>

                      <ErrorMessage
                        className="error"
                        name="confirm"
                        component="p"
                      />
                      <p className="confirm-placement">heylo</p>
                    </div>
                  </PasswordBox>

                  <PhoneNumberBox>
                    <label htmlFor="PhoneNumber">Phone number</label>

                    <div className="wrapper">
                      <div
                        className="code"
                        onClick={() => setShowCodes(!showCodes)}
                      >
                        <span>
                          <input
                            type="text"
                            placeholder="+376"
                            disabled
                            // value={
                              // selectedPhoneCode ? selectedPhoneCode : undefined
                            // }
                            value={selectedPhoneCode ? `${selectedPhoneCode}` : '+376'}
                            // defaultValue="33"
                          />
                          <img
                            // alt="arrow-down"
                            src="/assets/icons/chevron-down.svg"
                            className={
                              showCodes ? "arrow-down active" : "arrow-down"
                            }
                          />
                        </span>
                      </div>

                      <Field
                        type="text"
                        name="phonenumber"
                        placeholder="number"
                      />
                      <br />
                    </div>

                    <div
                      className="menu style-4"
                      style={{ display: showCodes ? "block" : "none" }}
                    >
                      <div
                        className="search"
                        onClick={() => setShowCodes(true)}
                      >
                        <input
                          type="text"
                          placeholder="Search..."
                          onChange={handleCountrySearch}

                          // ref={searchRef}
                        />
                      </div>

                      <div className="scrollable style-4">
                        {countryList.map((c) => (
                          <span onClick={() => handlePickCode(c)} key={c.label}>
                            <p>{c.label}</p>
                            <p>+{c.phone}</p>
                          </span>
                        ))}
                      </div>
                    </div>

                    <ErrorMessage
                      className="error"
                      name="phonenumber"
                      component="p"
                    />
                    <p className="phone-placement">heylo</p>
                  </PhoneNumberBox>
                  {/* 
                <CheckBoxInput>
                  {checkTerms ? (
                    <input
                      type="checkbox"
                      checked
                      onClick={() =>
                        setCheckTerms(checkTerms === true ? false : true)
                      }
                    />
                  ) : (
                    <div
                      onClick={() =>
                        setCheckTerms(checkTerms === true ? false : true)
                      }
                    ></div>
                  )}

                  <p>
                    I have read, understood and I agree to the{" "}
                    <u>Privacy Policy</u>, and <u>Terms and conditions.</u>
                  </p>
                </CheckBoxInput> */}

                  <FilledButton
                    type="submit"
                    className={
                      !formFilled || error || !countryValue || isSigningUp
                        ? "disabled"
                        : " "
                    }
                    disabled={
                      !formFilled || error || !countryValue || isSigningUp
                    }
                  >
                    {isSigningUp ? (
                      <CircularLoader bg="#cccccc" size="28" color="#ffffff" />
                    ) : (
                      <p>Open account</p>
                    )}
                  </FilledButton>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        {/* )} */}
      </ThemedPage>
    </>
  );
};

export default Register;
