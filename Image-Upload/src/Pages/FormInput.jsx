import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const FormInput = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [imagePreview, setImagePreview] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Image preview handler
  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };


  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("image", data.imageUrl[0]);
    formData.append("name", data.name);
    formData.append("url", data.url);
    formData.append("details", data.details);
    console.log(formData, data);
  
    try {
      // Send form data (including the image) to the backend
      const response = await axios.post("http://localhost:3000/test", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data.insertedId) {
        reset();
        setImagePreview(null);
        navigate(from, { replace: true });
        Swal.fire({
          showConfirmButton: false,
          timer: 1500,
          title: "Info added Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error uploading image or adding news:", error);
      Swal.fire({
        title: "An error occurred!",
        text: "Please try again later.",
        icon: "error",
      });
    }
  };
  
  return (
    <div className="container mx-auto">
      <div className="rounded-lg p-10">
        <div>
          <h2 className="text-2xl font-bold text-center mb-7">Form Input</h2>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
         
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5">
          <div className="">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="imageUrl"
            >
            Image
            </label>
            <div className="relative w-full h-64 md:h-80 border-2 border-dashed rounded-lg flex justify-center items-center cursor-pointer">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <FaCamera className="text-6xl text-gray-400 mb-2" />
                  <p className="text-gray-400">Select an image to preview</p>
                </div>
              )}
              <input
                type="file"
                {...register("imageUrl", { required: true })}
                onChange={handleImagePreview}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-2">
               Image is required.
              </p>
            )}
          </div>

          {/* Form Fields Section */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="name"
              >
              Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name", { required: true })}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  Name is required.
                </p>
              )}
            </div>

            {/* URL */}
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="url"
              >
                URL
              </label>
              <input
                type="text"
                id="url"
                {...register("url", { required: true })}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${
                  errors.pdfUrl ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.pdfUrl && (
                <p className="text-red-500 text-sm mt-1">
                  URL is required.
                </p>
              )}
            </div>

            {/* Details */}
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="details"
              >
                Details
              </label>
              <textarea
                id="details"
                {...register("details", { required: true })}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                rows="4"
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  Details are required.
                </p>
              )}
            </div>

            
          </div>
          </div>
          {/* Submit Button */}
          <div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default FormInput;
