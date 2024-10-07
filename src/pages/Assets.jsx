import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { MainContainer } from "../styled/templates/MainContainer";
import { MainPage } from "../styled/templates/MainPage";
import { PrimarySwitcher } from "../styled/input/Input";
import { styled } from "styled-components";
import { ContentTable } from "../styled/templates/ContentTable";
import ActivityCard from "../components/ActivityCard";
import { useMediaQuery } from "@mui/material";
import { context } from "../context/context";
import BalanceCardAssets from "../components/BalanceCardAssets";
import AssetsTable from "../components/assetsTables/AssetsTable";
import BalanceCard from "../components/BalanceCard";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import CircularLoader from "../styled/loaders/CircularLoader";
// import CircularLoader from "../styled/loaders/CircularLoader";

const Assets = () => {
  const mobile = useMediaQuery("(max-width: 768px)");

  const { accounts } = useContext(context);
  const [account, setAccount] = useState(undefined);
  const [stockAccount, setStockAccount] = useState(undefined);
  const [fiatAccount, setFiatAccount] = useState(undefined);
  const [cryptoAccount, setCryptoAccount] = useState(undefined);
  const [currenciesAccount, setCurrenciesAccount] = useState(undefined);
  const [live, setLive] = useState(undefined);
  const [practice, setPractice] = useState(undefined);

  // const currentAccount = "live";

  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);

  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!loading && user && accounts) {
      setAccounts();
    }

    if (loading && !user) {
      setLoader(true);
    }

    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading]);

  async function setAccounts() {
    if (accounts) {
      const { live, practice } = accounts;
      setLive(live);
      setAccount(live);
      setPractice(practice);
      setLoader(false);
    }
  }

  useEffect(() => {
    if (!loading && account && user) {
      const { Crypto, Stock, Fiat, Currencies } = account;
      if (Crypto && Stock && Fiat && Currencies) {
        setStockAccount(Object.values(Stock));
        setFiatAccount([Fiat]);
        setCryptoAccount(Object.values(Crypto));
        setCurrenciesAccount(Object.values(Currencies));
      }
    }
  }, [account, loading, user]);

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
            selected="Assets"
            hidden={{ sidebarHidden, setSidebarHidden }}
          />
          <MainPage className="scrollbar-hide">
            <Header sidebar={{ sidebarHidden, setSidebarHidden }} />
            <div className="content">
              <h1 className="page_title">Assets</h1>

              <CardsDivider>
                <BalanceCardAssets />
                <ActivityCard />
              </CardsDivider>

              {
                <AssetsTable
                  crypto={cryptoAccount}
                  stocks={stockAccount}
                  fiat={fiatAccount}
                  currencies={currenciesAccount}
                />
              }
            </div>
          </MainPage>
        </>
      )}
    </MainContainer>
  );
};

const CardsDivider = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  margin-top: 32px;
  max-height: 400px;
  height: 100%;

  @media screen and (max-width: 1200px) {
    flex-direction: column;
    height: unset;
    max-height: unset;
  }

  /* gap: 24px; */
  /* margin-top: 32px;
  display: grid;
  height: 100%;
  grid-template-columns: auto auto;
  grid-template-rows: auto;
  gap: 24px;
  align-items: center;
  max-height: 330px; */

  /* @media screen and (max-width: 1000px) { */
  /* height: fit-content; */
  /* height: 100%; */
  /* max-height: 100%; */
  /* grid-template-columns: auto;
    grid-template-rows: unset;
    margin-bottom: 146px;
  } */
  /* height: max-content; */
`;

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
    padding: 0px 24px;
  }

  tr {
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
    width: 100%;
    padding: 0px 24px;
  }

  .section {
    width: 100%;
    background-color: rgba(27, 31, 45, 0.8);
    padding: 0px 24px;
  }

  .section p {
    color: #bac2de;
    font-size: 16px;
    text-align: left;
    display: grid;
    align-content: center;
    padding: 12px 0px;
    font-weight: 600;
    line-height: 28px;
  }

  .head-cell {
    /* padding: 0px 24px; */
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
    /* padding: 0px 24px; */
    height: 72px;
    white-space: nowrap;
    text-align: left;
    display: grid;
    align-content: center;
    color: white;
    /* background-color: red; */
    display: flex;
    /* justify-content: ; */
    place-content: left;
    padding: 24px 0px;
  }

  .symbol div {
    /* display: grid; */
    grid-template-columns: 20px auto;
    gap: 12px;
    align-items: center;
    white-space: nowrap;
  }

  .symbol div .checkbox {
    width: 20px;
    height: 20px;
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
    max-width: 200px;
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

  /* .action {
    max-width: 120px;
    width: 100%;
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
  } */
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

export default Assets;
