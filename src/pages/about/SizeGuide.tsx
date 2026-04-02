import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import { Button } from "../../components/ui/button";
import AboutSidebar from "../../components/about/AboutSidebar";

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Size Guide" 
          subtitle="Find your perfect fit with our comprehensive sizing guide"
        />
        
        <ContentSection title="Footwear Sizing">
          <div className="space-y-8">
            <div className="bg-muted/10 rounded-lg p-8">
              <h3 className="text-xl font-light text-foreground mb-6">How to Measure Your Foot Size</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Method 1: Using a Ruler</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Place your foot on a piece of paper against a wall</li>
                    <li>Mark the longest toe and measure the length in centimeters</li>
                    <li>Use our size chart below to find your size</li>
                  </ol>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Method 2: Tracing Your Foot</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Trace around your foot on paper while standing</li>
                    <li>Measure the length from heel to the longest toe</li>
                    <li>Measure the width at the widest part of your foot</li>
                    <li>Match measurements to the size chart below</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="border border-border p-3 text-left font-light">India Size</th>
                    <th className="border border-border p-3 text-left font-light">UK Size</th>
                    <th className="border border-border p-3 text-left font-light">US Size</th>
                    <th className="border border-border p-3 text-left font-light">EU Size</th>
                    <th className="border border-border p-3 text-left font-light">Foot Length (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { india: "6", uk: "6", us: "7", eu: "39", length: "24.5" },
                    { india: "7", uk: "7", us: "8", eu: "40", length: "25.0" },
                    { india: "8", uk: "8", us: "9", eu: "41", length: "25.5" },
                    { india: "9", uk: "9", us: "10", eu: "42", length: "26.5" },
                    { india: "10", uk: "10", us: "11", eu: "44", length: "27.5" },
                  ].map((size, index) => (
                    <tr key={index} className="hover:bg-muted/10">
                      <td className="border border-border p-3">{size.india}</td>
                      <td className="border border-border p-3">{size.uk}</td>
                      <td className="border border-border p-3">{size.us}</td>
                      <td className="border border-border p-3">{size.eu}</td>
                      <td className="border border-border p-3">{size.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Kids' Sizing">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Boys' Sizes</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Small (Age 3-5)</span>
                  <span className="text-foreground">Size 8 - 12</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Medium (Age 6-9)</span>
                  <span className="text-foreground">Size 13 - 3</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Large (Age 10-12)</span>
                  <span className="text-foreground">Size 4 - 6</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Girls' Sizes</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Small (Age 3-5)</span>
                  <span className="text-foreground">Size 8 - 12</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Medium (Age 6-9)</span>
                  <span className="text-foreground">Size 13 - 3</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Large (Age 10-12)</span>
                  <span className="text-foreground">Size 4 - 6</span>
                </div>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Need Help?">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Still unsure about sizing? Our footwear experts are here to help you find the perfect fit. 
              Contact us or visit our store for a proper fitting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="rounded-none">
                Download PDF Guide
              </Button>
              <Button className="rounded-none">
                Contact Us
              </Button>
            </div>
          </div>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default SizeGuide;