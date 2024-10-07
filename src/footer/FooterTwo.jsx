import CTAOne from '../cta/CTAOne'
import '../styles/footer/two.scss'

const footerLinks = ["Overview", "Features", "Pricing", "Careers", "Help", "Privacy"]

const FooterTwo = () => {
  return (
    <>
        <div className="footer__two__cta">
            <div className='footer__two__cta__container'>
            <CTAOne />
            </div>
        </div>

        <div className="footer__two__container">
        <div className="footer__two__wrapper">

                <span className='footer__two__brand'>
                    <img src="/logos/one.svg" alt="logo" className='footer__two__brand__logo' />

                        <ul className='footer__two__brand__links'>
                        {footerLinks.map(link => (
                            <li key={link} className='footer__two__brand__link'> <p>{link}</p> </li>
                        ))}
                        </ul>
                   
                </span>

                <span className='footer__two__disclaimer'> The risk of loss in online trading of stocks, options, futures, currencies, foreign equities, and fixed Income can be substantial.
                <br />
                <br />
                Options involve risk and are not suitable for all investors. For more information read the Characteristics and Risks of Standardized Options, also known as the options disclosure document (ODD). Alternatively, call 312-542-6901 to receive a copy of the ODD. Before trading, clients must read the relevant risk disclosure statements on our Warnings and Disclosures page. Trading on margin is only for experienced investors with high risk tolerance. You may lose more than your initial investment. For additional information about rates on margin loans, please see Margin Loan Rates. Security futures involve a high degree of risk and are not suitable for all investors. The amount you may lose may be greater than your initial investment. Before trading security futures, read the Security Futures Risk Disclosure Statement. Structured products and fixed income products such as bonds are complex products that are more risky and are not suitable for all investors. Before trading, please read the Risk Warning and Disclosure Statement.</span>


                <span className='footer__two__bottom'>
                <hr />


                <p className='footer__two__reserved'>© 2077 Untitled UI. All rights reserved.</p>          
                </span>

        </div>

        </div>
    </>
  )
}

export default FooterTwo