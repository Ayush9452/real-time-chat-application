import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { GET_ALL_CHANNEL_ROUTE, GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { MdFolderZip } from "react-icons/md";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress } = useAppStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(GET_ALL_MESSAGES_ROUTE, { id: selectedChatData._id }, {
          withCredentials: true
        })
        if (res.data.message) {
          setSelectedChatMessages(res.data.message)
        }
      } catch (error) {
        console.log(error);
      }
    }

    const getChannelMessages = async ()=>{
      try{
        const res = await apiClient.get(`${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,{
          withCredentials:true
        })

        if(res.data.messages){
          setSelectedChatMessages(res.data.messages);
        }
      }catch(error){
        console.log(error)
      }
    }

    if (selectedChatData._id) {
      if (selectedChatType === 'contact') getMessages();
      else if(selectedChatType === "channel") getChannelMessages();
    }

  }, [selectedChatData, setSelectedChatMessages, selectedChatType])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkifImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|wepg|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  }

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = lastDate !== messageDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      )
    })
  }

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const res = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: data => {
        setFileDownloadProgress(Math.round((data.loaded * 100) / data.total));
      }
    })

    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
  }

  const renderDMMessages = (message) => {
    return <div className={`${message.sender === selectedChatData._id
      ? "text-left"
      : "text-right"}`}>
      {message.messageType === "text" && (<div className={`${message.sender !== selectedChatData._id
        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
        : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
        } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
        {message.content}
      </div>)}
      {message.messageType === "file" && (
        <div className={`${message.sender !== selectedChatData._id
          ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
          : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkifImage(message.fileUrl) ? <div className="cursor-pointer"
            onClick={() => {
              setShowImage(true);
              setImageUrl(message.fileUrl)
            }}>
            <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} />
          </div>
            : <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}>
                <IoMdArrowRoundDown />
              </span>
            </div>}
        </div>)}

      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  }

  const renderChannelMessages = (message) => {
    return <div className={`${message.sender._id !== userInfo.id
      ? "text-left"
      : "text-right"}`}>
      {message.messageType === "text" && (<div className={`${message.sender._id === userInfo.id
        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
        : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
        } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}>
        {message.content}
      </div>)}
      {message.messageType === "file" && (
        <div className={`${message.sender._id === userInfo.id
          ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
          : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkifImage(message.fileUrl) ? <div className="cursor-pointer"
            onClick={() => {
              setShowImage(true);
              setImageUrl(message.fileUrl)
            }}>
            <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} />
          </div>
            : <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}>
                <IoMdArrowRoundDown />
              </span>
            </div>}
        </div>)}

      {message.sender._id !== userInfo.id && (
        <div className="flex items-center justify-start gap-3">
          <Avatar className="h-8 w-8 rounded-full overflow-hidden">
            {
              message.sender.image ?
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt='profile'
                  className='object-cover rounded-full w-full h-full bg-black'
                /> : <AvatarFallback className={`uppercase h-8 w-8  text-lg border-[1px] flex items-center justify-center rounded-full
${getColor(message.sender.color)}`}>
                  {message.sender.firstName
                    ? message.sender.firstName.split("").shift()
                    : message.sender.email.split("").shift()}
                </AvatarFallback>
            }
          </Avatar>
          <span className="text-sm text-white/60">
          {`${message.sender.firstName} ${message.sender.lastName}`}
          </span>
        </div>
      )}

      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  }

  return (
    <div className="flex-1 overflow-auto no-scrollbar p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {
        showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img src={`${HOST}/${imageUrl}`} className="h-[80vh] w-full bg-cover" />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={() => {
              downloadFile(imageUrl);
            }}><IoMdArrowRoundDown /></button>
            <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={() => {
              setShowImage(false);
              setImageUrl(none);
            }}><IoCloseSharp /></button>
          </div>
        </div>
      }
    </div>
  )
}

export default MessageContainer
