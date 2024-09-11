'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle, FaGraduationCap, FaUser } from 'react-icons/fa';

// Define the steps with their icons
const steps = [
  { label: 'Personal', icon: <FaUser />, isActive: true }, // Mark first step as active
  { label: 'Education', icon: <FaGraduationCap /> },
  { label: 'Experience', icon: <FaBriefcase /> },
  { label: 'Complete', icon: <FaCheckCircle /> }
];

const SummaryPage = () => {
  const [progress, setProgress] = useState(20); 
  const [summary, setSummary] = useState(""); 
  const [wordCount, setWordCount] = useState(0); 
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load summary from localStorage on component mount
    const savedSummary = localStorage.getItem('personalSummary');
    if (savedSummary) {
      setSummary(savedSummary);
      setWordCount(savedSummary.trim().split(/\s+/).length);
    }

    // Simulate progress bar initialization
    const timer = setTimeout(() => setProgress(20), 500); 
    return () => clearTimeout(timer);
  }, []);

  const handleSummaryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    const words = text.trim().split(/\s+/).length;
    if (words <= 100) { // Change word count limit to 100
      setSummary(text);
      setWordCount(words);
    }
  };

  const handleSubmitSummary = () => {
    if (summary.trim().length === 0) {
      setIsErrorDialogOpen(true); // Show error dialog if summary is empty
    } else {
      localStorage.setItem('personalSummary', summary);
      router.push('/education'); // Navigate to the /education page
    }
  };

  return (
    <div className="min-h-screen bg-[#264653] flex flex-col items-center justify-start px-4 py-8 overflow-y-auto">
      <div className="flex flex-col items-center justify-start w-full max-w-screen-lg">
        {/* Title Layer */}
        <div className="mt-8 sm:mt-16">
          <h3 className="text-white text-2xl mb-4">Personal</h3>
        </div>

        {/* Progress Bar Layer */}
        <div className="relative w-full mb-6 max-w-2xl mt-6 sm:mt-10">
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
        <div className="flex items-center justify-between w-full max-w-2xl px-4 md:px-8 mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`text-xl sm:text-2xl mb-1 sm:mb-2 ${step.isActive ? 'text-yellow-500' : 'text-white'}`}>
                {step.icon}
              </div>
              <span className="text-white text-xs sm:text-sm">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Content Layer */}
        <div className="text-white text-center w-full max-w-2xl">
          <Card className="bg-[#ffffff33]">
            <CardHeader>
              <h2 className="text-sm font-medium text-center text-white">Final Step </h2>
              <CardTitle className="text-lg text-start text-gray-800">Personal Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Textarea with word limit */}
              <div className="flex flex-col ">
                <Label htmlFor="summary" className="text-start mb-2 text-gray-800">Describe here ...*</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={handleSummaryChange}
                  placeholder="Enter your personal summary here"
                  className="resize-none h-32 border-gray-300 rounded"
                  required
                />
                <p className="text-gray-400 text-sm mt-2">{wordCount} / 100 words</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center">
              <Button className="w-full" onClick={handleSubmitSummary}>Next</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Error Dialog */}
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p className="text-red-500">Need to Add a Personal Summary.</p>
          <Button className="mt-4" onClick={() => setIsErrorDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SummaryPage;
