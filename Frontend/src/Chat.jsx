import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { prevChats, setPrevChats, newChat, setNewChats, reply } =
    useContext(MyContext);

  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    if (!(prevChats && prevChats.length)) return;

    const content = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));

      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [prevChats, reply]);

  return (
    <>
      {newChat && <h1>Start a New Chat!</h1>}

      <div className="chats" style={newChat === true ? {display:"none"}:{}}>
        {prevChats &&
          prevChats.slice(0, -1).map((chat, idx) => (
            <div
              className={chat.role == "user" ? "userDiv" : "modelDiv"}
              key={idx}
            >
              {chat.role == "user" ? (
                <p className="userMsg">{chat.content}</p>
              ) : (
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              )}
            </div>
          ))}

        {prevChats.length > 0 && (
          <>
            {latestReply !== null ? (
              <div className="modelDiv" key={"typing"}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {latestReply}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="modelDiv" key={"non-typing"}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {prevChats[prevChats.length - 1].content}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}

export default Chat;
