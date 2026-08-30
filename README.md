# Blog Application - MERN + Tailwind

A full-stack blog platform built with **MongoDB, Express, React, Node.js** and styled using **Tailwind CSS**.  
Users can sign up, log in, create posts, like/dislike, comment, and manage their own profile.
visit ---- https://blog-application-mern-tailwind.vercel.app/

---

## 🚀 Features
- 🔐 Secure user authentication (Signup/Login with JWT)
- 📝 Create, edit, and delete blog posts
- 👍 Like / 👎 Dislike system with live counts
- 💬 Comment section with markdown support
- 👤 Profile page with user-specific posts
- 🌙 Dark mode + custom fonts via ThemeContext
- 📱 Responsive design using Tailwind CSS
- 🔗 Share posts with native browser share API

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios  
- **Backend:** Node.js, Express.js, MongoDB Atlas  
- **Auth:** JWT (JSON Web Token)  
- **Deployment:** Vercel (frontend), Render (backend)  

---

## ⚙️ Installation

1. Clone the repository:

   git clone https://github.com/your-username/blog-application-mern-tailwind.git
   cd blog-application-mern-tailwind
2. Install dependencies:

    - npm install
   
3.Create .env file in root:

   env
     VITE_API_BASE_URL=http://localhost:5000
     MONGO_URI=your_mongo_connection_string
     JWT_SECRET=your_secret_key

4.Run backend:

  - npm run server
    
5.Run frontend:

  - npm run dev


📌 Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas
