import "../styles/hero/two.scss";
import HeaderWhite from "../components/HeaderWhite";

const HeroTwo = () => {
  return (
    <>
      <HeaderWhite />
      <div className="hero__two__container">
        <div className="hero__two__wrapper">
          <div className="hero__two__top">
            <p className="hero__two__label">Trading. Redefined. That's all</p>
            <h1 className="hero__two__title">
              Experience trading, at your fingertips
            </h1>
            <p className="hero__two__text">
              Trade Universal Trade Market with industry’s lowest costs
            </p>

            <button className="hero__two__button"> Get started </button>
          </div>

          <figure className="hero__two__desktop__figure">
            <img src="/screenshots/hero_one_desktop.png" alt="app screenshot" />
          </figure>

          <figure className="hero__two__mobile__figure">
            <img src="/screenshots/hero_one_mobile.png" alt="app screenshot" />
          </figure>
        </div>
      </div>
    </>
  );
};

export default HeroTwo;
