'use client';
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

// Define the steps with their icons
const steps = [
  { label: 'Personal', icon: <FaUser />, isActive: true },
  { label: 'Education', icon: <FaGraduationCap />, isActive: true },
  { label: 'Experience', icon: <FaBriefcase />, isActive: true },
  { label: 'Complete', icon: <FaCheckCircle />, isActive: true }
];

// Define types
interface Screenshot {
  id: number;
  screenshot_title: string;
  selectedImageScreenshots: string | ArrayBuffer | null;
}

interface ViewingScreenshot {
  screenshots_id: number;
  screenshots: string;
  title: string;
}

const CompletePage = () => {
  const [progress, setProgress] = useState(100);
  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
  const [screenshotTitle, setScreenshotTitle] = useState('');
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isValidationDialogOpen, setIsValidationDialogOpen] = useState(false); // New state for validation dialog
  const [viewingScreenshot, setViewingScreenshot] = useState<ViewingScreenshot[] | null>(null);
  const router = useRouter();
  const MAX_SCREENSHOTS = 15;

  useEffect(() => {
    // Load screenshots from localStorage if available
    const savedScreenshots = localStorage.getItem('screenshots');
    if (savedScreenshots) {
      const parsedScreenshots = JSON.parse(savedScreenshots) as ViewingScreenshot[];
      setScreenshots(parsedScreenshots.map(s => ({
        id: s.screenshots_id,
        screenshot_title: s.title,
        selectedImageScreenshots: s.screenshots
      })));
      setViewingScreenshot(parsedScreenshots); // Initialize dialog data
    }

    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Resize image
            const maxWidth = 800;
            const maxHeight = 800;
            let width = image.width;
            let height = image.height;
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
            canvas.width = width;
            canvas.height = height;
            ctx.fillStyle = 'white'; // Ensure white background
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(image, 0, 0, width, height);
            // Convert to data URL and set to state
            const dataURL = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality as needed
            setSelectedImage(dataURL);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddScreenshots = () => {
    if (screenshots.length >= MAX_SCREENSHOTS) {
      setIsValidationDialogOpen(true); // Open validation dialog
      return;
    }

    if (selectedImage && screenshotTitle) {
      const newScreenshot: Screenshot = {
        id: screenshots.length ? Math.max(...screenshots.map(s => s.id)) + 1 : 1, // Unique ID
        screenshot_title: screenshotTitle,
        selectedImageScreenshots: selectedImage
      };
      const updatedScreenshots = [...screenshots, newScreenshot];
      setScreenshots(updatedScreenshots);

      // Update the dialog view to include the new screenshot
      const newViewingScreenshots: ViewingScreenshot[] = updatedScreenshots.map(s => ({
        screenshots_id: s.id,
        screenshots: s.selectedImageScreenshots as string,
        title: s.screenshot_title
      }));
      setViewingScreenshot(newViewingScreenshots);

      // Clear selected image and title
      setSelectedImage(null);
      setScreenshotTitle('');
    } else {
      alert('Please add a title and select an image.');
    }
  };

  const handleViewScreenshots = () => {
    // Load screenshots from state for viewing in the dialog
    const newViewingScreenshots: ViewingScreenshot[] = screenshots.map(s => ({
      screenshots_id: s.id,
      screenshots: s.selectedImageScreenshots as string,
      title: s.screenshot_title
    }));
    setViewingScreenshot(newViewingScreenshots);
    setIsDialogOpen(true);
  };

  const handleDeleteScreenshot = (id: number) => {
    const updatedScreenshots = screenshots.filter(screenshot => screenshot.id !== id);
    setScreenshots(updatedScreenshots);

    // Update the dialog view
    const newViewingScreenshots: ViewingScreenshot[] = updatedScreenshots.map(s => ({
      screenshots_id: s.id,
      screenshots: s.selectedImageScreenshots as string,
      title: s.screenshot_title
    }));
    setViewingScreenshot(newViewingScreenshots);
  };

  const handleSubmitScreenshots = () => {
    try {
      // Format screenshots for localStorage
      const formattedScreenshots: ViewingScreenshot[] = screenshots.length > 0
        ? screenshots.map(s => ({
            screenshots_id: s.id,
            screenshots: s.selectedImageScreenshots as string,
            title: s.screenshot_title
          }))
        : [{ screenshots_id: 0, screenshots: " ", title: " " }]; // Placeholder if empty

      localStorage.setItem('screenshots', JSON.stringify(formattedScreenshots));
      router.push('/template');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          alert('Storage quota exceeded. Please delete some items before saving more.');
        } else {
          console.error('An error occurred:', error);
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#264653] flex items-start justify-center px-4 py-8 overflow-y-auto">
      <div className="flex flex-col items-center justify-start w-full max-w-screen-lg">
        <div className="mt-8 sm:mt-16 md:mt-24">
          <h3 className="text-white text-2xl mb-4">Complete</h3>
        </div>

        <div className="relative w-full mb-6 max-w-2xl mt-10">
          <div
            className="absolute bottom-0 left-0 h-2 rounded-full"
            style={{ width: '100%', backgroundColor: '#ffffff' }}
          ></div>
          <div
            className="absolute bottom-0 left-0 h-2 rounded-full"
            style={{ width: `${progress}%`, backgroundColor: '#4caf50' }}
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

        <div className="text-white text-center mt-2 w-full max-w-2xl mb-8">
          <Card className="bg-[#ffffff33]">
            <CardHeader>
              <CardTitle className="text-lg text-start text-gray-800">Screenshot of Projects</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                <div className="flex flex-col">
                  {selectedImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedImage as string}
                      alt="Selected"
                      className="w-full max-w-[130px] h-auto object-cover border border-gray-300 rounded "
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <Label htmlFor="imageUpload" className="text-start mb-1 text-gray-800">Choose an image</Label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="border border-gray-300 p-1 rounded "
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="screenshotTitle" className="text-start mb-1 text-gray-800">Screenshot Title</Label>
                  <Input
                    id="screenshotTitle"
                    type="text"
                    value={screenshotTitle}
                    onChange={(e) => setScreenshotTitle(e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center px-2 pb-4">
              <div className="flex flex-col w-full gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button className="w-full" onClick={handleAddScreenshots}>Add New Screenshot</Button>
                  <Button className="w-full" onClick={handleViewScreenshots}>View Screenshots</Button>
                </div>
                <Button className="w-full" onClick={handleSubmitScreenshots}>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Dialog for Viewing Screenshots */}
        {viewingScreenshot && (
          <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
            <DialogContent className="max-h-[80vh] overflow-y-auto bg-[#ffffffcc]"> {/* Added semi-transparent background */}
              <div className="text-center">
                {viewingScreenshot.length > 0 ? (
                  viewingScreenshot.map((screenshot, index) => (
                    <div key={index} className="mb-4 relative">
                      <button
                        onClick={() => handleDeleteScreenshot(screenshot.screenshots_id)}
                        className="absolute top-0 left-0 p-2 text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                      <h3 className="text-lg font-semibold mb-2">{screenshot.title}</h3>
                      {screenshot.screenshots ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={screenshot.screenshots}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full max-w-[150px] h-auto object-cover border border-gray-300 rounded mx-auto"
                        />
                      ) : (
                        <p>No screenshot available</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No screenshots available</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog for Validation Message */}
        {isValidationDialogOpen && (
          <Dialog open={isValidationDialogOpen} onOpenChange={() => setIsValidationDialogOpen(false)}>
            <DialogContent className="max-w-sm bg-[#ffffffcc]">
              <div className="text-center p-4">
                <h4 className="text-lg font-semibold mb-2">Screenshot Limit Reached</h4>
                <p className="mb-4">You have reached the maximum number of 15 screenshots. Please delete some existing screenshots before adding new ones.</p>
                <Button onClick={() => setIsValidationDialogOpen(false)}>OK</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default CompletePage;
