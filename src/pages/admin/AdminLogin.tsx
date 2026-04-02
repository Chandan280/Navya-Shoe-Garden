import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type View = "login" | "forgot";

const AdminLogin = () => {
  const [email, setEmail] = useState("navyashoegarden6@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<View>("login");

  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Welcome Admin 👋",
      description: "Login successful",
    });

   window.location.href = "/admin/dashboard";
    setLoading(false);
  };

  // ✅ RESET PASSWORD EMAIL
  const handleResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:8080/admin/reset-password",
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Reset link sent 📩",
      description: "Check your email to reset password",
    });

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {view === "login" ? "Admin Panel" : "Reset Password"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Navya Shoe Garden
          </p>
        </div>

        {/* LOGIN */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full h-12">
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <button
              type="button"
              onClick={() => setView("forgot")}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition"
            >
              Forgot Password?
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {view === "forgot" && (
          <form onSubmit={handleResetEmail} className="space-y-4">

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                disabled
              />
            </div>

            <Button type="submit" className="w-full h-12">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <button
              type="button"
              onClick={() => setView("login")}
              className="w-full text-sm text-muted-foreground hover:text-foreground"
            >
              Back to login
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default AdminLogin;