import { styled } from "styled-components";
import BalanceCard from "./BalanceCard";
import AssetsCard from "./AssetsCard";
import TradingProgress from "./TradingProgress";
import ChartContainer from "./ChartContainer";
import MiniTrade from "./MiniTrade";
import AccountSummary from "./AccountSummary";
import TradeHistoryTable from "./TradeHistoryTable";
import Header from "./Header";
import { MainPage } from "../styled/templates/MainPage";
import { useContext, useState } from "react";
import { context } from "../context/context";

const Main = ({ sidebar }) => {
  const { sidebarHidden, setSidebarHidden } = sidebar;
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");

  const { currentAccount, totalBalance, dispatch, totals, realEstateBalance } =
    useContext(context);

  const { stockTotal, fiatTotal, cryptoTotal } = totals;
  const realEstateTotal = 0;

  const total = Number(totalBalance) + Number(realEstateBalance);
  // const {} = useContext(context)

  const categories = [
    {
      name: "Crypto",
      percent: ((cryptoTotal / total) * 100).toFixed(0),
      color: "#F7931A",
    },
    {
      name: "Stocks",
      percent: ((stockTotal / total) * 100).toFixed(0),
      color: "#0AC18E",
    },
    {
      name: "Fiat",
      percent: ((fiatTotal / total) * 100).toFixed(0),
      color: "#0C6CF2",
    },
    {
      name: "Real Estate",
      percent: ((realEstateBalance / total) * 100).toFixed(0),
      color: "#E84142",
    },
  ];

  let list = [];

  categories.forEach((c) => {
    if (c.percent > 0) {
      list.push(c);
    }
  });

  let areas = `
  "main main main side"
  "chart chart chart side"
  "chart chart chart side"
  "table table table table";
  `;

  let progAreas = `
  "main main main side"
  "trading trading trading side"
  "chart chart chart side"
  "table table table table";
  `;

  return (
    <MainPage className="scrollbar-hide">
      <Header sidebar={{ sidebarHidden, setSidebarHidden }} />
      <Container
        className="wrapper"
        $areas={list.length > 0 ? progAreas : areas}
      >
        <div className="main">
          <BalanceCard balance={totalBalance} />
          <AssetsCard />
        </div>
        {list.length > 0 && <TradingProgress style="normal" />}
        <ChartContainer symbol={{ selectedSymbol, setSelectedSymbol }} />
        <div className="side">
          <MiniTrade symbol={{ selectedSymbol, setSelectedSymbol }} />
          <AccountSummary />
        </div>
        <div className="scrollbar-hide table">
          <TradeHistoryTable />
        </div>
      </Container>
    </MainPage>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 0.63fr;
  grid-template-rows: 0.2fr 0.1fr 0.8fr;
  grid-template-areas: ${(props) => props.$areas};
  gap: 16px;
  height: fit-content;

  @media screen and (max-width: 1250px) {
    grid-template-columns: auto;
    grid-template-rows: unset;
    grid-template-areas:
      "main main main main"
      "trading trading trading trading"
      "chart chart chart chart"
      "side side side side"
      "table table table table";
  }

  .main {
    grid-area: main;
    display: flex;
    width: 100%;

    @media screen and (max-width: 1100px) {
      flex-direction: column;
      gap: 16px;
    }
  }

  .side {
    grid-area: side;
    display: flex;
    gap: 12px;
    flex-direction: column;
    border-radius: 12px;
    box-sizing: border-box;
    max-width: 100%;
  }

  .table {
    grid-area: table;
    background-color: #151823;
    width: 100%;
    border-radius: 12px;
    height: 100%;
    overflow-y: scroll;
    box-sizing: content-box;
    max-height: 400px;
  }
`;

export default Main;
