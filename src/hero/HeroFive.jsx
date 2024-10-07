import "../styles/hero/five.scss";
import HeaderWhite from "../components/HeaderWhite";
import FeaturesFour from "../features/FeaturesFour";

const HeroFive = () => {
  return (
    <>
      <HeaderWhite />
      <div className="hero__five__container">
        <div className="hero__five__wrapper">
          <div className="hero__five__top">
            <span className="hero__five__tag">
              <p className="hero__five__tag__label">New!</p>
              <span className="hero__five__tag__text">
                <p> Trade NFTs on our platform</p>
                <img src="/icons/arrow-right.svg" alt="right" />
              </span>
            </span>
            <h1 className="hero__five__title">
              A new way to explore the Universal Trade Market
            </h1>
            <p className="hero__five__text">
              Trade the markets with our secure software and stay on top of your
              account. Trade anywhere, anytime and from any device
            </p>

            <button className="hero__five__button"> Get started </button>
          </div>

          <figure className="hero__five__desktop__figure">
            <img src="/screenshots/hero_five_desktop.png" alt="screenshot" />
          </figure>

          <figure className="hero__five__mobile__figure">
            <img src="/screenshots/hero_three_mobile.png" alt="screenshot" />
          </figure>
        </div>
      </div>

      <FeaturesFour />
    </>
  );
};

export default HeroFive;
