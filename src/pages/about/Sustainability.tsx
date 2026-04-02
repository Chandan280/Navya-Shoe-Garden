import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import PageHeader from "../../components/about/PageHeader";
import ContentSection from "../../components/about/ContentSection";
import AboutSidebar from "../../components/about/AboutSidebar";

const Sustainability = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden lg:block">
          <AboutSidebar />
        </div>
        
        <main className="w-full lg:w-[70vw] lg:ml-auto px-6">
        <PageHeader 
          title="Sustainability" 
          subtitle="Crafting quality footwear while caring for our planet and future generations"
        />
        
        <ContentSection title="Our Environmental Commitment">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Responsible Sourcing</h3>
              <p className="text-muted-foreground leading-relaxed">
                We partner only with suppliers who share our commitment to ethical practices. Every material used in our footwear is sourced responsibly, with full transparency in our supply chain.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-light text-foreground">Eco-Friendly Materials</h3>
              <p className="text-muted-foreground leading-relaxed">
                We're increasing our use of recycled and sustainable materials in our footwear, reducing the environmental impact of manufacturing while maintaining the highest quality standards.
              </p>
            </div>
          </div>

          <div className="bg-muted/10 rounded-lg p-8">
            <h3 className="text-2xl font-light text-foreground mb-6">Our Impact Goals</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-light text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Recyclable packaging by 2025</p>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2">90%</div>
                <p className="text-sm text-muted-foreground">Eco-friendly packaging materials</p>
              </div>
              <div>
                <div className="text-3xl font-light text-primary mb-2">Zero</div>
                <p className="text-sm text-muted-foreground">Waste to landfill policy</p>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Quality That Lasts">
          <div className="space-y-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe in creating footwear that lasts — shoes built to endure, not end up in a landfill after a season.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Durable Craftsmanship</h3>
                <p className="text-muted-foreground">
                  Every pair is crafted with attention to durability, using quality materials and construction techniques that extend the life of your footwear.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-light text-foreground">Care & Repair</h3>
                <p className="text-muted-foreground">
                  We encourage proper shoe care to extend the life of your footwear. Visit our Customer Care page for tips on keeping your shoes in great shape.
                </p>
              </div>
            </div>
          </div>
        </ContentSection>

        <ContentSection title="Our Commitments">
          <div className="space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              Our commitment to sustainability is an ongoing journey. We continuously strive to improve our practices and reduce our environmental footprint.
            </p>
            
            <div className="grid md:grid-cols-4 gap-8 items-center">
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Eco Packaging</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Ethical Labor</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Sustainable</span>
              </div>
              <div className="h-16 w-32 bg-muted/10 rounded-lg flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Quality First</span>
              </div>
            </div>
          </div>
        </ContentSection>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Sustainability;