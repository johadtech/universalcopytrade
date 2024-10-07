import Header from "../components/Header";
import CTAThree from "../cta/CTAThree";
import "../styles/content/crypto-dark.scss";
import FooterSeven from "../footer/FooterSeven";
import { useEffect } from "react";

const CryptoTradingDark = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <div className="crypto__dark__container">
        <div className="crypto__dark__wrapper">
          <div className="crypto__dark__intro">
            <p className="crypto__dark__intro__tag">Crypto Trading</p>

            <h1 className="crypto__dark__intro__text">
              Trade cryptocurrencies on our platform
            </h1>

            <p className="crypto__dark__intro__supporting"></p>
          </div>

          <div className="crypto__dark__content">
            <div className="crypto__dark__content__one">
              <p>
                Universal Trade Market is excited to announce the launch of our
                new cryptocurrency trading platform. Now you can start trading
                Bitcoin, Ethereum and many more cryptocurrencies quickly, easily
                and safely from wherever you are — in just seconds. You get
                great margin trading leverage and short sell options with fast
                deposits and withdrawals. Our support team is available 24/7/365
                to help get you trading on our CySEC-regulated platform with a
                trading volume of US $11 billion monthly.
              </p>

              <h1>What is a crypto currency</h1>

              <p>
                A cryptocurrency like bitcoin is a virtual currency traded
                peer-to-peer on a blockchain, independent of centralized
                authorities like banks and governments. Cryptocurrencies are
                entirely virtual, so they are not backed by physical commodities
                and have no intrinsic value.
              </p>

              <h1>How Do Cryptocurrencies Work?</h1>

              <p>
                Primarily, cryptocurrencies rely on blockchain technology to
                complete a transaction via an intricate P2P network. Once a
                transfer request is entered into the network, it is validated by
                the network and added to a pool of other transactions to create
                a block of data for the ledger, which is then entered into the
                existing blockchain. Once the block is successfully added to the
                chain, the transaction is approved and completed.
              </p>

              <h1>Are There Investment Opportunities with Cryptocurrencies?</h1>

              <p>
                Absolutely. Cryptocurrencies have become established investment
                commodities among major financial institutions and have even
                been adopted by countries such as Australia and Japan. As with
                any investment though, there are risks linked to market
                movements, high volatility and economics.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CTAThree />
      <FooterSeven />
    </>
  );
};

export default CryptoTradingDark;
