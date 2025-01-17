import React, { useEffect, useState } from "react";
import FileExplorer from "./FileExplorer";
import CodeEditor from "./CodeEditor";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { cleanResponse } from "./Helpers/Cleaner";

type FileData = {
  filepath: string;
  content: string;
};

// const jsonResponse = {
//   output: [
//     {
//       filepath: "src/config/database.js",
//       content:
//         "const mongoose = require('mongoose');\nconst database = () => {  mongoose.connect('mongodb://localhost/todo', {    useNewUrlParser: true,     useUnifiedTopology: true,    useFindAndModify: false,    useCreateIndex: true  });\n};\nmodule.exports = database;\n",
//     },
//     {
//       filepath: "src/config/dotenv.js",
//       content: "require('dotenv').config();\n",
//     },
//     {
//       filepath: "src/models/user.model.js",
//       content:
//         "const mongoose = require('mongoose');\nconst userSchema = new mongoose.Schema({  name: {    type: String,    required: true  },  email: {    type: String,    required: true,    unique: true  },  password: {    type: String,    required: true  }});\nconst User = mongoose.model('User', userSchema);\nmodule.exports = User;\n",
//     },
//     {
//       filepath: "src/models/product.model.js",
//       content:
//         "const mongoose = require('mongoose');\nconst productSchema = new mongoose.Schema({  name: {    type: String,    required: true  },  price: {    type: Number,    required: true  },  description: {    type: String,    required: true  }});\nconst Product = mongoose.model('Product', productSchema);\nmodule.exports = Product;\n",
//     },
//     {
//       filepath: "src/controllers/user.controller.js",
//       content:
//         "const User = require('../models/user.model');\nconst createUser = async (req, res) => {  try {    const user = new User(req.body);\n    await user.save();\n    res.status(201).json({ message: 'User created successfully' });\n  } catch (error) {    console.error(error);\n    res.status(500).json({ error: 'An error occurred while creating the user' });\n  }};\nconst findUser = async (req, res) => {  try {    const user = await User.findById(req.params.id);\n    if (!user) {      return res.status(404).json({ error: 'User not found' });\n    }    res.json(user);\n  } catch (error) {    console.error(error);\n    res.status(500).json({ error: 'An error occurred while finding the user' });\n  }};\nmodule.exports = {  createUser,   findUser};\n",
//     },
//     {
//       filepath: "src/controllers/product.controller.js",
//       content:
//         "const Product = require('../models/product.model');\nconst createProduct = async (req, res) => {  try {    const product = new Product(req.body);\n    await product.save();\n    res.status(201).json({ message: 'Product created successfully' });\n  } catch (error) {    console.error(error);\n    res.status(500).json({ error: 'An error occurred while creating the product' });\n  }};\nconst findProduct = async (req, res) => {  try {    const product = await Product.findById(req.params.id);\n    if (!product) {      return res.status(404).json({ error: 'Product not found' });\n    }    res.json(product);\n  } catch (error) {    console.error(error);\n    res.status(500).json({ error: 'An error occurred while finding the product' });\n  }};\nmodule.exports = {  createProduct,   findProduct};\n",
//     },
//     {
//       filepath: "src/routes/user.routes.js",
//       content:
//         "const express = require('express');\nconst userController = require('../controllers/user.controller');\nconst router = express.Router();\nrouter.post('/', userController.createUser);\nrouter.get('/:id', userController.findUser);\nmodule.exports = router;\n",
//     },
//     {
//       filepath: "src/routes/product.routes.js",
//       content:
//         "const express = require('express');\nconst productController = require('../controllers/product.controller');\nconst router = express.Router();\nrouter.post('/', productController.createProduct);\nrouter.get('/:id', productController.findProduct);\nmodule.exports = router;\n",
//     },
//     {
//       filepath: "src/services/user.service.js",
//       content:
//         "const User = require('../models/user.model');\nconst createUser = async (userData) => {  const user = new User(userData);\n  return user.save();\n};\nconst findUser = async (userId) => {  return User.findById(userId);\n};\nmodule.exports = {  createUser,   findUser};\n",
//     },
//     {
//       filepath: "src/services/email.service.js",
//       content:
//         "const sendEmail = async (emailData) => {  // Add email sending logic here};\nmodule.exports = {  sendEmail};\n",
//     },
//     {
//       filepath: "src/middlewares/error.middleware.js",
//       content:
//         "const errorHandler = (err, req, res, next) => {  console.error(err);\n  res.status(500).json({ error: 'An error occurred' });\n};\nmodule.exports = errorHandler;\n",
//     },
//     {
//       filepath: "src/app.js",
//       content:
//         "const express = require('express');\nconst userRoutes = require('./routes/user.routes');\nconst productRoutes = require('./routes/product.routes');\nconst errorMiddleware = require('./middlewares/error.middleware');\nconst app = express();\napp.use(express.json());\napp.use('/api/users', userRoutes);\napp.use('/api/products', productRoutes);\napp.use(errorMiddleware);\nmodule.exports = app;\n",
//     },
//     {
//       filepath: ".env",
//       content: "MONGO_URI=mongodb://localhost/todoAPI_KEY=your_api_key",
//     },
//   ],
// };

