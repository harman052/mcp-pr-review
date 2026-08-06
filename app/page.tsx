import { RepoUrlForm } from "@/components/repo-url-form";

export default function LandingPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-2xl font-bold mb-8">Welcome to ReviewPilot</div>
      <RepoUrlForm />
    </div>
  );
}
