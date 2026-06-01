# IdeaVault Server 🚀

Backend API for the **IdeaVault** platform, built with **Node.js**, **Express.js**, and **MongoDB**. This server handles idea management, categories, comments, authentication middleware, and CRUD operations.

## 🌐 Live API

Backend Repository: https://github.com/shrabon10/IdeaVault-Server

---

## 📌 Features

* JWT Authentication & Authorization
* MongoDB Database Integration
* Create, Read, Update, Delete (CRUD) Ideas
* Create, Read, Update, Delete Comments
* Category Management
* Trending Ideas API
* Popular Categories API
* Search Ideas by Name or Category
* Protected Routes with Token Verification
* RESTful API Design
* CORS Enabled

---

## 🛠️ Technologies Used

* Node.js
* Express.js
* MongoDB
* JOSE (JWT Verification)
* Dotenv
* CORS

---

## 📂 Project Structure

```bash
IdeaVault-Server/
│
├── index.js
├── package.json
├── .env
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

CLIENT_URL=http://localhost:3000
```

---

## 📥 Installation

### Clone the repository

```bash
git clone https://github.com/shrabon10/IdeaVault-Server.git
```

### Navigate to project folder

```bash
cd IdeaVault-Server
```

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Run production server

```bash
npm start
```

---

# 🔐 Authentication

Protected routes require an Authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 📚 API Endpoints

## Categories

### Get All Categories

```http
GET /categories
```

### Get Popular Categories

```http
GET /popularCategories
```

---

## Ideas

### Get All Ideas

```http
GET /ideas
```

### Get Trending Ideas

```http
GET /trendingIdeas
```

### Get Single Idea (Protected)

```http
GET /idea/:id
```

### Search Ideas

```http
GET /searchedIdeas?search=technology
```

### Create Idea

```http
POST /idea
```

Request Body:

```json
{
  "name": "AI Note Generator",
  "category": "Technology",
  "description": "Generate notes using AI"
}
```

### Update Idea

```http
PATCH /idea/:id
```

### Delete Idea

```http
DELETE /idea/:id
```

---

## Comments

### Get All Comments

```http
GET /comments
```

### Create Comment

```http
POST /comment
```

### Update Comment

```http
PATCH /comment/:id
```

### Delete Comment

```http
DELETE /comment/:id
```

---

## 📦 Dependencies

```json
{
  "cors": "^latest",
  "dotenv": "^latest",
  "express": "^latest",
  "mongodb": "^latest",
  "jose-cjs": "^latest"
}
```

---

## 🚀 Future Improvements

* User-specific ideas
* Like & Save functionality
* Pagination
* Advanced filtering
* Role-based authorization
* API rate limiting
* Cloud image uploads

---

## 👨‍💻 Author

**Omor Faruk Shrabon**

GitHub: https://github.com/shrabon10

---

## 📄 License

This project is licensed under the MIT License.
