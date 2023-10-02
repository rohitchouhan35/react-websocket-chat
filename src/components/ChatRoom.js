import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useStateContext } from "./contexts/ContextProvider";
import "./ChatRoom.css";

var stompClient = null;
const ChatRoom = () => {
  const { isLoggedIn, userData, setUserData } = useStateContext();
  const navigate = useNavigate();

  const allowedUsers = ["sid", "rohit", "rohit", "pra"];

  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState("CHATROOM");
  useEffect(() => {
    try {
      console.log(userData);
      if (!isLoggedIn) {
        navigate("/login");
      }
      if(userData.connected) return;

      console.log("xyz");

      if (!userData.connected && userData.username != null) {
        setTimeout(registerUser, 1000); // Use setTimeout with 1000 milliseconds (1 second)
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, []);

  const connect = () => {
    try {
      console.log("connect executing...");
      let Sock = new SockJS("https://spring-websocket-chat-rc35.onrender.com/ws");
      stompClient = over(Sock);
      stompClient.connect({}, onConnected, onError);
    } catch (error) {
      console.error("Error in connect:", error);
    }
  };

  const onConnected = () => {
    try {
      console.log("onConnected executing...");
      setUserData({ ...userData, connected: true });
    
      if (stompClient.connected) { // Check if the connection is open
        stompClient.subscribe("/chatroom/public", onMessageReceived, onError);
        stompClient.subscribe(
          "/user/" + userData.username + "/private",
          onPrivateMessage, 
          onError
        );
        console.log("helloooooo");
        userJoin();
      } else {
        console.log("WebSocket connection is not open yet.");
      }
    } catch (error) {
      console.error("Error in onConnected:", error);
    }
  };
  

  const userJoin = () => {
    try {
      console.log("userJoin executing...");
      var chatMessage = {
        senderName: userData.username,
        status: "JOIN",
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    } catch (error) {
      console.error("Error in userJoin:", error);
    }
  };

  const onMessageReceived = (payload) => {
    try {
      console.log("onMessageReceived executing...");
      var payloadData = JSON.parse(payload.body);
      // eslint-disable-next-line
      switch (payloadData.status) {
        case "JOIN":
          if (!privateChats.get(payloadData.senderName)) {
            privateChats.set(payloadData.senderName, []);
            setPrivateChats(new Map(privateChats));
          }
          break;
        case "MESSAGE":
          publicChats.push(payloadData);
          setPublicChats([...publicChats]);
          break;
      }
    } catch (error) {
      console.error("Error in onMessageReceived:", error);
    }
  };

  const onPrivateMessage = (payload) => {
    try {
      console.log("onPrivateMessage executing...");
      console.log(payload);
      var payloadData = JSON.parse(payload.body);
      if (privateChats.get(payloadData.senderName)) {
        privateChats.get(payloadData.senderName).push(payloadData);
        setPrivateChats(new Map(privateChats));
      } else {
        let list = [];
        list.push(payloadData);
        privateChats.set(payloadData.senderName, list);
        setPrivateChats(new Map(privateChats));
      }
    } catch (error) {
      console.error("Error in onPrivateMessage:", error);
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    try {
      console.log("handleMessage iexecuting...");
      const { value } = event.target;
      setUserData({ ...userData, message: value });
    } catch (error) {
      console.error("Error in handleMessage:", error);
    }
  };

  const sendValue = () => {
    try {
      console.log("sendValue executing...");
      if (stompClient && stompClient.connected) {
        // Check if the connection is open
        var chatMessage = {
          senderName: userData.username,
          message: userData.message,
          status: "MESSAGE",
        };
        console.log(chatMessage);
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
        setUserData({ ...userData, message: "" });
      } else {
        // Handle the case when the WebSocket connection is not ready
        console.log("WebSocket connection not ready.");
      }
    } catch (error) {
      console.error("Error in sendValue:", error);
    }
  };

  const sendPrivateValue = () => {
    try {
      console.log("sendPrivate executing...");
      if (stompClient && stompClient.connected) {
        // Check if the connection is open
        var chatMessage = {
          senderName: userData.username,
          receiverName: tab,
          message: userData.message,
          status: "MESSAGE",
        };

        if (userData.username !== tab) {
          privateChats.get(tab).push(chatMessage);
          setPrivateChats(new Map(privateChats));
        }
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        setUserData({ ...userData, message: "" });
      } else {
        // Handle the case when the WebSocket connection is not ready
        console.log("WebSocket connection not ready.");
      }
    } catch (error) {
      console.error("Error in sendPrivateValue:", error);
    }
  };

  const handleUsername = (event) => {
    try {
      console.log("handleUsername executing...");
      const { value } = event.target;
      setUserData({ ...userData, username: value });
    } catch (error) {
      console.error("Error in handleUsername:", error);
    }
  };

  const registerUser = () => {
    try {
      connect();
    } catch (error) {
      console.error("Error in registerUser:", error);
    }
  };

  return (
    <div>
      {userData.connected ? (
        <div className="container">
          <div className="chat-box">
            <div className="member-list">
              <ul>
                <li
                  onClick={() => {
                    setTab("CHATROOM");
                  }}
                  className={`member ${tab === "CHATROOM" && "active"}`}
                >
                  Law-Faction
                </li>
                {[...privateChats.keys()]
                  .filter((name) => allowedUsers.includes(name))
                  .map((name, index) => (
                    <li
                      onClick={() => {
                        setTab(name);
                      }}
                      className={`member ${tab === name && "active"}`}
                      key={index}
                    >
                      {name}
                    </li>
                  ))}
              </ul>
            </div>
            {tab === "CHATROOM" && (
              <div className="chat-content">
                <ul className="chat-messages">
                  {publicChats.map((chat, index) => (
                    <li
                      className={`message ${
                        chat.senderName === userData.username && "self"
                      }`}
                      key={index}
                    >
                      {chat.senderName !== userData.username && (
                        <div className="avatar">{chat.senderName}</div>
                      )}
                      <div className="message-data">{chat.message}</div>
                      {chat.senderName === userData.username && (
                        <div className="avatar self">{chat.senderName}</div>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="send-message">
                  <input
                    type="text"
                    className="input-message"
                    placeholder="enter the message"
                    value={userData.message}
                    onChange={handleMessage}
                  />
                  <button
                    type="button"
                    className="send-button"
                    onClick={sendValue}
                  >
                    send
                  </button>
                </div>
              </div>
            )}
            {tab !== "CHATROOM" && (
              <div className="chat-content">
                <ul className="chat-messages">
                  {[...privateChats.get(tab)].map((chat, index) => (
                    <li
                      className={`message ${
                        chat.senderName === userData.username && "self"
                      }`}
                      key={index}
                    >
                      {chat.senderName !== userData.username && (
                        <div className="avatar">{chat.senderName}</div>
                      )}
                      <div className="message-data">{chat.message}</div>
                      {chat.senderName === userData.username && (
                        <div className="avatar self">{chat.senderName}</div>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="send-message">
                  <input
                    type="text"
                    className="input-message"
                    placeholder="enter the message"
                    value={userData.message}
                    onChange={handleMessage}
                  />
                  <button
                    type="button"
                    className="send-button"
                    onClick={sendPrivateValue}
                  >
                    send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="loading-spinner"></div>
      )}
    </div>
  );
};

export default ChatRoom;
