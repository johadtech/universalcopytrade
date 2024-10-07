import '../styles/pricing/two.scss'

const pricingFetures = ["200% ROI", "$10,000 Limit", "24/7 Support", "Plan runs for three days", "Personal account manager"]
const pricingFetures2 = ["300% ROI", "$99,500 Limit", "24/7 Support", "Plan runs for five days", "Personal account manager"]

const PricingTwo = () => {
  return (
    <div className="pricing__two__container">

        <div className="pricing__two__wrapper">
            <div className="pricing__two__text">
            <p className="pricing__two__section__label">Pricing</p>
            <h1 className="pricing__two__section__title">Pricing plans that scale</h1>
            <p className="pricing__two__section__supporting__text">Simple, transparent pricing that grows with you. Try any plan free for 30 days.</p>
            </div>

            <div className="pricing__two__cards">
                <div className="pricing__two__card">

                    <div className="pricing__two__card__top">                
<span>
                    <h1 className='pricing__two__card__price'>$5,000</h1>
                    <p className='pricing__two__card__name'>Lite</p>
</span>

                    </div>

                    <div className="pricing__two__card__mid">
                    <ul className="pricing__two__feature__list">
                            {pricingFetures.map(feature => (
                                <li key={feature} className='pricing__two__feature__item'>
                                        <img src="icons/green-check.svg" alt="check"  className='check'/>
                                    <p>{feature}</p>
                                </li>
                            ))}
                        </ul>
                        </div>  

                    <div className="pricing__two__card__bottom">
                    <button className='pricing__two__card__button'>Get started</button>
                    </div>
                </div>

                <div className="pricing__two__card">

<div className="pricing__two__card__top">                

<span>

<h1 className='pricing__two__card__price'>$11,000</h1>
<p className='pricing__two__card__name'>Starter</p>
</span>

</div>

<div className="pricing__two__card__mid">
<ul className="pricing__two__feature__list">
        {pricingFetures.map(feature => (
            <li key={feature} className='pricing__two__feature__item'>
                    <img src="icons/green-check.svg" alt="check"className='check' />
                <p>{feature}</p>
            </li>
        ))}
    </ul>
    </div>  

<div className="pricing__two__card__bottom">
<button className='pricing__two__card__button'>Get started</button>
</div>
</div>

                <div className="pricing__two__card">

<div className="pricing__two__card__top">                

<span>

<h1 className='pricing__two__card__price'>$100,000</h1>
<p className='pricing__two__card__name'>Pro</p>
</span>

</div>

<div className="pricing__two__card__mid">
<ul className="pricing__two__feature__list">
        {pricingFetures.map(feature => (
            <li key={feature} className='pricing__two__feature__item'>
                    <img src="icons/green-check.svg" alt="check"  className='check'/>
                <p>{feature}</p>
            </li>
        ))}
    </ul>
    </div>  

<div className="pricing__two__card__bottom">
<button className='pricing__two__card__button'>Get started</button>
</div>
                </div>
            </div>
  
        </div>
    </div>
  )
}

export default PricingTwo