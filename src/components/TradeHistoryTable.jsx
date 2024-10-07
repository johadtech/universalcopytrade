import { useContext, useEffect, useState } from "react";
import { styled } from "styled-components";
import { context } from "../context/context";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Skeleton } from "@mui/material";
import { formatterZero, getTime, toFixedIfNecessary } from "../utils/utils";
import CloseTradeModal from "../modals/CloseTradeModal";

const TradeHistoryTable = () => {
  const tabs = ["Open Trades", "Closed Trades"];
  const [activeTab, setActiveTab] = useState("Open Trades");
  const { userData } = useContext(context);

  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState([]);
  // const [userList, setUserList] = useState([]);

  // toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(" ");
  const [toastType, setToastType] = useState(undefined);

  const { id } = userData;

  useEffect(() => {
    function getTrades() {
      const q = query(collection(db, "trades"), where("user", "==", id));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tradeList = [];
        querySnapshot.forEach((doc) => {
          tradeList.push(doc.data());
        });
        setTrades(tradeList);
        setTimeout(() => {
          setIsLoading(false);
        }, 600);
      });
    }

    if (id) {
      getTrades();
    }
  }, [id]);

  const dummyList = [
    {
      id: "2PA6DDXmkgO2dfr4rh31fgSukHFG3",
      firstname: "Sam",
      lastname: "Wells",
      photoURL: null,
      admin: true,
      registerDate: "2 days ago",
      lastLogin: "1 day ago",
      presence: "online",
      verified: true,
      email: "samwells333@gmail.com",
      currency: "USD",
      blocked: false, // or active
      // status: "active", // or blocked
    },
    {
      id: "GKOqJzyMllht7LIcWuyB2rcCFpFGD3",
      firstname: "Russel",
      lastname: "Carter",
      photoURL: null,
      admin: false,
      registerDate: "2 days ago",
      lastLogin: "1 day ago",
      presence: "online",
      verified: true,
      email: "samwells333@gmail.com",
      currency: "USD",
      blocked: false, // or active
      // status: "active", // or blocked
    },
    {
      id: "g9xpimLpyryX1XGk2KJEy1d6ggTUft2",
      firstname: "Global",
      lastname: "Finex",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/finance-test-5f328.appspot.com/o/logo.pngThu%20Feb%2016%202023%2002%3A58%3A39%20GMT%2B0100%20(West%20Africa%20Standard%20Time)?alt=media&token=9f3ff58c-d249-4af2-8c44-b39370f137ab",
      admin: false,
      registerDate: "2 days ago",
      lastLogin: "1 day ago",
      presence: "online",
      verified: true,
      email: "support@globalfinex.net",
      currency: "USD",
      blocked: false, // or active
      // status: "active", // or blocked
    },
    {
      id: "g9xpimLpX1XGk2KJErumfyy1d6ggTUft2",
      firstname: "Global",
      lastname: "Finex",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/finance-test-5f328.appspot.com/o/logo.pngThu%20Feb%2016%202023%2002%3A58%3A39%20GMT%2B0100%20(West%20Africa%20Standard%20Time)?alt=media&token=9f3ff58c-d249-4af2-8c44-b39370f137ab",
      admin: false,
      registerDate: "2 days ago",
      lastLogin: "1 day ago",
      presence: "online",
      verified: true,
      email: "support@globalfinex.net",
      currency: "USD",
      blocked: false, // or active
      // status: "active", // or blocked
    },
    {
      id: "g9xpimLpX1XGk2KJryjyrjyrEy1d6ggTUft2",
      firstname: "Global",
      lastname: "Finex",
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/finance-test-5f328.appspot.com/o/logo.pngThu%20Feb%2016%202023%2002%3A58%3A39%20GMT%2B0100%20(West%20Africa%20Standard%20Time)?alt=media&token=9f3ff58c-d249-4af2-8c44-b39370f137ab",
      admin: false,
      registerDate: "2 days ago",
      lastLogin: "1 day ago",
      presence: "online",
      verified: true,
      email: "support@globalfinex.net",
      currency: "USD",
      blocked: false, // or active
      // status: "active", // or blocked
    },
  ];

  const [selectedCloseTrade, setSelectedCloseTrade] = useState(undefined);
  const [closeTrade, setCloseTrade] = useState(false);

  function handleCloseTrade(trade) {
    setSelectedCloseTrade(trade);
    setCloseTrade(true);
    // console.log("trade", trade);
  }

  return (
    <>
      {closeTrade && (
        <CloseTradeModal
          open={{ closeTrade, setCloseTrade }}
          details={selectedCloseTrade}
        />
      )}

      {isLoading ? (
        <div
          style={{
            paddingBottom: "24px",
            // position: "relative",
            maxHeight: "100%",
            width: "100%",
            overflow: "scroll",
          }}
          className="scrollbar-hide"
        >
          <div
            style={{
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "#1B1F2D",
              width: "100%",
              padding: "16px 24px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              display: "flex",
              gap: "32px",
              position: "sticky",
              top: "0",
              zIndex: "999",
              left: "0",
              borderBottom: "1px solid #212945",
            }}
          >
            <p>Open Trades</p>
            <p style={{ color: "#ACB3CD" }}>Closed Trades</p>
          </div>

          {/* trades */}
          <TradesTableDesktop>
            <th>
              <td className="head-cell asset">
                <p>
                  {" "}
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "100%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell date">
                <p>
                  {" "}
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "100%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell direction">
                <p>
                  {" "}
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "100%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell amount">
                <p>
                  {" "}
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "100%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell entry">
                <p>
                  {" "}
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "100%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell pl">
                <p>
                  {" "}
                  <Skeleton
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgba(27, 31, 45)",
                      maxWidth: "100%",
                    }}
                  />
                </p>
              </td>
              <td className="head-cell action"></td>
            </th>

            {dummyList.map((li) => (
              <tr key={li.id}>
                <td className="row-cell asset">
                  <span>
                    <Skeleton
                      variant="circular"
                      width={22}
                      height={22}
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "100%",
                      }}
                    />
                    <p>
                      {" "}
                      <Skeleton
                        variant="rounded"
                        width={100}
                        sx={{
                          backgroundColor: "rgba(27, 31, 45)",
                          maxWidth: "100%",
                        }}
                      />
                    </p>
                  </span>
                </td>
                <td className="row-cell date">
                  <p>
                    {" "}
                    <Skeleton
                      variant="rounded"
                      // width={100}
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "100%",
                      }}
                    />
                  </p>
                </td>
                <td className="row-cell direction">
                  <p>
                    {" "}
                    <Skeleton
                      variant="rounded"
                      // width={100}
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "100%",
                      }}
                    />{" "}
                  </p>
                </td>
                <td className="row-cell amount">
                  <p>
                    {" "}
                    <Skeleton
                      variant="rounded"
                      // width={100}
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "100%",
                      }}
                    />{" "}
                  </p>
                </td>
                <td className="row-cell entry">
                  <p>
                    <Skeleton
                      variant="rounded"
                      // width={100}
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "100%",
                      }}
                    />
                  </p>
                </td>
                <td className="row-cell pl">
                  <p>
                    <Skeleton
                      variant="rounded"
                      // width={100}
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "100%",
                      }}
                    />
                  </p>
                </td>
                <td className="row-cell action">
                  {/* <button> */}
                  <p>
                    <Skeleton
                      variant="rounded"
                      width={70}
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "100%",
                      }}
                    />
                  </p>
                  {/* </button> */}
                </td>
              </tr>
            ))}
          </TradesTableDesktop>

          {/* mobile */}
          <TradesTableMobile>
            <>
              {dummyList.map((li) => (
                <div className="table-cell active">
                  <div className="top">
                    <span>
                      <Skeleton
                        variant="circular"
                        width={22}
                        height={22}
                        sx={{
                          backgroundColor: "rgba(27, 31, 45)",
                          maxWidth: "100%",
                        }}
                      />
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />
                      </p>
                    </span>

                    <button>Close</button>
                  </div>
                  <div className="bottom">
                    <span>
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />
                      </p>
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />
                      </p>
                    </span>
                    <span>
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />
                      </p>
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />
                      </p>
                    </span>
                    <span>
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />
                      </p>
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />
                      </p>
                    </span>
                    <span>
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />
                      </p>
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />
                      </p>
                    </span>
                    <span>
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />
                      </p>
                      <p>
                        {" "}
                        <Skeleton
                          variant="rounded"
                          width={100}
                          sx={{
                            backgroundColor: "rgba(27, 31, 45)",
                            maxWidth: "100%",
                          }}
                        />
                      </p>
                    </span>
                  </div>
                </div>
              ))}
            </>
          </TradesTableMobile>
        </div>
      ) : (
        <div
          style={{
            paddingBottom: "24px",
            // position: "relative",
            maxHeight: "100%",
            width: "100%",
            overflow: "scroll",
          }}
          className="scrollbar-hide"
        >
          <div
            style={{
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "#1B1F2D",
              width: "100%",
              padding: "16px 24px",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              display: "flex",
              gap: "32px",
              position: "sticky",
              top: "0",
              zIndex: "999",
              left: "0",
              borderBottom: "1px solid #212945",
            }}
          >
            {tabs.map((tab) => (
              <p
                key={tab}
                style={{
                  color: tab !== activeTab && "#ACB3CD",
                  cursor: "pointer",
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </p>
            ))}
          </div>

          {/* <p>Open Trades</p> */}
          {/* <p style={{ color: "#ACB3CD" }}>Closed Trades</p> */}

          {/* trades */}
          <TradesTableDesktop>
            {trades.length > 0 && (
              <th>
                <td className="head-cell asset">
                  <p>Asset</p>
                </td>
                <td className="head-cell date">
                  <p>Date</p>
                </td>
                <td className="head-cell direction">
                  <p>Direction</p>
                </td>
                <td className="head-cell amount">
                  <p>Amount</p>
                </td>
                <td className="head-cell entry">
                  <p>Entry price</p>
                </td>
                <td className="head-cell pl">
                  <p>P&L</p>
                </td>
                <td className="head-cell action"></td>
              </th>
            )}

            {activeTab === "Open Trades" &&
              trades.map(
                (trade) =>
                  trade.status === "open" && (
                    <tr key={trade?.ref}>
                      <td className="row-cell asset">
                        <span>
                          <img
                            src={`./asseticons/${trade?.asset}.svg`}
                            alt=""
                          />
                          <p>{trade?.asset}</p>
                        </span>
                      </td>
                      <td className="row-cell date">
                        <p> {getTime(new Date() - trade?.date?.toDate())}</p>
                      </td>
                      <td className="row-cell direction">
                        <p> {trade?.direction} </p>
                      </td>
                      <td className="row-cell amount">
                        <p>
                          {" "}
                          {trade.type === "Forex" && `${trade.amount} USD`}
                          {trade.type === "Crypto" && (
                            <>
                              {trade.direction === "Sell"
                                ? `${trade.amount} ${trade.asset}`
                                : `${toFixedIfNecessary(trade.converted, 6)} ${
                                    trade.asset
                                  }`}
                            </>
                          )}
                          {trade.type === "Stocks" && (
                            <>
                              {trade.direction === "Sell"
                                ? `${trade.amount} ${trade.asset}`
                                : `${toFixedIfNecessary(trade.converted, 6)} ${
                                    trade.asset
                                  }`}
                            </>
                          )}
                        </p>
                      </td>
                      <td className="row-cell entry">
                        <p>{toFixedIfNecessary(trade?.entry, 4)} </p>
                      </td>
                      <td className="row-cell pl">
                        <p
                          style={{
                            color: trade?.pnl < 0 ? "#ff3344" : "#51BE7F",
                          }}
                        >
                          {trade?.type === "Forex"
                            ? formatterZero.format(trade?.pnl)
                            : trade?.pnl + " " + trade?.asset}
                        </p>
                      </td>
                      <td className="row-cell action">
                        <button onClick={() => handleCloseTrade(trade)}>
                          <p>Close</p>
                        </button>
                      </td>
                    </tr>
                  )
              )}

            {activeTab === "Closed Trades" &&
              trades.map(
                (trade) =>
                  trade?.status === "closed" && (
                    <tr key={trade?.ref}>
                      <td className="row-cell asset">
                        <span>
                          <img
                            src={`./asseticons/${trade?.asset}.svg`}
                            alt=""
                          />
                          <p>{trade?.asset}</p>
                        </span>
                      </td>
                      <td className="row-cell date">
                        <p> {getTime(new Date() - trade.date?.toDate())}</p>
                      </td>
                      <td className="row-cell direction">
                        <p> {trade?.direction} </p>
                      </td>
                      <td className="row-cell amount">
                        <p>
                          {trade.type === "Forex" && `${trade.amount} USD`}
                          {trade.type === "Crypto" && (
                            <>
                              {trade.direction === "Sell"
                                ? `${trade.amount} ${trade.asset}`
                                : `${toFixedIfNecessary(trade.converted, 6)} ${
                                    trade.asset
                                  }`}
                            </>
                          )}
                          {trade.type === "Stocks" && (
                            <>
                              {trade.direction === "Sell"
                                ? `${trade.amount} ${trade.asset}`
                                : `${toFixedIfNecessary(trade.converted, 6)} ${
                                    trade.asset
                                  }`}
                            </>
                          )}
                        </p>
                      </td>
                      <td className="row-cell entry">
                        <p>{toFixedIfNecessary(trade?.entry, 4)} </p>
                      </td>
                      <td className="row-cell pl">
                        <p
                          style={{
                            color: trade?.pnl < 0 ? "#ff3344" : "#51BE7F",
                          }}
                        >
                          {trade?.type === "Forex"
                            ? formatterZero.format(trade?.pnl)
                            : trade?.pnl + " " + trade?.asset}
                        </p>
                      </td>
                      <td className="row-cell action">
                        <button>
                          <p>Closed</p>
                        </button>
                      </td>
                    </tr>
                  )
              )}
          </TradesTableDesktop>

          {/* mobile */}
          <TradesTableMobile>
            {/* open */}
            {activeTab === "Open Trades" &&
              trades.map(
                (trade) =>
                  trade.status === "open" && (
                    // <div>
                    <div className="table-cell active" key={trade.ref}>
                      <div className="top">
                        <span>
                          <img src={`./asseticons/${trade.asset}.svg`} alt="" />
                          <p>{trade.asset}</p>
                        </span>

                        <button onClick={() => handleCloseTrade(trade)}>
                          <p>Close</p>
                        </button>
                      </div>
                      <div className="bottom">
                        <span>
                          <p className="title">Date</p>
                          <p className="detail">
                            {getTime(new Date() - trade.date?.toDate())}
                          </p>
                        </span>
                        <span>
                          <p className="title">Direction</p>
                          <p className="detail">{trade.direction}</p>
                        </span>
                        <span>
                          <p className="title">Amount</p>
                          <p className="detail">
                            {trade.type === "Forex" && `${trade.amount} USD`}
                            {trade.type === "Crypto" && (
                              <>
                                {trade.direction === "Sell"
                                  ? `${trade.amount} ${trade.asset}`
                                  : `${toFixedIfNecessary(
                                      trade.converted,
                                      6
                                    )} ${trade.asset}`}
                              </>
                            )}
                            {trade.type === "Stocks" && (
                              <>
                                {trade.direction === "Sell"
                                  ? `${trade.amount} ${trade.asset}`
                                  : `${toFixedIfNecessary(
                                      trade.converted,
                                      6
                                    )} ${trade.asset}`}
                              </>
                            )}
                          </p>
                        </span>
                        <span>
                          <p className="title">Entry price</p>
                          <p className="detail">
                            {toFixedIfNecessary(trade.entry, 4)}{" "}
                          </p>
                        </span>
                        <span>
                          <p className="title">P&L</p>
                          <p
                            className="detail"
                            style={{
                              color: trade.pnl < 0 ? "#ff3344" : "#51BE7F",
                            }}
                          >
                            {trade.type === "Forex"
                              ? formatterZero.format(trade.pnl)
                              : trade.pnl + " " + trade.asset}
                          </p>
                        </span>
                      </div>
                    </div>
                  )
                // </div>
              )}

            {activeTab === "Closed Trades" &&
              trades.map(
                (trade) =>
                  trade.status === "closed" && (
                    // <div>
                    <div className="table-cell active" key={trade.ref}>
                      <div className="top">
                        <span>
                          <img src={`./asseticons/${trade.asset}.svg`} alt="" />
                          <p>{trade.asset}</p>
                        </span>

                        <button>Closed</button>
                      </div>
                      <div className="bottom">
                        <span>
                          <p className="title">Date</p>
                          <p className="detail">
                            {getTime(new Date() - trade.date.toDate())}
                          </p>
                        </span>
                        <span>
                          <p className="title">Direction</p>
                          <p className="detail">{trade.direction}</p>
                        </span>
                        <span>
                          <p className="title">Amount</p>
                          <p className="detail">
                            {trade.type === "Forex" && `${trade.amount} USD`}
                            {trade.type === "Crypto" && (
                              <>
                                {trade.direction === "Sell"
                                  ? `${trade.amount} ${trade.asset}`
                                  : `${toFixedIfNecessary(
                                      trade.converted,
                                      6
                                    )} ${trade.asset}`}
                              </>
                            )}
                            {trade.type === "Stocks" && (
                              <>
                                {trade.direction === "Sell"
                                  ? `${trade.amount} ${trade.asset}`
                                  : `${toFixedIfNecessary(
                                      trade.converted,
                                      6
                                    )} ${trade.asset}`}
                              </>
                            )}
                          </p>
                        </span>
                        <span>
                          <p className="title">Entry price</p>
                          <p className="detail">
                            {toFixedIfNecessary(trade.entry, 4)}{" "}
                          </p>
                        </span>
                        <span>
                          <p className="title">P&L</p>
                          <p
                            className="detail"
                            style={{
                              color: trade.pnl < 0 ? "#ff3344" : "#51BE7F",
                            }}
                          >
                            {trade.type === "Forex"
                              ? formatterZero.format(trade.pnl)
                              : trade.pnl + " " + trade.asset}
                          </p>
                        </span>
                      </div>
                    </div>
                  )
                // </div>
              )}
          </TradesTableMobile>
        </div>
      )}
    </>
  );
};

