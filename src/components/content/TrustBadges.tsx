import { Truck, RefreshCw, ShieldCheck } from "lucide-react";

const badges = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above ₹5,000" },
  { icon: RefreshCw, title: "Easy Exchange", desc: "No returns, hassle-free exchange" },
  { icon: ShieldCheck, title: "Genuine Products", desc: "100% authentic footwear" },
];

const TrustBadges = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {badges.map((b) => (
          <div key={b.title} className="flex flex-col items-center gap-2 py-6">
            <b.icon className="w-7 h-7 text-foreground" strokeWidth={1.2} />
            <h3 className="text-sm font-medium text-foreground">{b.title}</h3>
            <p className="text-xs font-light text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;
