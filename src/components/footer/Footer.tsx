import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-background text-foreground pt-8 pb-2 px-4 sm:px-6 border-t border-border mt-48">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-8">
          {/* Brand - Left side */}
          <div>
            <h3 className="text-lg font-medium tracking-wide mb-4">NAVYA SHOE GARDEN</h3>
            <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md mb-6">
              Quality footwear combining style, comfort, and affordability
            </p>
            
            {/* Contact Information */}
            <div className="space-y-2 text-sm font-light text-muted-foreground">
              <div>
                <p className="font-normal text-foreground mb-1">Contact</p>
                <p>9518555555</p>
                <p>navyashoegarden6@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Link lists - Right side */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Shop */}
            <div>
              <h4 className="text-sm font-normal mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><Link to="/category/new-in" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">New In</Link></li>
                <li><Link to="/category/men" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">Men</Link></li>
                <li><Link to="/category/women" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">Women</Link></li>
                <li><Link to="/category/kids" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">Kids</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-normal mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/about/size-guide" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">Size Guide</Link></li>
                <li><Link to="/about/customer-care" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">Customer Care</Link></li>
                <li><a href="#" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">Returns</a></li>
                <li><a href="#" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">Shipping</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-sm font-normal mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="https://wa.me/919518555555" target="_blank" rel="noopener noreferrer" className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors">WhatsApp</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-border -mx-4 sm:-mx-6 px-4 sm:px-6 pt-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-light text-foreground mb-1 md:mb-0">
            © 2024 Navya Shoe Garden. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-sm font-light text-foreground hover:text-muted-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm font-light text-foreground hover:text-muted-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
