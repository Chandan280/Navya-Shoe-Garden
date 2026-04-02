import { Link } from "react-router-dom";
import kidsShoes from "@/assets/hero-kids-shoes.jpg";
import sneakersImg from "@/assets/hero-sneakers-clean.jpg";

const OneThirdTwoThirdsSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Link to="/category/kids" className="block">
            <div className="w-full h-[350px] sm:h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <img src={kidsShoes} alt="Kids' Collection" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </Link>
          <div>
            <h3 className="text-sm font-normal text-foreground mb-1">Kids' Collection</h3>
            <p className="text-sm font-light text-foreground">Fun and comfortable footwear for boys and girls</p>
          </div>
        </div>
        <div className="lg:col-span-2">
          <Link to="/category/sneakers" className="block">
            <div className="w-full h-[350px] sm:h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <img src={sneakersImg} alt="Sneakers" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </Link>
          <div>
            <h3 className="text-sm font-normal text-foreground mb-1">Sneakers</h3>
            <p className="text-sm font-light text-foreground">Stylish sneakers for men and women</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OneThirdTwoThirdsSection;
