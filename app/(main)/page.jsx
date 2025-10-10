import FeaturesSection from "../components/FeaturesSection";
import Hero from "../components/Hero";
import InvestmentCategories from "../components/InvestmentCategories";
import WhyChooseSection from "../components/WhyChooseSection";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseSection />
      <InvestmentCategories />
      <FeaturesSection />
    </>
  );
}
