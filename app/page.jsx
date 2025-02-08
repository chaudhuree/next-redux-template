'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useGetProductsQuery } from './redux/features/api/productApi';
import Pagination from './components/Pagination';

export default function Home() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const { data, isLoading } = useGetProductsQuery({ 
        page, 
        search: searchTerm,
        status: 'active'  // Only fetch active products
    });

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome to Our Store
                </h1>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data?.products.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="p-6">
                            <Link href={`/products/${product._id}`}>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                                    {product.name}
                                </h2>
                            </Link>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                {product.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${product.price}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                    {product.category}
                                </span>
                            </div>
                            <Link 
                                href={`/products/${product._id}`}
                                className="mt-4 block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {data?.products.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        No products found. Try a different search term.
                    </p>
                </div>
            )}

            {data && data.totalPages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={page}
                        totalPages={data.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </main>
    );
}
