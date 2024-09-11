'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Adjust import path as needed
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation'; // Import the useRouter hook
import { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle, FaGraduationCap, FaTrash, FaUser } from 'react-icons/fa';

// Define the steps with their icons
const steps = [
  { label: 'Personal', icon: <FaUser />, isActive: false },
  { label: 'Education', icon: <FaGraduationCap /> },
  { label: 'Experience', icon: <FaBriefcase /> },
  { label: 'Complete', icon: <FaCheckCircle /> }
];

const CorePage = () => {
  const [progress, setProgress] = useState(40); // Update progress to reflect step 6
  const [coreInput, setCoreInput] = useState("");
  const [coreSkills, setCoreSkills] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false); // State to manage dialog visibility
  const router = useRouter();

  useEffect(() => {
    // Load existing core skills from localStorage if they exist
    const storedCoreSkills = localStorage.getItem('coreSkilled');
    if (storedCoreSkills) {
      const { coreSkills } = JSON.parse(storedCoreSkills);
      setCoreSkills(coreSkills || []);
    }

    // Simulate progress update
    const timer = setTimeout(() => setProgress(40), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddCoreSkill = () => {
    if (coreSkills.length >= 6) {
      setShowDialog(true); // Show dialog if the maximum core skills limit is reached
      return;
    }

    if (coreInput.trim() !== "") {
      setCoreSkills([...coreSkills, coreInput.trim()]);
      setCoreInput("");
    }
  };

  const handleDeleteCoreSkill = (index: number) => {
    setCoreSkills(coreSkills.filter((_, i) => i !== index));
  };

  const handleSubmitCoreSkills = () => {
    if (coreSkills.length === 0) {
      setCoreSkills([" "]); // Set default value if no core skills are added
    }

    // Save core skills to localStorage
    const coreSkillsData = {
      id: 'unique-id', // Replace with actual unique ID generation if needed
      coreSkills
    };
    localStorage.setItem('coreSkilled', JSON.stringify(coreSkillsData));

    // Redirect to the next page
    router.push('/projects'); // Navigate to the next page
  };

  return (
    <div className="min-h-screen bg-[#264653] flex flex-col items-center px-4 py-6">
      <div className="flex flex-col items-center justify-start w-full max-w-screen-lg">
        
        {/* Title Layer */}
        <div className="mt-10 mb-4">
          <h3 className="text-white text-2xl mb-4">Personal</h3>
        </div>

        {/* Progress Bar Layer */}
        <div className="relative w-full mb-6 max-w-2xl mt-8">
          <div className="absolute bottom-0 left-0 h-2 rounded-full bg-white w-full"></div>
          <div className="absolute bottom-0 left-0 h-2 rounded-full bg-green-500" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Icons and Labels Layer */}
        <div className="flex items-center justify-between w-full max-w-2xl px-4 mb-6">
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
        <div className="w-full max-w-2xl flex flex-col">
          <Card className="bg-[#ffffff33] flex flex-col h-full max-h-[80vh] overflow-auto">
            <CardHeader>
              <h2 className="text-sm font-medium text-center text-white">Step 6</h2>
              <CardTitle className="text-lg text-start text-gray-800">Core Work Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <Label htmlFor="coreSkills" className="text-start mb-1 text-gray-800">Enter core skill here...</Label>
                    <Input
                      id="coreSkills"
                      type="text"
                      value={coreInput}
                      onChange={(e) => setCoreInput(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-start mb-1 text-transparent">Add</Label>
                    <Button className="w-full" onClick={handleAddCoreSkill}>Add</Button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {coreSkills.length > 0 ? (
                    coreSkills.map((coreSkill, index) => (
                      <div key={index} className="bg-gray-800 text-gray-200 p-2 rounded flex items-center justify-between">
                        <span>{coreSkill}</span>
                        <button onClick={() => handleDeleteCoreSkill(index)} className="text-red-500">
                          <FaTrash />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-800">No core skills added yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center">
              <Button className="w-full" onClick={handleSubmitCoreSkills}>Next</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Dialog for max skills limit */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warning</DialogTitle>
          </DialogHeader>
          <p className="text-gray-800">Maximum core skills limit reached. Please remove a skill before adding more.</p>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CorePage;
