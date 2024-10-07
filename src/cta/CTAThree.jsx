import "../styles/cta/three.scss";

const CTAThree = () => {
  return (
    <div className="cta__three__container">
      <div className="cta__three__wrapper">
        <h1 className="cta__three__text">Start your trading journey now</h1>
        <p className="cta__three__supporting__text">
          It’s easy to get started. Sign up today to start trading with us.
        </p>
        <div className="cta__three__buttons">
          <a href="https://universalcopytrade.com/login">
            <button className="cta__three__button__white">Learn more</button>
          </a>

          <a href="https://universalcopytrade.com/login">
            <button className="cta__three__button__blue">Get Started</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CTAThree;
