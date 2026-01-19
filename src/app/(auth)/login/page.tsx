import { requireUnAuth } from "@/lib/auth-utils";
import { LoginForm } from "../components/login-form";

const Page=async()=>{
  await requireUnAuth();
  return (
    <div>
        <LoginForm/>
    </div>
  );
};

export default Page;