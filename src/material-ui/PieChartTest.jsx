import { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { createPopper } from "@popperjs/core";
import {
  DropDownIconOutlined,
  FormButton,
  OutlinedIconBoxWithIcon,
} from "../styled/input/Input";
import { formatnumber, formatterZero } from "../utils/utils";

const gridSize = 152;
const gridInnerSize = gridSize - 32;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const PieChartTest = ({ details }) => {
  const popcorn = document.querySelector("#popcorn");
  const tooltip = document.querySelector("#tooltip");

  const [portfolioValue, setPortfolioValue] = useState(130000);

  // useEffect(() => {
  //   console.log("details", details);
  // }, []);

  const [amount, setAmount] = useState(details?.minimum);
  const [minimum, setMinimum] = useState(details?.minimum);
  const [roi, setRoi] = useState(details?.roi);

  // duration
  const durationOptions = [
    // "1 day",
    // "2 days",
    // "4 weeks",
    "3 days",
    "4 days",
    "5 days",
    "6 days",
    "1 week",
    "2 weeks",
    "3 weeks",
    "1 month",
    "2 months",
    "3 months",
    "4 months",
    "5 months",
    "6 months",
    "7 months",
    "8 months",
    "9 months",
    "10 months",
    "1 year",
    "2 years",
    "3 years",
  ];
  const [time, setTime] = useState(2);
  const [duration, setDuration] = useState(3);
  function handleDuration(e) {
    const { value } = e.target;

    // setDurationToolTipMessage(`Your trade will auto close after ${value}`);
    const timeSlice = value.slice(0, value.indexOf(" "));

    if (value.includes("day")) {
      setDuration(Number(timeSlice) * 1);
      // console.log("day", Number(timeSlice) * 1);
    }
    if (value.includes("week")) {
      setDuration(Number(timeSlice) * 7);
      // console.log("week", Number(timeSlice) * 7);
    }
    if (value.includes("month")) {
      setDuration(Number(timeSlice) * 30.417);
      // console.log("month", Number(timeSlice) * 30.417);
    }

    if (value.includes("year")) {
      setDuration(Number(timeSlice) * 365);
      // console.log("year", Number(timeSlice) * 365);
    }

    // console.log(time);
    // setDuration(value);
  }

  // const [appreciation, setAppreciation] = useState();
  // const [income, setIncome] = useState();
  // const [capital, setCapital] = useState();

  Highcharts.setOptions({
    colors: ["#a7e4f7", "#4fcaef", "#05a2d0"],
  });

  const [profits, setProfits] = useState((roi / 100) * amount * duration);
  const [total, setTotal] = useState(amount + profits);

  const options = {
    chart: {
      style: {
        fontFamily: "Inter",
        width: "100%",
        placeSelf: "center",
        border: "none",
        outline: "none",
      },
      type: "pie",
      plotBackgroundColor: "#10121c",
      plotBorderWidth: 0,
      plotShadow: false,
      margin: 0,
      padding: 10,
      spacing: [0, 0, 0, 0],
      tickWidth: 0,
      minPadding: 0,
      maxPadding: 0,
      height: 230,
    },
    title: {
      text: `<p style='color: white; font-size: 16px; font-weight: 600; margin-top: 24px; padding: 0; margin-right: 6px;'>$${formatnumber(
        total
      )}<p> <p style='color: #BAC2DE; font-size: 10px; font-weight: 500'>Total portfolio value</p>`,
      align: "center",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        placeContent: "center",
        whiteSpace: "wrap",
        textAlign: "center",
      },
      verticalAlign: "middle",
      useHTML: true,
      y: 0,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        center: ["50%", "50%"],
        size: "70%",
        size: gridSize,
        innerSize: gridInnerSize,
      },
      series: {
        dataLabels: {
          enabled: true,
          crop: false,
          connectorPadding: 5,
          distance: 10,
          useHTML: true,
          overflow: "allow",
          connectorShape: "straight",
          crookDistance: "50%",
          format: `<p style='color: white; font-size: 16px; font-weight: 600; margin-top: 24px; padding: 0'>{point.value}<p> <p style='color: #BAC2DE; font-size: 10px; font-weight: 500'>{point.name}</p>`,
          style: {
            fontSize: "14px",
            fontWeight: 300,
            color: "white",
          },
        },
      },
    },
    series: [
      {
        groupPadding: 0,
        pointPadding: 0,
        name: "Browsers",
        colorByPoint: true,
        stroke: "transparent",
        data: [
          {
            name: "Capital",
            y: ((amount / total) * 100).toFixed(0) - 10,
            value: `${formatterZero.format(amount)}`,
          },
          {
            name: "Capital<br />Appreciation",
            y: ((profits / total) * 100).toFixed(0) - 10,
            value: `${formatterZero.format(profits)}`,
          },
          {
            name: "Daily<br />P&L",
            y: 10,
            value: `${formatterZero.format(profits / duration)}`,
          },
        ],
      },
    ],
    credits: { enabled: false },
  };

  // const [tooltipMessage, setToolTipMessage] = useState("");

  const [showToolTip, setShowToolTip] = useState(false);

  useEffect(() => {
    if (tooltip) {
      if (showToolTip) {
        createPopper(popcorn, tooltip, {
          placement: "top",
        });
        tooltip.style.display = "inline-block";
      }

      if (!showToolTip) {
        tooltip.style.display = "none";
      }
    }
  }, [showToolTip, popcorn, tooltip]);

  const [width, setWidth] = useState(null);
  const chartComponent = useRef({});
  const [chartOptions, setChartOptions] = useState(options);

  const handleWidth = () => {
    const w = getRandomIntInclusive(100, 300);
    setWidth(w);
  };

  useEffect(() => {
    handleWidth();
  }, []);

  useEffect(() => {
    const chart = chartComponent.current?.chart;

    if (chart) chart.reflow(false);
  }, [width]);

  const [amountError, setAmountError] = useState(false);

  // const balance = 300;

  function handleAmount(e) {
    const { value } = e.target;

    if (value) {
      // console.log(value);
      setAmount(Number(value));
      if (value < minimum) {
        // console.log("value", value);
        // setAmount(value);
        setAmountError(true);
        // setToolTipMessage(
        //   `Your current balance is ${balance} but you are attempting to withdraw ${e.target.value} BTC, which is over your available balance`
        // );
      } else {
        setAmountError(false);
      }
    } else {
      setAmount(details?.minimum);
    }
  }

  useEffect(() => {
    function handleResize() {
      // Update the state or perform any other actions when the
      // browser is resized
      handleWidth();
    }

    // Attach the event listener to the window object
    window.addEventListener("resize", handleResize);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isCalculating, setIsCalculating] = useState(false);

  function handleButtonClick() {
    setProfits((roi / 100) * amount * duration);

    const calcProfits = (roi / 100) * amount * duration;
    setTotal(amount + calcProfits);

    const chart = chartComponent.current?.chart;

    if (chart) {
      // console.log(chart);
      chart.setTitle({
        text: `<p style='color: white; font-size: 16px; font-weight: 600; margin-top: 24px; padding: 0; margin-right: 6px;'>$${formatnumber(
          amount + calcProfits
        )}<p> <p style='color: #BAC2DE; font-size: 10px; font-weight: 500'>Total portfolio value</p>`,
      });
      chart.series[0].setData(
        [
          {
            name: "Capital",
            y: ((amount / total) * 100).toFixed(0) - 10,
            value: `${formatterZero.format(amount)}`,
          },
          {
            name: "Capital<br />Appreciation",
            y: ((calcProfits / total) * 100).toFixed(0) - 10,
            value: `${formatterZero.format(calcProfits)}`,
          },
          {
            name: "Daily<br />P&L",
            y: 10,
            value: `${formatterZero.format(calcProfits / duration)}`,
          },
        ],
        false
      );
      chart.redraw(true);
      chart.reflow(false);
      window.dispatchEvent(new Event("resize"));
    }
  }

  return (
    <div
      style={{
        backgroundColor: "rgba(27, 31, 45, 0.3)",
        height: "100%",
        borderRadius: "12px",
        overflowY: "auto",
        position: "relative",
        marginTop: "24px",
        borderRadius: "12px",
        backgroundColor: "#10121c",
        border: "1px solid #222739",
        width: "100%",
        overflow: "scroll",
      }}
      className="scrollbar-hide"
    >
      <div>
        <div
          style={{
            display: "grid",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <HighchartsReact
            ref={chartComponent}
            highcharts={Highcharts}
            options={chartOptions}
          />
        </div>

        <div style={{ padding: "24px" }}>
          <div className="form_item">
            <p className="label">Value</p>
            <div className="content">
              <OutlinedIconBoxWithIcon>
                <input
                  type="number"
                  placeholder={minimum}
                  onChange={handleAmount}
                />
                <div className="box">
                  <img src={`./asseticons/USD.svg`} alt="" />
                  <p>USD</p>
                </div>
              </OutlinedIconBoxWithIcon>

              {amountError && (
                <span className="caption">
                  <p>
                    The minimum for this project is{" "}
                    {formatterZero.format(minimum)}
                  </p>
                  {/* <p>
                            {balance} {selectedAsset?.asset}{" "}
                          </p> */}
                </span>
              )}
            </div>
          </div>

          {/* <div className="form_item">
            <DropDownIconOutlined>
              <div className="wrapper">
                <label for="country" className="label">
                  My outlook:
                </label>
                <div className="content">
                  <div className="main">
                    <input
                      type="text"
                      name="country"
                      id=""
                      placeholder="Pessimistic"
                      autoComplete="off"
                      className="country_search_ref"
                    />
                  </div>

                  <span
                    className={showUserTab ? "selectors tab" : "selectors"}
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
            </DropDownIconOutlined>
          </div> */}

          <div className="form_item">
            <p className="label">Estimate my return over...</p>
            <div className="content" style={{ marginTop: "8px" }}>
              <DropDownIconOutlined className="select">
                <div className="wrapper">
                  <div className="content">
                    <div className="main">
                      <select
                        name="verification-options"
                        onChange={(e) => handleDuration(e)}
                      >
                        {durationOptions.map((option) => (
                          <option value={option} key={option}>
                            {option}
                          </option>
                        ))}
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

          <FormButton
            className={
              !amount || amountError ? "form_button disabled" : "form_button"
            }
            style={{ marginTop: "48px", width: "100%" }}
            disabled={!amount || amountError}
            onClick={handleButtonClick}
          >
            <p>Calculate ROI</p>
          </FormButton>
        </div>
      </div>
    </div>
  );
};

export default PieChartTest;
