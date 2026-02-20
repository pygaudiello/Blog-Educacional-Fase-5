// Styles padrão
import "./App.css";

// App.jsx
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Admin from "./pages/Admin/Admin";
import CreatePost from "./pages/Postagem/CreatePost";
import EditPost from "./pages/EditPost/EditPost";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import PostView from "./pages/PostView/PostView";
import Gerenciar from "./pages/Gerenciar/Gerenciar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/gerenciar" element={<Gerenciar />} />
      </Routes>
    </>
  );
}

export default App;
