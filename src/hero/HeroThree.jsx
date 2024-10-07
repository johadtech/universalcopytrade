import '../styles/hero/three.scss'
import HeaderWhite from "../components/HeaderWhite"
import FeaturesTwo from '../features/FeaturesTwo'
import FeaturesFive from '../features/FeaturesFive'
import FeaturesThree from '../features/FeaturesThree'
import FeaturesFour from '../features/FeaturesFour'
import TestimonialsOne from '../testimonials/TestimonialsOne'
import FooterFive from '../footer/FooterFive'
import FooterThree from '../footer/FooterThree'
import FooterFour from '../footer/FooterFour'
import AssetsOne from '../assets/AssetsOne'
import FooterOne from '../footer/FooterOne'
import FooterTwo from '../footer/FooterTwo'


const HeroThree = () => {
  return (
    <>
    <HeaderWhite />

    <div className="hero__three__container">
      <div className="hero__three__wrapper">
        <div className="hero__three__top">
        <h1 className='hero__three__title'>Financial markets at your fingertips</h1>
        <p className='hero__three__text'>Trade the markets with our secure software and stay on top of your account. Trade anywhere, anytime and from any device</p>

        <button className='hero__three__button'> Get started </button>
        </div>

        <figure className="hero__three__desktop__figure">
          <img src="/screenshots/hero_three_desktop.png" alt="screenshot" />
        </figure>

        <figure className="hero__three__mobile__figure">
          <img src="/screenshots/hero_three_mobile.png" alt="screenshot" />
        </figure>
      </div>
    </div>

    <FeaturesTwo />
    <FeaturesFour />
    <TestimonialsOne />
    <AssetsOne />
    <FooterThree />
    </>
  )
}

export default HeroThree