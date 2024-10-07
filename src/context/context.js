import { createContext, useEffect, useState, useReducer } from "react";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import axios from "axios";

let theme;
let color;

function getTheme() {
  fetch("settings.json").then((response) => {
    response.json().then((settings) => {
      const { themeName, themeColor } = settings;
      localStorage.setItem("themeName", themeName);
      localStorage.setItem("themeColor", themeColor);
    });
  });
}

getTheme();

theme = localStorage.getItem("themeName");
color = localStorage.getItem("themeColor");

// Create our number formatter.
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const THEME_STATE = {
  theme,
  color,
};

const INITIAL_STATE = {
  currentUser: null,
  currentAccount: "live",
  currentWallet: "walletconnect",
  toast: JSON.stringify({
    open: false,
    message: false,
    type: false,
  }),
};

const themeReducer = function (state, action) {
  switch (action.type) {
    case "switchTheme":
      return { theme: action.payload };
    default:
      return state.theme;
  }
};

const userReducer = function (state, action) {
  switch (action.type) {
    case "login":
      return { currentUser: action.payload };
    case "register":
      return { currentUser: action.payload };
    case "logout":
      return { currentUser: null };
    case "switchAccount":
      return { currentAccount: "live" };
    // case "setWalletConnect":
    //   return { currentWallet: action.payload };
    case "switchTheme":
      return { theme: action.payload };
    case "toast":
      return { toast: action.payload };
    default:
      return state.currentUser;
  }
};

