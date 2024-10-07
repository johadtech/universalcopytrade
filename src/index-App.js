import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import AssetsOne from "./assets/AssetsOne";
import AssetsTwo from "./assets/AssetsTwo";
import Header from "./components/Header";
import AboutDark from "./content/AboutDark";
//import AboutUs from "./content/AboutUs";
//import CopyExperts from "./content/CopyExperts";
import CopyExpertsDark from "./content/CopyExpertsDark";
//import CryptoTrading from "./content/CryptoTrading";
import CryptoTradingDark from "./content/CryptoTradingDark";
//import FAQ from "./content/FAQ";
import FAQDark from "./content/FAQDark";
//import ForexTrading from "./content/ForexTrading";
import ForexTradingDark from "./content/ForexTradingDark";
//import Privacy from "./content/Privacy";
import PrivacyDark from "./content/PrivacyDark";
//import StockTrading from "./content/StockTrading";
import StockTradingDark from "./content/StockTradingDark";
//import TermsOfService from "./content/TermsOfService";
import TermsOfServiceDark from "./content/TermsOfServiceDark";
import CTAOne from "./cta/CTAOne";
import CTAThree from "./cta/CTAThree";
import CTATwo from "./cta/CTATwo";
import FeaturesFive from "./features/FeaturesFive";
import FeaturesFour from "./features/FeaturesFour";
import FeaturesOne from "./features/FeaturesOne";
import FeaturesThree from "./features/FeaturesThree";
import FeaturesTwo from "./features/FeaturesTwo";
import FooterEight from "./footer/FooterEight";
import FooterFive from "./footer/FooterFive";
import FooterFour from "./footer/FooterFour";
import FooterOne from "./footer/FooterOne";
import FooterSeven from "./footer/FooterSeven";
import FooterSix from "./footer/FooterSix";
import FooterThree from "./footer/FooterThree";
import FooterTwo from "./footer/FooterTwo";
import HeroEight from "./hero/HeroEight";
import HeroFive from "./hero/HeroFive";
import HeroFour from "./hero/HeroFour";
import HeroOne from "./hero/HeroOne";
import HeroSeven from "./hero/HeroSeven";
import HeroSix from "./hero/HeroSix";
import HeroThree from "./hero/HeroThree";
import HeroTwo from "./hero/HeroTwo";
import Main from "./Main";
import PricingOne from "./pricing/PricingOne";
import PricingTwo from "./pricing/PricingTwo";
import StatsOne from "./stats/StatsOne";
import TestimonialsOne from "./testimonials/TestimonialsOne";
import TestimonialsTwo from "./testimonials/TestimonialsTwo";

function App() {
  return (
    <Router>
      <Routes>
        {/* Root */}
        <Route path="/" element={<Main />} />

        {/* Header */}
        <Route path="/header" element={<Header />} />

        {/* Hero */}
        <Route path="/heroone" element={<HeroOne />} />
        <Route path="/herotwo" element={<HeroTwo />} />
        <Route path="/herothree" element={<HeroThree />} />
        <Route path="/herofour" element={<HeroFour />} />
        <Route path="/herofive" element={<HeroFive />} />
        <Route path="/herosix" element={<HeroSix />} />
        <Route path="/heroseven" element={<HeroSeven />} />
        <Route path="/heroeight" element={<HeroEight />} />

        {/* Pricing */}
        <Route path="/pricingone" element={<PricingOne />} />
        <Route path="/pricingtwo" element={<PricingTwo />} />

        {/* Testimonials */}
        <Route path="/testimonialsone" element={<TestimonialsOne />} />
        <Route path="/testimonialstwo" element={<TestimonialsTwo />} />

        {/* Features */}
        <Route path="/featuresone" element={<FeaturesOne />} />
        <Route path="/featurestwo" element={<FeaturesTwo />} />
        <Route path="/featuresthree" element={<FeaturesThree />} />
        <Route path="/featuresfour" element={<FeaturesFour />} />
        <Route path="/featuresfive" element={<FeaturesFive />} />

        {/* CTA */}
        <Route path="/ctaone" element={<CTAOne />} />
        <Route path="/ctatwo" element={<CTATwo />} />
        <Route path="/ctathree" element={<CTAThree />} />

        {/* Footer */}
        <Route path="/footerone" element={<FooterOne />} />
        <Route path="/footertwo" element={<FooterTwo />} />
        <Route path="/footerthree" element={<FooterThree />} />
        <Route path="/footerfour" element={<FooterFour />} />
        <Route path="/footerfive" element={<FooterFive />} />
        <Route path="/footersix" element={<FooterSix />} />
        <Route path="/footerseven" element={<FooterSeven />} />
        <Route path="/footereight" element={<FooterEight />} />

        {/* Assets */}
        <Route path="/assetsone" element={<AssetsOne />} />
        <Route path="/assetstwo" element={<AssetsTwo />} />

        {/* Stats */}
        <Route path="/statsone" element={<StatsOne />} />

        {/* Content */}
        {/* <Route path="/about" element={<AboutUs />} />
        <Route path="/copy" element={<CopyExperts />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tos" element={<TermsOfService />} />
        <Route path="/faq" element={<FAQ />} /> */}

        <Route path="/about" element={<AboutDark />} />
        <Route path="/copy" element={<CopyExpertsDark />} />
        <Route path="/privacy" element={<PrivacyDark />} />
        <Route path="/tos" element={<TermsOfServiceDark />} />
        <Route path="/faq" element={<FAQDark />} />

        {/* Content - dark */}
        <Route path="/copy-dark" element={<CopyExpertsDark />} />
        <Route path="/about-dark" element={<AboutDark />} />
        <Route path="/privacy-dark" element={<PrivacyDark />} />
        <Route path="/tos-dark" element={<TermsOfServiceDark />} />
        <Route path="/faq-dark" element={<FAQDark />} />

        {/* Trading */}
        {/* <Route path="/forex" element={<ForexTrading />} /> */}
        {/* <Route path="/crypto" element={<CryptoTrading />} /> */}
        {/* <Route path="/stocks" element={<StockTrading />} /> */}

        <Route path="/forex" element={<ForexTradingDark />} />
        <Route path="/crypto" element={<CryptoTradingDark />} />
        <Route path="/stocks" element={<StockTradingDark />} />
      </Routes>
    </Router>
  );
}

export default App;
