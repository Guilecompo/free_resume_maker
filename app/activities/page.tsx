'use client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle, FaGraduationCap, FaTrash, FaUser } from 'react-icons/fa';

// Define the steps with their icons
const steps = [
  { label: 'Personal', icon: <FaUser />, isActive: true },
  { label: 'Education', icon: <FaGraduationCap /> },
  { label: 'Experience', icon: <FaBriefcase /> },
  { label: 'Complete', icon: <FaCheckCircle /> }
];

interface Organization {
  id: number;
  title: string;
  type: string;
  community: string;
  started: string;
  ended: string;
  details: string[];
}

const ActivityPage = () => {
  const [progress, setProgress] = useState(26);
  const [coreInput, setCoreInput] = useState("");
  const [platform_use, setPlatform_use] = useState<string[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [detailInput, setDetailInput] = useState("");
  const [organization_details, setOrganization_details] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isMaxDetailsDialogOpen, setIsMaxDetailsDialogOpen] = useState(false);
  const [activityExistsDialogOpen, setActivityExistsDialogOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const savedData = localStorage.getItem('activities');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Loaded activities from local storage:", parsedData); // Debugging line
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          // Convert the saved data format to match the state
          const convertedOrganizations = parsedData.map((activity: any) => ({
            id: activity.activity_id,
            title: activity.activity_title,
            type: activity.activity_type,
            community: activity.activity_community,
            started: activity.activity_started,
            ended: activity.activity_ended,
            details: activity.organization_detail.map((detail: any) => detail.organization_detail)
          }));
          setOrganizations(convertedOrganizations);
        }
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
    const timer = setTimeout(() => setProgress(26), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddDetail = () => {
    if (detailInput.trim() !== "" && organization_details.length < 3) {
      setOrganization_details([...organization_details, detailInput.trim()]);
      setDetailInput("");
    } else if (organization_details.length >= 3) {
      setIsMaxDetailsDialogOpen(true);
    }
  };

  const handleAddOrganization = () => {
    // Check if an activity already exists in local storage
    const existingData = localStorage.getItem('activities');
    if (existingData) {
      try {
        const parsedData = JSON.parse(existingData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setActivityExistsDialogOpen(true);
          return; // Prevent adding a new activity if one already exists
        }
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }

    // Proceed to add new organization if no existing data
    const title = (document.getElementById('activity_title') as HTMLInputElement)?.value || '';
    const type = (document.getElementById('activity_type') as HTMLInputElement)?.value || '';
    const community = (document.getElementById('activity_community') as HTMLInputElement)?.value || '';
    const started = (document.getElementById('activity_started') as HTMLInputElement)?.value || '';
    const ended = (document.getElementById('activity_ended') as HTMLInputElement)?.value || '';

    if (title && type && community && started && ended) {
      const newOrganization: Organization = {
        id: organizations.length + 1,
        title,
        type,
        community,
        started,
        ended,
        details: organization_details
      };

      const updatedOrganizations = [...organizations, newOrganization];
      setOrganizations(updatedOrganizations);
      setOrganization_details([]);
      localStorage.setItem('activities', JSON.stringify(updatedOrganizations));
      setDialogOpen(true);
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleDeleteOrganization = (id: number) => {
    const updatedOrganizations = organizations.filter(org => org.id !== id);
    setOrganizations(updatedOrganizations);
    localStorage.setItem('activities', JSON.stringify(updatedOrganizations));
  };

  const handleDeleteDetail = (index: number) => {
    setOrganization_details(organization_details.filter((_, idx) => idx !== index));
  };

  const handleSubmitActivities = () => {
    if (organization_details.length === 0) {
      setOrganization_details([" "]);
    }
    if (organization_details.length > 3) {
      setIsMaxDetailsDialogOpen(true);
      return;
    }

    const activityData = organizations.map(org => ({
      activity_id: org.id,
      activity_title: org.title,
      activity_type: org.type,
      activity_community: org.community,
      activity_started: org.started,
      activity_ended: org.ended,
      organization_detail: org.details.map((detail, index) => ({
        organization_detail_id: index + 1,
        organization_detail: detail
      }))
    }));

    localStorage.setItem('activities', JSON.stringify(activityData));
    router.push('/summary');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#264653] px-4 py-6">
      <div className="flex flex-col flex-1 items-center justify-start w-full max-w-screen-lg mx-auto">
        <div className="mt-10 mb-4">
          <h3 className="text-white text-2xl">Personal</h3>
        </div>

        <div className="relative w-full mb-6 max-w-2xl mt-6">
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

        <div className="flex items-center justify-between w-full max-w-2xl px-4 md:px-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`text-2xl mb-2 ${step.isActive ? 'text-yellow-500' : 'text-white'}`}>
                {step.icon}
              </div>
              <span className="text-white ml-2 md:ml-0">{step.label}</span>
            </div>
          ))}
        </div>

        <div className="w-full max-w-2xl flex flex-col flex-1">
          <Card className="bg-[#ffffff33] flex flex-col flex-1">
            <CardHeader>
              <h2 className="text-sm font-medium text-center text-white">Step 8</h2>
              <CardTitle className="text-lg text-start text-gray-800">Activity</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col">
                    <Label htmlFor="activity_title" className="text-start mb-1 text-gray-800">Organization Title*</Label>
                    <Input id="activity_title" type="text" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <Label htmlFor="activity_type" className="text-start mb-1 text-gray-800">Organization Type*</Label>
                    <Input id="activity_type" type="text" placeholder="e.g. Student Body Organization" required />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="activity_community" className="text-start mb-1 text-gray-800">Organization Community*</Label>
                    <Input id="activity_community" type="text" placeholder="e.g. Information Technology" required />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="activity_started" className="text-start mb-1 text-gray-800">Activity Started*</Label>
                    <Input id="activity_started" type="date" required />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="activity_ended" className="text-start mb-1 text-gray-800">Activity Ended*</Label>
                    <Input id="activity_ended" type="date" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex flex-col mt-2">
                    <Label htmlFor="organization_detail" className="text-start mb-1 text-gray-800">Organization Details</Label>
                    <Input
                      id="organization_detail"
                      type="text"
                      value={detailInput}
                      onChange={(e) => setDetailInput(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col mt-2">
                    <Label className="text-start mb-1 text-transparent">Add</Label>
                    <Button className="w-full" onClick={handleAddDetail}>Add Detail</Button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {organization_details.length > 0 ? (
                    organization_details.map((item, index) => (
                      <div key={index} className="bg-gray-800 text-gray-200 p-2 rounded flex items-center justify-between">
                        <span>{item}</span>
                        <button onClick={() => handleDeleteDetail(index)} className="text-red-500">
                          <FaTrash />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-800">No details added yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center">
              <div className="flex flex-col w-full gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button className="w-full" onClick={handleAddOrganization}>Add New Activity</Button>
                  <Button className="w-full" onClick={() => setDialogOpen(true)}>View Activities</Button>
                </div>
                <Button className="w-full" onClick={handleSubmitActivities}>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto p-6">
            <h3 className="text-xl font-semibold">Activities</h3>
            <div className="space-y-4">
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <div key={org.id} className="border-b border-gray-300 pb-2 flex items-center justify-between">
                    <div className="flex flex-col">
                      <h4 className="text-lg font-semibold">{org.title}</h4>
                      <p>Type: {org.type}</p>
                      <p>Community: {org.community}</p>
                      <p>Started: {org.started}</p>
                      <p>Ended: {org.ended}</p>
                      {org.details && org.details.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Details:</p>
                          <ul className="list-disc pl-10">
                            {org.details.map((detail, idx) => (
                              <li key={idx} className="mt-1">
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleDeleteOrganization(org.id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </div>
                ))
              ) : (
                <p>No activities to display.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isMaxDetailsDialogOpen} onOpenChange={setIsMaxDetailsDialogOpen}>
          <DialogContent className="p-6">
            <DialogHeader>
              <DialogTitle>Maximum Details Limit Reached</DialogTitle>
            </DialogHeader>
            <p className="text-red-500">You can only add up to 3 organization details.</p>
            <Button className="mt-4" onClick={() => setIsMaxDetailsDialogOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>

        <Dialog open={activityExistsDialogOpen} onOpenChange={setActivityExistsDialogOpen}>
          <DialogContent className="p-6">
            <DialogHeader>
              <DialogTitle>Activity Exists</DialogTitle>
            </DialogHeader>
            <p className="text-red-500">You have already added an activity. Please delete the existing one if you wish to add a new activity.</p>
            <Button className="mt-4" onClick={() => setActivityExistsDialogOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ActivityPage;
