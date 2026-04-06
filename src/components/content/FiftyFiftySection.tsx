import { Link } from "react-router-dom";
import menSneakers from "@/assets/hero-men-sneakers.jpg";
import womenShoes from "@/assets/hero-women-shoes.jpg";

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-20 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* MEN */}
        <Link to="/category/men" className="group block">
          <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-white">

            {/* IMAGE */}
            <img
              src={menSneakers}
              alt="Men's Collection"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-500" />

            {/* TEXT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-[0.2em] mb-4">
                MEN
              </h2>

              <span className="border border-white px-6 py-2 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-black">
                SHOP NOW
              </span>
            </div>
          </div>
        </Link>

        {/* WOMEN */}
        <Link to="/category/women" className="group block">
          <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-white">

            {/* IMAGE */}
            <img
              src={womenShoes}
              alt="Women's Collection"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-500" />

            {/* TEXT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-[0.2em] mb-4">
                WOMEN
              </h2>

              <span className="border border-white px-6 py-2 text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-black">
                SHOP NOW
              </span>
            </div>
          </div>
        </Link>

      </div>
    </section>
  );
};

export default FiftyFiftySection;