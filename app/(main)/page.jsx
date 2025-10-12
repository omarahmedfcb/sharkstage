import Banner from "./Banner";
import Hero from "./Hero";
import InvestmentCategories from "./InvestmentCategories";
import Numbers from "./Numbers";
import ReadySection from "./ReadySection";
import WhyChooseSection from "./WhyChooseSection";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChooseSection />
      <Numbers />
      <InvestmentCategories />
      <Banner />
      <ReadySection />
    </>
  );
}
