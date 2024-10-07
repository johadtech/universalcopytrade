import { useEffect } from "react";
import Header from "../components/Header";
import CTAThree from "../cta/CTAThree";
import FooterSeven from "../footer/FooterSeven";
import "../styles/content/about-dark.scss";

const AboutDark = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <div className="about__dark__container">
        <div className="about__dark__wrapper">
          <div className="about__dark__intro">
            <p className="about__dark__intro__tag">About us</p>
            <h1 className="about__dark__intro__text">
              We bring honesty and transparency to financial services technology
            </h1>
            <p className="about__dark__intro__supporting">
              Welcome to Universal Trade Market, an international online trading
              firm offering 24 hours access to a diverse range of trading
              products including forex currency pairs, commodities, futures,
              indices and stocks.
              <br />
              <br />
              Through Universal Trade Market and the world renowned MetaTrader 5
              trading platform, you can take advantage of high liquidity, low
              spreads, mobile trading, technical analysis and even more.
            </p>
          </div>

          <div className="about__dark__content">
            <section className="about__dark__content__one">
              <div>
                <p>
                  We maintain high standards to keep trading environments
                  secure, and offer the best tailor made trading conditions for
                  every client. We help Forex traders to develop the knowledge
                  and skills they need to trade efficiently and responsibly.
                  <br />
                  <br />
                  With our Daily Market analysis, we bring the freshest market
                  insights to our beloved clients every day. Experience it for
                  yourself!
                </p>

                <h1>Why we’re better</h1>

                <p>
                  Our team is comprised of industry experts who are driven to
                  consistently improve the trading experience through
                  experience.
                  <br />
                  <br />
                  Universal Trade Market Account - The only 1 trading account
                  type for ease of your experience with us.
                  <br />
                  <br />
                  Zero deposit fees. We don't charge any commissions or fees on
                  your deposits and withdrawals.
                  <br />
                  <br />
                  Licensed and Regulated. We respect and abide the industry
                  standards and regulations.
                  <br />
                  <br />
                  Instant account opening and funding. Simple registration form
                  and fast verification.
                </p>
              </div>

              <figure>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"
                  alt="about us"
                />
              </figure>
            </section>
          </div>
        </div>
      </div>
      <CTAThree />
      <FooterSeven />
    </>
  );
};

export default AboutDark;
