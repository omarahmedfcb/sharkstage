import {
  Building2,
  Smartphone,
  Leaf,
  Cog,
  ShoppingBag,
  Rocket,
} from "lucide-react";

export default function InvestmentCategories() {
  const categories = [
    {
      icon: <Building2 className="w-8 h-8 text-white" />,
      bg: "bg-blue-500",
      title: "Real Estate",
      desc: "Commercial and residential property investments",
      projects: "127 Projects",
      roi: "12-25%",
    },
    {
      icon: <Smartphone className="w-8 h-8 text-white" />,
      bg: "bg-purple-500",
      title: "Technology",
      desc: "SaaS, apps, and digital product ventures",
      projects: "234 Projects",
      roi: "12-25%",
    },
    {
      icon: <Leaf className="w-8 h-8 text-white" />,
      bg: "bg-green-500",
      title: "Green Energy",
      desc: "Sustainable and renewable energy projects",
      projects: "89 Projects",
      roi: "12-25%",
    },
    {
      icon: <Cog className="w-8 h-8 text-white" />,
      bg: "bg-orange-500",
      title: "AI & Automation",
      desc: "Machine learning and automation solutions",
      projects: "156 Projects",
      roi: "12-25%",
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-white" />,
      bg: "bg-indigo-500",
      title: "E-commerce",
      desc: "Online retail and marketplace platforms",
      projects: "198 Projects",
      roi: "12-25%",
    },
    {
      icon: <Rocket className="w-8 h-8 text-white" />,
      bg: "bg-yellow-500",
      title: "Startups",
      desc: "Early-stage ventures and MVPs",
      projects: "312 Projects",
      roi: "12-25%",
    },
  ];

  return (
    <section className="py-16 bg-background text-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Explore{" "}
            <span className="bg-gradient-to-r from-blue-600 via-gray-700 to-yellow-500 bg-clip-text text-transparent">
              Investment Categories
            </span>
          </h2>
          <p className="text-paragraph mt-2">
            Discover opportunities across diverse industries and sectors
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between 
                         border border-gray-100 hover:shadow-lg hover:-translate-y-1 
                         transition-all duration-300 ease-out"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${cat.bg}`}>{cat.icon}</div>
                <span className="text-xs text-paragraph font-medium">
                  {cat.projects}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{cat.title}</h3>
              <p className="text-paragraph text-sm mb-6">{cat.desc}</p>
              <hr className="border-gray-200 mb-2" />
              <p className="text-sm text-paragraph font-medium">
                Average ROI:{" "}
                <span className="text-yellow-500 font-medium">{cat.roi}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
