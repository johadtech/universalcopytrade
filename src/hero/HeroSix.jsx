import "../styles/hero/six.scss";
import Header from "../components/Header";
import FeaturesFive from "../features/FeaturesFive";

const HeroSix = () => {
  return (
    <>
      <div className="hero__six__container">
        <div className="hero__six__wrapper">
          {/* <p className="hero__six__tag">Simple. Trading. Demistified</p> */}
          {/* <h1 className="hero__six__text">Your gateway to financial markets</h1> */}
          <h1 className="hero__six__text">
            {/* <span>Your gateway to</span> */}
            <span> {""} Your</span>
            <span> {""} gateway</span>
            {/* <span> {""} gateway</span> */}
            <span> {""} to</span>
            <span> {""} global</span>
            <span> {""} financial </span>
            <span> {""} markets </span>
            {/* <span>to</span>
                <span>financial</span>
                <span>markets</span> */}
          </h1>

          <p className="hero__six__supporting__text">
            Enjoy complete access to an ever expanding world of trading.
          </p>

          <span className="hero__six__buttons">
            {/* <button className="hero__six__button__white">Learn more</button> */}

            <a href="https://universalcopytrade.com/login">
              <button className="cta__three__button__blue">Get started</button>
            </a>
          </span>

          <figure className="hero__six__rainbow__figure">
            <img src="/assets/rainbow.png" alt="light" />
          </figure>
        </div>
      </div>
    </>
  );
};

export default HeroSix;
