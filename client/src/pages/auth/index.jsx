import React, { useState } from 'react'
import Background from "@/assets/login2.png"
import Victory from "@/assets/victory.svg"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import {apiClient} from "@/lib/api-client.js"
import { SIGNUP_ROUTE, LOGIN_ROUTE } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'


const Auth = () => {
  const Navigate = useNavigate();
  const {setUserInfo} = useAppStore();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const validationSignup = () =>{
    if(!email.length){
      toast.error("Email is Required");
      return false;
    }
    if(!password.length){
      toast.error("Password is Required");
      return false;
    }
    if(password !== confirmPassword){
      toast.error("Password and Confirm Password must be same!");
      return false;
    }
    return true;
  }

  const validationLogin = () =>{
    if(!email.length){
      toast.error("Email is Required");
      return false;
    }
    if(!password.length){
      toast.error("Password is Required");
      return false;
    }
    return true;
  }

  const handleLogin = async () => {
    if(validationLogin()){
      const res = await apiClient.post(LOGIN_ROUTE,
        {email,password},
        {withCredentials: true},
      )
      if(res.status === 201){
        setUserInfo(res.data.user);
        if(!res.data.user.profileSetup) Navigate("/profile")
          else Navigate("/chat");
      }
    }
  }
  
  const handleSignup = async () => {
    if(validationSignup()){
      const res = await apiClient.post(SIGNUP_ROUTE,
        {email,password},
        {withCredentials: true}
      );
      if(res.status === 201){
        setUserInfo(res.data.user);
        Navigate("/profile");
      }
      console.log(res.data);
    }
  }


  return (
    <div className="h-[100vh] w-[100vw] flex item-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 xxl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center ">
          <div className="flex flex-col items-center justify-center ">
            <div className="flex items-center justify-center ">
              <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
              <img src={Victory} alt="Victory emoji" className=' h-[100px] ' />
            </div>
            <p className="font-medium text-center">Fill in the details to get started with ChatMaster!</p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className='w-3/4' defaultValue='login'>
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full 
                data-[state=active]:text-black data-[state=active]:front-semibold data-[state=active]:border-purple-500 p-3 transition-all duration-300 ">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full 
                data-[state=active]:text-black data-[state=active]:front-semibold data-[state=active]:border-purple-500 p-3 transition-all duration-300 ">
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10 " value="login">
                <Input
                  className="rounded-full p-6 "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                />
                <Input
                  className="rounded-full p-6 "
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                  type="password" />
                <Button className="rounded-full p-6" onClick={handleLogin} >Login</Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 " value="signup">
                <Input
                  className="rounded-full p-6 "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                />
                <Input
                  className="rounded-full p-6 "
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                  type="password" />
                <Input
                  className="rounded-full p-6 "
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  type="password" />
                <Button className="rounded-full p-6" onClick={handleSignup} >Signup</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center ">
          <img src={Background} alt="Background Image" />
        </div>
      </div>
    </div>
  )
}

export default Auth;
