import { useEffect } from 'react';
import Header from '../components/Header';
import HeaderWhite from '../components/HeaderWhite';
import CTAOne from '../cta/CTAOne';
import CTAThree from '../cta/CTAThree';
import FooterEight from '../footer/FooterEight';
import FooterOne from '../footer/FooterOne';
import FooterSeven from '../footer/FooterSeven';
import '../styles/content/faq-dark.scss';

const questions = [
    {
        title: "How do I open an account?",
        text: "Our account registration process is as easy as clicking a 'Get Started' button anywhere on our website. They will all take you to the account registration page, or your dashboard if you have already logged in."
    },
    {
        title: "How do I make a deposit?",
        text: "Once logged into your account, you will find a 'deposit' panel as an option in the sidebar of your dashboard. This will enable you deposit really quickly."
    }, 
    // {
    //     title: "Can I withdraw my money whenever I want?",
    //     text: "Defenitely, all of your funds are for you to access and spend however you choose. Some Foreign Exchange trades however do require a margin, which means that your funds may be held in a trade tempoarily. Also, you cannot withdraw funds from your practice account."
    // },
    {
        title: "What trading options are available?",
        text: "We offer a wide vareity of options spanning accross forex, including stocks and cryptocurrencies. We also offer practice accounts to demo your trades before taking on serious trades with a live one."
    },
    {
        title: "What is copy trading?",
        text: "Copy trading is most useful for those that do not wish to trade on their own or with an account manager. With copy trading, you can select from a list of specially selected traders and directly copy every trade they place."
    },
    {
        title: "How does staking work?",
        text: "Staking your crypto allows you to tap into the power of the blockchain decentralization and make profits. Your crypto is placed in a pool of traders and you earn on daily basis in the pool."
    }, 
    {
        title: "How do I create a demo account?",
        text: "Demo accounts (called Practice accounts in your dashboard) are available to you by default. We automatically create them for you and funding them is as simple as tapping a button. That's what it actually is!"
    }
]

const FAQDark = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

  return (
    <>
   <Header />
    <div className="faq__dark__container">
        <div className="faq__dark__wrapper">
            <div className="faq__dark__intro">
                <div className="faq__dark__intro__title">FAQs</div>
                <div className="faq__dark__intro__text">Everything you need to know about our platform. Can’t find the answer you’re looking for? Please chat to our team.</div>
            </div>

            <div className="faq__dark__content">
               {questions.map(question => (
                <span className='faq__dark__question'>
                    <h1>{question.title}</h1>
                    <p>{question.text}</p>
                </span>
               ))}
            </div>
        </div>
    </div>
    <CTAThree />
    <FooterSeven />
    </>
  )
}

export default FAQDark