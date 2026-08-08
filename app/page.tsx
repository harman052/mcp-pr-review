import { Heading } from "@/components/Heading";
import { RepoUrlForm } from "@/components/RepoUrlForm";

export default function LandingPage() {
  return (
    <div className="w-full max-w-md">
      <Heading level={1} className="mb-8 text-center">
        Welcome to ReviewPilot
      </Heading>
      <RepoUrlForm />
    </div>
  );
}
