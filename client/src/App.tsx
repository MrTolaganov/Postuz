import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Auth from "./pages/auth";
import Navbar from "./components/shared/navbar";
import { toast } from "sonner";
import $axios from "./http";
import { authStore } from "./store/auth.store";
import { useEffect } from "react";
import RecoveryAcc from "./pages/recovery-acc";

export default function App() {
  const { setIsAuth, setUser, setIsLoading } = authStore();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const { data } = await $axios.get("/auth/refresh");
      setIsAuth(true);
      setUser(data.user);
      localStorage.setItem("accessToken", data.accessToken);
    } catch (err: any) {
      toast(err.response.data.message);
      localStorage.removeItem("accessToken");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="recovery-account/:accessToken" element={<RecoveryAcc />} />
      </Routes>
    </>
  );
}
