import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { FaTimes } from 'react-icons/fa';

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

    const webcamRef = useRef(null);

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

        try {
            const formData = new FormData();
            formData.append('file', upload);
            formData.append('upload_preset', 'faozlxxi');

            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/trinity-social/image/upload',
                formData
            );

            console.log('Image uploaded:', response.data);
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
        <div className="max-w-screen-md mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Upload Images</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <label className="block mb-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        
                    />
                    
                </label>

                <button onClick={startWebcam} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Capture photo using webcam
                </button>

                {isWebcamMode && (
                    <div className="mt-4">
                        <Webcam
                            audio={false}
                            height={720}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={1280}
                            videoConstraints={videoConstraints}
                        />
                        <button onClick={capture} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                            Capture photo
                        </button>
                    </div>
                )}

                {preview !== '' && (
                    <div className="mt-4 relative">
                        <FaTimes className="absolute top-0 right-0 cursor-pointer" onClick={handleDeselectImage} />
                        <img src={preview} alt="Selected" className="w-full h-auto rounded mt-2" />
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            <button onClick={uploadImage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
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
