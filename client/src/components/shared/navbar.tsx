import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import CreatePost from "../create-post";
import { useCreatePost } from "@/hooks/use-create-post";
import { authStore } from "@/store/auth.store";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import $axios from "@/http";
import { IUser } from "@/interfaces";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { onOpen } = useCreatePost();
  const { isAuth, user, isLoading, setIsAuth, setUser } = authStore();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await $axios.delete("/auth/logout");
      setIsAuth(false);
      setUser({} as IUser);
      localStorage.removeItem("accessToken");
      navigate("/auth");
    } catch (error: any) {
      toast(error.response.data.message);
    }
  };

  return (
    <>
      <div className="w-full h-[10vh] md:h-24 bg-gray-900 fixed inset-0">
        <div className="w-full h-full flex justify-between items-center container">
          <Link to={"/"} className="flex justify-center items-center">
            <img src="/logo.png" alt="" className="w-16 md:w-24" />
            <p className="font-bold text-3xl md:text-4xl ml-[-1rem] md:ml-[-1.5rem]">ostuz</p>
          </Link>
          <div className="flex gap-2">
            <Button className="rounded-full font-bold md:p-6" onClick={onOpen}>
              Create
            </Button>
            {isAuth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>{user.email.at(0)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <p
                    className={cn(
                      "text-center m-1",
                      user.isActivated ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {user.isActivated ? "User is activated" : "User is not activated"}
                  </p>
                  <DropdownMenuItem>{user.email}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Button
                      className="w-full"
                      size={"sm"}
                      variant={"destructive"}
                      onClick={onLogout}
                    >
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isLoading ? (
              <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
            ) : (
              <Link to={"/auth"}>
                <Button className="rounded-full font-bold md:p-6" variant={"secondary"}>
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <CreatePost />
    </>
  );
}
