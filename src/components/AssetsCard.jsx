import { useContext, useEffect, useState } from "react";
import { styled } from "styled-components";
import { context } from "../context/context";
import CircularLoader from "../styled/loaders/CircularLoader";

const AssetsCard = () => {
  const { accounts, currentPrices } = useContext(context);

  const [isLoading, setIsLoading] = useState(true);

  const [assets, setAssets] = useState([]);

  // const topCrypto = [
  //   {
  //     name: "Apple",
  //     symbol: "AAPL"
  //   }
  // ]
  // const topStocks = []

  useEffect(() => {
    if (accounts && currentPrices) {
      const { live } = accounts;

      if (live) {
        const btc = live.Crypto.BTC;
        const eth = live.Crypto.ETH;
        const apple = live.Stock.AAPL;
        const amazon = live.Stock.AMZN;
        const usd = live.Fiat;

        setAssets([
          {
            name: "Bitcoin",
            symbol: "BTC",
            icon: "./assets/asset/bitcoin.svg",
            value: btc.value,
            price: currentPrices["BTC"],
          },
          {
            name: "Ethereum",
            symbol: "ETH",
            icon: "./asseticons/ETH.svg",
            value: eth.value,
            price: currentPrices["ETH"],
          },
          {
            name: "United States Dollars",
            symbol: "USD",
            icon: "./asseticons/USD.svg",
            value: usd.value,
            price: 1,
          },
          {
            name: "Apple",
            symbol: "NASDAQ:AAPL",
            icon: "./asseticons/AAPL.svg",
            value: apple.value,
            price: currentPrices["AAPL"],
          },
        ]);
      }
      setIsLoading(false);
    }
  }, [accounts, currentPrices]);

  const { formatter } = useContext(context);

  return (
    <Container>
      <div className="top">Top Assets</div>

      <div className="wrapper">
        {isLoading ? (
          <div
            style={{
              backgroundColor: "transparent",
              padding: "60px",
            }}
          >
            <CircularLoader
              bg="rgba(12, 108, 243, 0.2)"
              size="28"
              color="#0C6CF2"
            />
          </div>
        ) : (
          <div className="assets">
            {assets.length > 0 ? (
              assets.map((asset) => (
                <div className="asset">
                  <div className="asset_left">
                    <img src={asset.icon} alt="" />
                    <span>
                      <p>{asset.name}</p>
                      <p>{asset.symbol}</p>
                    </span>
                  </div>

                  <span className="asset_right">
                    <p>{asset.value.toFixed(2)}</p>
                    {asset.value ? (
                      <p>{formatter.format(asset.price * asset.value)}</p>
                    ) : (
                      <p> {} </p>
                    )}
                  </span>
                </div>
              ))
            ) : (
              <div
                style={{
                  height: "100%",
                  minHeight: "200px",
                  // backgroundColor: "red",
                  display: "flex",
                  placeContent: "center",
                }}
              >
                <CircularLoader
                  bg="rgba(12, 108, 243, 0.2)"
                  size="28"
                  color="#0C6CF2"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
    // </div>
  );
};

const Container = styled.div`
  grid-area: assets;
  background-color: #151823;
  border-radius: 12px;
  width: 78%;
  padding: 24px 0px;
  background-color: #151823cc;
  border-left: 1px solid #1b1f2d;
  border-bottom-left-radius: 0px;
  border-top-left-radius: 0px;

  @media screen and (max-width: 1540px) {
    display: none;
  }

  @media screen and (max-width: 1250px) {
    display: block;

    width: 100%;
  }

  @media screen and (max-width: 1100px) {
    border-radius: 12px;
  }

  .top {
    color: white;
    font-size: 18px;
    font-weight: 600;
    background-color: #1b1f2d;
    width: 100%;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    padding: 12px 24px;
    background-color: transparent;
  }

  .wrapper {
    padding: 16px;
    display: grid;
    gap: 24px;
  }

  .assets {
    display: grid;
    gap: 16px;
    font-family: "Inter";
    font-feature-settings: "tnum", "lnum", "zero", "ss01";
  }

  .asset {
    display: flex;
    justify-content: space-between;
    padding: 4px;
  }

  .asset_left {
    display: flex;
    gap: 8px;
  }

  .asset_left img {
    height: 32px;
    width: 32px;
  }

  .asset_left span {
    display: grid;
    gap: 4px;
  }

  .asset_left span p:nth-child(1) {
    color: white;
    font-size: 16px;
    font-weight: 500;
  }

  .asset_left span p:nth-child(2) {
    color: #bac2de;
    font-size: 14px;
    font-weight: 600;
  }

  .asset_right {
    display: grid;
    gap: 4px;
    // backgroundColor: red;
    text-align: right;
  }

  .asset_right p:nth-child(1) {
    color: white;
    font-size: 16px;
    font-weight: 500;
  }

  .asset_right p:nth-child(2) {
    color: #bac2de;
    font-size: 14px;
    font-weight: 600;
  }
`;

export default AssetsCard;
