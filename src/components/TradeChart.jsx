import { useEffect } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { styled } from "styled-components";

const TradeChart = ({ symbol }) => {
  const { selectedSymbol, setSelectedSymbol } = symbol;

  useEffect(() => {
    function removeTickers() {
      const ticker = document.querySelectorAll("#tradingview_widget_wrapper");
      ticker.forEach((tick) => {
        tick.lastChild.style.display = "none";
      });
    }

    removeTickers();

    return () => {
      removeTickers();
    };
  });

  return (
    <MiniChartStandard>
      <div className="wrapper">
        <AdvancedRealTimeChart
          autosize
          symbol={selectedSymbol}
          interval="D"
          timezone="Etc/UTC"
          theme="dark"
          style="9"
          locale="en"
          toolbar_bg="#151823"
          enable_publishing={false}
          backgroundColor="#151823"
          height="100%"
          width="100%"
          gridColor="#151823"
          hide_side_toolbar={false}
          container_id="tradingview_8eac5"
          allow_symbol_change="false"
        ></AdvancedRealTimeChart>
        <div className="box"></div>
      </div>
    </MiniChartStandard>
  );
};

const MiniChartStandard = styled.div`
  grid-area: chart;
  background-color: #151823;
  height: 100%;
  border-radius: 12px;
  padding: 16px;
  min-height: 400px;

  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .box {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: content-box;
    outline: solid 1.7px #151823;
    outline-offset: -1px;
    width: 100%;
    height: 100%;
    user-select: none;
    pointer-events: none;
  }
`;

export default TradeChart;
