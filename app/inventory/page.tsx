import { prisma } from "@/lib/prisma";
import Sidebar from "../components/Sidebar";
import GetCurrentuser from "@/lib/auth";
import {deleteProduct} from "@/lib/actions/products";
import Pagination from "../components/Pagination";



const Inventorypage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) => {
  const user = await GetCurrentuser();
  const userId = user.id;

  const params = await searchParams;
  const q = (params.q ?? "").trim();

  const where = {
    userId,
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
  };
  const pageSize = 5;
  const page = Math.max(1, Number(params.page ?? 1));


 const products = await prisma.product.findMany({
   where,
   orderBy: { createdAt: "desc" },
   skip: (page - 1) * pageSize,
   take: pageSize,
 });



const [totalCount] = await Promise.all([
  prisma.product.count({ where }),
  prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  }),
]);


  
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));



  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPath="/inventory" />
      <main className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Inventory
              </h1>
              <p className="text-sm text-gray-500">
                Manage your product and track inventory levels
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* search */}
          <div className="bg-white rounded-lg border-gray-200 p-6">
            <form action="/inventory" method="Get" className="flex gap-2 ">
              <input
                type="text"
                name="q"
                placeholder="Search products..."
                className="flex-1 px-4 py-2 border border-gary-300 rounded-lg focus:border-transparent"
              />
              <button className="px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 ">
                Search
              </button>
            </form>
          </div>
          {/* product Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 upp">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 upp">
                    Sku
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 upp">
                    price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 upp">
                    Qunatity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 upp">
                    Lowstock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 upp">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, key) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm  text-gray-500 ">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm  text-gray-500 ">
                      {product.sku || "_"}
                    </td>
                    <td className="px-6 py-4 text-sm  text-gray-500 ">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm  text-gray-500 ">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm  text-gray-500 ">
                      {product.lowStockAt || "_"}
                    </td>
                    <td className="px-6 py-4 text-sm  text-gray-500 ">
                      <form
                        action={async (formData: FormData) => {
                          "use server";
                          await deleteProduct(formData);
                        }}
                      >
                        <input type="hidden" name="id" value={product.id} />
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* total Pages */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg border  boredr-gray-200 p-6">
             <Pagination currentPages={page} totalPages={totalPages} baseUrl="/inventory" searchParams={{
              q,
              pageSize :String(pageSize)
             }} />
            </div>
            
          )}
        </div>
      </main>
    </div>
  );
};

export default Inventorypage;
