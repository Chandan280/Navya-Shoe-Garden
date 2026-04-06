import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // get logged in user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // 🔥 SAVE PROFILE TO DB
    const saveProfile = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) return;

      const avatar =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        user.identities?.[0]?.identity_data?.avatar_url ||
        user.identities?.[0]?.identity_data?.picture ||
        "";

      const name =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0];

      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: name,
        avatar_url: avatar,
      });
    };

    saveProfile();

    // listen login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const user = session.user;

          const avatar =
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            user.identities?.[0]?.identity_data?.avatar_url ||
            user.identities?.[0]?.identity_data?.picture ||
            "";

          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0];

          await supabase.from("profiles").upsert({
            id: user.id,
            full_name: name,
            avatar_url: avatar,
          });
        }
      }
    );

    return () => { 
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);