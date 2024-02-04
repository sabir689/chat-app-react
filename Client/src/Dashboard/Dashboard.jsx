/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import avatar1 from "../assets/user-circle.svg"
import call from "../assets/phone-outgoing.svg"
import send from "../assets/send.svg"
import plus from "../assets/plus.svg"
import { io } from 'socket.io-client'


const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:details')));
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState({});
    const [message, setMessage] = useState('')
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    console.log(messages, 'messages');

    useEffect(() => {
        setSocket(io('http://localhost:8080'))
    }, [])

    useEffect(() => {
        socket?.emit('addUser', user?.id)
        socket?.on('getUsers', users => {
            console.log('activeUsers :>>', users);
        })
        socket?.on('getMessage', (data) => {
            console.log('data :>>', data);


            setMessages((prev) => ({
                ...prev,
                messages: [...prev.messages, { user: data.user, message: data.message }]
            }))
        })
    }, [socket, user, messages])

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user:details'))
        const fetchConversations = async () => {
            const res = await fetch(`http://localhost:8000/api/conversations/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const resData = await res.json()
            setConversations(resData)

        };

        fetchConversations();

    }, []);
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const resData = await res.json()
            setUsers(resData)
        }
        fetchUsers()
    }, [user?.id])
    const fetchMessages = async (conversationId, receiver) => {
        const res = await fetch(`http://localhost:8000/api/message/${conversationId}?senderId = ${user?.id}&& receiverId=${receiver?.receiverId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const resData = await res.json()
        console.log('resData :>>', resData);
        setMessages({ messages: resData, receiver, conversationId })
    }
    const sendMessage = async (e) => {
        socket?.emit('sendMessage', {
            senderId: user?.id,
            receiverId: messages?.receiver?.receiverId,
            message,
            conversationId: messages?.conversationId,
        });

        // Update the local state with the new message immediately
        setMessages((prev) => ({
            ...prev,
            messages: [
                ...prev.messages,
                { user: { id: user?.id }, message: message }, // Assuming the structure of your messages
            ],
        }));

        // Send the message to the server
        const res = await fetch(`http://localhost:8000/api/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                conversationId: messages?.conversationId,
                senderId: user?.id,
                message,
                receiverId: messages?.receiver?.receiverId,
            }),
        });

        setMessage('');
    };


    return (
        <div className="w-screen flex bg-purple-200 ">
            <div className="w-[25%] border-2 border-white h-screen bg-cyan-300 overflow-y-scroll">
                <div className="flex justify-center items-center my-8">
                    <img className="w-16 cursor-pointer" src={avatar1} alt="" />
                    <div className="text-black mr-8">
                        <h3 className="font-bold">{user?.fullName}</h3>
                        <p className="font-bold">My Account</p>
                    </div>
                </div>
                <hr />
                <div className="ml-5 font-bold text-black text-2xl">Messages</div>
                <div>
                    {
                        conversations.length > 0 ?
                            conversations.map(({ conversationId, user }) => {
                                return (
                                    // eslint-disable-next-line react/jsx-key
                                    <div>
                                        <div className="flex cursor-pointer gap-4 ml-5 text-sm items-center mt-2 py-4" onClick={() =>
                                            fetchMessages(conversationId, user)
                                        }>
                                            <img className="w-10" src={avatar1} alt="User Avatar" />
                                            <div className="text-black font-medium mr-8">
                                                <h3>{user?.fullName}</h3>
                                                <p>{user?.email}</p>
                                            </div>

                                        </div>
                                        <hr />
                                    </div>
                                );
                            }) : <div className="text-center text-lg font-semibold text-black mt-24"> No Conversation</div>

                    }
                </div>


            </div>
            <div className="w-[58%] border-2 border-white flex  flex-col items-center bg-white h-screen">
                {
                    messages?.receiver?.fullName &&
                    <div className="border-2 w-[75%] bg-gray-300  flex  items-center mt-6  rounded-full px-14">
                        <div><img className="cursor-pointer" src={avatar1} width={60} height={60} alt="" /></div>
                        <div className="ml-6 mr-auto">
                            <h3 className="text-lg font-semibold  text-black">{messages?.receiver?.fullName}</h3>
                            <p className="text-sm font-light text-black">{messages?.receiver?.email}</p>
                        </div>
                        <div >
                            <img src={call} alt="" />
                        </div>
                    </div>
                }

                <div className="  w-full overflow-y-scroll shadow-sm ">
                    <div className="h-[1000px] px-10 py-14 text-black text-xs">

                        {
                            messages?.messages?.length > 0 ?
                                messages.messages.map(({ message, user: { id } = {} }) => {
                                    return (
                                        <div className={` max-w-[40%] mb-6 rounded-b-xl p-4 ${id === user?.id ? 'bg-gray-300 text-black rounded-tl-xl ml-auto' : 'bg-gray-500 rounded-tr-xl'}  bg-gray-300 rounded-b-xl rounded-tr-xl p-2`}>
                                            {message}
                                        </div>
                                    )


                                }
                                ) : <div className=" bg-gray-600 ml-auto rounded-b-xl rounded-xl p-2 text-center"> No message</div>
                        }
                    </div>
                </div>
                {
                    messages?.receiver?.fullName &&
                    <div className="p-14 w-full flex justify-between items-center shadow-2xl ">
                        <input placeholder="Type a message...." value={message} onChange={(event) => setMessage(event.target.value)} className='w-full p-2 rounded-box bg-gray-200 focus:ring-0 focus-border-0 text-black shadow-2xl border-cyan-300 border-2 outline-none' />
                        <div onClick={() => sendMessage()} className={`cursor-pointer p-2 ${!message && 'pointer-events-none'} `}>
                            <img src={send} alt="" />
                        </div>
                        <div className="cursor-pointer p-2">
                            <img className="rounded-box border-2 border-black" src={plus} alt="" />
                        </div>
                    </div>
                }

            </div>
            <div className="w-[25%] border-2 border-white  h-screen overflow-y-scroll">
                <h3 className="text-black text-center font-bold text-xl mt-5 ">People</h3>
                <div>
                    {
                        users.length > 0 ?
                            users.map(({ userId, user }) => {
                                return (
                                    <div>
                                        <div className="flex cursor-pointer gap-4 ml-5 text-sm items-center mt-2 py-4 " onClick={() =>
                                            fetchMessages('new', user)
                                        }>
                                            <img className="w-10" src={avatar1} alt="User Avatar" />
                                            <div className="text-black font-medium mr-8">
                                                <h3>{user?.fullName}</h3>
                                                <p>{user?.email}</p>

                                            </div>

                                        </div>
                                        <hr />

                                    </div>

                                );
                            }) : <div className="text-center text-lg font-semibold text-black mt-24"> No Conversation</div>

                    }

                </div>
            </div>


        </div>
    );
};

export default Dashboard;