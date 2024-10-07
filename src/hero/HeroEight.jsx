import '../styles/hero/eight.scss'
import Header from "../components/Header"
import FeaturesFive from '../features/FeaturesFive'
import FeaturesTwo from '../features/FeaturesTwo'
import HeaderWhite from '../components/HeaderWhite'

const HeroEight = () => {
  return (
   <>
    <HeaderWhite />

    <div className="hero__eight__container">
        <div className="hero__eight__wrapper">
            {/* <p className="hero__eight__tag">Simple. Trading. Demistified</p> */}
            <h1 className="hero__eight__text">Your gateway to the financial markets</h1>

            <p className="hero__eight__supporting__text">Enjoy complete access to an ever expanding world of trading.</p>

            <span className="hero__eight__buttons">
                {/* <button className="hero__eight__button__white">Learn more</button> */}
                <button className="hero__eight__button__blue">Get started</button>
            </span>
        </div>

        <figure className='hero__eight__rainbow__figure'>
                <img src="/assets/rainbow_bright.png" alt="light" />
            </figure>
    </div>

    <FeaturesTwo />
   </>
  )
}

export default HeroEight