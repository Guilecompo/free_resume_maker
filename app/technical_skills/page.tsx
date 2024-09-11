'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Adjust import path as needed
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation'; // Import the useRouter hook
import { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle, FaGraduationCap, FaTrash, FaUser } from 'react-icons/fa';

const steps = [
  { label: 'Personal', icon: <FaUser />, isActive: false },
  { label: 'Education', icon: <FaGraduationCap /> },
  { label: 'Experience', icon: <FaBriefcase /> },
  { label: 'Complete', icon: <FaCheckCircle /> }
];

const TechnicalPage = () => {
  const [progress, setProgress] = useState(21); // Update progress to reflect step 4
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false); // State to manage dialog visibility
  const router = useRouter();

  useEffect(() => {
    // Load existing technical skills from localStorage if they exist
    const storedTechnicalSkills = localStorage.getItem('technicalSkills');
    if (storedTechnicalSkills) {
      const { skills } = JSON.parse(storedTechnicalSkills);
      setSkills(skills || []);
    }
    
    // Simulate progress update
    const timer = setTimeout(() => setProgress(21), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddSkill = () => {
    if (skills.length >= 8) {
      setShowDialog(true); // Show dialog if the maximum skills limit is reached
      return;
    }

    if (skillInput.trim() !== "") {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleDeleteSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmitTechnicalSkills = () => {
    if (skills.length === 0) {
      // Ensure that skills list is not empty
      setSkills([" "]); // Set default value if no skills are added
    }

    // Save technical skills to localStorage
    const technicalSkills = {
      id: 'unique-id', // Replace with actual unique ID generation if needed
      skills
    };
    localStorage.setItem('technicalSkills', JSON.stringify(technicalSkills));

    // Redirect to the next page
    router.push('/platform'); // Navigate to the next page
  };

  return (
    <div className="min-h-screen bg-[#264653] flex flex-col items-center justify-start px-4 py-6">
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
        <div className="w-full max-w-2xl flex flex-col overflow-auto">
          <Card className="bg-[#ffffff33] flex flex-col h-full max-h-[80vh] overflow-auto">
            <CardHeader>
              <h2 className="text-sm font-medium text-center text-white">Step 4</h2>
              <CardTitle className="text-lg text-start text-gray-800">Technical Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <Label htmlFor="skills" className="text-start mb-1 text-gray-800">Enter Skill</Label>
                    <Input
                      id="skills"
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-start mb-1 text-transparent">Add</Label>
                    <Button className="w-full" onClick={handleAddSkill}>Add</Button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <div key={index} className="bg-gray-800 text-gray-200 p-2 rounded flex items-center justify-between">
                        <span>{skill}</span>
                        <button onClick={() => handleDeleteSkill(index)} className="text-red-500">
                          <FaTrash />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-800">No skills added yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center">
              <Button className="w-full" onClick={handleSubmitTechnicalSkills}>Next</Button>
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
          <p className="text-gray-800">Maximum skills limit reached. Please remove a skill before adding more.</p>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnicalPage;
