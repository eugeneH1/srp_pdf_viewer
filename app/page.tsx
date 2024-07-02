"use client"
import axios, { AxiosError } from "axios";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const payload = {
        username: event.currentTarget.username.value,
        password: event.currentTarget.password.value,
      };
      alert(JSON.stringify(payload));

      try {
        const { data } = await axios.post("/api/auth/login", payload);
      
        alert(JSON.stringify(data));
        //redirect user to reader
      } catch(e){
        alert(e);
        const error = e as AxiosError;

        alert(error.message);
      }
    };
    
    
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden max-w-lg w-full">
        <div className="p-8 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-center">Silk Route Press</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center">
                This is the beta of our new pdf reader. Please contact us if you have any hassles.
            </p>
          </div>
          <div className="space-y-4">
            <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Enter your username" type="text" name="username"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="Enter your password" type="password" name="password"/>
              </div>
              <div className="flex flex-row items-center gap-2">
              </div>
            </div>
            <div className="flex justify-center">
              <Button type="submit">Submit</Button>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}