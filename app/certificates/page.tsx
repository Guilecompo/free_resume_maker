'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle, FaGraduationCap, FaTrash, FaUser } from 'react-icons/fa';

const steps = [
  { label: 'Personal', icon: <FaUser />, isActive: true },
  { label: 'Education', icon: <FaGraduationCap />, isActive: true },
  { label: 'Experience', icon: <FaBriefcase /> },
  { label: 'Complete', icon: <FaCheckCircle /> }
];

let nextId = 1;

const CertificatePage = () => {
  const [progress, setProgress] = useState(45);
  const [company_name, setCompany_name] = useState("");
  const [certificate_title, setCertificateTitle] = useState("");
  const [entries, setEntries] = useState<{ id: number; certificate_title: string; company_name: string; }[]>([]);
  const [currentCertificateId, setCurrentCertificateId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load certificates from localStorage
    const savedCertificates = localStorage.getItem('certificates');
    if (savedCertificates) {
      setEntries(JSON.parse(savedCertificates));
    }

    // Simulate progress bar initialization
    const timer = setTimeout(() => setProgress(45), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddEntry = () => {
    if (certificate_title.trim() !== "" && company_name.trim() !== "") {
      if (entries.length >= 5) {
        setErrorDialogOpen(true);
        return;
      }
      const newEntry = {
        id: nextId++,
        certificate_title: certificate_title.trim(),
        company_name: company_name.trim(),
      };
      setEntries([...entries, newEntry]);
      setCertificateTitle("");
      setCompany_name("");
    }
  };

  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleSubmitCertificates = () => {
    if (entries.length === 0) {
      // If no entries, set an empty value and proceed
      localStorage.setItem('certificates', JSON.stringify([{ id: 0, certificate_title: " ", company_name: " " }]));
    } else {
      localStorage.setItem('certificates', JSON.stringify(entries));
    }
    router.push('/experience');
  };

  const currentCertificate = entries.find(entry => entry.id === currentCertificateId);

  return (
    <div className="min-h-screen bg-[#264653] flex flex-col items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center w-full max-w-screen-lg">
        {/* Title Layer */}
        <div className="mt-10 mb-6 text-center">
          <h3 className="text-white text-2xl mb-4">Certificates</h3>
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
              <h2 className="text-sm font-medium text-center text-white">Step 2</h2>
              <CardTitle className="text-lg text-start text-gray-800">Certificate</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex flex-col">
                  <Label htmlFor="certificate_title" className="text-start mb-1 text-gray-800">Certificate Title*</Label>
                  <Input
                    id="certificate_title"
                    type="text"
                    value={certificate_title}
                    onChange={(e) => setCertificateTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col ">
                    <Label htmlFor="company_name" className="text-start mb-1 text-gray-800">Name of Company</Label>
                    <Input
                      id="company_name"
                      type="text"
                      value={company_name}
                      onChange={(e) => setCompany_name(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col ">
                    <Label className="text-start mb-1 text-transparent">Add</Label>
                    <Button className="w-full" onClick={handleAddEntry}>Add Certificate</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center">
              <div className="flex flex-col w-full gap-2">
                <Button className="w-full" onClick={() => setDialogOpen(true)}>View All Certificates</Button>
                <Button className="w-full" onClick={handleSubmitCertificates}>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Dialog for Viewing Certificate Details */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto p-6">
            <h3 className="text-xl font-semibold">Certificates</h3>
            <div className="space-y-4">
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <div key={entry.id} className="border-b border-gray-300 pb-2 flex items-center ">
                    <button onClick={() => handleDeleteEntry(entry.id)} className="text-red-500 ">
                      <FaTrash />
                    </button>
                    <div className="pl-4">
                      <h4 className="text-lg font-semibold">{entry.certificate_title}</h4>
                      <p>Company: {entry.company_name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No certificates to display.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Error Dialog for Max Certificates Limit */}
        <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
          <DialogContent className="p-6">
            <h3 className="text-xl font-semibold">Error</h3>
            <p className="text-red-500">Max certificates list reached limit of 5.</p>
            <Button className="mt-4" onClick={() => setErrorDialogOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CertificatePage;
