import '../styles/assets/one.scss'


const features = ["Stocks", "Cryptocurrencies", "Foreign Exchange"]

const AssetsOne = () => {
  return (
    <div className="assets__one__container">
        <div className="assets__one__wrapper">
            <div className="assets__one__top">
                <h1 className="assets__one__title"> Get started in 5 minutes </h1>

                <div className="assets__one__features">
                    {features.map(feature => (

                        <span className='assets__one__feature' key={feature}>
                            <img src="icons/assets_check_icon.svg" alt={feature}/>
                        <p>{feature}</p>
                        </span>
                      
                    ))}
                </div>

                <div className="assets__one__buttons">
                    <button className="assets__one__button__white">Learn more</button>
                    <button className="assets__one__button__blue">Get started</button>
                </div>
            </div>

            <figure className="assets__one__desktop__figure">
            <img src="/assets/assets_one_desktop.png" alt="screenshot" />
            </figure>

            <figure className="assets__one__mobile__figure">
            <img src="/assets/assets_one_mobile.png" alt="screenshot" />
            </figure>


        </div>
    </div>
  )
}

export default AssetsOne