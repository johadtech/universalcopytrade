import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { MainContainer } from "../styled/templates/MainContainer";
//import Main from "./Main";
import { styled } from "styled-components";
import { MainPage } from "../styled/templates/MainPage";
import Header from "../components/Header";
//import TradeChart from "../components/TradeChart";
//import TradeHistory from "../components/TradeHistory";
import TradeCard from "../components/TradeCard";
//import TradeData from "../components/TradeData";
import TradeChartContainer from "../components/TradeChartContainer";
import TradeHistoryTable from "../components/TradeHistoryTable";
//import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { useMediaQuery } from "@mui/material";
//import { context } from "../context/context";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import CircularLoader from "../styled/loaders/CircularLoader";

const Trade = () => {
  const mobile = useMediaQuery("(max-width: 768px)");

  const [selectedSymbol, setSelectedSymbol] = useState(undefined);
  const [selectedAsset, setSelectedAsset] = useState(undefined);
  const [selectedType, setSelectedType] = useState(undefined);
  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);

  // const params = useParams();
  // const searchParams = useSearchParams();

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
    const defaultAsset = JSON.parse(localStorage.getItem("selectedTradeAsset"));

    // console.log("default", defaultAsset);

    if (defaultAsset) {
      switch (defaultAsset.type) {
        case "Crypto":
          setSelectedType("Crypto");
          setSelectedAsset(defaultAsset);
          setSelectedSymbol(defaultAsset.alt);
          break;
        case "Currencies":
          setSelectedType("Forex");
          setSelectedSymbol(defaultAsset.asset);
          setSelectedAsset(defaultAsset);
          break;
        case "Stock":
          setSelectedType("Stocks");
          setSelectedAsset(defaultAsset);
          setSelectedSymbol(defaultAsset.asset);
          break;
        default:
          break;
      }
    } else {
      setSelectedSymbol("BTC");
      setSelectedType("Crypto");
    }
  }, []);

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
            selected="Trade"
            hidden={{ sidebarHidden, setSidebarHidden }}
          />

          <MainPage className="scrollbar-hide">
            <Header sidebar={{ sidebarHidden, setSidebarHidden }} />
            <TradeContainer className="scrollbar-hide">
              <div className="chart">
                <TradeChartContainer
                  symbol={{ selectedSymbol, setSelectedSymbol }}
                  asset={{ selectedAsset, setSelectedAsset }}
                />
              </div>
              <div className="trade">
                <TradeCard
                  type={{ selectedType, setSelectedType }}
                  symbol={{ selectedSymbol, setSelectedSymbol }}
                  // asset={{ selectedAsset, setSelectedAsset }}
                />
                {/* <TradeData /> */}
              </div>
              <div className=" scrollbar-hide table">
                <TradeHistoryTable />
              </div>
            </TradeContainer>
          </MainPage>
        </>
      )}
    </MainContainer>
  );
};

const TradeContainer = styled.div`
  color: white;
  display: grid;
  grid-template-columns: auto 0.9fr;
  grid-template-rows: auto auto;
  gap: 16px;
  grid-template-areas:
    "chart chart side side"
    "chart chart side side"
    "chart chart side side"
    "history history history history";

  @media screen and (max-width: 1940px) {
    grid-template-columns: auto 1fr;
  }

  @media screen and (max-width: 1100px) {
    grid-template-areas:
      "chart chart chart chart"
      "side side side side"
      "history history history history"
      "history history history history";
  }

  .chart {
    grid-area: chart;
    width: 100%;
    height: 100%;
  }

  .trade {
    grid-area: side;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .table {
    grid-area: history;
    background-color: #151823;
    position: relative;
    border-radius: 12px;
    height: 100%;
    /* max-height: 650px; */

    /* 
    width: 100%;
    border-radius: 12px;
    height: 100%;
    overflow-y: scroll;
    box-sizing: content-box;
     */
  }
`;

export default Trade;
