import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import axios from "axios";
import { v1 as uuidv1 } from "uuid";
import { toast } from "react-toastify";

function Sidebar({ isOpen, onClose }) {
  const {
    allThreads,
    setAllThreads,
    setPrompt,
    setReply,
    reply,
    currThreadId,
    setCurrThreadId,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/thread/${threadId}`
      );
      console.log(response.data);

      // Refresh the thread list after deletion
      getAllThreads();

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  const getAllMsg = async (threadId) => {
    setCurrThreadId(threadId);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/thread/${threadId}`
      );
      setPrevChats(response.data);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  const getAllThreads = async () => {
    try {
      const fetchThreads = await axios.get("http://localhost:8080/api/thread");
      const filterData = fetchThreads.data.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filterData);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId, reply]);

  return (
    <div
      className={
        isOpen !== undefined
          ? `sidebarContainer ${isOpen ? "open" : "closed"}`
          : "sidebarContainer"
      }
    >
      {/* MOBILE: add close button */}
      <div className="newChatSection">
        <span className="gptLogoImg" onClick={createNewChat}>
          <img
            className="gptLogo"
            src="src/assets/chatgptlogo.png"
            alt="LOGO"
          />
        </span>
        <span className="gptLogoImg newChatIcon" onClick={createNewChat}>
          <i className="newchat fa-solid fa-pen-to-square"></i>
        </span>
        {/* Only show close in mobile (max-width 1024px) */}
        {isOpen !== undefined && (
          <span
            className="gptLogoImg"
            style={{ marginLeft: 8, display: "flex" }}
            onClick={onClose}
          >
            <i
              className="fa-solid fa-xmark"
              style={{ fontSize: "1.25rem" }}
            ></i>
          </span>
        )}
      </div>
      <div className="history">
        <p id="sidechat">Chats</p>
        <ul>
          {allThreads &&
            allThreads.map((thread, idx) => (
              <li
                onClick={() => getAllMsg(thread.threadId)}
                key={idx}
                className={
                  currThreadId === thread.threadId
                    ? "highlighted listHis"
                    : "listHis"
                }
              >
                {thread.title.length > 40
                  ? thread.title.slice(0, 40) + "..."
                  : thread.title}
                <i
                  className="fa-solid fa-trash-can"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(thread.threadId);
                  }}
                ></i>
              </li>
            ))}
        </ul>
      </div>
      <div className="info">
        <p>By &nbsp; &nbsp; &hearts;</p>
      </div>
    </div>
  );
}
export default Sidebar;
