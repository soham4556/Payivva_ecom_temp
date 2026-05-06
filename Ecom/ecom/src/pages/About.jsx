import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us - Payivva Technologies</title>
        <meta
          name="description"
          content="Learn about Payivva Technologies, a leading multi-vendor eCommerce marketplace connecting buyers and sellers worldwide."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          About Payivva Technologies
        </h1>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Payivva Technologies is on a mission to democratize eCommerce by
              providing a platform where any vendor can sell their products to a
              global audience. We believe in empowering small businesses and
              entrepreneurs with the tools they need to succeed online.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              { number: "500+", label: "Active Vendors" },
              { number: "10,000+", label: "Products Listed" },
              { number: "50,000+", label: "Happy Customers" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl shadow-sm p-6 text-center"
              >
                <p className="text-3xl font-extrabold text-indigo-600">
                  {stat.number}
                </p>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Verified vendors with quality assurance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Secure payment processing with SSL encryption</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Real-time order tracking from purchase to delivery</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>24/7 customer support for buyers and sellers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>Competitive marketplace with best prices</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
