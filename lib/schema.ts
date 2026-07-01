import { z } from "zod";

export const tributeSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  relationship: z.string().min(2, "Please share your relationship."),
  country: z.string().min(2, "Please enter your country."),
  message: z
    .string()
    .min(20, "Please write at least 20 characters.")
    .max(1200, "Please keep the tribute under 1,200 characters."),
  photo: z
    .custom<FileList>()
    .optional()
    .refine((files) => !files || files.length === 0 || files[0].size <= 5_000_000, {
      message: "Please upload an image smaller than 5MB."
    })
});

export type TributeInput = z.infer<typeof tributeSchema>;
