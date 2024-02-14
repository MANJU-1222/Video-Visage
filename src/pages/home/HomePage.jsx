import "./HomePage.css";

import VideoUploadModal from "../../components/videouploadmodal/VideoUploadModal";
// import { useRecoilState } from "recoil";
import { useState, useEffect, useRef } from "react";
// import { comment } from "../../atom/CommentAtom";
import Chatbot from "../../components/chatbot/Chatbot";
import { useNavigate } from "react-router-dom";
import { Filename } from "../../atom/FilenameAtom";
import { useRecoilState } from "recoil";
import VideoPlay from "../../services/playvideo/playvideo";
import GetVideos from "../../services/playvideo/playvideo";
import { comment } from "../../atom/CommentAtom";
import VcBaground from "../../../public/assets/VcBg.png";
import PlayIcon from "../../../public/assets/playicon.png"

function HomePage() 
{
  // const ws = useRef(null);
  const containerRef = useRef(null);
  // const [frames, setFrames] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [displayChat, setDisplayChat] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const [file, setfile] = useRecoilState(Filename);
  // const [isDark, setIsDark] = useState(false);
  const [commentHistory, setcommentHistory] = useRecoilState(comment);
  const [flag, setflag] = useState(true);
  const [recommend, setRecommend] = useState([]);
  const navigate = useNavigate();
  const videoWrapperRef = useRef(null);
  const [videoWrapperWidth, setVideoWrapperWidth] = useState(0);
  const [socket, setSocket] = useState();
  const [value, setValue] = useState({});


  useEffect(() => {
    setRec();
  }, []);

  async function setRec() {
    const val = await GetVideos.getVideo();
    setRecommend(val);
    // console.log("hh");
    // console.log(val, "vvvv");
  }

  // useEffect(()=>{
  // console.log("Recommend : ",recommend)
  // },[recommend])
  // const { commentHistory, setcommentHistory } = useRecoilState(comment);
  // const messages = [
  //   "Hi, welcome to SimpleChat! Go ahead and send me a message.😄",
  //   "Another message here.",
  //   "Yet another message!",
  //   "And one more message for good measure.",
  // ];

  const handleDisplayChat = () => {
    setSlideOut(true);
    setTimeout(() => {
      setDisplayChat(false);
      setSlideOut(false);
    }, 300);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 840) {
        setShowChatbot(true);
      } else {
        setShowChatbot(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // useEffect(() => {
  //   // Define the WebSocket URL
  //   const url = "ws://localhost:8765";

  //   // Create a WebSocket instance
  //   ws.current = new WebSocket(url);

  //   // WebSocket event listeners
  //   ws.current.onopen = () => {
  //     console.log("WebSocket connected");
  //   };

  //   ws.current.onmessage = (event) => {
  //     console.log("Message from server:", event.data);
  //     handleFrameData(event.data); // Handle the received binary data
  //   };

  //   ws.current.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };

  //   // Clean up function to close the WebSocket connection
  //   return () => {
  //     ws.current.close();
  //   };
  // }, []);

  // const handleFrameData = (data) => {
  //   // Convert the binary data into a Blob object
  //   const blob = new Blob([data], { type: "image/jpeg" });

  //   // Create a URL for the Blob object
  //   const imageUrl = URL.createObjectURL(blob);

  //   // Update the frames state with the new image URL
  //   setFrames(imageUrl);
  // };

  // const handleStart =async () => {
  //   // Send the "start" message to the server
  //   console.log('start')
  //   if (ws.current && ws.current.readyState === WebSocket.OPEN) {
  //     console.log('mid')
  //     ws.current.send(file);
  //   }
  //   console.log('end')
  // };

  function socket_init() {
    const ws = new WebSocket("ws://192.168.1.124:8000/ws");
    return ws;
  }

  useEffect(() => {
    setSocket(socket_init());
  }, []);

  if (socket)
    socket.onmessage = function (event) {
      console.log(event.data);
      const val = JSON.parse(event.data);
      setValue(val);
      console.log(val.status);
      if (val?.frameNumber)
        setcommentHistory((prev) => [...prev, val.frameNumber]);
      console.log(commentHistory, "comment");
      handleScrollToBottom();
    };

  // useEffect(() => {
  //   console.log(value.image, "hi");
  // }, [value]);

  // function sendMessage(event) {
  //   if (socket) socket?.send(document.getElementById("input").value);
  // }

  const handleScrollToBottom = () => {
    const dashboardContainer = document.querySelector(".msger-chat");
    if (dashboardContainer) {
      dashboardContainer.scrollTop = dashboardContainer.scrollHeight;
    }
  };

  // const startLive = () => {};

  useEffect(() => {
    const updateVideoWrapperWidth = () => {
      if (videoWrapperRef.current) {
        const width = videoWrapperRef.current.clientWidth;
        setVideoWrapperWidth(width);
      }
    };
    updateVideoWrapperWidth();
    window.addEventListener("resize", updateVideoWrapperWidth);
    return () => {
      window.removeEventListener("resize", updateVideoWrapperWidth);
    };
  }, []);


  return (
    <div className="wrapper light">
      <div className="app-container">
        <div className="left-side" onClick={handleDisplayChat}>
          <nav className="nav">
            <img
              src="https://i.postimg.cc/Sx0ZGtQJ/logo.png"
              className="logo"
            />
            <ul>
              <li>
                <VideoUploadModal />
              </li>
              <li>
                <img
                  src="https://i.postimg.cc/k4DZH604/users.png"
                  onClick={() => navigate("/knownface")}
                />
              </li>

              {/* <li onClick={() => setIsDark(!isDark)}>
                <img src="https://i.postimg.cc/v84Fqkyz/setting.png" />
              </li> */}
              <li
                onClick={() => {
                  VideoPlay.live();
                  setflag(false);
                }}
              >
                <img src="https://i.postimg.cc/JnggC78Q/video.png" />
              </li>
              <li>
                <img
                  src="../../../public/assets/media-playback-start-symbolic.svg"
                  onClick={() => {
                    setcommentHistory([]);
                    VideoPlay.play(file);
                  }}
                />
              </li>
              <li onClick={() => VideoPlay.pause()}>
                <img src="../../../public/assets/pauseIcon.png" alt="" />
              </li>
            </ul>
          </nav>
        </div>
        <div className="app-main" onClick={handleDisplayChat}>
          <div className="video-wrapper" ref={videoWrapperRef}>
             <div style={{position:"relative" ,width:"100%"}}>
             {flag ? (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  width: "100%",
                  color: "white",
                  fontSize: "35px",
                }}
              >
                Welcome to our Visage
                <p style={{ fontSize: "16px" }}>play your video</p>
                <div style={{display:"flex",justifyContent:"center",marginTop:"60px"}}>
                    <img src={PlayIcon} alt=""  style={{width:"60px",height:"60px"}}/>
                </div> 
              </div>
            ) : (
              <img
                src={value?.image ? `data:image/jpeg;base64,${value?.image}` : VcBaground}
                alt="test"
              ></img>
            )}
            {flag ? (
           <div className="recommendedVedios">
           {videoWrapperWidth > 600 ? (
             recommend.slice(0, 4).map((item, index) => (
               <div className={`recommend box${index + 1}`} key={item?.name}>
                 <img
                   src={`data:image/jpeg;base64,${item?.first_frame}`}
                   alt="test"
                   onClick={() => {
                     VideoPlay.play(item?.name);
                     setflag(false);
                     setcommentHistory([]);
                   }}
                 ></img>
               </div>
             ))
           ) : videoWrapperWidth < 450 ? (
             recommend.slice(0, 2).map((item, index) => (
               <div className={`recommend alignCenterbox${index + 1}`} key={item?.name}>
                 <img
                   src={`data:image/jpeg;base64,${item?.first_frame}`}
                   alt="test"
                   onClick={() => {
                     VideoPlay.play(item?.name);
                     setflag(false);
                     setcommentHistory([]);
                   }}
                 ></img>
               </div>
             ))
           ) : (
             recommend.slice(0, 3).map((item, index) => (
               <div className={`recommend alignbox${index + 1}`} key={item?.name}>
                 <img
                   src={`data:image/jpeg;base64,${item?.first_frame}`}
                   alt="test"
                   onClick={() => {
                     VideoPlay.play(item?.name);
                     setflag(false);
                     setcommentHistory([]);
                   }}
                 ></img>
               </div>
             ))
           )}
           </div>
         
           
            ) : null}
             </div>
          </div>
          <div className="comment-wrapper">
            <section className="msger">
              <div className="live-wrapper">
                <p className="live-text">
                  {" "}
                  <span className="dot"></span>Live updates
                </p>
              </div>
              <main className="msger-chat">
                {commentHistory.map((message, index) => {
                  return (
                    <div
                      className="msg left-msg"
                      key={index}
                      ref={containerRef}
                    >
                      <div className="msg-bubble">
                        <div className="logo-container">
                          <img
                            src="https://i.postimg.cc/Sx0ZGtQJ/logo.png"
                            alt=""
                          />
                        </div>
                        <div className="msg-text">{message}</div>
                      </div>
                    </div>
                  );
                })}
              </main>
            </section>
          </div>
        </div>
        <div>
          <div>
            {showChatbot ? (
              <Chatbot />
            ) : displayChat ? (
              <div>
                <Chatbot displayChat={displayChat} slideOut={slideOut} />
              </div>
            ) : (
              <button
                className="chatIcon"
                onClick={(event) => {
                  event.stopPropagation();
                  setDisplayChat(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{ fill: "rgba(0, 0, 0, 1)" }}
                >
                  <path d="M20 2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h3v3.767L13.277 18H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14h-7.277L9 18.233V16H4V4h16v12z"></path>
                  <path d="M7 7h10v2H7zm0 4h7v2H7z"></path>{" "}
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
