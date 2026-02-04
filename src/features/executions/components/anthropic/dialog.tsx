"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCredentialByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must stat with a letter or underscore and contains only letters,numbers,and underscored",
    }),
  credentialId: z.string().min(1, "Credential is required"),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { message: "User prompt is required" }),
});

export type AnthropicFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AnthropicFormValues) => void;
  defaultValues?: Partial<AnthropicFormValues>;
}

export const AnthropicDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const { data: credentials, isLoading: isLoadingCredentials } =
    useCredentialByType(CredentialType.ANTHROPIC);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credentialId: defaultValues.credentialId || "",
      variableName: defaultValues.variableName,
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
    },
  });

  const watchVariableName = form.watch("variableName");

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      form.reset({
        credentialId: defaultValues.credentialId || "",
        variableName: defaultValues.variableName,
        systemPrompt: defaultValues.systemPrompt,
        userPrompt: defaultValues.userPrompt,
      });
    }
  }, [open, defaultValues]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anthropic configuration</DialogTitle>
          <DialogDescription>
            configure the AI model and prompts for this node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="MyAnthropic" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the result in other node:{" "}
                    {`{{${watchVariableName}.text}}`}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anthropic Credential</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    onOpenChange={field.onBlur}
                    disabled={isLoadingCredentials || !credentials.length}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {credentials.map((credential) => (
                        <SelectItem
                          key={credential.value}
                          value={credential.value}
                        >
                          <div className="flex items-center gap-2">
                            <Image
                              src="/anthropic.svg"
                              alt="Anthropic"
                              width={16}
                              height={16}
                            />
                            {credential.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="You are a helpful assistant."
                      className="min-h-[80px] font-mono text-sm "
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Sets the behavior of the assistant.Use {"{{variables}}"} for
                    simple values or {"{{json variables}}"} to stringify objects
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summarize this text: {{json httpResponse.data}} "
                      className="min-h-[120px] font-mono text-sm "
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The prompt to send to the AI.Use {"{{variables}}"} for
                    simple values or {"{{json variables}}"} to stringify objects
                  </FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