const TradesTableDesktop = styled.table`
  /* display: grid; */
  width: 100%;
  display: none;
  /* max-width: 100%;
  overflow-x: scroll;
  overflow-y: scroll; */

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

  .asset {
    max-width: 235px;
    width: 100%;
  }

  .asset span {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .asset span img {
    width: 20px;
    height: 20px;
  }

  .asset span p {
    font-size: 14px;
    font-weight: 600;
    color: white;
  }

  .date {
    max-width: 176px;
    width: 100%;
  }

  .direction {
    max-width: 120px;
    width: 100%;
  }

  .amount {
    max-width: 120px;
    width: 100%;
  }

  .entry {
    max-width: 120px;
    width: 100%;
  }

  .pl {
    max-width: 120px;
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
    background-color: transparent;
    border: 1px solid #212945;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .action button:hover {
    background-color: rgba(27, 31, 45);
    border: 1px solid rgba(27, 31, 45);
  }
`;

const TradesTableMobile = styled.div`
  display: none;

  @media screen and (max-width: 1000px) {
    display: block;
  }

  .table-cell {
    padding: 24px;
    cursor: pointer;
  }

  .table-cell.active .bottom {
    display: block;
  }

  .table-cell:hover {
    background-color: #1b1f2d;
  }

  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .top span {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .top img {
    width: 20px;
    height: 20px;
  }

  .top p {
    font-size: 16px;
    font-weight: 600;
    color: white;
  }

  .top button {
    padding: 8px 16px;
    color: white;
    background-color: transparent;
    border: 1px solid #212945;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .top button:hover {
    background-color: rgba(27, 31, 45);
    border: 1px solid rgba(27, 31, 45);
  }

  .bottom {
    padding-top: 8px;
    box-sizing: border-box;
    display: none;
  }

  .bottom span {
    margin-top: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .title {
    color: #bac2de;
  }

  .detail {
    color: white;
    font-weight: 500;
  }
`;

export default TradeHistoryTable;
