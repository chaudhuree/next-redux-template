'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useGetProductsQuery, useDeleteProductMutation } from '@/app/redux/features/api/productApi';
import EditProductModal from '@/app/components/EditProductModal';
import Pagination from '@/app/components/Pagination';

export default function Products() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetProductsQuery({ 
        page, 
        search: debouncedSearch,
    });
    const [deleteProduct] = useDeleteProductMutation();

    // Check authentication
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    const handleSearch = useCallback((e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page on new search
    }, []);

    if (!user) {
        return null; // Don't render anything while redirecting
    }

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                {user?.role === 'admin' && (
                    <Link
                        href="/products/create"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Add Product
                    </Link>
                )}
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search products by name, description, or category..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            {user?.role === 'admin' && (
                                <th scope="col" className="px-6 py-3">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.products.map((product) => (
                            <tr key={product._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <Link href={`/products/${product._id}`} className="hover:text-blue-600 dark:hover:text-blue-500">
                                        {product.name}
                                    </Link>
                                </th>
                                <td className="px-6 py-4">{product.category}</td>
                                <td className="px-6 py-4">${product.price}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        product.status === 'active' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    }`}>
                                        {product.status}
                                    </span>
                                </td>
                                {user?.role === 'admin' && (
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingProduct(product)}
                                                className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="font-medium text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data && (
                <div className="mt-4">
                    <Pagination
                        currentPage={page}
                        totalPages={data.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                />
            )}
        </div>
    );
}