interface FileDataResponse {
  filepath: string;
  content: string;
}

interface jsonResponseType {
  output: FileDataResponse[];
}

function App() {
  const location = useLocation();
  const prompt = location.state?.prompt || "";
  const [selectedFile, setSelectedFile] = useState<{
    path: string;
    content: string;
  } | null>(null);
  const [jsonResponse, setJsonResponse] = useState<jsonResponseType>({
    output: [],
  });

  async function init() {
    try {
      const response = await axios.post("http://localhost:3000/chats", {
        messages: prompt,
      });
      const cleanJson = cleanResponse(JSON.stringify(response.data.Content));
      // console.log(cleanJson);
      const final = cleanJson.replace(/;/g, ";\\n");
      // console.log(final);
      setJsonResponse(JSON.parse(final));
    } catch (error: any) {
      console.error("Something related to the apiReasponse", error);
    }
  }

  useEffect(() => {
    init();
  }, []);

  const handleFileSelect = (path: string, content: string) => {
    setSelectedFile({ path, content });
  };

  return (
    <div className="h-screen flex bg-gray-900">
      {/* Left panel - Status */}
      <div className="w-[30%] h-full p-4 bg-gray-800 border-r border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-100">
          Project Status
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              Project Structure
            </h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-3xl font-bold text-blue-400">
                  {jsonResponse.output.length}
                </p>
                <p className="text-sm text-gray-400">Total Files</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-400">
                  {
                    new Set(
                      jsonResponse.output.map((f) =>
                        f.filepath.split("/").slice(0, -1).join("/")
                      )
                    ).size
                  }
                </p>
                <p className="text-sm text-gray-400">Total Folders</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              File Types
            </h3>
            <div className="space-y-2">
              {Object.entries(
                jsonResponse.output.reduce((acc, file) => {
                  const ext = file.filepath.split(".").pop() || "unknown";
                  acc[ext] = (acc[ext] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([ext, count]) => (
                <div key={ext} className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">.{ext} files</span>
                  <span className="text-sm font-medium text-blue-400">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              Recent Changes
            </h3>
            <div className="space-y-2">
              {jsonResponse.output.slice(0, 3).map((file, index) => (
                <div key={index} className="text-sm text-gray-400">
                  <p className="font-medium text-gray-300">{file.filepath}</p>
                  <p className="text-xs text-gray-500">Modified recently</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Horizontal layout */}
      <div className="w-[70%] h-full flex bg-gray-900">
        {/* Explorer section */}
        <div className="w-1/3 p-4 border-r border-gray-700">
          <FileExplorer
            files={jsonResponse.output}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* Code panel section */}
        <div className="w-2/3">
          <CodeEditor
            filePath={selectedFile?.path}
            content={selectedFile?.content}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
