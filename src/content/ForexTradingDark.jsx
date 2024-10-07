import { useEffect } from 'react';
import Header from '../components/Header';
import CTAThree from '../cta/CTAThree';
import FooterSeven from '../footer/FooterSeven';
import '../styles/content/forex-dark.scss';

const ForexTradingDark = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

  return (

    <>
    <Header />
    <div className="forex__dark__container">
        <div className="forex__dark__wrapper">
            <div className="forex__dark__intro">
                <p className="forex__dark__intro__tag">Forex Trading</p>

                <h1 className="forex__dark__intro__text">Trade foreign exchange on our platform</h1>

                <p className="forex__dark__intro__supporting"></p>
            </div>

            <div className="forex__dark__content">
                <div className='forex__dark__content__one'>

<p>

                Forex is short for foreign exchange. The forex market is a place where currencies are traded. It is the largest and most liquid financial market in the world with an average daily turnover of 6.6 trillion U.S. dollars as of 2019. The basis of the forex market is the fluctuations of exchange rates. Forex traders speculate on the price fluctuations of currency pairs, making money on the difference between buying and selling prices.
</p>


<h1>

What is Margin?
</h1>

<p>

Margin is the amount of a trader’s funds required to open a new position. Margin is estimated based on the size of your trade, which is measured in lots. A standard lot is 100,000 units. We also provide mini lots (10,000 units), micro lots (1,000 units) and nano lots (100 units). The greater the lot, the bigger the margin amount. Margin allows you to trade with leverage, which, in turn, allows you to place trades larger than the amount of your trading capital. Leverage influences the margin amount too.
</p>


<h1>

What is leverage?
</h1>
<p>

Leverage is the ability to trade positions larger than the amount of capital you possess. This mechanism allows traders to use extra funds from a broker in order to increase the size of their trades. For example, 1:100 leverage means that a trader who has deposited $1,000 into his or her account can trade with $100,000. Although leverage lets traders increase their trade size and, consequently, potential gains, it magnifies their potential losses putting their capital at risk.
</p>


<h1>

When is the forex market open?
</h1>

<p>
Due to different time zones, the international forex market is open 24 hours a day — from 5 p.m. Eastern Standard Time (EST) on Sunday to 4 p.m. EST on Friday, except holidays. Markets first open in Australasia, then in Europe and afterwards in North America. So, when the market closes in Australia, traders can have access to markets in other regions. The 24-hour availability of the forex market is what makes it so attractive to millions of traders.
</p>





                </div>
            </div>
        </div>
    </div>
    <CTAThree />
<FooterSeven />
    </>
  )
}

export default ForexTradingDark