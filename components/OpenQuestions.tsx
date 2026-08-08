import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Heading } from "./Heading";

interface OpenQuestionsProps {
  questions?: string[];
}

export function OpenQuestions({ questions }: OpenQuestionsProps) {
  if (!questions?.length) {
    return null;
  }

  return (
    <section>
      <Heading level={3}>Open questions</Heading>
      <ol className="list-decimal space-y-2 pl-6 text-sm">
        {questions.map((question, index) => (
          <li key={`${question}-${index}`}>
            <Item size="xs">
              <ItemContent>
                <ItemTitle className="font-normal">{question}</ItemTitle>
              </ItemContent>
            </Item>
          </li>
        ))}
      </ol>
    </section>
  );
}
