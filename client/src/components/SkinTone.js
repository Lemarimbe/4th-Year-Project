import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import { FaTimes, FaSpinner, FaUpload } from 'react-icons/fa';

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const SkinTone = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [image, setImage] = useState('');
    const [upload, setUpload] = useState('');
    const [preview, setPreview] = useState('');
    const [isWebcamMode, setIsWebcamMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [progress, setProgress] = useState(0); // Progress state
    const [isDragOver, setIsDragOver] = useState(false); // Drag and drop state

    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setUpload(imageSrc);
        setPreview(imageSrc);
        setIsWebcamMode(false); // Disable webcam mode after capturing
    }, [webcamRef]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUpload(file);
            setPreview(URL.createObjectURL(file)); // Preview the selected file
        } else {
            // Deselect the currently selected image
            setSelectedFile(null);
            setImage('');
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            setUpload(file);
            setPreview(URL.createObjectURL(file)); // Preview the selected file
        }
    };

    const handleDeselectImage = () => {
        setSelectedFile(null);
        setImage('');
        setPreview('');
    };

    const startWebcam = () => {
        setIsWebcamMode(true);
        setImage(''); // Clear the image preview
    };

    const uploadImage = async () => {
        setIsLoading(true); // Set loading state to true
        setProgress(0); // Reset progress

        try {
            const formData = new FormData();
            formData.append('file', upload);
            formData.append('upload_preset', 'faozlxxi');

            const cloud_config = {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            };

            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/trinity-social/image/upload',
                formData,
                cloud_config
            );

            console.log('Image uploaded:', response.data);
            const token = localStorage.getItem("token"); // Retrieve the token from localStorage
            console.log(token);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the request headers
                },
            };
            if (response.data.secure_url) {
                let image_url = response.data.secure_url
                const skin_response = await axios.post('http://localhost:5050/skin/', {image_url}, config)
                console.log(skin_response)
                if (skin_response.data.success) {
                    alert('Image processed successfully!')
                    navigate('/')
                }
            }
            // Handle successful image upload, such as sending the Cloudinary URL to your backend
        } catch (error) {
            console.error('Image upload failed:', error);
            // Handle image upload failure, such as displaying an error message
        } finally {
            setIsLoading(false); // Set loading state to false after upload completes
        }
    };

    const handleUpload = () => {
        if (image) {
            // If an image is selected or captured
            uploadImage(image);
        }
    };

    return (
        <div className="max-w-screen-md mx-auto p-8 bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">Upload Images</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-6">
                    <label
                        htmlFor="fileInput"
                        className={`block mb-2 font-medium text-gray-700 cursor-pointer ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            } flex items-center justify-center p-6 border-2 border-dashed rounded-md hover:border-blue-500 hover:bg-blue-50`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="text-center">
                            <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                            <span className="mt-2 block text-sm font-medium text-gray-700">
                                Drag and drop an image, or select a file
                            </span>
                        </div>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="sr-only"
                        />
                    </label>
                </div>

                <button
                    onClick={startWebcam}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-6"
                >
                    Capture photo using webcam
                </button>

                {isWebcamMode && (
                    <div className="mb-6">
                        <Webcam
                            audio={false}
                            height={720}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={1280}
                            videoConstraints={videoConstraints}
                        />
                        <button
                            onClick={capture}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mt-4"
                        >
                            Capture photo
                        </button>
                    </div>
                )}

                {preview !== '' && (
                    <div className="relative mb-6">
                        <FaTimes
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={handleDeselectImage}
                        />
                        <img src={preview} alt="Selected" className="w-full h-auto rounded-lg" />
                        {isLoading ? (
                            <div className="flex items-center justify-center mt-4">
                                <FaSpinner className="animate-spin mr-2 text-blue-500" />
                                <span className="text-gray-700">Uploading {progress}%</span>
                            </div>
                        ) : (
                            <button
                                onClick={uploadImage}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mt-4"
                            >
                                Upload Image
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkinTone;