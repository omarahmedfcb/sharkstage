import Banner from "../components/Banner";
import FeaturesSection from "../components/FeaturesSection";
import Hero from "../components/Hero";
import InvestmentCategories from "../components/InvestmentCategories";
import Numbers from "../components/Numbers";
import ReadySection from "../components/ReadySection";
import WhyChooseSection from "../components/WhyChooseSection";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseSection />
      <Numbers />
      <InvestmentCategories />
      {/* <FeaturesSection /> */}
      <Banner />
      <ReadySection />
    </>
  );
}
