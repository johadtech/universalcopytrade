import '../styles/footer/eight.scss'
import {Link} from 'react-router-dom'

// const footerLinks = ["Overview", "Features", "Pricing", "Careers", "Help", "Privacy"]

const footerLinks =[
    {
    name: "About us",
    link: "/about"
    },
    {
        name: "FAQs",
        link: "/faq"
    },
    {
        name: "Privacy Policy",
        link: "/privacy"
    },
    {
        name: "Terms of Service",
        link: "/tos"
    },
    // {
    //     name: "Copy Trading",
    //     link: "/copy"
    // },
]



const FooterEight = () => {
  return (
    <>
        <div className="footer__eight__cta__container">
            <div className='footer__eight__cta__wrapper'>
                <h1 className='footer__eight__cta__title'>Open an account now</h1>
                <p className='footer__eight__cta__text'>In order to verify your identity, a government issued ID card with your photo, name, and date of birth is required. Please have the documents prepared in advance.</p>
                <span className='footer__eight__buttons'>
                    {/* <button className="footer__eight__button__white">Learn more</button> */}
                    <button className="footer__eight__button__blue">Get started</button>
                </span>
            </div>


            <hr className='footer__eight__hr'/>
        </div>

      

        <div className="footer__eight__container">

      

        <div className="footer__eight__wrapper">

                <span className='footer__eight__brand'>
                    <img src="/logos/one.svg" alt="logo" className='footer__eight__brand__logo' />

                    <p className='footer__eight__brand__text'>Explore an ever expanding world of trading</p>

                        <ul className='footer__eight__brand__links'>
                        {footerLinks.map(link => (
                            <Link to={link.link} className='footer__eight__brand__link' key={link.name}>
                                <p>{link.name}</p>
                            </Link>
                        ))}
                        </ul>
                   
                </span>

                <span className='footer__eight__disclaimer'> The risk of loss in online trading of stocks, options, futures, currencies, foreign equities, and fixed Income can be substantial.
                <br />
                <br />
                Options involve risk and are not suitable for all investors. For more information read the Characteristics and Risks of Standardized Options, also known as the options disclosure document (ODD). Alternatively, call 312-542-6901 to receive a copy of the ODD. Before trading, clients must read the relevant risk disclosure statements on our Warnings and Disclosures page. Trading on margin is only for experienced investors with high risk tolerance. You may lose more than your initial investment. For additional information about rates on margin loans, please see Margin Loan Rates. Security futures involve a high degree of risk and are not suitable for all investors. The amount you may lose may be greater than your initial investment. Before trading security futures, read the Security Futures Risk Disclosure Statement. Structured products and fixed income products such as bonds are complex products that are more risky and are not suitable for all investors. Before trading, please read the Risk Warning and Disclosure Statement.</span>


                <span className='footer__eight__bottom'>
                <hr />


                <p className='footer__eight__reserved'>© 2077 Untitled UI. All rights reserved.</p>          
                </span>

        </div>

        </div>
    </>
  )
}

export default FooterEight