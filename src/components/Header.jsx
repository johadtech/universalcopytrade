import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/components/header.scss";

// products extra = "Copy Trading"
// company extra = "About us, privacy policy"
// resources extra = "FAQs, Terms of Service"

const productsExtra = [
  {
    icon: "/extra/magic.svg",
    title: "Copy Trading",
    desc: "Experience the power of social trading",
    link: "/copy",
  },
];

const companyExtra = [
  {
    icon: "/extra/flag.svg",
    title: "About us",
    desc: "Learn more about our mission",
    link: "/about",
  },
  {
    icon: "/extra/smile.svg",
    title: "Privacy Policy",
    desc: "Learn we handle your data",
    link: "/privacy",
  },
];

const resourcesExtra = [
  {
    icon: "/extra/book.svg",
    title: "FAQ",
    desc: "Questions we get asked most",
    link: "/faq",
  },
  {
    icon: "/extra/dollar.svg",
    title: "Stock Trading",
    desc: "Trading the stock markets",
    link: "/stocks",
  },
  {
    icon: "/extra/bank.svg",
    title: "Forex Trading",
    desc: "Trading foreign exchange",
    link: "/forex",
  },
  {
    icon: "/extra/eth.svg",
    title: "Crypto Trading",
    desc: "Trading cryptocurrencies",
    link: "/crypto",
  },
];

