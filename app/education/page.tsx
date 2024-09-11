'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import Dialog components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle, FaGraduationCap, FaUser } from 'react-icons/fa'; // Import specific icons

// Define the steps with their icons
const steps = [
  { label: 'Personal', icon: <FaUser />, isActive: true },
  { label: 'Education', icon: <FaGraduationCap />, isActive: true },
  { label: 'Experience', icon: <FaBriefcase /> },
  { label: 'Complete', icon: <FaCheckCircle /> }
];

const EducationPage = () => {
  const [progress, setProgress] = useState(45); // Set initial progress value
  const [education, setEducation] = useState({
    bachelor: "",
    course: "",
    major: "",
    school: "",
    started: "",
    ended: ""
  });
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    // Load education data from localStorage on component mount
    const savedEducation = localStorage.getItem('educationDetails');
    if (savedEducation) {
      setEducation(JSON.parse(savedEducation));
    }

    // Simulate progress bar initialization
    const timer = setTimeout(() => setProgress(45), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setEducation(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmitEducation = () => {
    // Check for empty fields
    const isEmptyField = Object.values(education).some(field => field.trim() === "");
    if (isEmptyField) {
      setIsErrorDialogOpen(true); // Show error dialog if any field is empty
    } else {
      localStorage.setItem('educationDetails', JSON.stringify(education));
      router.push('/certificates'); // Navigate to the /certificates page
    }
  };

  return (
    <div className="min-h-screen bg-[#264653] flex items-start justify-center px-4 py-8 overflow-y-auto">
      <div className="flex flex-col items-center justify-start w-full max-w-screen-lg">
        {/* Title Layer */}
        <div className="mt-8 sm:mt-16">
          <h3 className="text-white text-2xl mb-4">Education</h3>
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
        <div className="text-white text-center w-full max-w-2xl mb-8">
          <Card className="bg-[#ffffff33]">
            <CardHeader>
              <h2 className="text-sm font-medium text-center text-white">Step 1</h2>
              <CardTitle className="text-lg text-start text-gray-800">Education Background</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Education input fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <Label htmlFor="bachelor" className="text-start mb-1 text-gray-800">Bachelor’s Degree*</Label>
                  <Input id="bachelor" type="text" placeholder="e.g. Bachelor of Science" value={education.bachelor} onChange={handleInputChange} required />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="course" className="text-start mb-1 text-gray-800">Course*</Label>
                  <Input id="course" type="text" placeholder="e.g. Information Technology" value={education.course} onChange={handleInputChange} required />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="major" className="text-start mb-1 text-gray-800">Major*</Label>
                  <Input id="major" type="text" placeholder="e.g. System Development" value={education.major} onChange={handleInputChange} required />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="school" className="text-start mb-1 text-gray-800">School Name*</Label>
                  <Input id="school" type="text" value={education.school} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col">
                  <Label htmlFor="started" className="text-start mb-1 text-gray-800">School Started*</Label>
                  <Input id="started" type="date" value={education.started} onChange={handleInputChange} required />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="ended" className="text-start mb-1 text-gray-800">School Ended*</Label>
                  <Input id="ended" type="date" value={education.ended} onChange={handleInputChange} required />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center items-center">
              <Button className="w-full" onClick={handleSubmitEducation}>Next</Button>
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
          <p className="text-red-500">Need to Fill All Required Fields.</p>
          <Button className="mt-4" onClick={() => setIsErrorDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationPage;
