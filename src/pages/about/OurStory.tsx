import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import AboutSidebar from "../../components/about/AboutSidebar";

const OurStory = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
          {/* Page Header */}
          <div className="py-12 border-b border-border mb-12">
            <h1 className="text-3xl md:text-4xl font-light text-foreground mb-3">Our Story</h1>
            <p className="text-muted-foreground font-light">
              Serving quality footwear with style and comfort since 2020.
            </p>
          </div>
          
          {/* About Section */}
          <div className="mb-12">
            <h2 className="text-xl font-light text-foreground mb-6">About Navya Shoe Garden</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Navya Shoe Garden was founded by Yatin Gosai with a simple mission: to provide quality footwear that combines style, comfort, and affordability. Since 2020, we've been serving customers with a carefully curated collection of shoes, sandals, and slippers for men, women, and kids.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We believe that great footwear should be accessible to everyone. Every pair in our collection is selected for its quality materials, comfortable fit, and timeless design.
            </p>
          </div>

          {/* Our Values */}
          <div className="mb-12">
            <h2 className="text-xl font-light text-foreground mb-8">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Quality</h3>
                <p className="text-muted-foreground">
                  We source only the finest materials to ensure every pair meets our high standards.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Comfort</h3>
                <p className="text-muted-foreground">
                  Every shoe is designed with comfort in mind, so you can walk with confidence all day long.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Style</h3>
                <p className="text-muted-foreground">
                  From classic designs to trendy picks, we have something for every taste and occasion.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Customer Care</h3>
                <p className="text-muted-foreground">
                  We're here to help you with all your needs.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className="text-xl font-light text-foreground mb-8">Contact Information</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Phone</h3>
                <p className="text-muted-foreground">9518555555</p>
                <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM</p>
                <p className="text-sm text-muted-foreground">Sat: 10AM-4PM</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Email</h3>
                <p className="text-muted-foreground">navyashoegarden6@gmail.com</p>
                <p className="text-sm text-muted-foreground">Response within 24 hours</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Live Chat</h3>
                <button className="text-foreground underline hover:text-foreground/80 transition-colors">
                  Start Chat
                </button>
                <p className="text-sm text-muted-foreground">Available during business hours</p>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default OurStory;
