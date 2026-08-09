import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-(--header-height) items-center gap-2 border-b py-2">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 className="text-base font-medium">ReviewPilot</h1>
        <div className="ml-auto gap-2">
          <a
            href="https://github.com/harman052/mcp-pr-review"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "hidden sm:flex",
            )}
          >
            GitHub
            <ExternalLink />
          </a>
        </div>
      </div>
    </header>
  );
}
