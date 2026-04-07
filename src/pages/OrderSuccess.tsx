

import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full space-y-6">

        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center text-2xl">
          ✔
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-semibold tracking-tight">
          Order Confirmed
        </h1>

        {/* Subtext */}
        <p className="text-gray-500 text-sm leading-relaxed">
          Your order has been placed successfully.
          We’ll notify you once it’s shipped.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400">Order ID</p>
            <p className="font-medium tracking-wide">
              #{orderId.slice(0, 8)}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <Link to="/account/orders">
            <Button className="w-full h-12 text-lg bg-black text-white hover:opacity-90">
              View Orders
            </Button>
          </Link>

          <Link to="/">
            <Button variant="outline" className="w-full h-12 text-lg">
              Continue Shopping
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;