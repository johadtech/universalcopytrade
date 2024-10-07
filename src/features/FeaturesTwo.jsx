import '../styles/features/two.scss'

const featureList = [
    {
        icon: "/icons/live.svg",
        "title": "Live Support",
        "text": "Our representatives are available to assist you at anytime. Or reach us 24/7/365 on Live Chat or by email."
    },
    {
        icon: "/icons/instant.svg",
        "title": "Instant Results",
        "text": "Start seeing instant results with fully automated trading strategies, personal managers and trading guides."
    },
    {
        icon: "/icons/secured.svg",
        "title": "Secured",
        "text": "Utilising top-tier security practices, our platform is able to handle cyberattacks and protect your assets."
    }
]


const FeaturesTwo = () => {
  return (
    <div className="features__two__container">
        <div className="features__two__wrapper">
        {featureList.map(feature => (
            <span className='features__two__feature' key={feature.name}>
                <img src={feature.icon} alt={feature.name} className='features__two__feature__icon'/>
                <p className='features__two__feature__title'>{feature.title}</p>
                <p className='features__two__feature__text'>{feature.text}</p>
            </span>
        ))}
        </div>
    </div>
  )
}

export default FeaturesTwo