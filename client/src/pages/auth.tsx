import ForgotPass from "@/components/auth/forgot-pass";
import Login from "@/components/auth/login";
import Register from "@/components/auth/register";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card className="w-full mx-8 md:mx-0 md:w-1/3 p-3 bg-gray-900">
        <CardContent>
          {auth === "login" && <Login />}
          {auth === "register" && <Register />}
          {auth === "forgot-pass" && <ForgotPass />}
        </CardContent>
      </Card>
    </div>
  );
}
