import { useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import LargeHero from "../components/content/LargeHero";
import FiftyFiftySection from "../components/content/FiftyFiftySection";
import OneThirdTwoThirdsSection from "../components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "../components/content/ProductCarousel";
import EditorialSection from "../components/content/EditorialSection";
import TrustBadges from "../components/content/TrustBadges";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 }
  }
};

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      <main className="pt-20">

        {/* 🔥 HERO */}
        {/* 🔥 HERO */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
  className="relative h-[92vh] flex items-center justify-center mx-6 mb-20 rounded-3xl overflow-hidden bg-black"
>

  {/* BACKGROUND IMAGE */}
  <motion.img
    src="https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg"
    className="absolute inset-0 w-full h-full object-cover scale-110"
    animate={{ scale: 1.1 }}
    transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
  />

  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/60" />

  {/* LIGHT GLOW */}
  <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-black to-transparent opacity-70" />

  {/* CONTENT */}
  <motion.div
    variants={fadeUp}
    initial="hidden"
    animate="show"
    className="relative text-center text-white px-6"
  >

    <h1 className="text-5xl md:text-7xl font-semibold tracking-[0.4em] mb-6">
      NAVYA
    </h1>

    <p className="text-gray-300 text-lg mb-8 tracking-widest">
      PREMIUM FOOTWEAR EXPERIENCE
    </p>

    <div className="flex justify-center gap-4">

      <motion.button
        onClick={() => navigate("/category/shop")}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-black px-8 py-3 rounded-full font-medium transition-all duration-300"
      >
        Shop Now
      </motion.button>

      <motion.button
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="border border-white px-8 py-3 rounded-full transition-all duration-300 hover:bg-white hover:text-black"
      >
        Explore
      </motion.button>

    </div>

  </motion.div>
</motion.div>

        {/* 🔥 SECTIONS WITH SCROLL ANIMATION */}
        <div className="space-y-16">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <FiftyFiftySection />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <ProductCarousel />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <TrustBadges />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <LargeHero />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <OneThirdTwoThirdsSection />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <EditorialSection />
          </motion.div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Index;