export const context = createContext(INITIAL_STATE);
export const themeContext = createContext(THEME_STATE);

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);
  const [themeState, themeDispatch] = useReducer(themeReducer, THEME_STATE);
  const [settings, setSettings] = useState(null);
  const [defaultTheme, setDefaultTheme] = useState("");
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState({});
  const [accounts, setAccounts] = useState({});
  const [btcPrice, setBtcPrice] = useState("");
  const [ethPrice, setEthPrice] = useState("");
  const [solPrice, setSolPrice] = useState("");
  const [bchPrice, setBchPrice] = useState("");
  const [ltcPrice, setLtcPrice] = useState("");
  const [dogePrice, setDogePrice] = useState("");
  const [usdtPrice, setUsdtPrice] = useState("");
  const [maticPrice, setMaticPrice] = useState("");
  const [avaxPrice, setAvaxPrice] = useState("");
  const [theme, setTheme] = useState("");

  useState(() => {
    function getTheme() {
      fetch("settings.json").then((response) => {
        response.json().then((settings) => {
          const { themeName, themeColor } = settings;
          themeDispatch({
            type: "switchTheme",
            payload: themeName,
          });
        });
      });
    }

    function setDub() {
      let dubAsset = {
        alt: "BTC",
        asset: "BTC",
        id: 1,
        tradable: true,
        type: "Crypto",
        value: 0,
        watching: false,
      };

      localStorage.setItem("selectedTradeAsset", JSON.stringify(dubAsset));
    }

    getTheme();
    setDub();
  }, []);

  // Stocks
  const [aaplPrice, setAaplPrice] = useState("");
  const [abtPrice, setAbtPrice] = useState("");
  const [adbePrice, setAdbePrice] = useState("");
  const [adiPrice, setAdiPrice] = useState("");
  const [aemdPrice, setAemdPrice] = useState("");
  const [aigPrice, setAigPrice] = useState("");
  const [amcPrice, setAmcPrice] = useState("");
  const [amdPrice, setAmdPrice] = useState("");
  const [amtPrice, setAmtPrice] = useState("");
  const [amznPrice, setAmznPrice] = useState("");
  const [aptPrice, setAptPrice] = useState("");
  const [asmlPrice, setAsmlPrice] = useState("");
  const [aterPrice, setAterPrice] = useState("");
  const [axpPrice, setAxpPrice] = useState("");
  const [baPrice, setBaPrice] = useState("");
  const [babaPrice, setBabaPrice] = useState("");
  const [bacPrice, setBacPrice] = useState("");
  const [biduPrice, setBiduPrice] = useState("");
  const [bmyPrice, setBmyPrice] = useState("");
  const [cPrice, setCPrice] = useState("");
  const [catPrice, setCatPrice] = useState("");
  const [ccoPrice, setCcoPrice] = useState("");
  const [ceiPrice, setCeiPrice] = useState("");
  const [chwyPrice, setChwyPrice] = useState("");
  const [clPrice, setClPrice] = useState("");
  const [cleuPrice, setCleuPrice] = useState("");
  const [cmcsaPrice, setCmcsaPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [crdfPrice, setCrdfPrice] = useState("");
  const [crmPrice, setCrmPrice] = useState("");
  const [cscoPrice, setCscoPrice] = useState("");
  const [cvxPrice, setCvxPrice] = useState("");
  const [disPrice, setDisPrice] = useState("");
  const [ebayPrice, setEbayPrice] = useState("");
  const [fbPrice, setFbPrice] = useState("");
  const [fslyPrice, setFslyPrice] = useState("");
  const [gePrice, setGePrice] = useState("");
  const [gevoPrice, setGevoPrice] = useState("");
  const [gmPrice, setGmPrice] = useState("");
  const [googlPrice, setGooglPrice] = useState("");
  const [gsPrice, setGsPrice] = useState("");
  const [hdPrice, setHdPrice] = useState("");
  const [honPrice, setHonPrice] = useState("");
  const [ibmnPrice, setIbmPrice] = useState("");
  const [inmdPrice, setInmdPrice] = useState("");
  const [intcPrice, setIntcPrice] = useState("");
  const [jnjPrice, setJnjPrice] = useState("");
  const [jpmPrice, setJpmPrice] = useState("");
  const [koPrice, setKoPrice] = useState("");
  const [lenPrice, setLenPrice] = useState("");
  const [lvsPrice, setLvsPrice] = useState("");
  const [maPrice, setMaPrice] = useState("");
  const [mdlzPrice, setMdlzPrice] = useState("");
  const [mmmPrice, setMmmPrice] = useState("");
  const [mnstPrice, setMnstPrice] = useState("");
  const [moPrice, setMoPrice] = useState("");
  const [mrinPrice, setMrinPrice] = useState("");
  const [mrkPrice, setMrkPrice] = useState("");
  const [msPrice, setMsPrice] = useState("");
  const [msiPrice, setMsiPrice] = useState("");
  const [msftPrice, setMsftPrice] = useState("");
  const [nflxPrice, setNflxPrice] = useState("");
  const [nkePrice, setNkePrice] = useState("");
  const [nvdaPrice, setNvdaPrice] = useState("");
  const [nvsPrice, setNvsPrice] = useState("");
  const [orclPrice, setOrclPrice] = useState("");
  const [pepPrice, setPepPrice] = useState("");
  const [pfePrice, setPfePrice] = useState("");
  const [pgPrice, setPgPrice] = useState("");
  const [pyplPrice, setPyplPrice] = useState("");
  const [racePrice, setRacePrice] = useState("");
  const [rklbPrice, setRklbPrice] = useState("");
  const [rlPrice, setRlPrice] = useState("");
  const [rwlkPrice, setRwlkPrice] = useState("");
  const [sbuxPrice, setSbuxPrice] = useState("");
  const [snapPrice, setSnapPrice] = useState("");
  const [ssrmPrice, setSsrmPrice] = useState("");
  const [sqPrice, setSqPrice] = useState("");
  const [tPrice, setTPrice] = useState("");
  const [tevaPrice, setTevaPrice] = useState("");
  const [tmPrice, setTmPrice] = useState("");
  const [tmusPrice, setTmusPrice] = useState("");
  const [tripPrice, setTripPrice] = useState("");
  const [tslaPrice, setTslaPrice] = useState("");
  const [tsmPrice, setTsmPrice] = useState("");
  const [twtrPrice, setTwtrPrice] = useState("");
  const [unhPrice, setUnhPrice] = useState("");
  const [vPrice, setVPrice] = useState("");
  const [vzPrice, setVzPrice] = useState("");
  const [wfcPrice, setWfcPrice] = useState("");
  const [wmtPrice, setWmtPrice] = useState("");
  const [xomPrice, setXomPrice] = useState("");

  // Totals
  const [cryptoTotal, setCryptoTotal] = useState("");
  const [stockTotal, setStockTotal] = useState("");
  const [totalBalance, setTotalBalance] = useState("");
  const [account, setAccount] = useState([]);
  const [live, setLive] = useState([]);
  const [practice, setPractice] = useState([]);
  const [fiatTotal, setFiatTotal] = useState("");
  const currentAccount = state.currentAccount;

  // Crypto extra
  const [oneInchPrice, setOneInchPrice] = useState("");
  const [aavePrice, setAavePrice] = useState("");
  const [algoPrice, setAlgoPrice] = useState("");
  const [ancPrice, setAncPrice] = useState("");
  const [apePrice, setApePrice] = useState("");
  const [auroraPrice, setAuroraPrice] = useState("");
  const [axsPrice, setAxsPrice] = useState("");
  const [btgPrice, setBtgPrice] = useState("");
  const [boringPrice, setBoringPrice] = useState("");
  const [adaPrice, setAdaPrice] = useState("");
  const [xcnPrice, setXcnPrice] = useState("");
  const [linkPrice, setLinkPrice] = useState("");
  const [cmdxPrice, setCmdxPrice] = useState("");
  const [croPrice, setCroPrice] = useState("");
  const [daiPrice, setDaiPrice] = useState("");
  const [daoPrice, setDaoPrice] = useState("");
  const [dashPrice, setDashPrice] = useState("");
  const [manaPrice, setManaPrice] = useState("");
  const [dflPrice, setDflPrice] = useState("");
  const [nrgPrice, setNrgPrice] = useState("");
  const [etcPrice, setEtcPrice] = useState("");
  const [evmosPrice, setEvmosPrice] = useState("");
  const [gtPrice, setGtPrice] = useState("");
  const [goPrice, setGoPrice] = useState("");
  const [lnPrice, setLnPrice] = useState("");
  const [xmrPrice, setXmrPrice] = useState("");
  const [nexoPrice, setNexoPrice] = useState("");
  const [okbPrice, setOkbPrice] = useState("");
  const [opPrice, setOpPrice] = useState("");
  const [ognPrice, setOgnPrice] = useState("");
  const [ornPrice, setOrnPrice] = useState("");
  const [dotPrice, setDotPrice] = useState("");
  const [xprPrice, setXprPrice] = useState("");
  const [xrpPrice, setXrpPrice] = useState("");
  const [rainiPrice, setRainiPrice] = useState("");
  const [rariPrice, setRariPrice] = useState("");
  const [sfpPrice, setSfpPrice] = useState("");
  const [shibPrice, setShibPrice] = useState("");
  const [xlmPrice, setXlmPrice] = useState("");
  const [stepPrice, setStepPrice] = useState("");
  const [gmtPrice, setGmtPrice] = useState("");
  const [sushiPrice, setSushiPrice] = useState("");
  const [tlosPrice, setTlosPrice] = useState("");
  const [xtzPrice, setXtzPrice] = useState("");
  const [grtPrice, setGrtPrice] = useState("");
  const [trxPrice, setTrxPrice] = useState("");
  const [uniPrice, setUniPrice] = useState("");
  const [vetPrice, setVetPrice] = useState("");
  const [wingPrice, setWingPrice] = useState("");
  const [wxtPrice, setWxtPrice] = useState("");
  const [timePrice, setTimePrice] = useState("");
  const [zecPrice, setZecPrice] = useState("");
  const [zigPrice, setZigPrice] = useState("");

  //currencies
  const [eurUsdPrice, setEurUsdPrice] = useState("");

  const [gbpUsdPrice, setGbpUsdPrice] = useState("");
  const [usdChfPrice, setUsdChfPrice] = useState("");
  const [nzdUsdPrice, setNzdUsdPrice] = useState("");
  const [audUsdPrice, setAudUsdPrice] = useState("");
  const [eurCadPrice, setEurCadPrice] = useState("");

  const [eurAudPrice, setEurAudPrice] = useState("");
  const [eurJpyPrice, setEurJpyPrice] = useState("");
  const [eurChfPrice, setEurChfPrice] = useState("");
  const [eurGbpPrice, setEurGbpPrice] = useState("");
  const [audCadPrice, setAudCadPrice] = useState("");
  const [gbpChfPrice, setGbpChfPrice] = useState("");
  const [gbpJpyPrice, setGbpJpyPrice] = useState("");
  const [chfJpyPrice, setChfJpyPrice] = useState("");
  const [audJpyPrice, setAudJpyPrice] = useState("");
  const [audNzdPrice, setAudNzdPrice] = useState("");

  const [profits, setProfits] = useState(undefined);

  const [projectDetails, setProjectDetails] = useState(undefined);

  const [signalBalance, setSignalBalance] = useState("");
  const [subscribeBalance, setSubscribeBalance] = useState("");
  const [realEstateBalance, setRealEstateBalance] = useState("");

  const [depositSettings, setDepositSettings] = useState({});
  const [withdrawalSettings, setWithdrawalSettings] = useState({});

  async function getData(id) {
    onSnapshot(doc(db, "users", id), (doc) => {
      const data = doc.data();

      if (data) {
        const {
          firstname,
          lastname,
          id,
          email,
          country,
          phone,
          photoURL,
          admin,
          tradingProgress,
          signalStrength,
          verified,
          blocked,
          popup,
          accountType,
          userCodeEnabled,
          presence,
          verificationSubmitted,
          wallet,
          phrases,
          tradeEnabled,
        } = data;
        const userInfo = {
          firstname,
          lastname,
          id,
          email,
          country,
          phone,
          photoURL,
          admin,
          tradingProgress,
          signalStrength,
          verified,
          blocked,
          popup,
          accountType,
          userCodeEnabled,
          presence,
          verificationSubmitted,
          wallet,
          phrases,
          tradeEnabled,
        };
        setUserData(userInfo);
      } else {
        return;
      }
    });

    // if (isDeletingUser) {
    // isDeletingUser && unsubscribe();
    // }
  }

  const [notiList, setNotiList] = useState([]);

  async function getNotifications(id) {
    const q = query(collection(db, "notifications"), where("user", "==", id));
    onSnapshot(q, (querySnapshot) => {
      const notificationList = [];
      querySnapshot.forEach((doc) => {
        notificationList.push(doc.data());
      });
      setNotiList(notificationList);
    });
  }

  async function getDeposit() {
    onSnapshot(doc(db, "admin", "deposit"), (doc) => {
      const data = doc.data();
      setDepositSettings(data);
    });
  }

  async function getWithdrawal() {
    onSnapshot(doc(db, "admin", "withdraw"), (doc) => {
      const data = doc.data();
      setWithdrawalSettings(data);
    });
  }

  async function getProfits(id) {
    onSnapshot(doc(db, "profits", id), (doc) => {
      const data = doc.data();
      // const { profits } = data;
      setProfits(data?.profits);
    });
  }

  async function getBalances(id) {
    onSnapshot(doc(db, "balances", id), (doc) => {
      const data = doc.data();
      setSignalBalance(data?.signalBalance);
      setSubscribeBalance(data?.subscriptionBalance);
      setRealEstateBalance(data?.realEstateBalance);
    });
  }

  useEffect(() => {
    if (user && user.uid) {
      onSnapshot(doc(db, "accounts", user.uid), (doc) => {
        setAccounts(doc.data());
      });
    }
  }, [user]); 

  async function additionalCryptoPrices() {
    const url = `https://redstone.p.rapidapi.com/prices?provider=redstone&symbols=1INCH,AAVE,ALGO,ANC,APE,AURORA,AXS,BTG,ADA,XCN,LINK,CRO,DAI,DAO,DASH,MANA,DFL,ETC,EVMOS,GT,LN,XMR,NEXO,OKB,OP,OGN,ORN,DOT,XPR,RARI,SFP,SHIB,XLM,GMT,SUSHI,TLOS,XTZ,GRT,TRX,UNI,VET,WING,WXT,TIME,ZEC,ZIG,XRP,AVAX,BCH,BTC,DOGE,ETH,LTC,MATIC,SOL,USDT`;

    const config = {
      method: "get",
      headers: {
        "X-RapidAPI-Key": "396a8cb761mshc0459779f675ee6p18d42djsn4cd87cfd13f7",
        "X-RapidAPI-Host": "redstone.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.get(url, config);

      if (response) {
        const { data } = response;

        setOneInchPrice(data["1INCH"].value);
        setAavePrice(data.AAVE.value);
        setAdaPrice(data.ADA.value);
        setAlgoPrice(data.ALGO.value);
        setAncPrice(data["ANC"].value);
        setApePrice(data.APE.value);
        setAuroraPrice(data.AURORA.value);
        setAvaxPrice(data.AVAX.value);
        setAxsPrice(data["AXS"].value);
        setBchPrice(data.BCH.value);
        setBtcPrice(data.BTC.value);
        setBtgPrice(data["BTG"].value);
        setCroPrice(data.CRO.value);
        setDaiPrice(data.DAI.value);
        setDaoPrice(data["DAO"].value);
        setDashPrice(data.DASH.value);
        setDogePrice(data.DOGE.value);
        setDotPrice(data.DOT.value);
        setEtcPrice(data["ETC"].value);

        setEthPrice(data.ETH.value);
        setEvmosPrice(data.EVMOS.value);
        setGmtPrice(data.GMT.value);
        setGrtPrice(data.GRT.value);
        setGtPrice(data.GT.value);
        setLinkPrice(data.LINK.value);
        setLnPrice(data.LN.value);
        setLtcPrice(data.LTC.value);
        setManaPrice(data.MANA.value);
        setMaticPrice(data.MATIC.value);

        setNexoPrice(data.NEXO.value);
        setOgnPrice(data["OGN"].value);
        setOkbPrice(data.OKB.value);
        setOrnPrice(data["ORN"].value);
        setOpPrice(data.OP.value);
        setRariPrice(data.RARI.value);
        setSushiPrice(data.SUSHI.value);
        setTimePrice(data.TIME.value);
        setTlosPrice(data.TLOS.value);
        setTrxPrice(data.TRX.value);
        setUniPrice(data.UNI.value);
        setVetPrice(data.VET.value);
        setWingPrice(data["WING"].value);
        setWxtPrice(data.WXT.value);
        setXcnPrice(data.XCN.value);
        setXlmPrice(data.XLM.value);
        setXmrPrice(data.XMR.value);
        setXprPrice(data.XPR.value);
        setXrpPrice(data.XRP.value);
        setXtzPrice(data.XTZ.value);
        setZecPrice(data.ZEC.value);
        setZigPrice(data.ZIG.value);
        setSfpPrice(data.SFP.value);
        setShibPrice(data["SHIB"].value);

        setSolPrice(data.SOL.value);

        setUsdtPrice(data.USDT.value);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchCryptoBackup() {
    const url = `https://coingecko.p.rapidapi.com/simple/price?ids=bitcoin%2C1inch%2Caave%2Cavalanche%2Calgorand%2Canchor-protocol%2Caxie-infinity%2Cbitcoin-gold%2Ccardano%2Cchainlink%2Ccronos%2Cdai%2Cdao-maker%2Cdash%2Cdecentraland%2Cdefi-land%2Cethereum-classic%2Cevmos%2Cstellar%2Cethereum%2Cpolygon%2Cripple%2Csolana%2Cavalanche%2Cdogecoin%2Cethereum%2Clitecoin%2Ctether%2Cbitcoin-cash%2Cproton%2Cusd-coin%2C&vs_currencies=usd`;

    const config = {
      method: "get",
      headers: {
        "X-RapidAPI-Host": "coingecko.p.rapidapi.com",
        "X-RapidAPI-Key": "396a8cb761mshc0459779f675ee6p18d42djsn4cd87cfd13f7",
      },
    };

    try {
      const response = await axios.get(url, config);
      // `live.Crypto.${type}.value`
      // const { data } = response;
      if (response) {
        const { data } = response;
        setOneInchPrice(data["1inch"].usd);
        setAavePrice(data.aave.usd);
        setAlgoPrice(data.algorand.usd);
        setAncPrice(data["anchor-protocol"].usd);
        setAxsPrice(data["axie-infinity"].usd);
        setBtcPrice(data.bitcoin.usd);
        setBtgPrice(data["bitcoin-gold"].usd);
        setAdaPrice(data.cardano.usd);
        setDaiPrice(data.dai.usd);
        setDaoPrice(data["dao-maker"].usd);
        setDashPrice(data.dash.usd);
        setManaPrice(data.decentraland.usd);
        setDflPrice(data["defi-land"].usd);
        setDogePrice(data.dogecoin.usd);
        setEthPrice(data.ethereum.usd);
        setEtcPrice(data["ethereum-classic"].usd);
        setEvmosPrice(data.evmos.usd);
        setLtcPrice(data.litecoin.usd);
        setXprPrice(data.proton.usd);
        setSolPrice(data.solana.usd);
        setXlmPrice(data.stellar.usd);
        setUsdtPrice(data.tether.usd);
        setBchPrice(data["bitcoin-cash"].usd);
        setXrpPrice(data.ripple.usd);
      }
    } catch (error) {
      console.log("error fetching", error);
    }
  }

  async function fetchStockPrices() {
    const url = `https://data.alpaca.markets/v2/stocks/snapshots?symbols=AAPL,ABT,ADBE,ADI,AEMD,AIG,AMC,AMD,AMT,AMZN,APT,ASML,ATER,AXP,BA,BABA,BAC,BIDU,BMY,C,CAT,CCO,CEI,CHWY,CL,CLEU,CMCSA,COST,CRDF,CRM,CSCO,CVX,DIS,EBAY,FB,FSLY,GE,GEVO,GM,GOOGL,GS,HD,HON,IBM,INMD,INTC,JNJ,JPM,KO,LEN,LVS,MA,MDLZ,MMM,MNST,MSFT,MO,MRIN,MRK,MS,MSI,NFLX,NKE,NVDA,NVS,ORCL,PEP,PFE,PG,PYPL,RACE,RKLB,RL,RWLK,SBUX,SNAP,SSRM,SQ,T,TEVA,TM,TMUS,TRIP,TSLA,TSM,TWTR,UNH,V,VZ,WFC,WMT,XOM`;

    const config = {
      method: "get",
      headers: {
        "Apca-Api-Key-Id": "PKQ6M7Z27HOJ5JZ6XEGN",
        "Apca-Api-Secret-Key": "J7HXcztjRdTUHB0aGkihTdnTTdLGmiVDstpJNAd5",
      },
    };

    try {
      const response = await axios.get(url, config);
      if (response) {
        const {
          AAPL,
          ABT,
          ADBE,
          ADI,
          AEMD,
          AIG,
          AMC,
          AMD,
          AMT,
          AMZN,
          APT,
          ASML,
          ATER,
          AXP,
          BA,
          BABA,
          BAC,
          BIDU,
          BMY,
          C,
          CAT,
          CCO,
          CEI,
          CHWY,
          CL,
          CLEU,
          CMCSA,
          COST,
          CRDF,
          CRM,
          CSCO,
          CVX,
          DIS,
          EBAY,
          FB,
          FSLY,
          GE,
          GEVO,
          GM,
          GOOGL,
          GS,
          HD,
          HON,
          IBM,
          INMD,
          INTC,
          JNJ,
          JPM,
          KO,
          LEN,
          LVS,
          MA,
          MDLZ,
          MMM,
          MNST,
          MSFT,
          MO,
          MRIN,
          MRK,
          MS,
          MSI,
          NFLX,
          NKE,
          NVDA,
          NVS,
          ORCL,
          PEP,
          PFE,
          PG,
          PYPL,
          RACE,
          RKLB,
          RL,
          RWLK,
          SBUX,
          SNAP,
          SSRM,
          SQ,
          T,
          TEVA,
          TM,
          TMUS,
          TRIP,
          TSLA,
          TSM,
          TWTR,
          UNH,
          V,
          VZ,
          WFC,
          WMT,
          XOM,
        } = response.data;

        // console.log(response.data);

        setAaplPrice(AAPL.latestTrade.p);
        setAbtPrice(ABT.latestTrade.p);
        setAdbePrice(ADBE.latestTrade.p);
        setAdiPrice(ADI.latestTrade.p);
        setAemdPrice(AEMD.latestTrade.p);
        setAigPrice(AIG.latestTrade.p);
        setAmcPrice(AMC.latestTrade.p);
        setAmdPrice(AMD.latestTrade.p);
        setAmtPrice(AMT.latestTrade.p);
        setAmznPrice(AMZN.latestTrade.p);
        setAptPrice(APT.latestTrade.p);
        setAsmlPrice(ASML.latestTrade.p);
        setAterPrice(ATER.latestTrade.p);
        setAxpPrice(AXP.latestTrade.p);
        setBaPrice(BA.latestTrade.p);
        setBabaPrice(BABA.latestTrade.p);
        setBacPrice(BAC.latestTrade.p);
        setBiduPrice(BIDU.latestTrade.p);
        setBmyPrice(BMY.latestTrade.p);
        setCPrice(C.latestTrade.p);
        setCatPrice(CAT.latestTrade.p);
        setCcoPrice(CCO.latestTrade.p);
        setCeiPrice(CEI.latestTrade.p);
        setChwyPrice(CHWY.latestTrade.p);
        setClPrice(CL.latestTrade.p);
        setCleuPrice(CLEU.latestTrade.p);
        setCmcsaPrice(CMCSA.latestTrade.p);
        setCostPrice(COST.latestTrade.p);
        setCrdfPrice(CRDF.latestTrade.p);
        setCrmPrice(CRM.latestTrade.p);
        setCscoPrice(CSCO.latestTrade.p);
        setCvxPrice(CVX.latestTrade.p);
        setDisPrice(DIS.latestTrade.p);
        setEbayPrice(EBAY.latestTrade.p);
        setFbPrice(FB.latestTrade.p);
        setFslyPrice(FSLY.latestTrade.p);
        setGePrice(GE.latestTrade.p);
        setGevoPrice(GEVO.latestTrade.p);
        setGmPrice(GEVO.latestTrade.p);
        setGooglPrice(GOOGL.latestTrade.p);
        setGsPrice(GS.latestTrade.p);
        setHdPrice(HD.latestTrade.p);
        setHonPrice(HON.latestTrade.p);
        setIbmPrice(IBM.latestTrade.p);
        setInmdPrice(INMD.latestTrade.p);
        setIntcPrice(INTC.latestTrade.p);
        setJnjPrice(JNJ.latestTrade.p);
        setJpmPrice(JPM.latestTrade.p);
        setKoPrice(KO.latestTrade.p);
        setLenPrice(LEN.latestTrade.p);
        setLvsPrice(LVS.latestTrade.p);
        setMaPrice(MA.latestTrade.p);
        setMdlzPrice(MDLZ.latestTrade.p);
        setMmmPrice(MMM.latestTrade.p);
        setMnstPrice(MNST.latestTrade.p);
        setMoPrice(MO.latestTrade.p);
        setMrinPrice(MRIN.latestTrade.p);
        setMrkPrice(MRK.latestTrade.p);
        setMsPrice(MS.latestTrade.p);
        setMsftPrice(MSFT.latestTrade.p);
        setMsiPrice(MSI.latestTrade.p);
        setNflxPrice(NFLX.latestTrade.p);
        setNkePrice(NKE.latestTrade.p);
        setNvdaPrice(NVDA.latestTrade.p);
        setNvsPrice(NVS.latestTrade.p);
        setOrclPrice(ORCL.latestTrade.p);
        setPepPrice(PEP.latestTrade.p);
        setPfePrice(PFE.latestTrade.p);
        setPgPrice(PG.latestTrade.p);
        setPyplPrice(PYPL.latestTrade.p);
        setRacePrice(RACE.latestTrade.p);
        setRklbPrice(RKLB.latestTrade.p);
        setRlPrice(RL.latestTrade.p);
        setRwlkPrice(RWLK.latestTrade.p);
        setSbuxPrice(SBUX.latestTrade.p);
        setSnapPrice(SNAP.latestTrade.p);
        setSqPrice(SQ.latestTrade.p);
        setSsrmPrice(SSRM.latestTrade.p);
        setTPrice(T.latestTrade.p);
        setTevaPrice(TEVA.latestTrade.p);
        setTmPrice(TM.latestTrade.p);
        setTmusPrice(TMUS.latestTrade.p);
        setTripPrice(TRIP.latestTrade.p);
        setTslaPrice(TSLA.latestTrade.p);
        setTsmPrice(TSM.latestTrade.p);
        setTwtrPrice(TWTR.latestTrade.p);
        setUnhPrice(UNH.latestTrade.p);
        setVPrice(V.latestTrade.p);
        setVzPrice(VZ.latestTrade.p);
        setWfcPrice(WFC.latestTrade.p);
        setWmtPrice(WMT.latestTrade.p);
        setXomPrice(XOM.latestTrade.p);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    fetchCurrenciesPrices();
  }, []);

  async function fetchCurrenciesPrices() {
    async function fetchEurPairs() {
      const url = `https://exchangerate-api.p.rapidapi.com/rapid/latest/EUR`;

      const config = {
        method: "get",
        headers: {
          "X-RapidAPI-Host": "exchangerate-api.p.rapidapi.com",
          "X-RapidAPI-Key":
            "396a8cb761mshc0459779f675ee6p18d42djsn4cd87cfd13f7",
        },
      };

      try {
        const response = await axios.get(url, config);

        if (response) {
          const { data } = response;
          setEurUsdPrice(data.rates.USD);
          setEurCadPrice(data.rates.CAD);
          setEurAudPrice(data.rates.AUD);
          setEurJpyPrice(data.rates.JPY);
          setEurChfPrice(data.rates.CHF);
          setEurGbpPrice(data.rates.GBP);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    async function fetchUsdPairs() {
      const url = `https://exchangerate-api.p.rapidapi.com/rapid/latest/USD`;

      const config = {
        method: "get",
        headers: {
          "X-RapidAPI-Host": "exchangerate-api.p.rapidapi.com",
          "X-RapidAPI-Key":
            "396a8cb761mshc0459779f675ee6p18d42djsn4cd87cfd13f7",
        },
      };

      try {
        const response = await axios.get(url, config);

        if (response) {
          const { data } = response;
          setUsdChfPrice(data.rates.CHF);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    async function fetchGbpPairs() {
      const url = `https://exchangerate-api.p.rapidapi.com/rapid/latest/GBP`;

      const config = {
        method: "get",
        headers: {
          "X-RapidAPI-Host": "exchangerate-api.p.rapidapi.com",
          "X-RapidAPI-Key":
            "396a8cb761mshc0459779f675ee6p18d42djsn4cd87cfd13f7",
        },
      };

      try {
        const response = await axios.get(url, config);

        if (response) {
          const { data } = response;
          setGbpUsdPrice(data.rates.USD);
          setGbpChfPrice(data.rates.CHF);
          setGbpJpyPrice(data.rates.JPY);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    async function fetchNzdPairs() {
      const url = `https://exchangerate-api.p.rapidapi.com/rapid/latest/NZD`;

      const config = {
        method: "get",
        headers: {
          "X-RapidAPI-Host": "exchangerate-api.p.rapidapi.com",
          "X-RapidAPI-Key":
            "396a8cb761mshc0459779f675ee6p18d42djsn4cd87cfd13f7",
        },
      };

      try {
        const response = await axios.get(url, config);

        if (response) {
          const { data } = response;
          setNzdUsdPrice(data.rates.USD);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    async function fetchAudPairs() {
      const url = `https://exchangerate-api.p.rapidapi.com/rapid/latest/AUD`;

      const config = {
        method: "get",
        headers: {
          "X-RapidAPI-Host": "exchangerate-api.p.rapidapi.com",
          "X-RapidAPI-Key":
            "396a8cb761mshc0459779f675ee6p18d42djsn4cd87cfd13f7",
        },
      };

      try {
        const response = await axios.get(url, config);

        if (response) {
          const { data } = response;
          setAudUsdPrice(data.rates.USD);
          setAudCadPrice(data.rates.CAD);
          setAudJpyPrice(data.rates.JPY);
          setAudNzdPrice(data.rates.NZD);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    async function fetchChfPairs() {
      const url = `https://exchangerate-api.p.rapidapi.com/rapid/latest/CHF`;

      const config = {
        method: "get",
        headers: {
          "X-RapidAPI-Host": "exchangerate-api.p.rapidapi.com",
          "X-RapidAPI-Key":
            "396a8cb761mshc0459779f675ee6p18d42djsn4cd87cfd13f7",
        },
      };

      try {
        const response = await axios.get(url, config);

        if (response) {
          const { data } = response;
          setChfJpyPrice(data.rates.JPY);
        }
      } catch (error) {
        console.log("error", error);
      }
    }

    fetchEurPairs();
    fetchUsdPairs();
    fetchGbpPairs();
    fetchNzdPairs();
    fetchAudPairs();
    fetchChfPairs();
  }

  const currentPrices = {
    // Crypto
    BTC: btcPrice,
    ETH: ethPrice,
    SOL: solPrice,
    BCH: bchPrice,
    LTC: ltcPrice,
    DOGE: dogePrice,
    USDT: Number(usdtPrice),
    USDC: Number(usdtPrice),
    MATIC: maticPrice,
    AVAX: avaxPrice,
    "1INCH": oneInchPrice,
    AAVE: aavePrice,
    ALGO: algoPrice,
    ANC: ancPrice,
    APE: apePrice,
    AURORA: auroraPrice,
    AXS: axsPrice,
    BTG: btgPrice,
    BORING: boringPrice,
    ADA: adaPrice,
    XCN: xcnPrice,
    LINK: linkPrice,
    CMDX: cmdxPrice,
    CRO: Number(croPrice),
    DAI: Number(daiPrice),
    DAO: daoPrice,
    DASH: dashPrice,
    MANA: manaPrice,
    DFL: dflPrice,
    NRG: nrgPrice,
    ETC: etcPrice,
    EVMOS: evmosPrice,
    GT: gtPrice,
    GO: goPrice,
    LN: lnPrice,
    XMR: xmrPrice,
    NEXO: nexoPrice,
    OKB: okbPrice,
    OP: opPrice,
    OGN: ognPrice,
    ORN: ornPrice,
    DOT: dotPrice,
    XPR: xprPrice,
    XRP: xrpPrice,
    RAINI: rainiPrice,
    RARI: rariPrice,
    SFP: sfpPrice,
    SHIB: shibPrice,
    XLM: xlmPrice,
    STEP: stepPrice,
    GMT: gmtPrice,
    SUSHI: sushiPrice,
    TLOS: tlosPrice,
    XTZ: xtzPrice,
    GRT: grtPrice,
    TRX: trxPrice,
    UNI: uniPrice,
    VET: vetPrice,
    WING: wingPrice,
    WXT: wxtPrice,
    TIME: timePrice,
    ZEC: zecPrice,
    ZIG: zigPrice,

    // Stocks
    AAPL: aaplPrice,
    ABT: abtPrice,
    ADBE: adbePrice,
    ADI: adiPrice,
    AEMD: aemdPrice,
    AIG: aigPrice,
    AMC: amcPrice,
    AMD: amdPrice,
    AMT: amtPrice,
    AMZN: amznPrice,
    APT: aptPrice,
    ASML: asmlPrice,
    ATER: aterPrice,
    AXP: axpPrice,
    BA: baPrice,
    BABA: babaPrice,
    BAC: bacPrice,
    BIDU: biduPrice,
    BMY: bmyPrice,
    C: cPrice,
    CAT: catPrice,
    CCO: ccoPrice,
    CEI: ceiPrice,
    CHWY: chwyPrice,
    CL: clPrice,
    CLEU: cleuPrice,
    CMCSA: cmcsaPrice,
    COST: costPrice,
    CRDF: crdfPrice,
    CRM: crmPrice,
    CSCO: cscoPrice,
    CVX: cvxPrice,
    DIS: disPrice,
    EBAY: ebayPrice,
    FB: fbPrice,
    FSLY: fslyPrice,
    GE: gePrice,
    GEVO: gevoPrice,
    GM: gmPrice,
    GOOGL: googlPrice,
    GS: gsPrice,
    HD: hdPrice,
    HON: honPrice,
    IBM: ibmnPrice,
    INMD: inmdPrice,
    INTC: intcPrice,
    JNJ: jnjPrice,
    JPM: jpmPrice,
    KO: koPrice,
    LEN: lenPrice,
    LVS: lvsPrice,
    MA: maPrice,
    MDLZ: mdlzPrice,
    MMM: mmmPrice,
    MNST: mnstPrice,
    MO: moPrice,
    MRIN: mrinPrice,
    MRK: mrkPrice,
    MS: msPrice,
    MSFT: msftPrice,
    MSI: msiPrice,
    NFLX: nflxPrice,
    NKE: nkePrice,
    NVDA: nvdaPrice,
    NVS: nvsPrice,
    ORCL: orclPrice,
    PEP: pepPrice,
    PFE: pfePrice,
    PG: pgPrice,
    PYPL: pyplPrice,
    RACE: racePrice,
    RKLB: rklbPrice,
    RL: rlPrice,
    RWLK: rwlkPrice,
    SBUX: sbuxPrice,
    SNAP: snapPrice,
    SQ: sqPrice,
    SSRM: ssrmPrice,
    T: tPrice,
    TEVA: tevaPrice,
    TM: tmPrice,
    TMUS: tmusPrice,
    TRIP: tripPrice,
    TSLA: tslaPrice,
    TSM: tsmPrice,
    TWTR: twtrPrice,
    UNH: unhPrice,
    V: vPrice,
    VZ: vzPrice,
    WFC: wfcPrice,
    WMT: wmtPrice,
    XOM: xomPrice,

    // Fiat
    USD: 1,

    // currencies
    EURUSD: eurUsdPrice,
    EURCAD: eurCadPrice,
    EURAUD: eurAudPrice,
    EURJPY: eurJpyPrice,
    EURCHF: eurChfPrice,
    EURGBP: eurGbpPrice,
    USDCHF: usdChfPrice,
    GBPUSD: gbpUsdPrice,
    GBPCHF: gbpChfPrice,
    GBPJPY: gbpJpyPrice,
    NZDUSD: nzdUsdPrice,
    AUDUSD: audUsdPrice,
    AUDCAD: audCadPrice,
    AUDJPY: audJpyPrice,
    AUDNZD: audNzdPrice,
    CHFJPY: chfJpyPrice,
  };

  useEffect(() => {
    if (accounts && currentAccount) {
      const { live, practice } = accounts;
      switch (currentAccount) {
        case "practice": {
          setAccount(practice);
          break;
        }
        case "live":
          setAccount(live);
          break;
        default:
          break;
      }
    }
  }, [currentAccount, account, accounts, live, practice]);

  useEffect(() => {
    if (account && live && practice) {
      const { Stock, Crypto, Fiat } = account;

      if (Stock && Crypto && Fiat) {
        const CryptoAccount = Object.values(Crypto);
        const StockAccount = Object.values(Stock);

        function getTotalCrypto() {
          let CryptoTotal = 0;
          for (let i = 0; i < CryptoAccount.length; i++) {
            const price =
              currentPrices[CryptoAccount[i].asset] * CryptoAccount[i].value;
            CryptoTotal = CryptoTotal + price;
          }
          setCryptoTotal(CryptoTotal);
        }

        setFiatTotal(Fiat.value);

        function getTotalStocks() {
          let StockTotal = 0;
          for (let i = 0; i < StockAccount.length; i++) {
            const price =
              currentPrices[StockAccount[i].asset] * StockAccount[i].value;
            StockTotal = StockTotal + price;
          }
          setStockTotal(StockTotal);
        }

        getTotalCrypto();
        getTotalStocks();
      }
    }
  }, [account, live, practice, currentPrices]);

  useEffect(() => {
    setTotalBalance(stockTotal + cryptoTotal + fiatTotal);
  }, [stockTotal, cryptoTotal, fiatTotal, totalBalance]);

  useEffect(() => {
    function getAccounts() {
      if (live && practice) {
        setLive(live);
        setPractice(practice);
      }
    }

    if (user && accounts) {
      getAccounts(user.uid);
    }
  }, [user, accounts, live, practice]);

  useEffect(() => {
    if (!loading && user) {
      getDeposit();
      getWithdrawal();
      getData(user.uid);
      getBalances(user.uid);
      getProfits(user.uid);
      getNotifications(user.uid);
    }

    // fetchCryptoPrices();
    fetchStockPrices();
    additionalCryptoPrices();
    fetchCryptoBackup();
  }, [user, loading]);

  return (
    // <ThirdwebProvider desiredChainId={ChainId.Mainnet}>
    //   <MoralisProvider
    //     serverUrl="https://t4rrurk2rwxu.usemoralis.com:2053/server"
    //     appId="WY0o08tyf41tHZEmveE8hy7xXjxhBIMz9nBzB9cs"
    //   >
    <themeContext.Provider value={{ theme: themeState.theme, themeDispatch }}>
      <context.Provider
        value={{
          currentUser: state.currentUser,
          color: state.color,
          toast: state.toast,
          dispatch,
          currentPrices,
          formatter,
          userData,
          totalBalance,
          accounts,
          signalBalance,
          subscribeBalance,
          realEstateBalance,
          profits,
          notiList,
          totals: {
            stockTotal,
            fiatTotal,
            cryptoTotal,
          },
          depositSettings,
          withdrawalSettings,
          selectedProject: {
            projectDetails,
            setProjectDetails,
          },
        }}
      >
        {children}
      </context.Provider>
    </themeContext.Provider>
    //   </MoralisProvider>
    // </ThirdwebProvider>
  );
};

export default Provider;

// setBoringPrice(data.boringdao.value);
// setCmdxPrice(data.comdex.value);
// setDflPrice(data["defi-land"].value);
// setNrgPrice(data.energi.value);
// setGoPrice(data.gochain.value);
// setRainiPrice(data.rainicorn.value);
// setStepPrice(data["step-finance"].value);

// const {data} = response;

// const { XRP, ADA, DOT, TRX, UNI, LINK, ETC, XLM, XMR, AAVE, DAI, OKB, XTZ,SUSHI,DASH,ALGO,ZEC,MANA,GRT,1INCH } =
//   response.data;
// setBtcPrice(BTC.value);
// setEthPrice(ETH.value);
// setSolPrice(SOL.value);
// setBchPrice(BCH.value);
// setLtcPrice(LTC.value);
// setDogePrice(DOGE.value);
// setUsdtPrice(USDT.value);
// setMaticPrice(MATIC.value);
// setAvaxPrice(AVAX.value);
// setAavePrice(AAVE.value);
