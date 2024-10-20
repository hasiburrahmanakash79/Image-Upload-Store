// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// const { MongoClient, ServerApiVersion } = require("mongodb");
// require("dotenv").config();
// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Multer configuration for file upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads"); // Folder to save uploaded images
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
//   },
// });

// const upload = multer({ storage: storage });

// // MongoDB connection
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvcivem.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     const collection = client.db("Image-upload").collection("test");

//     // Fetch data from MongoDB
//     app.get("/test", async (req, res) => {
//       try {
//         const result = await collection.find().toArray(); // Get all data
//         res.status(200).send(result);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).send({ error: "Failed to fetch data" });
//       }
//     });

//     // API endpoint to handle the form submission
//     app.post("/test", upload.single("image"), async (req, res) => {
//       try {
//         const { name, url, details, imageHostUrl } = req.body;
//         const imageUrl = req.file ? req.file.path : null;

//         const addItems = {
//           name,
//           url,
//           details,
//           imageUrl,
//           imageHostUrl
//         };

//         const result = await collection.insertOne(addItems);
//         res.status(201).send(result);
//       } catch (error) {
//         console.error("Error saving data:", error);
//         res.status(500).send({ error: "Failed to add data" });
//       }
//     });

//     // Check connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Successfully connected to MongoDB!");
//   } finally {
//     // await client.close(); // Uncomment if you want to close the client
//   }
// }

// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Image upload server is running");
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });


const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Folder to save uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage: storage });

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvcivem.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const collection = client.db("Image-upload").collection("test");

    // Fetch data from MongoDB
    app.get("/test", async (req, res) => {
      try {
        const result = await collection.find().toArray(); // Get all data
        res.status(200).send(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send({ error: "Failed to fetch data" });
      }
    });

    // API endpoint to handle the form submission
    app.post("/test", upload.single("image"), async (req, res) => {
      try {
        const { name, url, details } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        const addItems = {
          name,
          url,
          details,
          imageUrl, // Local path stored in MongoDB
        };

        const result = await collection.insertOne(addItems);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send({ error: "Failed to add data" });
      }
    });


    // Edit data and replace image if uploaded
    app.put("/test/:id", upload.single("image"), async (req, res) => {
      const { id } = req.params;
      const { name, url, details, oldImageUrl } = req.body;
      let updatedImageUrl = oldImageUrl;

      try {
        // If a new image is uploaded, delete the old image and update the path
        if (req.file) {
          fs.unlink(oldImageUrl, (err) => {
            if (err) console.error("Error deleting old image:", err);
          });
          updatedImageUrl = req.file.path; // New image path
        }

        const updatedData = { name, url, details, imageUrl: updatedImageUrl };

        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );

        if (result.modifiedCount === 1) {
          res.status(200).send({ message: "Item updated successfully" });
        } else {
          res.status(404).send({ error: "Item not found" });
        }
      } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).send({ error: "Failed to update item" });
      }
    });


    app.delete("/test/:id", async (req, res) => {
      const { id } = req.params;
      const { imageUrl } = req.body; // Get image path from request body
    
      try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) }); // Use ObjectId properly
    
        if (result.deletedCount === 1) {
          // Delete the image file from the server
          fs.unlink(imageUrl, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
              return res.status(500).send({ error: "Failed to delete image" });
            }
          });
          res.status(200).send({ message: "Item deleted successfully" });
        } else {
          res.status(404).send({ error: "Item not found" });
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).send({ error: "Failed to delete item" });
      }
    });

    // Check connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // await client.close(); // Uncomment if you want to close the client
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Image upload server is running");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
