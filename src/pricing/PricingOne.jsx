import '../styles/pricing/one.scss'

const pricingFetures = ["200% ROI", "$10,000 Limit", "24/7 Support", "Plan runs for three days", "Personal account manager"]
const pricingFetures2 = ["300% ROI", "$99,500 Limit", "24/7 Support", "Plan runs for five days", "Personal account manager"]

const PricingOne = () => {
  return (
    <div className="pricing__one__container">

        <div className="pricing__one__wrapper">
            <div className="pricing__one__text">
            <p className="pricing__one__section__label">Pricing</p>
            <h1 className="pricing__one__section__title">Pricing plans that scale</h1>
            <p className="pricing__one__section__supporting__text">Simple, transparent pricing that grows with you. Try any plan free for 30 days.</p>
            </div>

            <div className="pricing__one__cards">
                <div className="pricing__one__card">

                    <div className="pricing__one__card__top">                
                    <figure>
                    <img src="/icons/lite.svg" alt="" />
                    </figure>

<span>

                    <p className='pricing__one__card__name'>Lite</p>
                    <h1 className='pricing__one__card__price'>$5,000</h1>
</span>

                    </div>

                    <div className="pricing__one__card__mid">
                    <ul className="pricing__one__feature__list">
                            {pricingFetures.map(feature => (
                                <li key={feature} className='pricing__one__feature__item'>
                                        <img src="icons/purple-check.svg" alt="check" />
                                    <p>{feature}</p>
                                </li>
                            ))}
                        </ul>
                        </div>  

                    <div className="pricing__one__card__bottom">
                    <button className='pricing__one__card__button'>Get started</button>
                    </div>
                </div>

                <div className="pricing__one__card">

<div className="pricing__one__card__top">                
<figure>
<img src="/icons/starter.svg" alt="" />
</figure>

<span>

<p className='pricing__one__card__name'>Starter</p>
<h1 className='pricing__one__card__price'>$11,000</h1>
</span>

</div>

<div className="pricing__one__card__mid">
<ul className="pricing__one__feature__list">
        {pricingFetures.map(feature => (
            <li key={feature} className='pricing__one__feature__item'>
                    <img src="icons/purple-check.svg" alt="check" />
                <p>{feature}</p>
            </li>
        ))}
    </ul>
    </div>  

<div className="pricing__one__card__bottom">
<button className='pricing__one__card__button'>Get started</button>
</div>
</div>
            </div>
  
        </div>
    </div>
  )
}

export default PricingOne