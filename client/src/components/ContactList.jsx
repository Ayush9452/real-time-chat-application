import { useAppStore } from "@/store"
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({ contacts, isChannle = false }) => {
    const { selectedChatData,
        setSelectedChatType,
        setSelectedChatData,
        setSelectedChatMessages } = useAppStore();

    const handleClick = (contact) => {
        if (isChannle) setSelectedChatType("channel");
        else setSelectedChatType("contact");
        setSelectedChatData(contact);
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([]);
        }
    }
    return (
        <div className="mt-5">
            {contacts.map((contact) => (
                <div className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#c3b1b111]"}`} key={contact._id}
                    onClick={()=>handleClick(contact)}>
                    <div className="flex gap-5 items-center justify-start text-neutral-300">
                        {
                            !isChannle && <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                                {
                                    contact.image ? <AvatarImage
                                        src={`${HOST}/${contact.image}`}
                                        alt='profile'
                                        className='object-cover rounded-full w-full h-full bg-black'
                                    /> : <div className={`${ selectedChatData && selectedChatData._id === contact._id ? "bg-[#ffffff22] border border-white/70" :  getColor(contact.color)}uppercase h-10 w-10  text-lg border-[1px] flex items-center justify-center rounded-full`}>
                                        {contact.firstName
                                            ? contact.firstName.split("").shift()
                                            : contact.email.split("").shift()}
                                    </div>
                                }
                            </Avatar>
                        }
                        {isChannle && (
                                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">#</div>
                            )}
                        {isChannle ? (
                            <span>{contact.name}</span>
                        ):(
                            <span>{contact.firstName} {contact.lastName}</span>
                        )}
                    </div>
                </div>
            ))
            }
        </div>
    )
}

export default ContactList
