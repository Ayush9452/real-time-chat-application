import { useEffect, useRef, useState } from "react"
import { GrAttachment } from "react-icons/gr"
import { RiEmojiStickerLine } from "react-icons/ri"
import { IoMdSend } from "react-icons/io"
import EmojiPicker from "emoji-picker-react"
import { useAppStore } from "@/store"
import { useSocket } from "@/context/socketContext"
import { apiClient } from "@/lib/api-client"
import { UPLOAD_FILE_ROUTE } from "@/utils/constants"

const MessageBar = () => {
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const socket = useSocket();
    const { selectedChatType, selectedChatData, userInfo, setIsUploading,
        setFileUploadProgress } = useAppStore();
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
    const [message, setMessage] = useState("");

    useEffect(() => {
        function handleClickOutside(e) {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setEmojiPickerOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [emojiRef])


    const handleAddEmoji = (emoji) => {
        setMessage((message) => message + emoji.emoji)
    }

    const handleSendMessage = async () => {
        if (selectedChatType === 'contact') {
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            })
        } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
                sender: userInfo.id,
                content: message,
                channelId: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            })
        }
        setMessage("");
    }

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleAttachmentChange = async (e) => {
        try {
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                setIsUploading(true);
                const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
                    withCredentials: true,
                    onUploadProgress: data => {
                        setFileUploadProgress(Math.round((data.loaded * 100) / data.total))
                    }
                })
                if (res.status === 200 && res.data) {
                    setIsUploading(false);
                    if (selectedChatType === 'contact') {
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: res.data.filePath,
                        })
                    }else if (selectedChatType === "channel") {
                        socket.emit("send-channel-message", {
                            sender: userInfo.id,
                            content: undefined,
                            channelId: selectedChatData._id,
                            messageType: "file",
                            fileUrl: res.data.filePath,
                        })
                    }
                }
            }
        } catch (error) {
            setIsUploading(false);
            console.log(error)
        }
    }

    return (
        <div className="h-[10vh] bg-[#1c1d25] flex items-center justify-center px-8 mb-6 gap-6 ">
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center justify-between gap-5 pr-5 ">
                <input
                    type="text"
                    className="flex p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
                    value={message}
                    placeholder="Enter Message"
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex-2 flex gap-5">
                    <button className="text-neutral-500 focus:outline-none focus:border-none focus:text-white duration-300 transition-all "
                        onClick={handleAttachmentClick}
                    >
                        <GrAttachment className="text-2xl" />
                    </button>
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
                    <div className="relative">
                        <button className="text-neutral-500 focus:outline-none focus:border-none focus:text-white duration-300 transition-all "
                            onClick={() => setEmojiPickerOpen(true)}
                        >
                            <RiEmojiStickerLine className="text-2xl" />
                        </button>
                        <div className="absolute bottom-16 right-0 " ref={emojiRef}>
                            <EmojiPicker
                                theme="dark"
                                open={emojiPickerOpen}
                                onEmojiClick={handleAddEmoji}
                                autoFocusSearch={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <button className="bg-[#8417ff] rounded-md flex justify-center p-5 items-center hover:bg-[#741bda] 
            focus:bg-[#741bda] focus:outline-none focus:border-none focus:text-white duration-300 transition-all "
                onClick={handleSendMessage}>
                <IoMdSend className="text-2xl" />
            </button>
        </div>
    )
}

export default MessageBar
