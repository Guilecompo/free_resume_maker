'use client'
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IoIosCall, IoIosMail, IoLogoGithub, IoLogoLinkedin, IoMdGlobe } from "react-icons/io";
import { formatDate } from './utils/formatDate';

const colorOptions = [
    { label: 'Green & Yellow', bgColor: '#094f37', secondColor: '#f6c006' },
    { label: 'Blue & Orange', bgColor: '#003366', secondColor: '#ff6600' }
];

interface WorkDetail {
    work_details_id: number;
    work_details: string;
}

interface Experience {
    work: string;
    position: string;
    company: string;
    company_address: string;
    description: string;
    started: string;
    ended: string;
    work_details: WorkDetail[];
}
interface ProjectDetail {
    project_details_id: number;
    project_details: string;
}

interface PlatformUse {
    project_platform_useId: number;
    platform_use: string;
}
interface Project {
    project_id: number;
    project_title: string;
    project_description: string;
    project_type: string;
    project_started: string;
    project_ended: string;
    project_details: ProjectDetail[];
    platform_use: PlatformUse[];
}
interface OrganizationDetail {
    organization_detail_id: number;
    organization_detail: string;
}

interface Activity {
    activity_id: number;
    activity_title: string;
    activity_type: string;
    activity_community: string;
    activity_started: string;
    activity_ended: string;
    organization_detail: OrganizationDetail[];
}
interface Screenshot {
    screenshots_id: number;
    screenshots: string;
    title: string;
}

