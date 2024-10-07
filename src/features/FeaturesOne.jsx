import "../styles/features/one.scss";

const featureList = [
  {
    icon: "/icons/live.svg",
    title: "Live Support",
    text: "Our representatives are available to assist you at anytime. Or reach us 24/7/365 on Live Chat or by email.",
  },
  {
    icon: "/icons/instant.svg",
    title: "Instant Results",
    text: "Start seeing instant results with fully automated trading strategies, personal managers and trading guides.",
  },
  {
    icon: "/icons/secured.svg",
    title: "Secured",
    text: "Utilising top-tier security practices, our platform is able to handle cyberattacks and protect your assets.",
  },
];

const FeaturesOne = () => {
  return (
    <div className="features__one__container">
      <div className="features__one__wrapper">
        <div className="features__one__top">
          <p className="features__one__top__label">Features</p>
          <h1 className="features__one__top__title">
            Financial markets, demistified
          </h1>
          <p className="features__one__top__text">
            Choosing a trading account is always difficult, you need to get
            acquainted with all account types and choose the best one of them.
            At Universal Trade Market, we like to simplify everything for our
            beloved clients. An optimal trading account for all your needs.
          </p>
        </div>

        <div className="features__one__mid">
          <figure className="features__one__mid__figure__desktop">
            <img src="/screenshots/featureone.png" alt="app screenshot" />
          </figure>

          <figure className="features__one__mid__figure__mobile">
            <img
              src="/screenshots/featureone__mobile.png"
              alt="app screenshot"
            />
          </figure>
        </div>

        <div className="features__one__bottom">
          {featureList.map((feature) => (
            <span className="features__one__feature" key={feature.name}>
              <img
                src={feature.icon}
                alt={feature.name}
                className="features__one__feature__icon"
              />
              <p className="features__one__feature__title">{feature.title}</p>
              <p className="features__one__feature__text">{feature.text}</p>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesOne;
