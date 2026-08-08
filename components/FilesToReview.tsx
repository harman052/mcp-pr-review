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
  files?: (FileToReview | undefined)[];
}

export function FilesToReview({ files }: FilesToReviewProps) {
  if (!files?.length) {
    return null;
  }

  const validFiles = files?.filter((file) => file !== undefined);

  if (!validFiles?.length) {
    return null;
  }

  return (
    <section>
      <Heading level={3}>Files needing closer attention</Heading>

      <div className="space-y-4">
        {validFiles.map((file, index) => (
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
