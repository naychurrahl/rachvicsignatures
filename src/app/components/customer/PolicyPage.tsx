import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useApp } from "@/app/contexts/AppContext";

export function PolicyPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { settings } = useApp();
  const policy = slug ? settings.policies[slug] : undefined;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b px-4 py-3 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 active:scale-90 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg ml-2">{policy?.title || "Policy"}</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {policy ? (
          <div className="space-y-3">
            {policy.body.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-sm text-gray-600 dark:text-gray-400">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Policy not found.</p>
        )}
      </div>
    </div>
  );
}
