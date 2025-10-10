const WhyChooseSection = () => {
  const features = [
    {
      icon: "fa-shield-halved",
      title: "Secure Transactions",
      desc: "Bank-level security with encrypted payments and verified escrow services for complete peace of mind.",
    },
    {
      icon: "fa-chart-line",
      title: "Growth Analytics",
      desc: "Real-time data insights and performance metrics to track your investment portfolio growth.",
    },
    {
      icon: "fa-users",

      title: "Expert Community",
      desc: "Connect with seasoned investors and entrepreneurs in our exclusive networking platform.",
    },
    {
      icon: "fa-bolt",
      title: "Fast Processing",
      desc: "Lightning-fast deal execution with automated workflows and instant notifications.",
    },
    {
      icon: "fa-solid fa-earth-europe",
      title: "Global Marketplace",
      desc: "Access investment opportunities from around the world with multi-currency support.",
    },
  ];

  return (
    <section className="bg-background pb-20 pt-24 -mt-28">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-heading mb-3">
          Why Choose <span className="text-primary">InvestVenture</span>
        </h2>
        <p className="text-paragraph mb-12">
          The most trusted platform for buying and selling investment projects
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 text-left"
            >
              <div className="bg-primary w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <i
                  className={`fa-solid ${feature.icon} text-white text-xl`}
                ></i>
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2">
                {feature.title}
              </h3>
              <p className="text-paragraph text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
