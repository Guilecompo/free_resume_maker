'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaGithub, FaLinkedin, FaUser } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () =>{
    router.push('/personal');
  }
  return (
    <div className="h-screen bg-[#264653] flex items-start justify-center">
      <Tabs defaultValue="home" className="w-screen p-5">
        <TabsList className="grid w-full grid-cols-2 bg-transparent">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent 
          value="home" 
          className="flex items-center justify-center h-full"
        >
          <Card className="bg-transparent border-0">
            <CardContent className="space-y-1">
              <h3 className="text-white text-center mt-40">Build your resume now</h3>
              <h6 className="text-[#bdbdbd] text-center mt-5">Create a standout resume for free and unlock your career potential today!</h6>
            </CardContent>
            <CardFooter className="flex justify-center items-center mt-10">
              <Button className="w-full md:w-52" onClick={handleGetStarted}>Get Started</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent 
          value="about" 
          className="flex items-center justify-center h-full"
        >
          <Card className="bg-transparent border-0">
            <CardContent className="space-y-1">
              <h3 className="text-white text-center mt-40">About Developer</h3>
              <h6 className="text-[#bdbdbd] text-md md:text-lg text-center mt-5">
                Hi, I’m Kide Guile Compo, a BSIT major in System Development specializing in crafting dynamic websites and applications.<br />
                Proficient in HTML, CSS, JavaScript, React, Node.js, PHP, and MySQL, I use Tailwind and Bootstrap to deliver stylish, responsive solutions.<br />
                Let’s create something amazing together!
              </h6>
            </CardContent>
            <CardFooter className="flex flex-row justify-evenly items-center space-x-4 mt-10">
              <a href="https://www.linkedin.com/in/guile-compo-260822301/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-[#bdbdbd] no-underline">
                <FaLinkedin className="text-2xl md:text-3xl mb-2 text-blue-700" />
                <span className="no-underline">LinkedIn</span>
              </a>
              <a href="mailto:kideguilecompo03@gmail.com" className="flex flex-col items-center text-[#bdbdbd] no-underline">
                <FaEnvelope className="text-2xl md:text-3xl mb-2 text-red-600" />
                <span className="no-underline">Mail</span>
              </a>
              <a href="https://github.com/Guilecompo" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-[#bdbdbd] no-underline">
                <FaGithub className="text-2xl md:text-3xl mb-2" />
                <span className="no-underline">GitHub</span>
              </a>
              <a href="https://guileportfolio.netlify.app" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-[#bdbdbd] no-underline">
                <FaUser className="text-2xl md:text-3xl mb-2 text-green-600" />
                <span className="no-underline">Portfolio</span>
              </a>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
