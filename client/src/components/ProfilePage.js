import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
    const [user, setUser] = useState({
        username: '',
        name: '',
        skinTone: '',
        profilePic: null,
    });

    useEffect(() => {
        // Get user details from localStorage
        const userDetails = JSON.parse(localStorage.getItem('user'));
        if (userDetails) {
            setUser({
                username: userDetails.username,
                name: userDetails.name,
                skinTone: userDetails.skinTone,
                profilePic: userDetails.profilePic,
            });
        }
    }, []);

    const [progress, setProgress] = useState(0);

    const handleSubmit = async () => {
        try {
            if (user.profilePic instanceof File) {
                const formData = new FormData();
                formData.append('file', user.profilePic);
                formData.append('upload_preset', 'faozlxxi');

                const cloudConfig = {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    },
                };

                const cloudinaryResponse = await axios.post(
                    'https://api.cloudinary.com/v1_1/trinity-social/image/upload',
                    formData,
                    cloudConfig
                );

                const { secure_url } = cloudinaryResponse.data;

                const updatedUser = {
                    ...user,
                    profilePic: secure_url,
                };

                // Send the updated user data to the backend
                await sendUpdatedUserData(updatedUser);

                // Update local storage with the new user data
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                // If profile picture is not changed, send user data directly to backend
                await sendUpdatedUserData(user);
            }
        } catch (error) {
            console.error('An error occurred while updating user details:', error);
        }
    };

    const sendUpdatedUserData = async (userData) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.put('http://localhost:5050/profile', userData, config);

        if (response.status === 200) {
            console.log('User details updated successfully:', response.data);
        } else {
            console.error('Failed to update user details');
        }
    };
    

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white shadow-md rounded-md">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold">Profile</h2>
                    <p className="text-gray-500">Update your profile information.</p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <label
                                htmlFor="profile-picture"
                                className="cursor-pointer flex items-center space-x-2 text-sm font-medium text-gray-500 dark:text-gray-400"
                            >
                                <span className="underline">Change</span>
                                <span className="underline">Profile Picture</span>
                                <span className="opacity-70">.jpg</span>
                            </label>
                            <input
                                className="sr-only"
                                id="profile-picture"
                                type="file"
                                onChange={(e) =>
                                    setUser({ ...user, profilePic: e.target.files[0] })
                                }
                            />
                        </div>
                        <img
                            src={
                                user.profilePic instanceof File
                                    ? URL.createObjectURL(user.profilePic)
                                    : user.profilePic || '/logo192.png'
                            }
                            alt=""
                            className="rounded-full"
                            style={{
                                aspectRatio: '96/96',
                                objectFit: 'cover',
                                width: '96px',
                                height: '96px',
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="space-y-1.5">
                            <label htmlFor="username" className="block font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={user.username}
                                onChange={(e) =>
                                    setUser({ ...user, username: e.target.value })
                                }
                                placeholder="Username"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="block font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={user.name}
                                onChange={(e) =>
                                    setUser({ ...user, name: e.target.value })
                                }
                                placeholder="Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <p className="font-medium text-gray-700">Skin Tone</p>
                        <div className="grid grid-cols-5 items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 dark:border-gray-800">
                                <input
                                    className="sr-only"
                                    id="tone1"
                                    name="tone"
                                    type="radio"
                                    checked={user.skinTone === 'Porcelain'}
                                    onChange={(e) => setUser({ ...user, skinTone: 'Porcelain' })}
                                />
                                <label className="w-3 h-3 rounded-full bg-[#f2d6ae]" htmlFor="tone1" />
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 dark:border-gray-800">
                                <input
                                    className="sr-only"
                                    id="tone2"
                                    name="tone"
                                    type="radio"
                                    checked={user.skinTone === 'Ivory'}
                                    onChange={(e) => setUser({ ...user, skinTone: 'Ivory' })}
                                />
                                <label className="w-3 h-3 rounded-full bg-[#f2d6ae]" htmlFor="tone2" />
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 dark:border-gray-800">
                                <input
                                    className="sr-only"
                                    id="tone3"
                                    name="tone"
                                    type="radio"
                                    checked={user.skinTone === 'Beige'}
                                    onChange={(e) => setUser({ ...user, skinTone: 'Beige' })}
                                />
                                <label className="w-3 h-3 rounded-full bg-[#e0ac7c]" htmlFor="tone3" />
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 dark:border-gray-800">
                                <input
                                    className="sr-only"
                                    id="tone4"
                                    name="tone"
                                    type="radio"
                                    checked={user.skinTone === 'Tan'}
                                    onChange={(e) => setUser({ ...user, skinTone: 'Tan' })}
                                />
                                <label className="w-3 h-3 rounded-full bg-[#c68642]" htmlFor="tone4" />
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 dark:border-gray-800">
                                <input
                                    className="sr-only"
                                    id="tone5"
                                    name="tone"
                                    type="radio"
                                    checked={user.skinTone === 'Caramel'}
                                    onChange={(e) => setUser({ ...user, skinTone: 'Caramel' })}
                                />
                                <label className="w-3 h-3 rounded-full bg-[#b37628]" htmlFor="tone5" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t flex justify-end space-x-2">
                    <button
                        type="button"
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;