import { requireUnAuth } from "@/lib/auth-utils";
import { LoginForm } from "../../../features/auth/components/login-form";


const Page = async () => {
  await requireUnAuth();
  return <LoginForm />;
};

export default Page;