const Header = () => {
  const [activeDesktopMenu, setActiveDesktopMenu] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState(null);

  const navigate = useNavigate();
  const links = ["Products", "Company", "Resources"];

  function handleMobileMenu(name) {
    if (activeMobileMenu && activeMobileMenu === name) {
      setActiveMobileMenu(null);
    } else {
      setActiveMobileMenu(name);
    }
  }

  return (
    <div className="header__container">
      <div className="header__wrapper">
        <div className="header__left">
          <Link to="/">
            <img src="/logo.svg" alt="logo" className="header__logo" />
          </Link>

          <span className="header__links">
            {links.map((link) => (
              <p
                className="header__link"
                key={link}
                onMouseEnter={() => setActiveDesktopMenu(link)}
              >
                {link}
              </p>
            ))}
          </span>
        </div>

        <div
          className="hamburger__wrapper"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {!mobileMenu && (
            <img
              src="/icons/hamburger.svg"
              alt="hamburger menu"
              className="hamburger"
            />
          )}
          {mobileMenu && (
            <img
              src="/icons/close.svg"
              alt="close menu"
              className="hamburger"
            />
          )}
        </div>

        <div className="header__buttons">
          <button className="header__button__transparent">
            <a href="https://app.universaltrademarket.com">Log In</a>
          </button>
          <button className="header__button__blue">
            <a href="https://app.universaltrademarket.com">Sign up</a>
          </button>
        </div>
      </div>

      {activeDesktopMenu === "Resources" && (
        <div
          className="menu__desktop__resources"
          onMouseEnter={() => setActiveDesktopMenu("Resources")}
          onMouseLeave={() => setActiveDesktopMenu(null)}
        >
          {resourcesExtra.map((extra) => (
            <Link
              to={extra.link}
              key={extra.title}
              className="menu__desktop__extra"
            >
              <img src={extra.icon} alt="icon" />
              <span>
                <p className="extra__desktop__title">{extra.title}</p>
                <p className="extra__desktop__desc">{extra.desc}</p>
              </span>
            </Link>
          ))}
        </div>
      )}

      {activeDesktopMenu === "Company" && (
        <div
          className="menu__desktop__company"
          onMouseEnter={() => setActiveDesktopMenu("Company")}
          onMouseLeave={() => setActiveDesktopMenu(null)}
        >
          {companyExtra.map((extra) => (
            <Link
              to={extra.link}
              key={extra.title}
              className="menu__desktop__extra"
            >
              <img src={extra.icon} alt="icon" />
              <span>
                <p className="extra__desktop__title">{extra.title}</p>
                <p className="extra__desktop__desc">{extra.desc}</p>
              </span>
            </Link>
          ))}
        </div>
      )}

      {activeDesktopMenu === "Products" && (
        <div
          className="menu__desktop__products"
          onMouseEnter={() => setActiveDesktopMenu("Products")}
          onMouseLeave={() => setActiveDesktopMenu(null)}
        >
          {productsExtra.map((extra) => (
            <Link
              to={extra.link}
              key={extra.title}
              className="menu__desktop__extra"
            >
              <img src={extra.icon} alt="icon" />
              <span>
                <p className="extra__desktop__title">{extra.title}</p>
                <p className="extra__desktop__desc">{extra.desc}</p>
              </span>
            </Link>
          ))}
        </div>
      )}

      {mobileMenu && (
        <div className="menu__mobile__wrapper">
          <div className="menu__mobile">
            <div className="mobile__menu__top">
              <p className="menu__item">Home</p>
              <span
                className="menu__item__with__icon"
                onClick={() => handleMobileMenu("Company")}
              >
                <p>Company</p>
                {activeMobileMenu !== "Company" && (
                  <img src="/icons/down-chev.svg" alt="down" />
                )}
                {activeMobileMenu === "Company" && (
                  <img src="/icons/up-chev.svg" alt="down" />
                )}
              </span>

              {activeMobileMenu === "Company" && (
                <div className="embedded__mobile__menu">
                  <p className="embedded__mobile__menu__title">Company</p>
                  <span className="embedded__mobile__menu__list">
                    {companyExtra.map((extra) => (
                      <Link
                        to={extra.link}
                        key={extra.title}
                        className="embedded__mobile__menu__item"
                      >
                        <img src={extra.icon} alt={extra.title} />
                        <p>{extra.title}</p>
                      </Link>
                    ))}
                  </span>
                </div>
              )}

              <span
                className="menu__item__with__icon"
                onClick={() => handleMobileMenu("Products")}
              >
                <p>Products</p>
                {activeMobileMenu !== "Products" && (
                  <img src="/icons/down-chev.svg" alt="down" />
                )}
                {activeMobileMenu === "Products" && (
                  <img src="/icons/up-chev.svg" alt="down" />
                )}
              </span>

              {activeMobileMenu === "Products" && (
                <div className="embedded__mobile__menu">
                  <p className="embedded__mobile__menu__title">Products</p>
                  <span className="embedded__mobile__menu__list">
                    {productsExtra.map((extra) => (
                      <Link
                        to={extra.link}
                        key={extra.title}
                        className="embedded__mobile__menu__item"
                      >
                        <img src={extra.icon} alt={extra.title} />
                        <p>{extra.title}</p>
                      </Link>
                    ))}
                  </span>
                </div>
              )}

              <span
                className="menu__item__with__icon"
                onClick={() => handleMobileMenu("Resources")}
              >
                <p>Resources</p>
                {activeMobileMenu !== "Resources" && (
                  <img src="/icons/down-chev.svg" alt="down" />
                )}
                {activeMobileMenu === "Resources" && (
                  <img src="/icons/up-chev.svg" alt="up" />
                )}
              </span>

              {activeMobileMenu === "Resources" && (
                <div className="embedded__mobile__menu">
                  <p className="embedded__mobile__menu__title">Resources</p>
                  <span className="embedded__mobile__menu__list">
                    {resourcesExtra.map((extra) => (
                      <Link
                        to={extra.link}
                        key={extra.title}
                        className="embedded__mobile__menu__item"
                      >
                        <img src={extra.icon} alt={extra.title} />
                        <p>{extra.title}</p>
                      </Link>
                    ))}
                  </span>
                </div>
              )}
            </div>

            <hr />

            <div className="mobile__menu__bottom">
              <Link to="/about">About us</Link>
              <Link to="/faq">Frequently Asked Questions</Link>
            </div>

            <div className="header__buttons__mobile">
              <button className="header__button__transparent">
                <a href="https://app.universaltrademarket.com">Log In</a>
              </button>
              <button className="header__button__blue">
                <a href="https://app.universaltrademarket.com">Sign up</a>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
