import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-5xl font-mono font-medium text-brand-sand-dark select-none">
        404
      </p>
      <h1 className="mt-4 text-lg font-semibold text-brand-navy">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        This page does not exist or was moved.
      </p>
      <Link to="/fleets" className="mt-6">
        <Button>Back to Fleets</Button>
      </Link>
    </div>
  );
}
