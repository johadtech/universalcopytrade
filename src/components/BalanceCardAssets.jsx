import { useContext } from "react";
import { styled } from "styled-components";
import { context } from "../context/context";
import CountUp from "react-countup";
import TradingProgress from "./TradingProgress";
import { useMediaQuery } from "@mui/material";

const BalanceCardAssets = () => {
  const { formatter, totalBalance, totals, realEstateBalance } =
    useContext(context);

  const { stockTotal, fiatTotal, cryptoTotal } = totals;
  // const realEstateTotal = 0;
  const total = Number(totalBalance) + Number(realEstateBalance);

  const tradeCol = useMediaQuery("(max-width: 768px)");

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
      //
    },
    //
  ];

  let list = [];

  categories.forEach((c) => {
    if (c.percent > 0) {
      list.push(c);
    }
  });

  // console.log(categories);

  return (
    <BalanceCardStandard>
      <div className="top">
        <CountUp
          end={total}
          duration={1}
          decimals={2}
          delay={0}
          separator=","
          prefix="$"
        >
          {({ countUpRef }) => (
            <span className="total_balance">
              <p>Total Balance</p>
              <p ref={countUpRef}></p>
            </span>
          )}
        </CountUp>

        <p className="tag">Live account</p>
      </div>

      <div
        className="bottom"
        style={{
          height: "fit-content",
          marginTop: tradeCol ? "120px" : "120px",
        }}
      >
        <CategoriesStandard
          // style={{ marginTop: "100%" }}
          $grid={list.length < 3 ? "auto auto auto auto" : "auto auto auto"}
        >
          <div className="categories_lines">
            {categories.map(
              (c) =>
                c.percent > 0 && (
                  <LineStandard
                    key={c.name}
                    $inputColor={c.color}
                    $percent={`${c.percent}%`}
                    $name={c.name}
                  ></LineStandard>
                )
            )}
          </div>

          <div className="categories_names">
            {categories.map(
              (c) =>
                c.percent > 0 && (
                  <CategoryStandard
                    $inputColor={c.color}
                    $percent={`${c.percent}%`}
                    $name={c.name}
                  >
                    <div className="circle"></div>
                    <div className="tag">
                      <p>{c.name}</p>
                      <p>{c.percent}%</p>
                    </div>
                  </CategoryStandard>
                )
            )}
          </div>
        </CategoriesStandard>
      </div>
    </BalanceCardStandard>
  );
};

const BalanceCardStandard = styled.div`
  background-color: #151823;
  border-radius: 12px;
  width: 100%;
  padding: 30px 24px;
  white-space: nowrap;
  background-color: rgba(27, 31, 45, 0.3);
  border-radius: 12px;
  height: 100%;

  @media screen and (max-width: 1420px) {
    border-radius: 12px;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .top .tag {
    padding: 10px 12px;
    background-color: #193129;
    color: #5dbd92;
    font-weight: 500;
    max-width: max-content;
    border-radius: 8px;
    font-size: 16px;
    font-family: "Inter";
    font-feature-settings: "tnum", "lnum", "zero", "ss01";
    cursor: pointer;
  }

  .top .total_balance {
    display: grid;
    gap: 4px;
  }

  .total_balance p:nth-child(1) {
    color: #bac2de;
    font-size: 14px;
    font-weight: 500;
  }

  .total_balance p:nth-child(2) {
    color: white;
    font-size: 24px;
    font-weight: 600;
    font-family: "Inter";
  }

  /* tradeCol && */

  .bottom {
    width: 100%;
    margin-top: 64px;
    max-height: max-content;
    height: 100%;
    box-sizing: border-box;
  }

  .bottom .heading {
    font-size: 18px;
    color: white;
    font-weight: 600;
  }
`;

const CategoriesStandard = styled.div`
  margin-top: auto;

  .categories_lines {
    width: 100%;
    height: 24px;
    display: flex;
    gap: 4px;
  }

  .categories_names {
    display: flex;
    gap: 16px;
    margin-top: 18px;
    justify-content: space-between;
    /* display: flex; */
    /* flex-wrap: wrap; */
    display: grid;
    /* grid-template-columns: auto auto auto auto; */
    grid-template-columns: ${(props) => props.$grid};
    grid-template-rows: auto auto;
    gap: 24px;
  }
`;

const LineStandard = styled.div`
  /* width: 100%; */
  /* background-color: red; */
  height: 22px;
  width: ${(props) => props.$percent};
  background-color: ${(props) => props.$inputColor};
  border-radius: 4px;
  position: relative;

  .line {
    position: absolute;
    /* background-color: ${(props) => props.$inputColor}; */
    height: 24px;
    border-radius: 4px;
    width: ${(props) => props.$percent};
    /* position: relative; */
    /* width: 100%; */
    background-color: red;
  }
`;

const CategoryStandard = styled.div`
  /* position: absolute;
    bottom: -40px;
    left: 0px; */
  display: grid;
  grid-template-columns: 8px auto;
  gap: 8px;
  align-items: flex-start;
  /* display: none; */

  .circle {
    background-color: ${(props) => props.$inputColor};
    width: 8px;
    height: 8px;
    border-radius: 100%;
    margin-top: 4px;
  }

  .tag {
    display: grid;
    gap: 8px;
  }

  .tag p:nth-child(1) {
    font-size: 16px;
    font-weight: 500;
    color: white;
  }

  .tag p:nth-child(2) {
    font-size: 14px;
    font-weight: 600;
    color: #bfc5d9;
    font-family: Inter, sans-serif;
    font-feature-settings: "tnum", "lnum", "zero", "ss01";
    /* color: #bfc5d9; */
  }
`;

export default BalanceCardAssets;
