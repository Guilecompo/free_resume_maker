'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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

const SelectImagePage = () => {
  const [progress, setProgress] = useState(21); // Update progress to reflect step 2
  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null); // State for selected image
  const [error, setError] = useState<string>(''); // State for validation error message
  const router = useRouter();

  useEffect(() => {
    // Load the image from localStorage if it exists
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setSelectedImage(storedImage);
    }

    // Simulate progress update
    const timer = setTimeout(() => setProgress(40), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setError(''); // Clear error message when a file is selected
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const handleSubmitProfileImage = () => {
    if (!selectedImage) {
      setError('Please select an image before proceeding.');
      return;
    }

    // Save the selected image to localStorage
    localStorage.setItem('profileImage', selectedImage as string);

    // Redirect to the next page
    router.push('/social_accounts'); // Navigate to the next page
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
              <h2 className="text-sm font-medium text-center text-white">Step 2 </h2>
              <CardTitle className="text-lg text-start text-gray-800">Select Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2"> {/* Responsive grid layout */}
                {/* Image Display */}
                <div className="flex flex-col items-center mb-1">
                  {selectedImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedImage as string}
                      alt="Selected"
                      className="w-40 h-40 object-cover border border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-gray-800">No image selected</p>
                  )}
                </div>
                {/* Select Image */}
                <div className="flex flex-col items-center">
                  <Label htmlFor="imageUpload" className="text-start mb-1 text-gray-800">Choose an image</Label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border border-gray-300 p-2 rounded"
                  />
                  {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center">
              <Button className="w-full" onClick={handleSubmitProfileImage}>Next</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SelectImagePage;
