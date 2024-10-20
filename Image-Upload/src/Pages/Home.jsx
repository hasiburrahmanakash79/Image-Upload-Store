import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/test");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleEdit = async (id, newName, newUrl, newDetails, newImageFile, oldImageUrl) => {
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("url", newUrl);
    formData.append("details", newDetails);
    formData.append("oldImageUrl", oldImageUrl); // Send old image path to delete it
    if (newImageFile) formData.append("image", newImageFile); // Append new image if provided
  
    try {
      const response = await axios.put(`http://localhost:3000/test/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);
  
      // Success alert
      Swal.fire("Updated!", "Your data has been updated.", "success");
  
      fetchData(); // Refresh data after updating
      setEditingItem(null); // Close the modal
    } catch (error) {
      console.error("Error updating data:", error);
      Swal.fire("Error!", "Failed to update the data.", "error");
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  // Delete item with confirmation
  const handleDelete = async (id, imageUrl) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3000/test/${id}`, {
            data: { imageUrl }, // Send image path to backend for deletion
          });
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          fetchData(); // Refresh data after deletion
        } catch (error) {
          console.error("Error deleting data:", error);
          Swal.fire("Error!", "Failed to delete the file.", "error");
        }
      }
    });
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold mb-4">Uploaded Data</h1>
      <Link to='/upload' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Add Data</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {data.map((item) => (
          <div key={item._id} className="p-4 border rounded shadow">
            <img
              src={`http://localhost:3000/${item.imageUrl}`} // Ensure this matches your Express static path
              alt={item.name}
              className="w-full h-48 object-cover mb-2"
            />
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p>{item.details}</p>
                <p className="text-sm text-gray-500">URL: {item.url}</p>
              </div>
              <div  className="flex items-center gap-3">
              <button
                onClick={() => handleDelete(item._id, item.imageUrl)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setEditingItem(item)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
            <input
              type="text"
              placeholder="Name"
              defaultValue={editingItem.name}
              onChange={(e) => (editingItem.name = e.target.value)}
              className="block w-full mb-2 border px-2 py-1"
            />
            <input
              type="text"
              placeholder="URL"
              defaultValue={editingItem.url}
              onChange={(e) => (editingItem.url = e.target.value)}
              className="block w-full mb-2 border px-2 py-1"
            />
            <textarea
              placeholder="Details"
              defaultValue={editingItem.details}
              onChange={(e) => (editingItem.details = e.target.value)}
              className="block w-full mb-2 border px-2 py-1"
            />
            <input
              type="file"
              onChange={(e) => (editingItem.newImage = e.target.files[0])}
              className="block w-full mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() =>
                  handleEdit(
                    editingItem._id,
                    editingItem.name,
                    editingItem.url,
                    editingItem.details,
                    editingItem.newImage,
                    editingItem.imageUrl
                  )
                }
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}

{editingItem && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
      
      <input
        type="text"
        placeholder="Name"
        defaultValue={editingItem.name}
        onChange={(e) => (editingItem.name = e.target.value)}
        className="block w-full mb-2 border px-2 py-1"
      />

      <input
        type="text"
        placeholder="URL"
        defaultValue={editingItem.url}
        onChange={(e) => (editingItem.url = e.target.value)}
        className="block w-full mb-2 border px-2 py-1"
      />

      <textarea
        placeholder="Details"
        defaultValue={editingItem.details}
        onChange={(e) => (editingItem.details = e.target.value)}
        className="block w-full mb-2 border px-2 py-1"
      />

      {/* Image Upload with Preview */}
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            editingItem.newImage = file;
            const reader = new FileReader();
            reader.onload = (event) => {
              editingItem.previewImageUrl = event.target.result; // Store preview URL
              setEditingItem({ ...editingItem }); // Trigger re-render
            };
            reader.readAsDataURL(file); // Generate preview URL
          }
        }}
        className="block w-full mb-4"
      />

      {/* Show Image Preview */}
      {editingItem.previewImageUrl && (
        <div className="mb-4">
          <img
            src={editingItem.previewImageUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded"
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() =>
            handleEdit(
              editingItem._id,
              editingItem.name,
              editingItem.url,
              editingItem.details,
              editingItem.newImage,
              editingItem.imageUrl
            )
          }
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mr-2"
        >
          Save
        </button>
        <button
          onClick={() => setEditingItem(null)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Home;
