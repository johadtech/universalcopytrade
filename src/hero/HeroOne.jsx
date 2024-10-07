import "../styles/hero/one.scss";
import Header from "../components/Header";
import AnimatedText from "react-animated-text-content";

const HeroOne = () => {
  return (
    <>
      <div className="hero__one__container">
        <div className="hero__one__wrapper">
          <div className="hero__one__top">
            <p className="hero__one__label">Trading. Redefined. That's all</p>
            <h1 className="hero__one__title">
              Experience trading, at your fingertips
            </h1>
            <p className="hero__one__text">
              Trade Universal Trade Market with industry’s lowest costs
            </p>

            <button className="hero__one__button"> Get started </button>
          </div>

          <figure className="hero__one__desktop__figure">
            <img src="/screenshots/hero_one_desktop.png" alt="app screenshot" />
          </figure>

          <figure className="hero__one__mobile__figure">
            <img src="/screenshots/hero_one_mobile.png" alt="app screenshot" />
          </figure>
        </div>
      </div>
    </>
  );
};

export default HeroOne;
