import { useContext } from "react";
import { styled } from "styled-components";
import { context } from "../context/context";

const TradingProgress = ({ style }) => {
  const { userData } = useContext(context);
  const { tradingProgress } = userData;

  return (
    <TradingProgressStandard $percent={`${tradingProgress}%`} $style={style}>
      <span className="titles">
        <p>Trading progress</p>
        <p>{tradingProgress}%</p>
      </span>

      <div className="bars">
        <div className="bar"></div>
        <div className="progress"></div>
      </div>
    </TradingProgressStandard>
  );
};

const TradingProgressStandard = styled.div`
  grid-area: trading;
  display: grid;
  gap: 16px;
  width: 100%;
  padding: 24px;
  background-color: ${(props) =>
    props.$style !== "variant" ? "#151823" : "transparent"};
  padding: ${(props) => (props.$style !== "variant" ? "24px" : "0px")};
  border-radius: 12px;

  .titles {
    display: flex;
    justify-content: space-between;
  }

  .titles p:nth-child(1) {
    color: #bac2de;
    font-weight: 500;
    font-size: 16px;
  }

  .titles p:nth-child(2) {
    color: #fff;
    font-weight: 600;
    font-size: 16px;
  }

  .bars {
    position: relative;
  }

  .bar {
    background-color: #bed3fe;
    height: 4px;
    width: 100%;
    border-radius: 32px;
  }

  .progress {
    background-color: #0c6cf2;
    height: 4px;
    /* width: 60%; */
    width: ${(props) => props.$percent};
    border-radius: 32px;
    position: absolute;
    top: 0;
    transition: all 0.3s ease-in-out;
  }
`;

export default TradingProgress;
