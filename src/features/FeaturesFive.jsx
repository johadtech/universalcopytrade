import "../styles/features/five.scss";

const featureList = [
  {
    icon: "/icons/featuresfive_live.svg",
    title: "Live Support",
    text: "Our representatives are available to assist you at anytime. Or reach us 24/7/365 on Live Chat or by email.",
  },
  {
    icon: "/icons/featuresfive_easy.svg",
    title: "Easy Access",
    text: "We provide easy access to financial markets, your assets and other financial tools.",
  },
  {
    icon: "/icons/featuresfive_secured.svg",
    title: "Secured",
    text: "Utilising top-tier security practices, our platform is able to handle cyberattacks and protect your assets.",
  },
];

const FeaturesFive = () => {
  return (
    <div className="features__five__container">
      <div className="features__five__wrapper">
        <div className="features__five__top">
          <p className="features__five__top__label">Features</p>
          <h1 className="features__five__top__title">
            Financial markets, simplified
          </h1>
          <p className="features__five__top__text">
            Choosing a trading account is always difficult, you need to get
            acquainted with all account types and choose the best one of them.
            At Universal Trade Market, we like to simplify everything for our
            beloved clients. An optimal trading account for all your needs.
          </p>
        </div>

        <div className="features__five__bottom">
          <div className="features__five__features">
            {featureList.map((feature) => (
              <span className="features__five__feature">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="features__five__feature__icon"
                />
                <span>
                  <p className="features__five__feature__title">
                    {feature.title}
                  </p>
                  <p className="features__five__feature__text">
                    {feature.text}
                  </p>
                </span>
              </span>
            ))}
          </div>

          <figure className="features__five__image">
            <img src="/assets/featuresfive_assets.png" alt="assets" />
          </figure>
        </div>
      </div>
    </div>
  );
};

export default FeaturesFive;
