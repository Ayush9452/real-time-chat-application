export const createChatSlice = (set, get) => (
    {
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],
        directMessageContacts: [],
        isUploading:false,
        isDownloading:false,
        fileDownloadProgress:0,
        fileUploadProgress:0,
        channels:[],
        setChannels:(channels)=>set({channels}),
        setIsUploading: (isUploading) => set({ isUploading }),
        setIsDownloading: (isDownloading) => set({ isDownloading }),
        setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),
        setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
        setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
        setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
        setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
        setDirectMessageContacts: (directMessageContacts) => set({ directMessageContacts }),
        addChannel:(channel)=>{
            const channels = get().channels;
            set({
                channels:[
                    channel,...channels
                ]
            })
        },
        closeChat: () => set({
            selectedChatType: undefined,
            selectedChatData: undefined,
            selectedChatMessages: [],
        }),
        addMessage:(message)=>{
            const selectedChatMessages = get().selectedChatMessages;
            const selectedChatType = get().selectedChatType;

            set({
                selectedChatMessages:[
                    ...selectedChatMessages,{
                        ...message,
                        recipient:selectedChatType === "channel"
                        ? message.recipient
                        : message.recipient._id,
                        sender:selectedChatType === "channel"
                        ? message.sender
                        : message.sender._id,
                    }
                ]
            })
        },
        addChannelInChannelList:(message)=>{
            const channels = get().channels;
            const data = channels.find((channel)=>channel._id === message.channelId)
            const index = channels.findIndex((channel)=>channel._id === message.channelId)
            if(index !== -1 && index !== undefined){
                channels.splice(index,1);
                channels.unshift(data);
            }
        },
        addDMInDMList:(message)=>{
            const userId = get().userInfo.id;
            const fromId = message.sender._id === userId ? message.recipient._id : message.sender._id;
            const fromData = message.sender._id === userId ? message.recipient : message.sender;
            const dmContacts = get().directMessageContacts;
            const data = dmContacts.find((contact)=>contact._id === fromId);
            const index = dmContacts.findIndex((contact)=>contact._id === fromId)
            console.log(userId,fromId,fromData,data)
            if(index !== -1 && index !== undefined){
                dmContacts.splice(index,1);
                dmContacts.unshift(data);
            }else{
                dmContacts.unshift(fromData);
            }
            set({directMessageContacts: dmContacts});
        }
    }
)