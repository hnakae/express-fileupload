import React, { useRef, useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const fileInput = useRef(null);
  const url = "http://localhost:3000/upload";

  const [image, setImage] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const handleChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fileToUpload", fileInput.current.files[0]);
    try {
      const response = await axios.post(url, formData);
      setUploaded(true);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    setImage(null);
    setUploaded(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <style>
        {`
        .container {
            position: relative;
            z-index: 1;
          }

          .overlay {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 10;
          }
        `}
      </style>
      <form onSubmit={handleSubmit} className="p-8">
        <input
          type="file"
          ref={fileInput}
          onChange={handleChange}
          onClick={handleReset}
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        />
        {image && (
          <div className="container">
            <img src={image} alt="Selected image" />
            {uploaded && (
              <div className="overlay inset-0 flex items-center justify-center">
                <i className="fas fa-check-circle text-5xl text-teal-500 text-center" />
              </div>
            )}
          </div>
        )}
        <button
          type="submit"
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
        >
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
