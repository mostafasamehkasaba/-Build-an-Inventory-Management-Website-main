"use server";

import { redirect } from "next/navigation";
import GetCurrentuser  from "../auth";
import { prisma } from "../prisma";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  sku: z.string().optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),
});

export async function deleteProduct(formData: FormData) {
  const user = await GetCurrentuser();
  const id = String(formData.get("id") || "");

  await prisma.product.deleteMany({
    where: { id: id, userId: user.id },
  });
}

export async function createProduct(formData: FormData) {
  const user = await GetCurrentuser();

  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") || undefined,
    lowStockAt: formData.get("lowStockAt") || undefined,
  });


  if (!parsed.success) {
    throw new Error("Validation failed");
  }

  
  if (!user) {
    throw new Error("User not found");
  }

try {
  await prisma.product.create({
    data: {
      ...parsed.data,
      userId: user.id,
    },
  });
  
} catch (error) {
 
  console.error("تفاصيل خطأ Prisma:", error);
  throw new Error("Failed to create product.");
}
return redirect("/inventory");
}
