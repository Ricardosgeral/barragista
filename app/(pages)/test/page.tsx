"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tag, TagInput } from "emblor";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { damProfile } from "@/data/dam/constants";

const FormSchema = z.object({
  profile: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
});
export default function TagInputa() {
  const [tagsProfile, setTagsProfile] = useState<Tag[]>([]);
  const [activeTagProfileIndex, setActiveTagProfileIndex] = useState<
    number | null
  >(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profile: [],
    },
  });
  const { setValue } = form;
  // 2. Define a submit handler.
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-start space-y-8"
      >
        <FormField
          control={form.control}
          name="profile"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col items-start">
              <FormLabel>Profiles</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  placeholder="Select from list"
                  tags={tagsProfile}
                  maxTags={5}
                  minTags={1}
                  activeTagIndex={activeTagProfileIndex}
                  draggable={true}
                  setActiveTagIndex={setActiveTagProfileIndex}
                  className="sm:min-w-[450px]"
                  setTags={(newTags) => {
                    setTagsProfile(newTags);
                    setValue("profile", newTags as [Tag, ...Tag[]]);
                  }}
                  enableAutocomplete
                  autocompleteOptions={damProfile}
                  restrictTagsToAutocompleteOptions={true}
                />
              </FormControl>
              <FormDescription className="text-left">
                Selected Profile tags
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
