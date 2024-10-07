import FeaturesFive from '../features/FeaturesFive';
import '../styles/assets/two.scss';

const AssetsTwo = () => {
  return (

    <>
    
    <div className="assets__two__container">
        <div className="assets__two__wrapper">
            <div className="assets__two__top">
                <p className="assets__two__label"> Features </p>
                <h1 className="assets__two__title">  All your financial assets in one place </h1>
                <p className="assets__two__text">Get a stock account, foreign exchange broker and cryptocurrency exchange—in one refreshingly easy solution.</p>
            </div>

            <figure className="assets__two__desktop__figure">
                <img src="/assets/assets_two_desktop.png" alt="screenshot" />
            </figure>

<div className="assets__two__item">
            <figure className="assets__two__mobile__figure">
                <img src="/assets/assets_two_mobile.svg" alt="screenshot" />
            </figure>
            </div>
        </div>
    </div>

    </>

  )
}

export default AssetsTwo