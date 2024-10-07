import '../styles/features/three.scss'

const featureList = [
    {
        title: "Cryptocurrencies",
        text: "You can trade, exchange and earn in major crypto assets on our platform."
    },
    {
        title: "Foreign Exchange",
        text: "Our platform allows you to trade in major Foreign Exchange pairs with realtime rates."
    },
    {
        title: "Stocks",
        text: "We got AAPL, FB, NFLX, GOOGL, AMZN, TESLA and are ready to add stock pairs on request."
    },
    {
        title: "Notifications",
        text: "Get informed in realtime when your trades and other actions are complete."
    },
    {
        title: "Security",
        text: "Utilising top-tier security practices, our platform is able to protect your assets."
    },
    {
        title: "Support",
        text: "We have quick support available to assist with any service you may require."
    },
]

const FeaturesThree = () => {
  return (
   <div className="features__three__container">
    <div className="features__three__wrapper">

        <div className="features__three__top">
        <p className='features__three__top__label'>Everything you need</p>
        <h1 className='features__three__top__title'>All-in-one platform</h1>
        <p className='features__three__top__text'>A full feature platform that handles everything you may need.</p>
        </div>

        <div className="features__three__features">
        {featureList.map(feature => (
            <span className='features__three__feature' key={feature.title}>
                <img src="icons/Featurecheck.svg" alt="checkmark" className='features__three__checkmark'/>
                <p className='features__three__feature__title'>{feature.title}</p>
                <p className='features__three__feature__text'>{feature.text}</p>
            </span>
        ))}
        </div>

    </div>
   </div>
  )
}

export default FeaturesThree