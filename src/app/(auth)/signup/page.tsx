import { requireUnAuth } from "@/lib/auth-utils";
import { RegisterForm } from "../components/register-form";

const Page=async()=>{
  await requireUnAuth();
  return (
    <div>
        <RegisterForm/>
    </div>
  );
};

export default Page;