import { NextResponse } from "next/server";
import { z } from "zod";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { query } from "@/lib/db";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

const tributeInputSchema = z.object({
  name: z.string().min(2).max(120),
  relationship: z.string().min(2).max(120),
  country: z.string().min(2).max(120),
  message: z.string().min(20).max(1200)
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = tributeInputSchema.safeParse({
    name: formData.get("name"),
    relationship: formData.get("relationship"),
    country: formData.get("country"),
    message: formData.get("message")
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please complete the tribute form correctly." },
      { status: 400 }
    );
  }

  const { name, relationship, country, message } = parsed.data;
  const photo = formData.get("photo");
  let photoUrl: string | null = null;

  if (photo instanceof File && photo.size > 0) {
    if (!photo.type.startsWith("image/")) {
      return NextResponse.json({ error: "Please upload an image file." }, { status: 400 });
    }

    if (photo.size > 5_000_000) {
      return NextResponse.json(
        { error: "Please upload an image smaller than 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await photo.arrayBuffer());
    const upload = await uploadBufferToCloudinary(buffer, {
      folder: "fs-tribute/tribute-uploads",
      publicId: `${slugify(name)}-${Date.now()}`
    });
    photoUrl = upload.secure_url;
  }

  const slugBase = slugify(`${name}-${relationship}-${Date.now()}`);
  const tributeResult = await query<{ id: string }>(
    `
      insert into tributes (
        slug, name, relationship, country, message, photo_url, status, pinned, featured
      )
      values ($1, $2, $3, $4, $5, $6, 'pending', false, false)
      returning id
    `,
    [slugBase, name, relationship, country, message, photoUrl]
  );

  if (photoUrl) {
    await query(
      `
        insert into gallery (
          title, image_url, alt, story, year_label, status, featured
        )
        values ($1, $2, $3, $4, $5, 'pending', false)
      `,
      [
        `Photo memory from ${name}`,
        photoUrl,
        `Photo memory submitted by ${name}, ${relationship}.`,
        message,
        "Submitted Memory"
      ]
    );
  }

  return NextResponse.json({
    ok: true,
    tributeId: tributeResult.rows[0]?.id
  });
}
