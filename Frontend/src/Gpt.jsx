import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { MyContext } from "./MyContext";
import { useEffect, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Gpt = () => {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false); // ADDED

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevtheme) => (prevtheme === "dark" ? "light" : "dark"));
  };

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    prevChats,
    setPrevChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
    toggleTheme,
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
      <ToastContainer theme={theme} position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Gpt;
