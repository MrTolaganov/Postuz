import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function PendingModal() {
  return (
    <Alert className="w-full mx-8 md:mx-0 md:w-1/3 p-3 bg-gray-900">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Waiting...</AlertTitle>
      <AlertDescription>Plesase, check your email out and activate your account.</AlertDescription>
    </Alert>
  );
}
