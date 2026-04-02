import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import StoreMap from "../../components/about/StoreMap";
import { Button } from "../../components/ui/button";
import AboutSidebar from "../../components/about/AboutSidebar";

const StoreLocator = () => {
  const stores = [
    {
      name: "Navya Shoe Garden - Main Store",
      address: "Main Market, Near Bus Stand",
      phone: "9518555555",
      hours: "Mon-Sat: 10AM-8PM, Sun: 11AM-6PM",
      services: ["Browse & Buy", "Size Fitting", "Custom Orders", "Returns"]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Store Locator" 
          subtitle="Visit us in person for a personalized footwear shopping experience"
        />
        
        <ContentSection title="Store Map">
          <StoreMap />
        </ContentSection>

        <ContentSection title="Our Location">
          <div className="grid gap-8">
            {stores.map((store, index) => (
              <div key={index} className="bg-background rounded-lg p-8 border border-border">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-light text-foreground">{store.name}</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p>{store.address}</p>
                      <p>{store.phone}</p>
                      <p>{store.hours}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button variant="outline" className="rounded-none">
                        Get Directions
                      </Button>
                      <Button className="rounded-none">
                        Call Now
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-light text-foreground">Available Services</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {store.services.map((service, serviceIndex) => (
                        <li key={serviceIndex} className="text-sm text-muted-foreground flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></span>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContentSection>

        <ContentSection title="WhatsApp Orders">
          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-xl font-light text-foreground mb-4">Can't visit in person?</h3>
            <p className="text-muted-foreground mb-6">
              Order your favorite footwear directly via WhatsApp! Send us a message with the product you're interested in, 
              your size, and delivery address. We'll take care of the rest.
            </p>
            <Button variant="outline" className="rounded-none" onClick={() => window.open('https://wa.me/919518555555', '_blank')}>
              Chat on WhatsApp
            </Button>
          </div>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default StoreLocator;