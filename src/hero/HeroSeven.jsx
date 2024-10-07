import '../styles/hero/seven.scss'
import Header from "../components/Header"

const HeroSeven = () => {
  return (
   <>
    <Header />

    <div className="hero__seven__container">
        <div className="hero__seven__wrapper">
            <p className="hero__seven__tag">Simple. Trading. Demistified</p>
            <h1 className="hero__seven__text">There's more than one way to trade</h1>
            <p className="hero__seven__supporting__text">Gain access to all major trading markets on our platfom.</p>
            <span className="hero__seven__buttons">
                <button className="hero__seven__button__white">Learn more</button>
                <button className="hero__seven__button__blue">Get started</button>
            </span>
        </div>
    </div>
   </>
  )
}

export default HeroSeven