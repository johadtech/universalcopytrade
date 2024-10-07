import { useContext, useEffect, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import { styled } from "styled-components";
import { Button, Skeleton, SwipeableDrawer } from "@mui/material";
import Box from "@mui/material/Box";
import { LargeDivider, SmallDivider } from "../styled/forms/dividers";
import {
  AmountBox,
  DropDownBox,
  DropDownIcon,
  FullButton,
  TradeSwitcher,
} from "../styled/input/Input";
import Crypto from "../components/trades/fix-trade/Crypto";
import Stocks from "../components/trades/fix-trade/Stocks";
import Forex from "../components/trades/fix-trade/Forex";
import Convert from "../components/trades/fix-trade/Convert";
import { context } from "../context/context";

const FixUserTradeModal = ({ open, userData, accounts }) => {
  const { fixTrade, setFixTrade } = open;
  const { currentPrices } = useContext(context);
  const [isLoading, setIsLoading] = useState(true);

  const [cryptoAccount, setCryptoAccount] = useState([]);
  const [fiatAccount, setFiatAccount] = useState([]);
  const [stockAccount, setStockAccount] = useState([]);
  const [currenciesAccount, setCurrenciesAccount] = useState([]);

  useEffect(() => {
    if (accounts && currentPrices && userData) {
      const { live, practice } = accounts;
      if (live) {
        const { Crypto, Currencies, Fiat, Stock } = live;
        setCryptoAccount(Crypto);
        setFiatAccount(Fiat);
        setStockAccount(Stock);
        setCurrenciesAccount(Currencies);
        setIsLoading(false);
      }
    }
  }, [accounts, currentPrices]);

  const actions = ["Buy", "Sell", "Convert"];

  const [selectedAction, setSelectedAction] = useState("Buy");
  const [selectedType, setSelectedType] = useState("Crypto");

  const [changedAction, setChangedAction] = useState(false);

  const marketTypes = ["Crypto", "Stocks", "Forex"];

  function handleActionChange(action) {
    if (selectedAction === "Convert" && action === "Buy") {
      setSelectedType("Crypto");
    }

    if (selectedAction === "Convert" && action === "Sell") {
      setSelectedType("Crypto");
    }
    setSelectedAction(action);
  }

  return (
    <Modal
      open={fixTrade}
      onClose={() => setFixTrade(false)}
      style={{
        display: "flex",
        placeContent: "center",
        zIndex: "10001",
      }}
    >
      <ModalStandard className="scrollbar-hide">
        <div className="modal_top">
          <p>Fix trade</p>

          <svg
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setFixTrade(!fixTrade)}
            style={{ cursor: "pointer" }}
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.8647 0.366365C12.3532 -0.122122 13.1451 -0.122122 13.6336 0.366365C14.1221 0.854853 14.1221 1.64685 13.6336 2.13533L8.88929 6.87968L13.8743 11.8647C14.3628 12.3532 14.3628 13.1451 13.8743 13.6336C13.3858 14.1221 12.5938 14.1221 12.1053 13.6336L7.12032 8.64864L2.13533 13.6336C1.64685 14.1221 0.854853 14.1221 0.366366 13.6336C-0.122122 13.1451 -0.122122 12.3532 0.366366 11.8647L5.35136 6.87968L0.607014 2.13533C0.118527 1.64685 0.118527 0.854853 0.607014 0.366365C1.0955 -0.122122 1.8875 -0.122122 2.37598 0.366365L7.12032 5.11071L11.8647 0.366365Z"
              fill="#858DAD"
            />
          </svg>
        </div>

        <div className="modal_content">
          <div className="top">
            <LargeDivider>
              <TradeSwitcher className="trade_buttons">
                {actions.map((action) => (
                  <span
                    key={action}
                    onClick={() => handleActionChange(action)}
                    className={
                      action === selectedAction
                        ? `${action.toLowerCase()} active`
                        : action.toLowerCase()
                    }
                  >
                    <p>{action}</p>
                  </span>
                ))}
              </TradeSwitcher>

              {selectedAction !== "Convert" && (
                <DropDownBox className="type_select">
                  <div className="wrapper">
                    <p className="label">Type:</p>
                    <span className="content">
                      <select
                        name=""
                        id=""
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        {marketTypes.map((type) => (
                          <option value={type} key={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="#5C6175"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </DropDownBox>
              )}

              {selectedAction !== "Convert" && selectedType === "Crypto" && (
                <Crypto
                  account={cryptoAccount}
                  prices={currentPrices}
                  action={selectedAction}
                  user={userData}
                  fiat={fiatAccount}
                  accounts={accounts}
                />
              )}

              {selectedAction !== "Convert" && selectedType === "Forex" && (
                <Forex
                  account={currenciesAccount}
                  prices={currentPrices}
                  action={selectedAction}
                  user={userData}
                  fiat={fiatAccount}
                  accounts={accounts}
                />
              )}

              {selectedAction !== "Convert" && selectedType === "Stocks" && (
                <Stocks
                  account={stockAccount}
                  prices={currentPrices}
                  action={selectedAction}
                  user={userData}
                  fiat={fiatAccount}
                  accounts={accounts}
                />
              )}

              {selectedAction === "Convert" && (
                <Convert
                  crypto={cryptoAccount}
                  stock={stockAccount}
                  fiat={fiatAccount}
                  prices={currentPrices}
                  action={selectedAction}
                  user={userData}
                  open={{ fixTrade, setFixTrade }}
                />
              )}
            </LargeDivider>
          </div>
        </div>
      </ModalStandard>
    </Modal>
  );
};

const ModalStandard = styled.div`
  background-color: #151823;
  border-radius: 12px;
  max-width: 430px;
  place-self: center;
  width: 100%;
  border: 1px solid transparent;
  z-index: 10001;

  .bottom button {
    cursor: pointer;
    width: 100%;
    background-color: #0c6cf2;
    padding: 12px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
    margin-top: 32px;
  }

  .bottom button:hover {
    background-color: #ff3344;
  }

  @media screen and (max-width: 768px) {
    width: 100vw;
    max-width: unset;
    height: fit-content;
    max-height: 90%;
    position: fixed;
    left: 0;
    bottom: 0;
    padding-bottom: 48px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    overflow-y: scroll;

    .bottom button {
      margin: 0;
    }

    .top {
      margin-bottom: 52px;
    }

    .bottom {
      position: fixed;
      bottom: 0px;
      right: 0px;
      width: 100%;
      padding: 12px 24px;
      height: fit-content;
      background-color: #151823;
      /* display: none; */
    }
  }

  .modal_top {
    color: white;
    font-size: 16px;
    font-weight: 600;
    background-color: #1b1f2d;
    width: 100%;
    padding: 14px 30px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    position: sticky;
    top: 0;
    z-index: 1001;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal_content {
    padding: 24px;
  }

  .modal_content .top {
    display: grid;
    gap: 24px;
  }
`;

// {isLoading && (
//   <div
//     // style={{ padding: "24px", opacity: "0.9" }}
//     className="modal_content"
//   >
//     <div className="top"></div>
//     <LargeDivider>
//       <Skeleton
//         variant="rounded"
//         height={54}
//         sx={{ backgroundColor: "rgba(27, 31, 45, 0.3" }}
//       />
//       <Skeleton
//         variant="rounded"
//         height={54}
//         sx={{ backgroundColor: "rgba(27, 31, 45, 0.3" }}
//       />

//       <Skeleton
//         variant="rounded"
//         height={54}
//         sx={{ backgroundColor: "rgba(27, 31, 45, 0.3" }}
//       />

//       <Skeleton
//         variant="rounded"
//         height={54}
//         width={200}
//         sx={{ backgroundColor: "rgba(27, 31, 45, 0.3", width: "70%" }}
//       />

//       <TradeSwitcher
//         className="trade_buttons"
//         style={{
//           opacity: "0",
//           userSelect: "none",
//           pointerEvents: "none",
//         }}
//       >
//         {actions.map((action) => (
//           <span
//             key={action}
//             onClick={() => setSelectedAction(action)}
//             className={
//               action === selectedAction
//                 ? `${action.toLowerCase()} active`
//                 : action.toLowerCase()
//             }
//           >
//             <p>{action}</p>
//           </span>
//         ))}
//       </TradeSwitcher>

//       <AmountBox
//         className="amount_box"
//         style={{
//           opacity: "0",
//           userSelect: "none",
//           pointerEvents: "none",
//         }}
//       >
//         <div className="label">
//           <p>Amount:</p>
//           <img
//             src="./assets/misc/info.svg"
//             alt=""
//             className="error_inform"
//             id="popcorn"
//           />
//         </div>

//         <div className="wrapper">
//           <input type="number" placeholder="1000" />

//           <span className="asset">
//             <span>
//               <img src="./assets/asset/bitcoin.svg" alt="" />
//               <p>BTC</p>
//             </span>
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M6 9L12 15L18 9"
//                 stroke="#5C6175"
//                 stroke-width="3"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//               />
//             </svg>
//           </span>
//         </div>
//       </AmountBox>
//     </LargeDivider>

//     <div className="bottom">
//       {/* <FullButton className="button" >

//     </FullButton> */}
//       {/* <button > */}
//       <Skeleton
//         variant="rounded"
//         height={54}
//         sx={{ backgroundColor: "rgba(27, 31, 45, 0.3" }}
//       />
//       {/* </button> */}
//     </div>
//   </div>
// )}

// const SubscriptionCardStandard = styled.div`
//   background-color: #151823;
//   height: 100;
//   border-radius: 12px;
// `;

export default FixUserTradeModal;

// outlinedModal
// filledModal
