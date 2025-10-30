import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";

function ChatWindow({ onSidebarToggle }) {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setNewChat,
    setPrevChats,
    toggleTheme,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    try {
      const response = await axios.post("https://ai-buddy-1-nodc.onrender.com/api/create", {
        threadId: currThreadId,
        message: prompt,
      });
      setReply(response.data.reply);
    } catch (err) {
      toast.error(err.response.data.error);
    }
    setLoading(false);
  };
  const handleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        { role: "user", content: prompt },
        { role: "model", content: reply },
      ]);
    }
    setPrompt("");
  }, [reply]);

  const handleToast = () => {
    toast.error("This feature is not available yet");
  };
  return (
    <div id="chatWindow">
      <div className="navbar">
        {/* Sidebar toggle on mobile */}
        {onSidebarToggle && (
          <span
            className="gptLogoImg"
            onClick={onSidebarToggle}
            style={{ marginRight: "0.7rem", marginLeft: "0.5rem" }}
          >
            <img
              className="gptLogo"
              src="src/assets/chatgptlogo.png"
              alt="LOGO"
            />
          </span>
        )}
        <div id="name">
          <h3>
            AIBuddy <i className="fa-solid fa-chevron-down"></i>
          </h3>
        </div>
        <div id="user" onClick={handleDropdown}>
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
      {isOpen && (
        <>
          <div className="dropdown">
            <div id="information">
              <p>Functional</p>
            </div>

            <div className="dropItms" id="theme" onClick={toggleTheme}>
              <i className="fa-solid fa-circle-half-stroke"></i> Appearance{" "}
            </div>
            <div id="information">
              <p>Not-Functional</p>
            </div>

            <div className="dropItms" onClick={handleToast}>
              <i className="fa-solid fa-gear"></i> Setting
            </div>
            <div className="dropItms" onClick={handleToast}>
              <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade
            </div>
            <div
              className="dropItms"
              onClick={handleToast}
              style={{ color: "red" }}
            >
              <i
                className="fa-solid fa-right-from-bracket"
                style={{ color: "red" }}
              ></i>{" "}
              Log out
            </div>
          </div>
        </>
      )}
      <Chat />

      <div className="userInput">
        <PuffLoader
          color="whitesmoke"
          loading={loading}
          size={40}
          className="loader"
        />
        <div className="input">
          <textarea
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></textarea>
          <i className="fa-solid fa-share" onClick={getReply}></i>
        </div>
        <div id="information">
          <p>AIBuddy can make mistakes, so double-check it</p>
        </div>
      </div>
    </div>
  );
}
export default ChatWindow;
