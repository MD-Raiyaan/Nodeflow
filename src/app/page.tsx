import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";

export default async function Home() {
  await requireAuth();
  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center ">
      
    </div>
  );
}
