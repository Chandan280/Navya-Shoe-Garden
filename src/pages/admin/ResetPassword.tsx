import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // ✅ IMPORTANT: check session (from email link)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        toast({
          title: "Invalid session",
          description: "Reset link expired or invalid.",
          variant: "destructive",
        });
        navigate("/admin");
      }
    };

    checkSession();
  }, []);

  const handleReset = async () => {
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
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
      title: "Password updated!",
      description: "You can now login to admin panel.",
    });

    navigate("/admin");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">

        {/* 🔥 PREMIUM HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Set New Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Navya Shoe Garden Admin
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button onClick={handleReset} className="w-full h-12">
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;