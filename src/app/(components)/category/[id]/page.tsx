import Link from "next/link";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const { id: userId } = params;

  const getCategory = async () => {
    const res = await fetch(
      `https://api.escuelajs.co/api/v1/products/?categoryId=${userId}`
    );
    return res.json();
  };

  const Category = await getCategory();

  return (
    <div className="mx-auto w-full">
      <Link href={"/"} className="flex items-center gap-2 btn btn-dark block mt-2 mx-auto">Back</Link>
      <div className="w-full h-screen p-8 overflow-y-scroll grid grid-cols-5 gap-6 text-black bg-white">
        {Category.map((product: any) => (
          <div
            key={product.id}
            className="p-4 rounded-lg  border border-gray-200 hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            <div className="h-56 w-full overflow-hidden border rounded-md">
              <img
                className="w-full h-full object-cover rounded-md"
                src={product.images}
              />
            </div>
            <h1 className="text-lg font-semibold text-gray-800 mt-3">
              ${product.price}
            </h1>
            <p className="text-md font-medium text-gray-700">{product.title}</p>
            <p className="text-sm text-gray-600 mt-2">
              {product.description.slice(0, 50) + "..."}
            </p>
            <p>Category: {product.category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
