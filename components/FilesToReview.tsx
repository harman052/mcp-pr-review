import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Heading } from "./Heading";

interface FileToReview {
  path?: string;
  reason?: string;
}

interface FilesToReviewProps {
  files?: FileToReview[];
}

export function FilesToReview({ files }: FilesToReviewProps) {
  if (!files?.length) {
    return null;
  }

  return (
    <section>
      <Heading level={3}>Files needing closer attention</Heading>

      <div className="space-y-4">
        {files.map((file, index) => (
          <Item
            className="mb-4"
            key={file.path ?? index}
            size="sm"
            variant="muted"
          >
            <ItemContent>
              <ItemTitle>
                <code>{file.path}</code>
              </ItemTitle>

              {file.reason && <ItemDescription>{file.reason}</ItemDescription>}
            </ItemContent>
          </Item>
        ))}
      </div>
    </section>
  );
}
