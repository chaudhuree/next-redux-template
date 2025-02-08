import { baseApi } from './baseApi';
import { showErrorToast, showSuccessToast } from '@/app/utils/toast';

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ page = 1, search = '', status = '' }) => ({
                url: `/products?page=${page}&search=${search}${status ? `&status=${status}` : ''}`,
                credentials: 'omit', // Don't send credentials for public routes
            }),
            providesTags: ['Products']
        }),
        getProduct: builder.query({
            query: (id) => ({
                url: `/products/${id}`,
                credentials: 'omit', // Don't send credentials for public routes
            }),
            providesTags: ['Product']
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: '/products',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Products'],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    showSuccessToast('Product created successfully');
                } catch (error) {
                    showErrorToast(error.message || 'Failed to create product');
                }
            },
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Products', 'Product'],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    showSuccessToast('Product updated successfully');
                } catch (error) {
                    showErrorToast(error.message || 'Failed to update product');
                }
            },
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    showSuccessToast('Product deleted successfully');
                } catch (error) {
                    showErrorToast(error.message || 'Failed to delete product');
                }
            },
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;
