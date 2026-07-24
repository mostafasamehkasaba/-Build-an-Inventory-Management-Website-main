"use client";
import Sidebar from "../components/Sidebar";
import { createProduct, CreateProductState } from "@/lib/actions/products";
import Link from "next/link";
import { useActionState } from "react";

const AddProductPage = () => {
  const initialState: CreateProductState = {};
  const [state, formAction, isPending] = useActionState(
    createProduct,
    initialState
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/add-product" />

      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Add Product
              </h1>
              <p className="text-sm text-gray-500">
                Add a new product to your inventory
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl ">
          <div className="bg-white rounded-lg  border border-gray-200 p-6">
            <form className="space-y-6" action={formAction}>
              {state?.error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {state.error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Enter Product Name"
                />
              </div>

              <div className="gird grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="0"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="Enter Quantity"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="Enter Price"
                  />
                </div>
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                    SKU (optional)
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-transparent"
                    placeholder="Enter SKU"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lowStockAt" className="block text-sm font-medium text-gray-700 mb-2">
                  LowStockAt (optional)
                </label>
                <input
                  type="number"
                  id="lowStockAt"
                  name="lowStockAt"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-transparent"
                  placeholder="Enter LowStockAt"
                />
              </div>

              <div className="flex gap-5">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {isPending ? "جاري الإضافة..." : "Add Product"}
                </button>
                <Link
                  href="/inventory"
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gary-300"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProductPage;