import { categories } from "@/data/categories";

export default function InvestmentCategories() {

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
                <div className={`p-3 rounded-xl ${cat.bg}`}>
                  <cat.icon className="w-8 h-8 text-white" />
                </div>
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
