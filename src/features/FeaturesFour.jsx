import '../styles/features/four.scss'

const featureList = [
    {
        icon: "/icons/featuresfour_live.svg",
        title: "Live Support",
        text: "Our representatives are available to assist you at anytime. Or reach us 24/7/365 on Live Chat or by email."
    },
    {
        icon: "/icons/featuresfour_instant.svg",
        title: "Instant Results",
        text: "Start seeing instant results with fully automated trading strategies, personal managers and trading guides."
    },
    {
        icon: "/icons/featuresfour_secured.svg",
        title: "Secured",
        text: "Utilising top-tier security practices, our platform is able to handle cyberattacks and protect your assets."
    },
    {
        icon: "/icons/featuresfour_fully.svg",
        title: "Fully tested",
        text: "Our managers, resources, tools and platform have been tested and guaranteed to give you the best possible results."
    },

]

const FeaturesFour = () => {
  return (
   <div className="features__four__container">
    <div className="features__four__wrapper">

    <div className="features__four__top">
        <p className='features__four__top__label'>Everything you need</p>
        <h1 className='features__four__top__title'>All-in-one platform</h1>
        <p className='features__four__top__text'>A full feature platform that handles everything you may need.</p>
    </div>

    <div className="features__four__bottom">
    {featureList.map(feature => (
        <span key={feature.title} className="features__four__feature">
            <img src={feature.icon} alt={feature.name} className='features__four__feature__icon' />
            <p className='features__four__feature__title'>{feature.title}</p>
            <p className='features__four__feature__text'>{feature.text}</p>

            <span className='features__four__feature__link'>
                <p>Get started</p>
                <img src="/icons/arrow-left.svg" alt="arror" />
            </span>
        </span>
    ))}
    </div>

    </div>
   </div>
  )
}

export default FeaturesFour