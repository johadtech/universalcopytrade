import styled from "@emotion/styled";
import { Skeleton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { context } from "../context/context";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import CountUp from "react-countup";

const AccountSummary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { userData, currentPrices, profits } = useContext(context);

  const [user, loading] = useAuthState(auth);

  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const { id } = userData;

  const dubSummaries = [
    {
      name: "Total profits",
      amount: "$23,000.00",
      icon: "./assets/misc/wallet.svg",
    },
    {
      name: "Total deposits",
      amount: "$35,455.83",
      icon: "./assets/misc/wallet.svg",
      action: "Deposit",
    },
    {
      name: "Total withdrawals",
      amount: "$125,568.42",
      icon: "./assets/misc/wallet.svg",
      action: "Withdraw",
    },
  ];

  function getTotalDeposits(deposits) {
    let DepositTotal = 0;
    for (let i = 0; i < deposits.length; i++) {
      let depositAmount = deposits[i].totalInUSD;
      // currentPrices[deposits[i].asset] *
      // deposits[i].amount *
      // currentPrices.USD;

      // console.log("amt", depositAmount);
      DepositTotal = DepositTotal + depositAmount;
    }
    setDeposits(DepositTotal);
  }

  function getTotalWithdrawals(withdrawals) {
    let WithdrawalTotal = 0;
    for (let i = 0; i < withdrawals.length; i++) {
      let withdrawalAmount;

      withdrawalAmount = withdrawals[i].totalInUSD;
      // if (withdrawals[i].type === "Crypto") {
      //   withdrawalAmount =
      //     currentPrices[withdrawals[i].asset] *
      //     withdrawals[i].amount *
      //     currentPrices.USD;
      // } else {
      //   withdrawalAmount = currentPrices.USD * withdrawals[i].amount;
      // }

      WithdrawalTotal = WithdrawalTotal + withdrawalAmount;
    }
    setWithdrawals(WithdrawalTotal);
  }

  useEffect(() => {
    let depositsList = [];
    let withdrawalList = [];
    async function getDeposits() {
      const q = query(collection(db, "deposits"), where("user", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data().status === "approved") {
          depositsList.push(doc.data());
        }
      });
      getTotalDeposits(depositsList);
    }

    async function getWithdrawals() {
      const q = query(collection(db, "withdrawals"), where("user", "==", id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data().status === "approved") {
          withdrawalList.push(doc.data());
        }
      });
      getTotalWithdrawals(withdrawalList);
    }

    if (id) {
      getDeposits();
      getWithdrawals();
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  }, [id]);

  return (
    <AccountSummaryStandard className="scrollbar-hide">
      <div className="top">Account summary</div>

      {isLoading ? (
        <div className="summaries">
          {dubSummaries.map((summary) => (
            <div className="summary_wrap" key={summary.name}>
              <span>
                <Skeleton
                  variant="rounded"
                  width={20}
                  sx={{
                    backgroundColor: "rgba(27, 31, 45)",
                    maxWidth: "100%",
                  }}
                />
                <span style={{ display: "grid", gap: "8px" }}>
                  <p className="name">
                    <Skeleton
                      variant="rounded"
                      // width={100}
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "100%",
                      }}
                    />
                  </p>
                  <p className="text">
                    <Skeleton
                      variant="rounded"
                      width={150}
                      sx={{
                        backgroundColor: "rgba(27, 31, 45)",
                        maxWidth: "100%",
                      }}
                    />
                  </p>
                </span>
              </span>

              {/* <span style={{ display: "block" }}>
              <button
                style={{
                  outline: "none",
                  border: "none",
                  borderRadius: "32px",
                  padding: " 8px 12px",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#080A11",
                }}
              >
                Deposit
              </button>
            </span> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="summaries">
          <div className="summary_wrap">
            {/* total profits */}
            <CountUp
              end={profits}
              duration={1}
              delay={0}
              separator=","
              prefix="$"
              decimals="2"
            >
              {({ countUpRef }) => (
                <span>
                  <img src="./assets/sidebar/wallet.svg" alt="" />
                  <span style={{ display: "grid", gap: "8px" }}>
                    <p className="name">Total profits</p>
                    <p className="text" ref={countUpRef}></p>
                  </span>
                </span>
              )}
            </CountUp>
          </div>

          {/* total deposits */}
          <div className="summary_wrap">
            <CountUp
              end={deposits}
              duration={1}
              delay={0}
              separator=","
              prefix="$"
              decimals="2"
            >
              {({ countUpRef }) => (
                <span>
                  <img src="./assets/sidebar/deposit.svg" alt="" />
                  <span style={{ display: "grid", gap: "8px" }}>
                    <p className="name">Total deposits</p>
                    <p className="text" ref={countUpRef}></p>
                  </span>
                </span>
              )}
            </CountUp>
          </div>

          {/* total withdrawals */}
          <div className="summary_wrap">
            <CountUp
              end={withdrawals}
              duration={1}
              delay={0}
              separator=","
              prefix="$"
              decimals="2"
            >
              {({ countUpRef }) => (
                <span>
                  <img src="./assets/sidebar/withdraw.svg" alt="" />
                  <span style={{ display: "grid", gap: "8px" }}>
                    <p className="name">Total withdrawals</p>
                    <p className="text" ref={countUpRef}></p>
                  </span>
                </span>
              )}
            </CountUp>
          </div>
        </div>
      )}
    </AccountSummaryStandard>
  );
};

const AccountSummaryStandard = styled.div`
  grid-area: summary;
  background-color: #151823;
  height: 100%;
  border-radius: 12px;
  overflow-y: auto;
  position: relative;

  .top {
    color: white;
    font-size: 16px;
    font-weight: 600;
    background-color: #1b1f2d;
    width: 100%;
    padding: 12px 16px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    position: sticky;
    top: 0;
    z-index: 999;
    left: 0;
  }

  .summaries {
    display: grid;
    gap: 8px;
    padding: 8px;
    padding-top: 0px;
  }

  .summary_wrap {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    // backgroundColor: #1C233B;
    padding: 16px;
    align-items: center;
    border-radius: 6px;
  }

  .summary_wrap span {
    display: flex;
    gap: 12px;
    align-items: start;
  }

  .summary_wrap span .name {
    display: 14px;
    color: #bac2de;
    font-weight: 600;
  }

  .summary_wrap span .text {
    font-size: 20px;
    color: white;
    font-weight: 600;
  }

  .summary_wrap .bottom {
    display: block;
  }

  .summary_wrap .bottom .button {
    outline: none;
    border: none;
    border-radius: 32px;
    padding: 8px 12px;
    font-weight: 600;
    font-size: 14px;
    color: #080a11;
  }
`;

export default AccountSummary;
