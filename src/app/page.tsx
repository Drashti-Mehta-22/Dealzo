import { getProducts } from "@/actions/serverAction";
import AddProductForm from "@/components/AddProductForm";
import AuthButton from "@/components/AuthButton";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/utils/supabase/server";
import { Bell, icons, LogIn, Rabbit, Shield } from "lucide-react";
import Image from "next/image";
export default async function Home() {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const products = user ? await getProducts() : []

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];
  return (
    <main className="min-h-screen bg-linear-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#1e0a00] text-white">

      {/* HEADER */}
      <header className="bg-[#181818] border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <Image
              src={"/dealzo-price-logo.png"}
              alt="Dealzo"
              width={600}
              height={500}
              className="h-12.5 w-auto"
            />
          </div>

          <AuthButton user={user} />
        </div>
      </header>

      {/* HERO */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/10 px-5 py-2 rounded-full text-sm font-medium text-orange-400 border border-orange-500/20 shadow-inner mb-6">
            🚀 Track Prices Like a Pro
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
            Catch Every{" "}
            <span className="text-orange-400 relative">
              Price Drop
              <span className="absolute inset-0 blur-3xl opacity-30 bg-orange-700"></span>
            </span>{" "}
            Instantly
          </h2>

          {/* Subtext */}
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop checking prices manually. Let Dealzo track, analyze, and alert you when it's the perfect time to buy.
          </p>

          {/* FORM */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-xl p-6 max-w-2xl mx-auto">
            <AddProductForm user={user} />
          </div>

          {/* FEATURES */}
          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-sm hover:shadow-[0_0_25px_rgba(255,115,0,0.15)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-orange-500/20 transition">
                    <Icon className="w-6 h-6 text-orange-400" />
                  </div>

                  <h3 className="font-semibold text-white mb-2 text-lg">
                    {title}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PRODUCTS */}
      {user && products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">

          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              Your Deals Dashboard
            </h3>

            <span className="text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-start">
            {products.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl border border-white/6 bg-white/5 backdrop-blur-xl shadow-sm transition-all duration-300"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
