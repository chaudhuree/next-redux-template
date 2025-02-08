'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useGetUsersQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation } from '@/app/redux/features/api/userApi';
import Pagination from '@/app/components/Pagination';

export default function Users() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const { user: currentUser } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUsersQuery({ page, name: searchTerm });
    const [updateUserRole] = useUpdateUserRoleMutation();
    const [updateUserStatus] = useUpdateUserStatusMutation();

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/');
        }
    }, [currentUser, router]);

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await updateUserRole({ id: userId, role: newRole }).unwrap();
        } catch (error) {
            console.error('Failed to update user role:', error);
        }
    };

    const handleStatusUpdate = async (userId, newStatus) => {
        try {
            await updateUserStatus({ id: userId, status: newStatus }).unwrap();
        } catch (error) {
            console.error('Failed to update user status:', error);
        }
    };

    if (!currentUser || currentUser.role !== 'admin') {
        return null;
    }

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">User Management</h1>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.users.map((user) => (
                            <tr key={user._id} className="bg-white border-b">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {user.name}
                                </th>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        disabled={user._id === currentUser._id}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        user.status === 'active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user._id !== currentUser._id && (
                                        <button
                                            onClick={() => handleStatusUpdate(user._id, user.status === 'active' ? 'inactive' : 'active')}
                                            className={`px-3 py-1 rounded text-sm ${
                                                user.status === 'active'
                                                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                            }`}
                                        >
                                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data && (
                <Pagination
                    currentPage={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
}
