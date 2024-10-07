import '../styles/hero/four.scss'
import Header from "../components/Header"

const HeroFour = () => {
  return (
    <>
    <div className="hero__four__container">
      <div className="hero__four__wrapper">
        <div className="hero__four__top">
        <h1 className='hero__four__title'>Financial markets at your fingertips</h1>
        <p className='hero__four__text'>Trade the markets with our secure software and stay on top of your account. Trade anywhere, anytime and from any device</p>

        <button className='hero__four__button'> Get started </button>
        </div>

        <figure className="hero__four__desktop__figure">
          <img src="/screenshots/hero_three_desktop.png" alt="screenshot" />
        </figure>

        <figure className="hero__four__mobile__figure">
          <img src="/screenshots/hero_three_mobile.png" alt="screenshot" />
        </figure>
      </div>
    </div>
    </>
  )
}

export default HeroFour