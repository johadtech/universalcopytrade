import React from "react";
import { CardsWithGrid } from "../styled/templates/CardsWithGrid";
import { styled } from "styled-components";

const items = [
  {
    title: "Users",
    amount: 356,
    details: [
      {
        name: "Active users",
        value: 34,
      },
      {
        name: "Blocked users",
        value: 3,
      },
    ],
  },
  {
    title: "Deposits",
    amount: 43,
    details: [
      {
        name: "Pending deposits",
        value: 26,
      },
      {
        name: "Approved deposits",
        value: 7,
      },
      {
        name: "Declined deposits",
        value: 1,
      },
    ],
  },
  {
    title: "Withdrawals",
    amount: 50,
    details: [
      {
        name: "Pending withdrawals",
        value: 25,
      },
      {
        name: "Approved withdrawals",
        value: 10,
      },
      {
        name: "Declined withdrawals",
        value: 15,
      },
    ],
  },
  {
    title: "Subscriptions",
    amount: 12,
    details: [
      {
        name: "Running subscriptions",
        value: 25,
      },
      {
        name: "Ended subscriptions",
        value: 10,
      },
    ],
  },
  {
    title: "Trades",
    amount: 4,
    details: [
      {
        name: "Running trades",
        value: 3,
      },
      {
        name: "Fulfilled trades",
        value: 1,
      },
    ],
  },
  {
    title: "Verifications",
    amount: 26,
    details: [
      {
        name: "Pending verifications",
        value: 0,
      },
      {
        name: "Approved verifications",
        value: 24,
      },
      {
        name: "Declined verifications",
        value: 2,
      },
    ],
  },
];

const Overview = () => {
  return (
    <OverviewStandard>
      <div className="wrapper">
        {items.map((item) => (
          <div className="box">
            <div className="top">
              <p>Total {item.title}</p>
              <p>{item.amount}</p>
            </div>

            <div className="bottom">
              {item.details.map((detail) => (
                <span>
                  <p>{detail.name}</p>
                  <p>{detail.value}</p>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </OverviewStandard>
  );
};

const OverviewStandard = styled.div`
  margin-top: 24px;

  .wrapper {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
  }

  @media screen and (max-width: 1440px) {
    .wrapper {
      grid-template-columns: auto auto;
    }
  }

  @media screen and (max-width: 1000px) {
    .wrapper {
      grid-template-columns: auto;
      grid-template-rows: unset;
    }
  }

  .wrapper .box {
    background-color: rgba(27, 31, 45, 0.3);
    width: 100%;
    padding: 24px;
    /* min-width: 350px; */
  }

  .wrapper .box:nth-child(1) {
    border: 1px solid #222739;
    border-right: none;
    border-top-left-radius: 12px;
  }

  .wrapper .box:nth-child(2) {
    border: 1px solid #222739;
  }

  .wrapper .box:nth-child(3) {
    border: 1px solid #222739;
    border-top-right-radius: 12px;
    border-left: none;
  }

  .wrapper .box:nth-child(4) {
    border: 1px solid #222739;
    border-top: none;
    border-right: none;
    border-bottom-left-radius: 12px;
  }

  .wrapper .box:nth-child(5) {
    border: 1px solid #222739;
    border-top: none;
  }

  .wrapper .box:nth-child(6) {
    border: 1px solid #222739;
    border-bottom-right-radius: 12px;
    border-top: none;
    border-left: none;
  }

  @media screen and (max-width: 1440px) {
    .wrapper .box:nth-child(1) {
      border: 1px solid #222739;
      border-top-left-radius: 12px;
    }

    .wrapper .box:nth-child(2) {
      border: 1px solid #222739;
      border-left: none;
      border-top-right-radius: 12px;
    }

    .wrapper .box:nth-child(3) {
      border: 1px solid #222739;
      border-top: none;
      border-radius: 0;
    }

    .wrapper .box:nth-child(4) {
      border: 1px solid #222739;
      border-top: none;
      border-left: none;
      border-radius: 0;
    }

    .wrapper .box:nth-child(5) {
      border: 1px solid #222739;
      border-top: none;
      border-bottom-left-radius: 12px;
    }

    .wrapper .box:nth-child(6) {
      border: 1px solid #222739;
      border-top: none;
      border-left: none;
      border-bottom-right-radius: 12px;
    }
  }

  @media screen and (max-width: 1000px) {
    .wrapper .box:nth-child(1) {
      border: 1px solid #222739;
      border-bottom: none;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }

    .wrapper .box:nth-child(2) {
      border: 1px solid #222739;
      border-bottom: none;
      border-radius: 0;
    }

    .wrapper .box:nth-child(3) {
      border: 1px solid #222739;
      border-bottom: none;
      border-radius: 0;
    }

    .wrapper .box:nth-child(4) {
      border: 1px solid #222739;
      border-bottom: none;
      border-radius: 0;
    }

    .wrapper .box:nth-child(5) {
      border: 1px solid #222739;
      border-bottom: none;
      border-radius: 0;
    }

    .wrapper .box:nth-child(6) {
      border: 1px solid #222739;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
  }

  .top p:nth-child(1) {
    color: #bac2de;
    font-size: 14px;
    line-height: 24px;
    font-weight: 500;
  }

  .top p:nth-child(2) {
    color: white;
    font-size: 36px;
    line-height: 40px;
    font-weight: 600;
  }

  .wrapper div .bottom {
    margin-top: 48px;
  }

  .bottom span {
    display: flex;
    justify-content: space-between;
  }

  .bottom span p:nth-child(1) {
    color: #bac2de;
    line-height: 28px;
  }

  .bottom span p:nth-child(2) {
    color: #bac2de;
    font-weight: 500;
    // fontWeight: ;
    line-height: 28px;
  }
`;

export default Overview;
