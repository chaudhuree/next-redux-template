'use client';
import { useGetProductQuery } from '@/app/redux/features/api/productApi';
import { useParams } from 'next/navigation';

export default function ProductDetails() {
    const { id } = useParams();
    const { data: product, isLoading, error } = useGetProductQuery(id);

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error loading product</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <div className="mb-4">
                            <span className="font-semibold">Category:</span>
                            <span className="ml-2">{product.category}</span>
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Price:</span>
                            <span className="ml-2">${product.price}</span>
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                product.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {product.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
