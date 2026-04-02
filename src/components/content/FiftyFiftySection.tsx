import { Link } from "react-router-dom";
import menSneakers from "@/assets/hero-men-sneakers.jpg";
import womenShoes from "@/assets/hero-women-shoes.jpg";

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Link to="/category/men" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <img src={menSneakers} alt="Men's Collection" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </Link>
          <div>
            <h3 className="text-sm font-normal text-foreground mb-1">Men's Collection</h3>
            <p className="text-sm font-light text-foreground">Premium shoes, sandals and slippers for men</p>
          </div>
        </div>
        <div>
          <Link to="/category/women" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <img src={womenShoes} alt="Women's Collection" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </Link>
          <div>
            <h3 className="text-sm font-normal text-foreground mb-1">Women's Collection</h3>
            <p className="text-sm font-light text-foreground">Elegant shoes, sandals and slippers for women</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiftyFiftySection;
