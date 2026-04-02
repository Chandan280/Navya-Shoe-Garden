import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.png";

const LargeHero = () => {
  return (
    <section className="w-full mb-16">
      <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden relative">
        <img src={heroBanner} alt="Footwear Collection" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-light text-white tracking-wide text-center">
            Step into Style
          </h2>
          <Link
            to="/category/shop"
            className="px-10 py-3 border border-white text-white text-sm font-light tracking-widest hover:bg-white hover:text-foreground transition-colors"
          >
            Shop all
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LargeHero;
