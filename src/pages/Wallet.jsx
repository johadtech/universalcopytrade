import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { MainContainer } from "../styled/templates/MainContainer";
import { MainPage } from "../styled/templates/MainPage";
import { useMediaQuery } from "@mui/material";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import CircularLoader from "../styled/loaders/CircularLoader";
import styled from "styled-components";
import { siteSettings } from "../static";
import ShowSeedPhraseModal from "../modals/ShowSeedPhraseModal";

const Wallet = () => {
  const mobile = useMediaQuery("(max-width: 768px)");

  const [sidebarHidden, setSidebarHidden] = useState(mobile ? true : false);

  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      setLoader(false);
    }

    if (loading && !user) {
      setLoader(true);
    }

    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading]);

  const wallets = [
    {
      name: "Coinbase",
      icon: "./assets/wallets/coinbase.svg",
    },
    {
      name: "Coinbase One",
      icon: "./assets/wallets/coinbase-one.svg",
    },
    {
      name: "TrustWallet",
      icon: "./assets/wallets/trust.svg",
    },
    {
      name: "Gemini",
      icon: "./assets/wallets/gemini.svg",
    },
    {
      name: "Metamask",
      icon: "./assets/wallets/metamask.svg",
    },
    {
      name: "Uniswap",
      icon: "./assets/wallets/uniswap.svg",
    },
    {
      name: "Binance",
      icon: "./assets/wallets/binance.svg",
    },
  ];

  const [showPhrase, setShowPhrase] = useState(false);
  const [selected, setSelected] = useState(null);

  function handleShowPhrase(name) {
    setSelected(name);
    setShowPhrase(true);
  }

  return (
    <MainContainer>
      {showPhrase && (
        <ShowSeedPhraseModal
          open={{ showPhrase, setShowPhrase }}
          selected={selected}
        />
      )}

      {loader ? (
        <MainPage>
          <CircularLoader
            bg="rgba(12, 108, 243, 0.2)"
            size="44"
            color="#0C6CF2"
          />
        </MainPage>
      ) : (
        <>
          <Sidebar
            selected="Wallet Connect"
            hidden={{ sidebarHidden, setSidebarHidden }}
          />
          <MainPage className="scrollbar-hide">
            <Header sidebar={{ sidebarHidden, setSidebarHidden }} />

            <div className="content">
              {/* <h1 className="page_title">Wallet connect</h1> */}

              <WalletConnectWrapper>
                <p className="wallet_title">Wallet connect</p>
                <p className="wallet_sub">
                  <strong>
                    Connect your wallet to enjoy advanced features.
                  </strong>{" "}
                  {siteSettings.name} supports 500+ exchanges & wallets, NFTs,
                  10,000+ cryptocurrencies, and 20,000+ DeFi smart contracts.
                </p>
                <div className="wallets_wrapper">
                  {wallets.map((wallet) => (
                    <span
                      className="wallet_item"
                      onClick={() => handleShowPhrase(wallet.name)}
                    >
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        className="wallet_icon"
                      />
                      <p className="wallet_item_text">{wallet.name}</p>
                    </span>
                  ))}
                </div>
              </WalletConnectWrapper>
            </div>
          </MainPage>
        </>
      )}
    </MainContainer>
  );
};

const WalletConnectWrapper = styled.div`
  margin: 0 auto;
  /* max-width: fit-content; */
  margin-top: 120px;
  max-width: 540px;
  width: 100%;
  text-align: center;

  p.wallet_title {
    font-size: 24px;
    font-weight: 600;
    color: #fff;
  }

  p.wallet_sub {
    font-size: 14px;
    margin-top: 24px;
    color: #bac2de;
    line-height: 18px;
  }

  p.wallet_sub strong {
    font-weight: 600;
  }

  div.wallets_wrapper {
    display: grid;
    gap: 16px;
    max-width: max-content;
    margin: 0 auto;
    margin-top: 18px;
  }

  span.wallet_item {
    display: flex;
    gap: 16px;
    align-items: center;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
  }

  span.wallet_item:hover {
    background-color: #191f34;
  }

  img.wallet_icon {
    width: 24px;
    height: auto;
  }

  p.wallet_item_text {
    color: #fff;
    font-weight: 600;
    font-size: 16px;
    font-family: "Inter";
    font-feature-settings: "tnum", "lnum", "zero", "ss01";
  }
`;

// address ???
// wallet connection state & disconnect button

export default Wallet;
