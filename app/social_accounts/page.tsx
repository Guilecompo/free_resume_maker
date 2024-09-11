'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation'; // Import the useRouter hook
import { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle, FaGraduationCap, FaUser } from 'react-icons/fa'; // Import specific icons

// Define the steps with their icons
const steps = [
  { label: 'Personal', icon: <FaUser />, isActive: false },
  { label: 'Education', icon: <FaGraduationCap /> },
  { label: 'Experience', icon: <FaBriefcase /> },
  { label: 'Complete', icon: <FaCheckCircle /> }
];

const SocialPage = () => {
  const [progress, setProgress] = useState(21); // Update progress to reflect step 3
  const [portfolioLink, setPortfolioLink] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [error, setError] = useState<string>(''); // State for validation error message
  const router = useRouter();

  useEffect(() => {
    // Load the social accounts from localStorage if they exist
    const storedSocialAccounts = localStorage.getItem('socialAccounts');
    if (storedSocialAccounts) {
      const { portfolioLink, linkedinLink, githubLink } = JSON.parse(storedSocialAccounts);
      setPortfolioLink(portfolioLink || '');
      setLinkedinLink(linkedinLink || '');
      setGithubLink(githubLink || '');
    }

    // Simulate progress update
    const timer = setTimeout(() => setProgress(21), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmitSocialAccounts = () => {
    // Validate inputs
    if (!portfolioLink && !linkedinLink && !githubLink) {
      setError('Please provide at least one link before proceeding.');
      return;
    }

    // Save social accounts to localStorage
    const socialAccounts = {
      portfolioLink: portfolioLink || ' ',
      linkedinLink: linkedinLink || ' ',
      githubLink: githubLink || ' '
    };
    localStorage.setItem('socialAccounts', JSON.stringify(socialAccounts));

    // Redirect to the next page
    router.push('/technical_skills'); // Navigate to the next page
  };

  return (
    <div className="h-screen bg-[#264653] flex items-start justify-center px-4">
      <div className="flex flex-col items-center justify-start w-full max-w-screen-lg">
        {/* Title Layer */}
        <div className="mt-28">
          <h3 className="text-white text-2xl mb-4">Personal</h3>
        </div>

        {/* Progress Bar Layer */}
        <div className="relative w-full mb-6 max-w-2xl mt-10">
          {/* White background for the progress bar */}
          <div
            className="absolute bottom-0 left-0 h-2 rounded-full"
            style={{
              width: '100%', // Full width of the container
              backgroundColor: '#ffffff'
            }}
          ></div>
          {/* Green progress indicator */}
          <div
            className="absolute bottom-0 left-0 h-2 rounded-full"
            style={{
              width: `${progress}%`, // Progress width
              backgroundColor: '#4caf50'
            }}
          ></div>
        </div>

        {/* Icons and Labels Layer */}
        <div className="flex items-center justify-between w-full max-w-2xl px-4 md:px-8 ">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`text-2xl mb-2 ${step.isActive ? 'text-yellow-500' : 'text-white'}`}>
                {step.icon}
              </div>
              <span className="text-white ml-2 md:ml-0">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Content Layer */}
        <div className="text-white text-center mt-5 w-full max-w-2xl">
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} >
            <CardHeader>
              <h2 className="text-sm font-medium text-center text-white">Step 3 </h2>
              <CardTitle className="text-lg text-start text-gray-800">Social Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2"> {/* Responsive grid layout */}
                <div className="flex flex-col">
                  <Label htmlFor="portfolio" className="text-start mb-1 text-gray-800">Portfolio Link</Label>
                  <Input
                    id="portfolio"
                    type="text"
                    placeholder="https://sample.com"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="linkedin" className="text-start mb-1 text-gray-800">LinkedIn Link</Label>
                  <Input
                    id="linkedin"
                    type="text"
                    placeholder="linkedin.com/in/sample"
                    value={linkedinLink}
                    onChange={(e) => setLinkedinLink(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="github" className="text-start mb-1 text-gray-800">GitHub Link</Label>
                  <Input
                    id="github"
                    type="text"
                    placeholder="github.com/sample"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center">
              <Button className="w-full" onClick={handleSubmitSocialAccounts}>Next</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;