const ResumeTemplate = () => {
    const firstCardRef = useRef<HTMLDivElement>(null);
    const secondCardRef = useRef<HTMLDivElement>(null);

    const router = useRouter();

    const [selectedColor, setSelectedColor] = useState(colorOptions[0]);

    const [personalDetails, setPersonalDetails] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        suffix: '',
        email: '',
        phone_number: '',
    });

    const [profileSummary, setProfileSummary] = useState<string>("");

    const [profileImage, setProfileImage] = useState<string | null>(null);

    const [socialAccounts, setSocialAccounts] = useState({
        githubLink: '',
        linkedinLink: '',
        portfolioLink: '',
    });

    const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
    const [platformUsed, setPlatformUsed] = useState<string[]>([]);
    const [coreSkillsUsed, setCoreSkillsUsed] = useState<string[]>([]);

    const [educationDetails, setEducationDetails] = useState({
        bachelor: '',
        course: '',
        major: '',
        school: '',
        started: '',
        ended: '',
    });
    
    const [certificates, setCertificates] = useState<{ certificate_title: string; company_name: string; }[]>([]);

    const [experience, setExperience] = useState<Experience>({
        work: '',
        position: '',
        company: '',
        company_address: '',
        description: '',
        started: '',
        ended: '',
        work_details: [],
    });

    const [projects, setProjects] = useState<Project[]>([]);

    const [activities, setActivities] = useState<Activity[]>([]);

    const [screenshots, setScreenshots] = useState<Screenshot[]>([]);

    useEffect(() => {
        // Retrieve and parse personalDetails from localStorage
        const storedDetails = localStorage.getItem('personalDetails');
        if (storedDetails) {
            const parsedDetails = JSON.parse(storedDetails);
            setPersonalDetails(parsedDetails);
        }

        const storedImage = localStorage.getItem('profileImage');
        if (storedImage) {
            setProfileImage(storedImage);
        }

        const storedSocialAccounts = localStorage.getItem('socialAccounts');
        if (storedSocialAccounts) {
            const parsedSocialAccounts = JSON.parse(storedSocialAccounts);
            setSocialAccounts(parsedSocialAccounts);
        }
        const storedSkills = localStorage.getItem('technicalSkills');
        if (storedSkills) {
            const parsedSkills = JSON.parse(storedSkills);
            setTechnicalSkills(parsedSkills.skills || []);
        }
        const storedPlatformUse = localStorage.getItem('platforms');
        if (storedPlatformUse) {
            const parsedPlatformUse = JSON.parse(storedPlatformUse);
            setPlatformUsed(parsedPlatformUse.platformUse || []);
        }
        const storedCoreSkills = localStorage.getItem('coreSkilled');
        if (storedCoreSkills) {
            const parsedCoreSkills = JSON.parse(storedCoreSkills);
            setCoreSkillsUsed(parsedCoreSkills.coreSkills || []);
        }
        const storedProfileSummary = localStorage.getItem('personalSummary');
        if (storedProfileSummary) {
            setProfileSummary(storedProfileSummary);
        }
        const storedEducationDetails = localStorage.getItem('educationDetails');
        if (storedEducationDetails) {
            const parsedEducationDetails = JSON.parse(storedEducationDetails);
            setEducationDetails(parsedEducationDetails);
        }
        const storedCertificates = localStorage.getItem('certificates');
        if (storedCertificates) {
            const parsedCertificates = JSON.parse(storedCertificates);
            setCertificates(parsedCertificates);
        }
        const storedExperience = localStorage.getItem('experience');
        if (storedExperience) {
            const parsedExperience: Experience = JSON.parse(storedExperience);
            setExperience(parsedExperience);
        }
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            const parsedProjects: Project[] = JSON.parse(storedProjects);
            setProjects(parsedProjects);
        }
        const storedActivities = localStorage.getItem('activities');
        if (storedActivities) {
            const parsedActivities: Activity[] = JSON.parse(storedActivities);
            setActivities(parsedActivities);
        }
        const storedScreenshots = localStorage.getItem('screenshots');
        if (storedScreenshots) {
            const parsedScreenshots: Screenshot[] = JSON.parse(storedScreenshots);
            setScreenshots(parsedScreenshots);
        }
    }, []);

    const downloadPDF = async () => {
        if (firstCardRef.current && secondCardRef.current) {
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageHeight = doc.internal.pageSize.height;
    
            // Capture the first card with higher scale for better resolution
            const firstCardCanvas = await html2canvas(firstCardRef.current, { scale: 3 });
            const firstCardImage = firstCardCanvas.toDataURL('image/png');
            doc.addImage(firstCardImage, 'PNG', 0, 0, 210, 297);
            doc.addPage();
    
            // Capture the second card with higher scale for better resolution
            const secondCardCanvas = await html2canvas(secondCardRef.current, { scale: 3 });
            const secondCardImage = secondCardCanvas.toDataURL('image/png');
            doc.addImage(secondCardImage, 'PNG', 0, 0, 210, 297);
    
            // Save the PDF
            const filename = `${personalDetails.lastname || 'Resume'}.pdf`;
            doc.save(filename);

            localStorage.clear();

            // Redirect to home page
            router.push('/');
        }
    };
    

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-1 gap-2 p-4 bg-[#264653]">
            <div className="flex flex-row">
                <div className="mr-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="w-auto sm:w-auto md:text-sm text-xs"
                                style={{ backgroundColor: selectedColor.secondColor }}
                            >
                                Select Color Theme
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full sm:w-56">
                            <DropdownMenuLabel>Select Color Theme</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={selectedColor.label}
                                onValueChange={(value) => {
                                    const color = colorOptions.find(opt => opt.label === value);
                                    if (color) setSelectedColor(color);
                                }}
                            >
                                {colorOptions.map(color => (
                                    <DropdownMenuRadioItem key={color.label} value={color.label}>
                                        {color.label}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div>
                    <Button
                        onClick={downloadPDF}
                        className="w-auto sm:w-auto md:text-sm text-xs"
                        style={{ backgroundColor: selectedColor.secondColor }}
                    >
                        Download as Pdf
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <Card ref={firstCardRef} className="w-[100mm] md:w-[210mm] h-[297mm]"> {/* Approximate A4 size */}
                        <CardContent className="p-0 h-full w-full">
                            <div className="flex flex-row h-full">
                                <div className="w-2/4 md:w-2/5 h-full flex items-start justify-start p-2" style={{ backgroundColor: selectedColor.bgColor }}>
                                    <div className="text-white text-center">
                                        <div className="mt-2 flex items-start justify-start h-32 max-h-32">
                                            <div className="w-24 h-24 md:w-32 md:h-32 shadow-lg flex items-center justify-center" style={{ backgroundColor: selectedColor.secondColor }}>
                                                <img src={profileImage || "https://via.placeholder.com/150"} alt="Profile" className="w-full h-full object-cover"/>
                                            </div>
                                        </div>
                                        <div className="mt-0 md:mt-2 h-28 max-h-28">
                                        <h2 className="text-xs md:text-2xl font-semibold text-start uppercase mt-2">{`${personalDetails.firstname} ${personalDetails.middlename ? `${personalDetails.middlename}. ` : ''}${personalDetails.lastname} ${personalDetails.suffix}`}</h2>
                                            <h2 className="text-xs md:text-md font-semibold text-start uppercase mt-2">{`${educationDetails.course}`}</h2>
                                            <h2 className="text-xs md:text-md font-semibold text-start uppercase mt-2">{`${educationDetails.major}`}</h2>
                                        </div>
                                        <div className="mt-2 md:mt-3 h-24 max-h-24">
                                            <h2 className="text-xs md:text-md font-semibold text-start uppercase " style={{ color: selectedColor.secondColor }}>Contact Information</h2>
                                            {personalDetails.phone_number && (
                                                <div className="mt-2 pl-0 md:pl-3 flex items-center text-[10px] md:text-sm">
                                                    <IoIosCall className="text-md md:text-2xl mt-1" />
                                                    <p className="pl-1 md:pl-3">{personalDetails.phone_number}</p>
                                                </div>
                                            )}

                                            {personalDetails.email && (
                                                <div className="mt-2 pl-0 md:pl-3 flex items-center text-[10px] md:text-sm">
                                                    <IoIosMail className="text-md md:text-2xl mt-1" />
                                                    <p className="pl-1 md:pl-3">{personalDetails.email}</p>
                                                </div>
                                            )}

                                            {socialAccounts.linkedinLink && (
                                                <div className="mt-2 pl-0 md:pl-3 flex items-center text-[10px] md:text-sm">
                                                    <IoLogoLinkedin className="text-md md:text-2xl mt-1" />
                                                    <p className="pl-1 md:pl-3">{socialAccounts.linkedinLink}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-5 h-16 max-h-16">
                                            <h2 className="text-xs md:text-md font-semibold text-start uppercase" style={{ color: selectedColor.secondColor }}>Portfolio</h2>
                                            {socialAccounts.portfolioLink && (
                                                <div className="mt-2 pl-0 md:pl-3 flex items-center text-[10px] md:text-sm">
                                                    <IoMdGlobe className="text-md md:text-2xl mt-1" />
                                                    <p className="pl-1 md:pl-3">{socialAccounts.portfolioLink}</p>
                                                </div>
                                            )}
                                            {socialAccounts.githubLink && (
                                                <div className="mt-2 pl-0 md:pl-3 flex items-center text-[10px] md:text-sm">
                                                    <IoLogoGithub className="text-md md:text-2xl mt-1" />
                                                    <p className="pl-1 md:pl-3">{socialAccounts.githubLink}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-5 h-36 max-h-36">
                                            <h2 className="text-xs md:text-md font-semibold text-start uppercase" style={{ color: selectedColor.secondColor }}>Technical Skills</h2>
                                            <div className="mt-2 pl-0 md:pl-3  text-xs md:text-sm">
                                                {technicalSkills.map(skill => (
                                                    <p key={skill} className="pl-1 md:pl-3 flex items-center text-[10px] md:text-sm">• {skill}</p>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-5 h-48 max-h-48">
                                            <h2 className="text-xs md:text-md font-semibold text-start uppercase" style={{ color: selectedColor.secondColor }}>Programming Languages, Tools & Frameworks</h2>
                                            <div className="mt-2 pl-0 md:pl-3 text-xs md:text-sm">
                                                {platformUsed.map(platformUse => (
                                                    <p key={platformUse} className="pl-1 md:pl-3 flex items-center text-[10px] md:text-sm">• {platformUse}</p>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-5 h-16 max-h-16">
                                            <h2 className="text-xs md:text-md font-semibold text-start uppercase" style={{ color: selectedColor.secondColor }}>Core Work Skills</h2>
                                            <div className="mt-2 pl-0 md:pl-3 text-xs md:text-sm">
                                                {coreSkillsUsed.map(coreSkills => (
                                                    <p key={coreSkills} className="pl-1 md:pl-3 flex items-center text-[10px] md:text-sm">• {coreSkills}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white w-4/5 h-full flex items-start justify-start p-2">
                                    <div className="text-gray-800 text-center">
                                        <div className="mt-2 mb-2 h-44 max-h-44">
                                            <h2 className="text-[9px] md:text-[14px] font-semibold text-start uppercase">Profile Summary</h2>
                                            <h2 className="text-[7px] md:text-[12px] font-light md:font-normal text-start mt-0 md:mt-2 p-2">{`${profileSummary}`}</h2>
                                        </div>
                                        <div className="border-b-4 " style={{ borderColor: selectedColor.secondColor }}></div>
                                        <div className="mt-2 mb-2 h-40 max-h-40">
                                            <h2 className="text-[9px] md:text-[14px] font-semibold text-start uppercase">Education and Certifications</h2>
                                            <h2 className="text-[8px] md:text-sm font-semibold text-start mt-2 px-2 uppercase">{`${educationDetails.bachelor ? `${educationDetails.bachelor} in ` : ''}${educationDetails.course || ''}`}</h2>
                                            <h2 className="text-[8px] md:text-[12px] font-light md:font-medium text-start px-2">{`${educationDetails.school || ''}${educationDetails.school && (educationDetails.started || educationDetails.ended) ? ' | ' : ''}${educationDetails.started ? formatDate(educationDetails.started) : ''}${educationDetails.ended ? ` - ${formatDate(educationDetails.ended)}` : ''}`}</h2>
                                            <div className="ps-4 text-xs md:text-[12px]">
                                                {certificates.filter(cert => cert.certificate_title.trim() || cert.company_name.trim()).length > 0 ? (
                                                    certificates.filter(cert => cert.certificate_title.trim() || cert.company_name.trim()).map((cert, index) => (
                                                        <div key={index}>
                                                            <p className="text-[7px] md:text-[12px] text-start flex items-center">
                                                                {/* Conditional Bullet Point */}
                                                                {index > 0 && '• '}
                                                                {/* Conditional Display of Certificate Title */}
                                                                {cert.certificate_title.trim()}
                                                                {/* Conditional Pipe Separator and Company Name */}
                                                                {cert.company_name.trim() ? ` | ${cert.company_name.trim()}` : ''}
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="border-b-4 " style={{ borderColor: selectedColor.secondColor }}></div>
                                        <div className="mt-2 mb-2 h-40 max-h-40">
                                            <h2 className="text-[9px] md:text-[14px] font-semibold text-start uppercase">Relevant Experience</h2>
                                            {
                                                // Check if work or position are non-empty or non-whitespace
                                                (experience.work.trim() || experience.position.trim()) && (
                                                    <h2 className="text-[8px] md:text-sm font-semibold text-start mt-2 px-2 uppercase">
                                                        {experience.work.trim() || ''} 
                                                        {experience.work.trim() && experience.position.trim() ? ` - ${experience.position.trim()}` : (experience.position.trim() || '')}
                                                    </h2>
                                                )
                                            }

                                            {
                                                // Check if company, company_address, started or ended are non-empty or non-whitespace
                                                (experience.company.trim() || experience.company_address.trim() || experience.started.trim() || experience.ended.trim()) && (
                                                    <h2 className="text-[8px] md:text-[12px] font-light md:font-medium text-start px-2">
                                                        {experience.company.trim() || ''} 
                                                        {experience.company.trim() && (experience.started.trim() || experience.ended.trim()) ? ' | ' : ''}
                                                        {experience.started.trim() ? formatDate(experience.started.trim()) : ''}
                                                        {experience.ended.trim() ? ` - ${formatDate(experience.ended.trim())}` : ''}
                                                    </h2>
                                                )
                                            }
                                            <h2 className="text-[8px] md:text-[12px] text-start ps-3">{`${experience.description}`}</h2>
                                            <div className="ps-4 text-[7px] md:text-[12px]">
                                                {experience.work_details.filter(detail => detail.work_details.trim()).length > 0 ? (
                                                    experience.work_details.filter(detail => detail.work_details.trim()).map((detail) => (
                                                        <div key={detail.work_details_id}>
                                                            <p className="text-[7px] md:text-[12px] text-start flex items-center">
                                                                {/* Display bullet point and work details */}
                                                                • {detail.work_details.trim()}
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : null}
                                            </div>  
                                        </div>
                                        <div className="border-b-4 " style={{ borderColor: selectedColor.secondColor }}></div>
                                        <div className="mt-2 mb-2 h-96 max-h-96">
                                            <h2 className="text-[9px] md:text-[14px] font-semibold text-start uppercase">Projects</h2>
                                            {projects.map((project) => (
                                                <div key={project.project_id} className="">
                                                    {/* Display project title only if it exists */}
                                                    {project.project_title.trim() && (
                                                        <h2 className="text-[8px] md:text-sm font-semibold text-start mt-2 px-2 uppercase">
                                                            {project.project_title}
                                                        </h2>
                                                    )}

                                                    {/* Display project type and dates only if they exist */}
                                                    {(project.project_type.trim() || project.project_started.trim() || project.project_ended.trim()) && (
                                                        <h2 className="text-[8px] md:text-[12px] font-light md:font-medium text-start px-2">
                                                            {project.project_type.trim() || ''}
                                                            {project.project_type.trim() && (project.project_started.trim() || project.project_ended.trim()) ? ' | ' : ''}
                                                            {project.project_started.trim() ? `${formatDate(project.project_started)}` : ''}
                                                            {project.project_ended.trim() ? ` - ${formatDate(project.project_ended)}` : ''}
                                                        </h2>
                                                    )}

                                                    {/* Display platforms used only if there are any */}
                                                    {project.platform_use.length > 0 && (
                                                        <h2 className="text-[8px] md:text-[12px] font-light md:font-medium text-start px-2 text-gray-600 ps-3">
                                                            {project.platform_use.map((platform, index) => (
                                                                <span key={platform.project_platform_useId}>
                                                                    {index > 0 && ' | '}
                                                                    {platform.platform_use.trim()}
                                                                </span>
                                                            ))}
                                                        </h2>
                                                    )}

                                                    {/* Display project description only if it exists */}
                                                    {project.project_description.trim() && (
                                                        <h2 className="text-[8px] md:text-[12px] text-start ps-3">
                                                            {project.project_description}
                                                        </h2>
                                                    )}

                                                    {/* Display project details only if there are any */}
                                                    {project.project_details.length > 0 && (
                                                        <div className="ps-4 text-[7px] md:text-[12px]">
                                                            {project.project_details.map((detail) => (
                                                                <div key={detail.project_details_id}>
                                                                    <p className="text-[7px] md:text-[12px] text-start flex items-center">
                                                                        • {detail.project_details.trim()}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-b-4 " style={{ borderColor: selectedColor.secondColor }}></div>
                                        <div className="mt-2 mb-2 h-24 max-h-24">
                                            <h2 className="text-[9px] md:text-[14px] font-semibold text-start uppercase">Activities</h2>
                                            {activities.filter(activity => 
                                                    activity.activity_title.trim() || 
                                                    activity.activity_community.trim() || 
                                                    activity.activity_started.trim() || 
                                                    activity.activity_ended.trim() || 
                                                    activity.organization_detail.length > 0
                                                ).map(activity => (
                                                    <div key={activity.activity_id} className="mb-2">
                                                        {/* Display activity type and title only if they exist */}
                                                        {(activity.activity_type.trim() || activity.activity_title.trim()) && (
                                                            <h2 className="text-[8px] md:text-sm font-semibold text-start mt-2 px-2 uppercase">
                                                                {activity.activity_type.trim()} - {activity.activity_title.trim()}
                                                            </h2>
                                                        )}

                                                        {/* Display community and dates only if they exist */}
                                                        {(activity.activity_community.trim() || activity.activity_started.trim() || activity.activity_ended.trim()) && (
                                                            <h2 className="text-[8px] md:text-[12px] font-light md:font-medium text-start px-2">
                                                                {activity.activity_community.trim() || ''}
                                                                {activity.activity_community.trim() && (activity.activity_started.trim() || activity.activity_ended.trim()) ? ' | ' : ''}
                                                                {activity.activity_started.trim() ? `${formatDate(activity.activity_started.trim())}` : ''}
                                                                {activity.activity_ended.trim() ? ` - ${formatDate(activity.activity_ended.trim())}` : ''}
                                                            </h2>
                                                        )}

                                                        {/* Display organization details only if there are any */}
                                                        {activity.organization_detail.length > 0 && (
                                                            <div className="ps-4 text-[7px] md:text-[12px]">
                                                                {activity.organization_detail.map(detail => (
                                                                    detail.organization_detail.trim() && (
                                                                        <div key={detail.organization_detail_id}>
                                                                            <p className="text-[7px] md:text-[12px] text-start flex items-center">
                                                                                • {detail.organization_detail.trim()}
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Card ref={secondCardRef} className="w-[100mm] md:w-[210mm] h-[297mm]"> {/* Approximate A4 size */}
                        <CardContent className="p-0 h-full">
                            <div className="flex flex-col h-full">
                                <div className="h-24 w-full flex items-center justify-center p-2" style={{ backgroundColor: selectedColor.bgColor }}>
                                    <h2 className="text-xs md:text-xl font-semibold text-start text-white">{`${personalDetails.firstname} ${personalDetails.middlename ? `${personalDetails.middlename}. ` : ''}${personalDetails.lastname} ${personalDetails.suffix}`}</h2>
                                </div>
                                <div className="bg-white w-full h-full p-2">
                                    <div className="text-gray-800 grid grid-cols-3 gap-1">
                                        {screenshots.map((screenshot) => (
                                            <div key={screenshot.title} className="mb-4 flex flex-col items-center">
                                                <img 
                                                    src={screenshot.screenshots} 
                                                    alt={`${screenshot.title}`} 
                                                    className="w-[90px] h-[100px] md:w-[150px] md:h-[150px] object-cover"
                                                />
                                                <h3 className="text-xs md:text-sm font-semibold mt-2">{screenshot.title}</h3>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ResumeTemplate;
