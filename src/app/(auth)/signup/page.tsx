import { requireUnAuth } from "@/lib/auth-utils";
import { RegisterForm } from "../../../features/auth/components/register-form";

const Page = async () => {
  await requireUnAuth();
  return <RegisterForm />;
};

export default Page;
