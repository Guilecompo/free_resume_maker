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
import { FaBriefcase, FaCheckCircle, FaGraduationCap, FaUser } from 'react-icons/fa';

// Define the steps with their icons
const steps = [
  { label: 'Personal', icon: <FaUser />, isActive: true }, // Mark first step as active
  { label: 'Education', icon: <FaGraduationCap /> },
  { label: 'Experience', icon: <FaBriefcase /> },
  { label: 'Complete', icon: <FaCheckCircle /> }
];

// Define the type for the form data
interface FormData {
  firstname: string;
  middlename: string;
  lastname: string;
  suffix: string;
  email: string;
  phone: string;
}

const PersonalPage = () => {
  const [progress, setProgress] = useState(20); // Set initial progress value
  const [formData, setFormData] = useState<FormData>({
    firstname: '',
    middlename: '',
    lastname: '',
    suffix: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    // Load data from localStorage if available
    const storedData = localStorage.getItem('personalDetails');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData({
        firstname: parsedData.firstname || '',
        middlename: parsedData.middlename || '',
        lastname: parsedData.lastname || '',
        suffix: parsedData.suffix || '',
        email: parsedData.email || '',
        phone: parsedData.phone_number || ''
      });
    }
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const phonePattern = /^\d{11}$/;

    // Check required fields
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!formData.middlename.trim() || formData.middlename.length !== 1) newErrors.middlename = 'Middle Initial is required and must be a single letter';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim() || !phonePattern.test(formData.phone)) newErrors.phone = 'Phone number must be 11 digits';
    
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPersonalDetails = () => {
    if (validateForm()) {
      // Save to localStorage
      localStorage.setItem('personalDetails', JSON.stringify({
        firstname: formData.firstname,
        middlename: formData.middlename || ' ',
        lastname: formData.lastname,
        suffix: formData.suffix || ' ',
        email: formData.email,
        phone_number: formData.phone
      }));

      // Redirect to the next page
      router.push('/select_image');
    }
  };

  return (
    <div className="min-h-screen bg-[#264653] flex flex-col items-center justify-start px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-screen-lg flex flex-col items-center justify-start">
        {/* Title Layer */}
        <div className="mt-8 mb-4">
          <h3 className="text-white text-2xl">Personal</h3>
        </div>

        {/* Progress Bar Layer */}
        <div className="relative w-full mb-6 max-w-2xl">
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
              <div className={`text-2xl mb-2 ${step.isActive ? 'text-yellow-500' : 'text-white'}`}>
                {step.icon}
              </div>
              <span className="text-white ml-2 md:ml-0">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Content Layer */}
        <div className="text-white text-center w-full max-w-2xl mb-8">
          <Card className="bg-[#ffffff33]">
            <CardHeader>
              <h2 className="text-sm font-medium text-center text-white">Step 1 </h2>
              <CardTitle className="text-lg text-start text-gray-800">Personal Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <Label htmlFor="firstname" className="text-start mb-1 text-gray-800">First Name*</Label>
                  <Input
                    id="firstname"
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    required
                  />
                  {errors.firstname && <p className="text-red-500 text-xs">{errors.firstname}</p>}
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="middlename" className="text-start mb-1 text-gray-800">Middle Initial*</Label>
                  <Input
                    id="middlename"
                    type="text"
                    value={formData.middlename}
                    onChange={(e) => setFormData({ ...formData, middlename: e.target.value })}
                    placeholder="e.g. N"
                    maxLength={1} // Ensure only one character can be entered
                    required
                  />
                  {errors.middlename && <p className="text-red-500 text-xs">{errors.middlename}</p>}
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="lastname" className="text-start mb-1 text-gray-800">Last Name*</Label>
                  <Input
                    id="lastname"
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    required
                  />
                  {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname}</p>}
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="suffix" className="text-start mb-1 text-gray-800">Suffix</Label>
                  <Input
                    id="suffix"
                    type="text"
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex flex-col">
                  <Label htmlFor="email" className="text-start mb-1 text-gray-800">Email*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="phone" className="text-start mb-1 text-gray-800">Phone number*</Label>
                  <Input
                    id="phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => {
                      const newValue = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                      setFormData({ ...formData, phone: newValue });
                    }}
                    inputMode="numeric" // Suggests numeric input on mobile devices
                    pattern="\d*" // Matches only numeric input
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center">
              <Button className="w-full" onClick={handleSubmitPersonalDetails}>Next</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalPage;
