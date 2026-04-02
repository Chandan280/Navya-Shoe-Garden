import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import storeImage from "@/assets/store-image.jpg";

const EditorialSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 max-w-[630px]">
          <h2 className="text-2xl font-normal text-foreground leading-tight md:text-xl">
            Footwear Crafted for Comfort and Style
          </h2>
          <p className="text-sm font-light text-foreground leading-relaxed">
            Navya Shoe Garden was founded with a simple mission: to provide quality footwear that combines style, comfort, and affordability. Since 2020, we've been serving customers with a carefully curated collection for men, women, and kids.
          </p>
          <Link to="/about/our-story" className="inline-flex items-center gap-1 text-sm font-light text-foreground hover:text-foreground/80 transition-colors duration-200">
            <span>Read our full story</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <div className="order-first md:order-last">
          <div className="w-full aspect-square overflow-hidden">
            <img src={storeImage} alt="Navya Shoe Garden store" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialSection;
