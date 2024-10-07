import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { MainContainer } from "../styled/templates/MainContainer";
import { MainPage } from "../styled/templates/MainPage";
import { PrimarySwitcher, Search } from "../styled/input/Input";
import { styled } from "styled-components";
import { ContentTable } from "../styled/templates/ContentTable";
import { useMediaQuery } from "@mui/material";
import { context } from "../context/context";
import { onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import AllMarketsTable from "../components/marketsTables/AllMarketsTable";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import CircularLoader from "../styled/loaders/CircularLoader";

const Markets = () => {
  const mobile = useMediaQuery("(max-width: 768px)");

  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);

  const { accounts, userDetails } = useContext(context);
  const [account, setAccount] = useState(undefined);
  const [stockAccount, setStockAccount] = useState(undefined);
  const [fiatAccount, setFiatAccount] = useState(undefined);
  const [cryptoAccount, setCryptoAccount] = useState(undefined);
  const [currenciesAccount, setCurrenciesAccount] = useState(undefined);
  const [live, setLive] = useState(undefined);
  const [practice, setPractice] = useState(undefined);

  const currentAccount = "live";

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
    if (accounts) {
      const { live, practice } = accounts;
      setLive(live);
      setPractice(practice);
    }
  }, [accounts]);

  useEffect(() => {
    if ((live, practice)) {
      setAccount(currentAccount === "live" ? live : practice);
    }

    if (account) {
      const { Crypto, Stock, Fiat, Currencies } = account;
      setStockAccount(Object.values(Stock));
      setFiatAccount([Fiat]);
      setCryptoAccount(Object.values(Crypto));
      setCurrenciesAccount(Object.values(Currencies));
    }
  }, [currentAccount, account, accounts, live, practice]);

  // const marketOptions = ["All", "Crypto", "Stocks", "Currencies"];

  const [selectedMo, setSelectedMo] = useState("All");

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
            selected="Markets"
            hidden={{ sidebarHidden, setSidebarHidden }}
          />
          <MainPage className="scrollbar-hide">
            <Header sidebar={{ sidebarHidden, setSidebarHidden }} />

            <div className="content">
              <h1 className="page_title">Markets</h1>

              {selectedMo === "All" && (
                <AllMarketsTable
                  crypto={cryptoAccount}
                  stocks={stockAccount}
                  fiat={fiatAccount}
                  currencies={currenciesAccount}
                  type="all"
                />
              )}
            </div>
          </MainPage>
        </>
      )}
    </MainContainer>
  );
};

const TradesTableDesktop = styled.table`
  width: 100%;
  display: none;

  @media screen and (min-width: 1000px) {
    display: block;
  }

  th {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-bottom: 1px solid #212945;
  }

  tr {
    display: flex;
    justify-content: space-between;
    width: 100%;
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

export default Markets;

{
  /* Context */
}
{
  /* <div
              className="contextSwitch"
              style={{ display: "flex", gap: "8px" }}
            >
              {contexts.map((ctx) => (
                <button
                  style={{
                    backgroundColor:
                      ctx === selectedContext ? "white" : "#191F34",
                    padding: "8px 12px",
                    outline: "none",
                    border: "none",
                    borderRadius: "32px",
                    color: ctx !== selectedContext && "white",
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                    height: "max-content",
                    textAlign: "justify",
                  }}
                  onClick={() => handleContextSwitch(ctx)}
                >
                  <p
                    style={{
                      // width: "100%",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {ctx}
                  </p>
                </button>
              ))}
            </div> */
}
