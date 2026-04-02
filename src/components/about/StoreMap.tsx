interface Store {
  name: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

const stores: Store[] = [
  {
    name: "Navya Shoe Garden - Main Store",
    address: "Main Market, Near Bus Stand",
    phone: "9518555555",
    hours: "Mon-Sat: 10AM-8PM, Sun: 11AM-6PM",
    lat: 20.5937,
    lng: 78.9629
  },
];

const StoreMap = () => {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-border bg-muted/10 relative">
      {/* Static Map using Google Maps Embed API */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782176.7680557556!2d73.7250!3d20.5937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1641234567890!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
      />
      
      {/* Overlay with store markers */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
        <h4 className="text-sm font-medium text-foreground mb-3">Our Location</h4>
        <div className="space-y-2">
          {stores.map((store, index) => (
            <div key={index} className="text-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span className="font-medium text-foreground">{store.name}</span>
              </div>
              <p className="text-muted-foreground ml-4">{store.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreMap;