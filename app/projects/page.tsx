'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaBriefcase, FaCheckCircle, FaEdit, FaGraduationCap, FaTrash, FaUser } from 'react-icons/fa';

// Define types
interface PlatformUse {
  project_platform_useId: number;
  platform_use: string;
}

interface Project {
  project_id: number;
  project_title: string;
  project_type: string;
  project_started: string;
  project_ended: string;
  platform_use: PlatformUse[];
  project_description: string;
  project_details: { project_details_id: number; project_details: string }[];
}

// Define the steps with their icons
const steps = [
  { label: 'Personal', icon: <FaUser />, isActive: true },
  { label: 'Education', icon: <FaGraduationCap /> },
  { label: 'Experience', icon: <FaBriefcase /> },
  { label: 'Complete', icon: <FaCheckCircle /> }
];

const ProjectPage = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(26);
  const [platform_use, setPlatform_use] = useState<string[]>([]);
  const [project_descriptionInput, setProject_descriptionInput] = useState<string>("");
  const [project_detailsInput, setProject_detailsInput] = useState<string>("");
  const [project_description, setProject_description] = useState<string>("");
  const [project_details, setProject_details] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isViewProjectsDialogOpen, setIsViewProjectsDialogOpen] = useState(false);
  const [isMaxPlatformUseDialogOpen, setIsMaxPlatformUseDialogOpen] = useState(false);
  const [isMaxProjectDetailsDialogOpen, setIsMaxProjectDetailsDialogOpen] = useState(false);
  const [isMaxProjectsDialogOpen, setIsMaxProjectsDialogOpen] = useState(false); // New state for the max projects dialog
  const [dialogContent, setDialogContent] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  // Form field values
  const [formProjectTitle, setFormProjectTitle] = useState<string>("");
  const [formProjectType, setFormProjectType] = useState<string>("");
  const [formProjectStarted, setFormProjectStarted] = useState<string>("");
  const [formProjectEnded, setFormProjectEnded] = useState<string>("");

  // Load projects from localStorage if available
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }

    const timer = setTimeout(() => setProgress(26), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddCoreSkill = () => {
    if (project_descriptionInput.trim() !== "" && platform_use.length < 10) {
      setPlatform_use([...platform_use, project_descriptionInput.trim()]);
      setProject_descriptionInput("");
    } else if (platform_use.length >= 10) {
      setIsMaxPlatformUseDialogOpen(true);
    }
  };

  const handleAddProjectDetails = () => {
    if (project_detailsInput.trim() !== "" && project_details.length < 5) {
      setProject_details([...project_details, project_detailsInput.trim()]);
      setProject_detailsInput("");
    } else if (project_details.length >= 5) {
      setIsMaxProjectDetailsDialogOpen(true);
    }
  };

  const handleAddProject = () => {
    if (projects.length >= 2) {
      setIsMaxProjectsDialogOpen(true); // Show the new dialog if projects are already 2
      return;
    }

    if (project_description.split(/\s+/).length > 25) {
      setDescriptionError("Project description cannot exceed 25 words.");
      return;
    }

    const newProject: Project = {
      project_id: projects.length + 1,
      project_title: formProjectTitle,
      project_type: formProjectType,
      project_started: formProjectStarted,
      project_ended: formProjectEnded,
      platform_use: platform_use.map((platform, index) => ({
        project_platform_useId: index + 1,
        platform_use: platform
      })),
      project_description,
      project_details: project_details.map((detail, index) => ({
        project_details_id: index + 1,
        project_details: detail
      }))
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    // Clear form fields
    setFormProjectTitle("");
    setFormProjectType("");
    setFormProjectStarted("");
    setFormProjectEnded("");
    setPlatform_use([]);
    setProject_details([]);
    setProject_description("");
    setDescriptionError(null); // Clear error on successful addition
  };

  const handleDeleteProject = (project_id: number) => {
    const updatedProjects = projects.filter(project => project.project_id !== project_id);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const handleDeletePlatform = (platformId: number) => {
    setPlatform_use(platform_use.filter((_, index) => index !== platformId));
  };

  const handleDeleteProjectDetails = (detailId: number) => {
    setProject_details(project_details.filter((_, index) => index !== detailId));
  };

  const handleViewProjects = () => {
    setIsViewProjectsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProjectId(project.project_id);
    setFormProjectTitle(project.project_title);
    setFormProjectType(project.project_type);
    setFormProjectStarted(project.project_started);
    setFormProjectEnded(project.project_ended);
    setProject_description(project.project_description);
    setPlatform_use(project.platform_use.map(p => p.platform_use));
    setProject_details(project.project_details.map(d => d.project_details));
    setIsViewProjectsDialogOpen(false);
  };

  const handleSubmitProjects = () => {
    if (projects.length === 0) {
      setDialogContent("You need to add at least one project.");
      setIsViewProjectsDialogOpen(true);
      return;
    }
    if (projects.length > 2) {
      setDialogContent("You can only add a maximum of 2 projects.");
      setIsViewProjectsDialogOpen(true);
      return;
    }

    router.push('/activities');
  };

  const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

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
              <span className="text-white ml-2 md:ml-0 text-xs md:text-sm">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Content Layer */}
        <div className="w-full max-w-2xl flex flex-col">
          <Card className="bg-[#ffffff33] flex flex-col h-full max-h-[calc(100vh-200px)] md:max-h-[80vh] overflow-hidden">
            <CardHeader>
              <h2 className="text-sm font-medium text-center text-white">Step 7</h2>
              <CardTitle className="text-lg text-start text-gray-800">Projects</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <Label htmlFor="project_title" className="text-start mb-1 text-gray-800">Project Title*</Label>
                    <Input
                      id="project_title"
                      type="text"
                      value={formProjectTitle}
                      onChange={(e) => setFormProjectTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="project_type" className="text-start mb-1 text-gray-800">Project Type*</Label>
                    <Input
                      id="project_type"
                      type="text"
                      placeholder='e.g. Personal Project'
                      value={formProjectType}
                      onChange={(e) => setFormProjectType(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <Label htmlFor="project_started" className="text-start mb-1 text-gray-800">Project Started*</Label>
                    <Input
                      id="project_started"
                      type="date"
                      value={formProjectStarted}
                      onChange={(e) => setFormProjectStarted(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="project_ended" className="text-start mb-1 text-gray-800">Project Ended*</Label>
                    <Input
                      id="project_ended"
                      type="date"
                      value={formProjectEnded}
                      onChange={(e) => setFormProjectEnded(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="platform_use" className="text-start mb-1 text-gray-800">Languages, Tools & Frameworks used</Label>
                    <Input
                      id="platform_use"
                      type="text"
                      placeholder='e.g. JavaScript'
                      value={project_descriptionInput}
                      onChange={(e) => setProject_descriptionInput(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-start mb-1 text-transparent">Add</Label>
                    <Button className="w-full" onClick={handleAddCoreSkill}>Add Platform</Button>
                  </div>
                </div>
                {/* List of platforms in a responsive grid */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {platform_use.length > 0 ? (
                    platform_use.map((item, index) => (
                      <div key={index} className="bg-gray-800 text-gray-200 p-2 rounded flex items-center justify-between">
                        <span>{item}</span>
                        <button onClick={() => handleDeletePlatform(index)} className="text-red-500">
                          <FaTrash />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-800">No platforms added yet.</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="project_description" className="text-start mb-2 text-gray-800">Project Description here ...*</Label>
                  <Textarea
                    id="project_description"
                    value={project_description}
                    onChange={(e) => {
                      setProject_description(e.target.value);
                      if (wordCount(e.target.value) > 25) {
                        setDescriptionError("Project description cannot exceed 25 words.");
                      } else {
                        setDescriptionError(null);
                      }
                    }}
                    placeholder="Enter your project description here"
                    className="resize-none h-20 border-gray-300 rounded"
                    required
                  />
                  {descriptionError && <p className="text-red-500">{descriptionError}</p>}
                  <p className="text-gray-800 text-center">Word Count: {wordCount(project_description)} / 25</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <Label htmlFor="project_details" className="text-start mb-1 text-gray-800">Project Details</Label>
                    <Input
                      id="project_details"
                      type="text"
                      value={project_detailsInput}
                      onChange={(e) => setProject_detailsInput(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-start mb-1 text-transparent">Add</Label>
                    <Button className="w-full" onClick={handleAddProjectDetails}>Add Details</Button>
                  </div>
                </div>
                {/* List of Project details in a responsive grid */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {project_details.length > 0 ? (
                    project_details.map((item, index) => (
                      <div key={index} className="bg-gray-800 text-gray-200 p-2 rounded flex items-center justify-between">
                        <span>{item}</span>
                        <button onClick={() => handleDeleteProjectDetails(index)} className="text-red-500">
                          <FaTrash />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-800">No project details added yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center">
              <div className="flex flex-col w-full gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button className="w-full text-xs md:text-sm" onClick={handleAddProject}>Add New Project</Button>
                  <Button className="w-full text-xs md:text-sm" onClick={handleViewProjects}>View Projects</Button>
                </div>
                <Button className="w-full" onClick={handleSubmitProjects}>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Dialog for Viewing Projects */}
        <Dialog open={isViewProjectsDialogOpen} onOpenChange={setIsViewProjectsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle>Projects Overview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {dialogContent && <p className="text-red-500">{dialogContent}</p>}
              {projects.length > 0 ? (
                projects.map((project) => (
                  <div key={project.project_id} className="border-b border-gray-300 pb-2 flex items-center justify-between">
                    <div className="flex flex-col">
                      <h4 className="text-lg font-semibold">{project.project_title}</h4>
                      <p>Type: {project.project_type}</p>
                      <p>Started: {project.project_started}</p>
                      <p>Ended: {project.project_ended}</p>
                      <p>Description: {project.project_description}</p>
                      <p>Platforms Used:</p>
                      <ul className="list-disc pl-5">
                        {project.platform_use.map((platform) => (
                          <li key={platform.project_platform_useId}>{platform.platform_use}</li>
                        ))}
                      </ul>
                      <p>Project Details:</p>
                      <ul className="list-disc pl-5">
                        {project.project_details.map((detail) => (
                          <li key={detail.project_details_id}>{detail.project_details}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center">
                      <button onClick={() => handleEditProject(project)} className="text-blue-500 mr-4">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteProject(project.project_id)} className="text-red-500">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No projects to display.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog for Maximum Platform Use Reached */}
        <Dialog open={isMaxPlatformUseDialogOpen} onOpenChange={setIsMaxPlatformUseDialogOpen}>
          <DialogContent className="p-6">
            <DialogHeader>
              <DialogTitle>Maximum Platform Use Reached</DialogTitle>
            </DialogHeader>
            <p className="text-red-500">You can only add up to 10 platforms.</p>
            <Button className="mt-4" onClick={() => setIsMaxPlatformUseDialogOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>

        {/* Dialog for Maximum Project Details Reached */}
        <Dialog open={isMaxProjectDetailsDialogOpen} onOpenChange={setIsMaxProjectDetailsDialogOpen}>
          <DialogContent className="p-6">
            <DialogHeader>
              <DialogTitle>Maximum Project Details Reached</DialogTitle>
            </DialogHeader>
            <p className="text-red-500">You can only add up to 5 project details.</p>
            <Button className="mt-4" onClick={() => setIsMaxProjectDetailsDialogOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>

        {/* Dialog for Maximum Projects Reached */}
        <Dialog open={isMaxProjectsDialogOpen} onOpenChange={setIsMaxProjectsDialogOpen}>
          <DialogContent className="p-6">
            <DialogHeader>
              <DialogTitle>Maximum Projects Reached</DialogTitle>
            </DialogHeader>
            <p className="text-red-500">You can only add a maximum of 2 projects.</p>
            <Button className="mt-4" onClick={() => setIsMaxProjectsDialogOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectPage;
