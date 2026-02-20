import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function NotFound() {

  const location = useLocation();
  const navigate = useNavigate();

  /* ================= LOG 404 TO BACKEND ================= */

  useEffect(() => {

    const logError = async () => {

      await supabase
        .from("error_logs")
        .insert([
          {
            path: location.pathname,
            message: "404 Route Not Found"
          }
        ]);

      console.error(
        "404 Route:",
        location.pathname
      );
    };

    logError();

  }, [location.pathname]);

  /* ================= REDIRECT HOME ================= */

  const goHome = () => {
    navigate("/");
  };

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">

      <div className="text-center space-y-4">

        <h1 className="text-5xl font-bold">
          404
        </h1>

        <p className="text-muted-foreground">
          Page not found
        </p>

        <button
          onClick={goHome}
          className="btn-primary"
        >
          Go to Home
        </button>

      </div>

    </div>
  );
}
