"use client";

import { useActionState } from "react";
import { submitRepoUrl, type RepoFormState } from "@/app/actions/actions";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initialState: RepoFormState = {};

export function RepoUrlForm() {
  const [state, formAction, pending] = useActionState(
    submitRepoUrl,
    initialState,
  );

  return (
    <form action={formAction}>
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <Field data-invalid={state.error ? true : undefined}>
              <FieldLabel htmlFor="repoUrl" className="justify-center">
                Enter GitHub Repository URL
              </FieldLabel>
              <Input
                id="repoUrl"
                name="repoUrl"
                placeholder="https://github.com/vercel/next.js"
                aria-invalid={state.error ? true : undefined}
                required
                className="justify-center text-center"
              />
              <FieldError>{state.error}</FieldError>
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal" className="justify-center">
          <Button type="submit" disabled={pending}>
            {pending ? "Loading pull requests…" : "Submit"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
