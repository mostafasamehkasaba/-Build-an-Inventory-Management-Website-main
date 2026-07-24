"use server";

import { redirect } from "next/navigation";
import GetCurrentuser from "../auth";
import { prisma } from "../prisma";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  sku: z.string().optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),
});

export type CreateProductState = {
  error?: string;
};

export async function deleteProduct(formData: FormData) {
  const user = await GetCurrentuser();
  const id = String(formData.get("id") || "");

  await prisma.product.deleteMany({
    where: { id: id, userId: user.id },
  });
}

export async function createProduct(
  prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  const user = await GetCurrentuser();

  if (!user) {
    return { error: "المستخدم غير موجود" };
  }

  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") || undefined,
    lowStockAt: formData.get("lowStockAt") || undefined,
  });

  if (!parsed.success) {
    return { error: "من فضلك تأكد من صحة البيانات المدخلة" };
  }

  try {
    await prisma.product.create({
      data: {
        ...parsed.data,
        userId: user.id,
      },
    });
  } catch (error: unknown) {
    console.error("تفاصيل خطأ Prisma:", error);

    const prismaError = error as { code?: string };

    if (prismaError.code === "P2002") {
      return { error: "SKU already exists. Please use a unique SKU." };
    }

    return { error: "حدث خطأ أثناء إضافة المنتج، حاول مرة أخرى" };
  }

  redirect("/inventory");
}