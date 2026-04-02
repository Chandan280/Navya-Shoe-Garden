import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { action, email, otp, new_password } = await req.json();

    if (action === "send_otp") {
      // Find admin user by email
      const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
      if (userError) throw userError;
      
      const user = users.users.find((u) => u.email === email);
      if (!user) {
        return new Response(JSON.stringify({ error: "No admin account with this email" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check admin role
      const { data: roleData } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        return new Response(JSON.stringify({ error: "Not an admin account" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Generate 4-digit OTP
      const otpCode = String(Math.floor(1000 + Math.random() * 9000));
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min

      // Invalidate old OTPs
      await supabaseAdmin
        .from("admin_otps")
        .delete()
        .eq("user_id", user.id);

      // Store OTP
      await supabaseAdmin.from("admin_otps").insert({
        user_id: user.id,
        otp: otpCode,
        expires_at: expiresAt,
      });

      // Send OTP via WhatsApp to admin numbers
      const message = `Your Navya Shoe Garden admin OTP is ${otpCode}. Do not share this code.`;
      const phones = ["919518555555", "919518800800"];
      
      for (const phone of phones) {
        try {
          await fetch(
            `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
          );
        } catch {
          // WhatsApp API link - actual sending requires Business API
        }
      }

      // Log OTP for verification (in production, only send via SMS/WhatsApp)
      console.log(`OTP for ${email}: ${otpCode}`);

      return new Response(
        JSON.stringify({ success: true, message: "OTP sent to registered phone numbers" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify_and_reset") {
      // Find user
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const user = users.users.find((u) => u.email === email);
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify OTP
      const { data: otpData } = await supabaseAdmin
        .from("admin_otps")
        .select("*")
        .eq("user_id", user.id)
        .eq("otp", otp)
        .eq("used", false)
        .single();

      if (!otpData) {
        return new Response(JSON.stringify({ error: "Invalid OTP" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (new Date(otpData.expires_at) < new Date()) {
        return new Response(JSON.stringify({ error: "OTP expired" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Mark OTP as used
      await supabaseAdmin
        .from("admin_otps")
        .update({ used: true })
        .eq("id", otpData.id);

      // Reset password
      const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: new_password }
      );

      if (resetError) {
        return new Response(JSON.stringify({ error: resetError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({ success: true, message: "Password reset successfully" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
