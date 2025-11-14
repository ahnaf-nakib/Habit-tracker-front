import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// আপনার মূল CSS ফাইলটি ইম্পোর্ট করা হয়েছে:
import './styles/main.css' 
// 'react-toastify' CSS ইম্পোর্ট করা হয়েছে
import 'react-toastify/dist/ReactToastify.css' 
// 'ToastContainer' রুট লেভেলে রাখার দরকার নেই, এটি App.jsx এ আছে
// import { ToastContainer } from 'react-toastify' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <ToastContainer /> <--- এই লাইনটি বাদ দেওয়া হলো */}
  </React.StrictMode>
)