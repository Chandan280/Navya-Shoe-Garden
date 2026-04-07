import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Check, CheckCircle } from "lucide-react";
import CheckoutHeader from "../components/header/CheckoutHeader";
import Footer from "../components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PHONE = "919518555555";

const VALID_PINCODE_REGEX = /^\d{6}$/;

const getDeliveryCharge = (subtotal: number) => {
  if (subtotal > 5000) return 50;
  if (subtotal >= 3000) return 70;
  return 100;
};

const Checkout = () => {
  const { items, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentType, setPaymentType] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [pincodeValid, setPincodeValid] = useState<boolean | null>(null);

  const handleChange = (field: string, value: string) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
    if (field === "pincode") {
      if (VALID_PINCODE_REGEX.test(value)) {
        setPincodeValid(true);
      } else {
        setPincodeValid(null);
      }
    }
  };

  const fetchCityState = async (pincode: string) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        setCustomerDetails((prev) => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
        }));
      }
    } catch (error) {
      console.error("Pincode fetch error:", error);
    }
  };

  useEffect(() => {
    if (customerDetails.pincode.length === 6) {
      fetchCityState(customerDetails.pincode);
    }
  }, [customerDetails.pincode]);

  const sendWhatsAppToAdmin = (orderId: string) => {
    const itemsText = items
      .map((item) => `${item.name} (Size: ${item.size}, Color: ${item.color}) x${item.quantity} - ₹${item.price * item.quantity}`)
      .join("%0A");
    
    const fullAddress = `${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state} - ${customerDetails.pincode}`;
    
    const message = `🛒 *New Order!*%0A%0A*Order ID:* ${orderId.slice(0, 8)}%0A*Customer:* ${customerDetails.name}%0A*Phone:* ${customerDetails.phone}%0A*Address:* ${encodeURIComponent(fullAddress)}%0A%0A*Items:*%0A${itemsText}%0A%0A*Total:* ₹${totalPrice.toLocaleString()}%0A*Payment:* ${paymentType}`;
    
    window.open(`https://wa.me/${ADMIN_PHONE}?text=${message}`, "_blank");
  };

  const handlePlaceOrder = async () => {
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address || !customerDetails.city || !customerDetails.state || !customerDetails.pincode) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (!VALID_PINCODE_REGEX.test(customerDetails.pincode)) {
      toast({ title: "Please enter a valid 6-digit pincode", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }
    if (!items.every((item) => item.productId && item.size)) {
      toast({ title: "Invalid product data", variant: "destructive" });
      return;
    }

    setIsProcessing(true);

    if (paymentType === "Online") {
      toast({ title: "Online payment", description: "Razorpay integration requires API key setup. Please use COD for now or contact admin to configure Razorpay." });
      setIsProcessing(false);
      return;
    }

    const fullAddress = `${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state} - ${customerDetails.pincode}`;
   const { data: userData } = await supabase.auth.getUser();
    // COD flow
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        created_at: new Date().toISOString(),
        user_id: userData?.user?.id || null,
        customer_name: customerDetails.name,
        phone: customerDetails.phone,
        address: fullAddress,
        city: customerDetails.city,
        state: customerDetails.state,
        pincode: customerDetails.pincode,
        total_amount: totalPrice + getDeliveryCharge(totalPrice),
        payment_type: paymentType,
        payment_status: paymentType === "COD" ? "pending" : "paid",
      })
      .select()
      .single();

    if (orderError || !order) {
      toast({ title: "Order failed", description: orderError?.message, variant: "destructive" });
      setIsProcessing(false);
      return;
    }

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      quantity: item.quantity,
      size: item.size,
      color: item.color || null,
      price: item.price * item.quantity,
      image: item.image || null,
    }));

    await supabase.from("order_items").insert(orderItems);

    // Send WhatsApp notification
    sendWhatsAppToAdmin(order.id);

    clearCart();
    navigate("/order-success", {
      state: { orderId: order.id },
    });
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <CheckoutHeader />
      
      <main className="pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Order Summary */}
            <div className="lg:col-span-1 lg:order-2">
              <div className="bg-muted/20 p-8 rounded-none sticky top-6">
                <h2 className="text-lg font-light text-foreground mb-6">Order Summary</h2>
                
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-muted rounded-none overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-light text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Size: {item.size} · {item.color}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 p-0 rounded-none border-muted-foreground/20"><Minus className="h-3 w-3" /></Button>
                          <span className="text-sm font-medium text-foreground min-w-[2ch] text-center">{item.quantity}</span>
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 p-0 rounded-none border-muted-foreground/20"><Plus className="h-3 w-3" /></Button>
                        </div>
                      </div>
                      <div className="text-foreground font-medium">₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-muted-foreground/20 mt-6 pt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground">₹{getDeliveryCharge(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium pt-2 border-t border-muted-foreground/20">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">₹{(totalPrice + getDeliveryCharge(totalPrice)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 lg:order-1 space-y-8">
              {/* Customer Details */}
              <div className="bg-muted/20 p-8 rounded-none">
                <h2 className="text-lg font-light text-foreground mb-6">Customer Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-light text-foreground">Full Name *</Label>
                    <Input id="name" type="text" value={customerDetails.name} onChange={(e) => handleChange("name", e.target.value)} className="mt-2 rounded-none" placeholder="Enter your name" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-light text-foreground">Phone Number *</Label>
                    <Input id="phone" type="tel" value={customerDetails.phone} onChange={(e) => handleChange("phone", e.target.value)} className="mt-2 rounded-none" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-sm font-light text-foreground">Street Address *</Label>
                    <Input id="address" type="text" value={customerDetails.address} onChange={(e) => handleChange("address", e.target.value)} className="mt-2 rounded-none" placeholder="House no., street, area" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-light text-foreground">City *</Label>
                      <Input
                        id="city"
                        type="text"
                        value={customerDetails.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className="mt-2 rounded-none"
                        placeholder="City"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-light text-foreground">State *</Label>
                      <Input
                        id="state"
                        type="text"
                        value={customerDetails.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                        className="mt-2 rounded-none"
                        placeholder="State"
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode" className="text-sm font-light text-foreground">Pincode *</Label>
                      <Input
                        id="pincode"
                        type="text"
                        maxLength={6}
                        value={customerDetails.pincode}
                        onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, ""))}
                        className="mt-2 rounded-none"
                        placeholder="6-digit pincode"
                      />
                      {pincodeValid && (
                        <div className="flex items-center gap-1.5 mt-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Delivery available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-muted/20 p-8 rounded-none">
                <h2 className="text-lg font-light text-foreground mb-6">Payment Method</h2>
                <RadioGroup value={paymentType} onValueChange={setPaymentType} className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="COD" id="cod" />
                      <Label htmlFor="cod" className="font-light text-foreground">Cash on Delivery</Label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-muted-foreground/20 rounded-none">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="Online" id="online" />
                      <Label htmlFor="online" className="font-light text-foreground">Online Payment (UPI / Card)</Label>
                    </div>
                  </div>
                </RadioGroup>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || items.length === 0}
                  className="w-full rounded-none h-12 text-base mt-6"
                >
                  {isProcessing ? "Processing..." : `Place Order • ₹${(totalPrice + getDeliveryCharge(totalPrice)).toLocaleString()}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
