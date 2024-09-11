'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle, FaGraduationCap, FaTrash, FaUser } from 'react-icons/fa';

// Define the steps with their icons
const steps = [
  { label: 'Personal', icon: <FaUser />, isActive: true },
  { label: 'Education', icon: <FaGraduationCap />, isActive: true },
  { label: 'Experience', icon: <FaBriefcase />, isActive: true },
  { label: 'Complete', icon: <FaCheckCircle /> }
];

const ExperiencePage = () => {
  const [progress, setProgress] = useState(70); 
  const [description, setDescription] = useState(""); 
  const [work, setWork] = useState(""); 
  const [position, setPosition] = useState(""); 
  const [company, setCompany] = useState(""); 
  const [companyAddress, setCompanyAddress] = useState(""); 
  const [started, setStarted] = useState(""); 
  const [ended, setEnded] = useState(""); 
  const [experience, setExperience] = useState<{ work: string; position: string; company: string; company_address: string; started: string; ended: string; description: string; work_details: Array<{ work_details_id: number; work_details: string }> } | null>(null);
  const [work_details, setWorkDetails] = useState<Array<{ work_details_id: number; work_details: string }>>([]);
  const [work_detailsInput, setWorkDetailsInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDetailsDialogOpen, setErrorDetailsDialogOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Load experience from localStorage
    const savedExperience = localStorage.getItem('experience');
    if (savedExperience) {
      setExperience(JSON.parse(savedExperience));
    }
  }, []);

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    const words = text.trim().split(/\s+/).length;
    if (words <= 25) {
      setDescription(text);
      setWordCount(words);
    }
  };

  const handleAddWorkDetails = () => {
    if (work_details.length >= 3) {
      setErrorDetailsDialogOpen(true);
      return;
    }

    if (work_detailsInput.trim()) {
      const newDetail = {
        work_details_id: work_details.length > 0 ? work_details[work_details.length - 1].work_details_id + 1 : 1,
        work_details: work_detailsInput
      };
      setWorkDetails([...work_details, newDetail]);
      setWorkDetailsInput("");
    }
  };

  const handleDeleteWorkDetails = (index: number) => {
    const updatedDetails = work_details.filter((_, i) => i !== index);
    setWorkDetails(updatedDetails);
  };

  const handleSubmitExperience = () => {
    if (work && position && company && companyAddress && started && ended && description) {
      const newExperience = {
        work,
        position,
        company,
        company_address: companyAddress,
        started,
        ended,
        description,
        work_details
      };
      localStorage.setItem('experience', JSON.stringify(newExperience));
      router.push('/complete');
    } else {
      // Handle the case where no experience is set
      localStorage.setItem('experience', JSON.stringify({
        work: " ",
        position: " ",
        company: " ",
        company_address: " ",
        started: " ",
        ended: " ",
        description: " ",
        work_details: []
      }));
      router.push('/complete');
    }
  };

  const handleViewExperience = () => {
    setDialogOpen(true);
  };

  const handleDeleteExperience = () => {
    setExperience(null);
    localStorage.removeItem('experience');
  };

  return (
    <div className="min-h-screen bg-[#264653] flex flex-col items-center px-4 py-8">
      <div className="flex flex-col items-center w-full max-w-screen-lg">
        {/* Title Layer */}
        <div className="mt-10 mb-6 text-center">
          <h3 className="text-white text-2xl mb-4">Experience</h3>
        </div>

        {/* Progress Bar Layer */}
        <div className="relative w-full mb-6 max-w-2xl">
          <div
            className="absolute bottom-0 left-0 h-2 rounded-full"
            style={{
              width: '100%',
              backgroundColor: '#ffffff'
            }}
          ></div>
          <div
            className="absolute bottom-0 left-0 h-2 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: '#4caf50'
            }}
          ></div>
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
        <div className="w-full max-w-2xl flex-1">
          <Card className="bg-[#ffffff33] flex flex-col h-full max-h-[80vh] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg text-start text-gray-800">Experience</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"> {/* Responsive grid layout */}
                <div className="flex flex-col mt-2">
                  <Label htmlFor="work" className="text-start mb-1 text-gray-800">Work Type*</Label>
                  <Input id="work" type="text" value={work} onChange={(e) => setWork(e.target.value)} placeholder="e.g. System Developer" required />
                </div>
                
                <div className="flex flex-col mt-2">
                  <Label htmlFor="position" className="text-start mb-1 text-gray-800">Position*</Label>
                  <Input id="position" type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Intern" required />
                </div>
                <div className="flex flex-col mt-2">
                  <Label htmlFor="company" className="text-start mb-1 text-gray-800">Company Name*</Label>
                  <Input id="company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. PHINMA-COC" required />
                </div>
                <div className="flex flex-col mt-2">
                  <Label htmlFor="company_address" className="text-start mb-1 text-gray-800">Company Address*</Label>
                  <Input id="company_address" type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="e.g. Cagayan de Oro City" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col mt-2">
                  <Label htmlFor="started" className="text-start mb-1 text-gray-800">Work Started*</Label>
                  <Input id="started" type="date" value={started} onChange={(e) => setStarted(e.target.value)} required />
                </div>
                <div className="flex flex-col mt-2">
                  <Label htmlFor="ended" className="text-start mb-1 text-gray-800">Work Ended*</Label>
                  <Input id="ended" type="date" value={ended} onChange={(e) => setEnded(e.target.value)} required />
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <Label htmlFor="description" className="text-start mb-1 text-gray-800">Work Description (Max 25 words)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Enter your work description here"
                  className="resize-none h-32 border-gray-300 rounded"
                  required
                />
                <p className="text-gray-800 text-center text-sm mt-1">Word count: {wordCount} / 25</p>
              </div>
              
              {/* Work Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col">
                  <Label htmlFor="work_details" className="text-start mb-1 text-gray-800">Work Details</Label>
                  <Input
                    id="work_details"
                    type="text"
                    value={work_detailsInput}
                    onChange={(e) => setWorkDetailsInput(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <Label className="text-start mb-1 text-transparent">Add</Label>
                  <Button className="w-full" onClick={handleAddWorkDetails}>Add Details</Button>
                </div>
              </div>

              {/* List of Work details in a responsive grid */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {work_details.length > 0 ? (
                  work_details.map((item, index) => (
                    <div key={index} className="bg-gray-800 text-gray-200 p-2 rounded flex items-center justify-between">
                      <span>{item.work_details}</span>
                      <button onClick={() => handleDeleteWorkDetails(index)} className="text-red-500">
                        <FaTrash />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-800">No work details added yet.</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center p-2">
              <div className="flex flex-col w-full gap-2">
                <Button className="w-full" onClick={handleSubmitExperience}>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Dialog for Viewing Experience Entries */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto p-6">
          <h3 className="text-xl font-semibold">Experience Entries</h3>
          <div className="space-y-4">
            {experience ? (
              <div className="border-b border-gray-300 pb-2 flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold">{experience.work}</h4>
                  <p>Position: {experience.position}</p>
                  <p>Company: {experience.company}</p>
                  <p>Company Address: {experience.company_address}</p>
                  <p>Started: {experience.started}</p>
                  <p>Ended: {experience.ended}</p>
                  <p className="font-medium">Description:</p>
                  <p>{experience.description}</p>
                  <p className="font-medium">Work Details:</p>
                  {experience.work_details.length > 0 ? (
                    <ul>
                      {experience.work_details.map((detail, index) => (
                        <li key={index}>{detail.work_details}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No work details added.</p>
                  )}
                </div>
                <button onClick={handleDeleteExperience} className="text-red-500 ml-4">
                  <FaTrash />
                </button>
              </div>
            ) : (
              <p>No experience entries to display.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog for Exceeding Max Limit */}
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto p-6">
          <h3 className="text-xl font-semibold">Error</h3>
          <p>Max experience list reached the limit.</p>
        </DialogContent>
      </Dialog>

      {/* Error Dialog for Work Details Limit */}
      <Dialog open={errorDetailsDialogOpen} onOpenChange={setErrorDetailsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto p-6">
          <p className="text-center text-red-700">You can only add up to 3 work details.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExperiencePage;
