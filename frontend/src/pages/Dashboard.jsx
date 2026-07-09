import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  Plus,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
  BrainIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  SparklesIcon,
  FileText,
  MessageSquare,
  Linkedin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);

  const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // ATS Checker States
  const [showAtsChecker, setShowAtsChecker] = useState(false);
  const [atsResumeSource, setAtsResumeSource] = useState("saved"); // "saved" or "upload"
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [atsResumeFile, setAtsResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [isCheckingAts, setIsCheckingAts] = useState(false);
  const [generalAuditMode, setGeneralAuditMode] = useState(false);

  // Cover Letter States
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetterResumeId, setCoverLetterResumeId] = useState("");
  const [coverLetterJd, setCoverLetterJd] = useState("");
  const [coverLetterTone, setCoverLetterTone] = useState("professional");
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [coverLetterResult, setCoverLetterResult] = useState("");
  const [coverLetterSource, setCoverLetterSource] = useState("saved"); // "saved" or "upload"
  const [coverLetterFile, setCoverLetterFile] = useState(null);

  // Interview Prep States
  const [showInterviewPrep, setShowInterviewPrep] = useState(false);
  const [interviewResumeId, setInterviewResumeId] = useState("");
  const [interviewJobTitle, setInterviewJobTitle] = useState("");
  const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);
  const [interviewResult, setInterviewResult] = useState("");
  const [interviewSource, setInterviewSource] = useState("saved"); // "saved" or "upload"
  const [interviewFile, setInterviewFile] = useState(null);



  const navigate = useNavigate();

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: { Authorization: token },
      });

      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const createResume = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.post(
        "/api/resumes/create",
        { title },
        { headers: { Authorization: token } }
      );

      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const resumeText = await pdfToText(resume);

      const { data } = await api.post(
        "/api/ai/upload-resume",
        { title, resumeText },
        { headers: { Authorization: token } }
      );

      setTitle("");
      setResume(null);
      setShowUploadResume(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }

    setIsLoading(false);
  };

  const getResumeTextById = (resumeId) => {
    const selectedResumeObj = allResumes.find(r => r._id === resumeId);
    if (!selectedResumeObj) return "";
    
    let text = `Name: ${selectedResumeObj.personal_info?.full_name || ""}\n`;
    text += `Profession: ${selectedResumeObj.personal_info?.profession || ""}\n\n`;
    text += `Summary:\n${selectedResumeObj.professional_summary || ""}\n\n`;
    text += `Skills:\n${(selectedResumeObj.skills || []).join(", ")}\n\n`;
    text += `Experience:\n`;
    (selectedResumeObj.experience || []).forEach(exp => {
      text += `- ${exp.position} at ${exp.company} (${exp.start_date} - ${exp.end_date}): ${exp.description}\n`;
    });
    text += `\nProjects:\n`;
    (selectedResumeObj.project || []).forEach(proj => {
      text += `- ${proj.name} (${proj.type}): ${proj.description}\n`;
    });
    text += `\nEducation:\n`;
    (selectedResumeObj.education || []).forEach(edu => {
      text += `- ${edu.degree} in ${edu.field} from ${edu.institution} (Graduated: ${edu.graduation_date})\n`;
    });
    return text;
  };

  const handleGenerateCoverLetter = async (e) => {
    e.preventDefault();
    setIsGeneratingCoverLetter(true);
    setCoverLetterResult("");
    try {
      let resumeText = "";
      if (coverLetterSource === "saved") {
        if (!coverLetterResumeId) {
          toast.error("Please select a saved resume");
          setIsGeneratingCoverLetter(false);
          return;
        }
        resumeText = getResumeTextById(coverLetterResumeId);
      } else {
        if (!coverLetterFile) {
          toast.error("Please upload a PDF resume file");
          setIsGeneratingCoverLetter(false);
          return;
        }
        resumeText = await pdfToText(coverLetterFile);
      }

      if (!resumeText.trim()) {
        toast.error("Resume content is empty. Please add details or upload a valid file.");
        setIsGeneratingCoverLetter(false);
        return;
      }

      const { data } = await api.post(
        "/api/ai/generate-cover-letter",
        { resumeText, jobDescription: coverLetterJd, tone: coverLetterTone },
        { headers: { Authorization: token } }
      );
      setCoverLetterResult(data.content);
      toast.success("Cover letter generated!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsGeneratingCoverLetter(false);
  };

  const handleGenerateInterviewPrep = async (e) => {
    e.preventDefault();
    setIsGeneratingInterview(true);
    setInterviewResult("");
    try {
      let resumeText = "";
      if (interviewSource === "saved") {
        if (!interviewResumeId) {
          toast.error("Please select a saved resume");
          setIsGeneratingInterview(false);
          return;
        }
        resumeText = getResumeTextById(interviewResumeId);
      } else {
        if (!interviewFile) {
          toast.error("Please upload a PDF resume file");
          setIsGeneratingInterview(false);
          return;
        }
        resumeText = await pdfToText(interviewFile);
      }

      if (!resumeText.trim()) {
        toast.error("Resume content is empty. Please add details or upload a valid file.");
        setIsGeneratingInterview(false);
        return;
      }

      const { data } = await api.post(
        "/api/ai/interview-prep",
        { resumeText, jobTitle: interviewJobTitle },
        { headers: { Authorization: token } }
      );
      setInterviewResult(data.content);
      toast.success("Interview guide generated!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsGeneratingInterview(false);
  };



  const handleCheckAts = async (e) => {
    e.preventDefault();

    setIsCheckingAts(true);
    setAtsResult(null);

    try {
      let resumeText = "";

      if (atsResumeSource === "saved") {
        if (!selectedResumeId) {
          toast.error("Please select a saved resume");
          setIsCheckingAts(false);
          return;
        }
        resumeText = getResumeTextById(selectedResumeId);
        if (!resumeText) {
          toast.error("Selected resume not found");
          setIsCheckingAts(false);
          return;
        }
      } else {
        if (!atsResumeFile) {
          toast.error("Please select a PDF resume file");
          setIsCheckingAts(false);
          return;
        }
        resumeText = await pdfToText(atsResumeFile);
      }

      const { data } = await api.post(
        "/api/ai/check-ats",
        { resumeText, jobDescription },
        { headers: { Authorization: token } }
      );

      setAtsResult(data);
      toast.success("ATS score calculated!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
    setIsCheckingAts(false);
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Welcome, {user?.personal_info?.full_name || user?.name || "Developer"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Create, analyze, and optimize your resumes with AI assistance.
            </p>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Create Resume */}
          <div
            onClick={() => setShowCreateResume(true)}
            className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-green-500 dark:hover:border-green-500 rounded-2xl p-5 flex flex-col justify-between group shadow-xs hover:shadow-xl dark:shadow-none transition-all duration-300 cursor-pointer h-44"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-colors"></div>
            <div>
              <div className="size-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all duration-300 mb-3">
                <Plus className="size-5.5" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                Create New Resume
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Build a professional resume from scratch with our step-by-step assistant.
              </p>
            </div>
            <div className="text-xs font-semibold text-green-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-3">
              <span>Build now</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Card 2: Upload Existing */}
          <div
            onClick={() => setShowUploadResume(true)}
            className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 rounded-2xl p-5 flex flex-col justify-between group shadow-xs hover:shadow-xl dark:shadow-none transition-all duration-300 cursor-pointer h-44"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors"></div>
            <div>
              <div className="size-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:bg-purple-50 group-hover:text-white transition-all duration-300 mb-3">
                <UploadCloudIcon className="size-5.5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                Upload Existing PDF
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Import an existing PDF resume to parse the details and customize it.
              </p>
            </div>
            <div className="text-xs font-semibold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-3">
              <span>Import file</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Card 3: ATS Score Checker */}
          <div
            onClick={() => {
              setShowAtsChecker(true);
              setAtsResult(null);
              setJobDescription("");
              setAtsResumeFile(null);
              setSelectedResumeId("");
              setGeneralAuditMode(false);
            }}
            className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-5 flex flex-col justify-between group shadow-xs hover:shadow-xl dark:shadow-none transition-all duration-300 cursor-pointer h-44"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors"></div>
            <div>
              <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-white transition-all duration-300 mb-3">
                <BrainIcon className="size-5.5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-450 transition-colors">
                ATS Score Checker
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 leading-relaxed">
                Compare your resume with a Job Description to get an AI ATS match score.
              </p>
            </div>
            <div className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-3">
              <span>Check score</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Card 4: AI Cover Letter Writer */}
          <div
            onClick={() => {
              setShowCoverLetter(true);
              setCoverLetterResult("");
              setCoverLetterResumeId("");
              setCoverLetterJd("");
              setCoverLetterSource("saved");
              setCoverLetterFile(null);
            }}
            className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 rounded-2xl p-5 flex flex-col justify-between group shadow-xs hover:shadow-xl dark:shadow-none transition-all duration-300 cursor-pointer h-44"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-colors"></div>
            <div>
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 mb-3">
                <FileText className="size-5.5" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-450 transition-colors">
                AI Cover Letter Writer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Generate a tailored cover letter customized for any target role.
              </p>
            </div>
            <div className="text-xs font-semibold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-3">
              <span>Write letter</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Card 5: AI Interview Prep */}
          <div
            onClick={() => {
              setShowInterviewPrep(true);
              setInterviewResult("");
              setInterviewResumeId("");
              setInterviewJobTitle("");
              setInterviewSource("saved");
              setInterviewFile(null);
            }}
            className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 dark:hover:border-rose-500 rounded-2xl p-5 flex flex-col justify-between group shadow-xs hover:shadow-xl dark:shadow-none transition-all duration-300 cursor-pointer h-44"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-colors"></div>
            <div>
              <div className="size-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 mb-3">
                <MessageSquare className="size-5.5" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 group-hover:text-rose-700 dark:group-hover:text-rose-455 transition-colors">
                AI Interview Prep
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Practice customized questions and answer tips based on your resume.
              </p>
            </div>
            <div className="text-xs font-semibold text-rose-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-3">
              <span>Prepare Q&A</span>
              <span>&rarr;</span>
            </div>
          </div>


        </div>



        {/* Create Resume Modal */}
        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-100 shadow-xl rounded-2xl w-full max-w-md p-6 overflow-hidden"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-2">Create a Resume</h2>
              <p className="text-xs text-slate-400 mb-6">Enter a name for your new resume layout.</p>
              
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="e.g. Software Engineer Resume"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-6 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm transition-all"
                required
              />

              <button className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold text-sm shadow-sm active:scale-95 transition-all">
                Create Resume
              </button>

              <button
                type="button"
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              >
                <XIcon className="size-5" />
              </button>
            </div>
          </form>
        )}

        {/* Upload Resume Modal */}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-100 shadow-xl rounded-2xl w-full max-w-md p-6"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-2">Upload Resume</h2>
              <p className="text-xs text-slate-400 mb-6">Upload a PDF. Our AI will parse and pre-populate your details.</p>
              
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="e.g. Imported Resume"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm transition-all"
                required
              />

              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-slate-700"
                >
                  <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-xl p-6 py-8 mb-6 hover:border-green-500 text-slate-400 hover:text-green-600 cursor-pointer transition-all duration-300">
                    {resume ? (
                      <p className="text-green-600 font-medium text-sm text-center truncate max-w-xs">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-10 stroke-1 text-slate-300" />
                        <p className="text-xs font-semibold text-slate-500">Select PDF resume file</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>

              <button
                disabled={isLoading}
                className="w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <LoaderCircleIcon className="animate-spin size-4 text-white" />
                )}
                {isLoading ? "Uploading..." : "Upload Resume"}
              </button>

              <button
                type="button"
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                }}
              >
                <XIcon className="size-5" />
              </button>
            </div>
          </form>
        )}



        {/* ATS Score Checker Modal */}
        {showAtsChecker && (
          <div
            onClick={() => {
              if (!isCheckingAts) setShowAtsChecker(false);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-100 shadow-xl rounded-2xl w-full max-w-5xl p-6 md:p-8 flex flex-col md:flex-row gap-8 overflow-y-auto max-h-[90vh]"
            >
              <button
                type="button"
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors z-10"
                onClick={() => {
                  if (!isCheckingAts) setShowAtsChecker(false);
                }}
              >
                <XIcon className="size-5" />
              </button>

              {/* Left Column - ATS Inputs */}
              <form onSubmit={handleCheckAts} className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BrainIcon className="size-5 text-blue-500" />
                    <h2 className="text-xl font-bold text-slate-800">ATS Match Calculator</h2>
                  </div>
                  <p className="text-xs text-slate-400 mb-6 font-sans">Compare your resume against a target Job Description using AI.</p>

                  {/* Tab Selector */}
                  <div className="flex border-b border-slate-200 mb-6">
                    <button
                      type="button"
                      onClick={() => setAtsResumeSource("saved")}
                      className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-all ${
                        atsResumeSource === "saved"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      Saved Resumes ({allResumes.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAtsResumeSource("upload")}
                      className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-all ${
                        atsResumeSource === "upload"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      Upload PDF Resume
                    </button>
                  </div>

                  {/* Resume inputs */}
                  {atsResumeSource === "saved" ? (
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Select Resume
                      </label>
                      {allResumes.length === 0 ? (
                        <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl">You have no saved resumes. Build one first or switch to PDF upload.</p>
                      ) : (
                        <select
                          value={selectedResumeId}
                          onChange={(e) => setSelectedResumeId(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all bg-white"
                          required
                        >
                          <option value="">-- Choose one of your resumes --</option>
                          {allResumes.map((r, i) => (
                            <option key={i} value={r._id}>{r.title}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ) : (
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Upload PDF File
                      </label>
                      <label htmlFor="ats-resume-input" className="block">
                        <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-xl p-5 hover:border-blue-500 text-slate-400 hover:text-blue-600 cursor-pointer transition-all duration-300">
                          {atsResumeFile ? (
                            <p className="text-blue-600 font-semibold text-sm text-center truncate max-w-[300px]">
                              {atsResumeFile.name}
                            </p>
                          ) : (
                            <>
                              <UploadCloud className="size-8 stroke-1 text-slate-300" />
                              <p className="text-xs font-semibold text-slate-500">Click to upload your PDF resume</p>
                            </>
                          )}
                        </div>
                      </label>
                      <input
                        type="file"
                        id="ats-resume-input"
                        accept=".pdf"
                        hidden
                        onChange={(e) => setAtsResumeFile(e.target.files[0])}
                      />
                    </div>
                  )}

                  {/* Toggle general audit mode */}
                  <div className="flex items-center gap-2 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <input
                      type="checkbox"
                      id="general-audit-mode"
                      checked={generalAuditMode}
                      onChange={(e) => {
                        setGeneralAuditMode(e.target.checked);
                        if (e.target.checked) {
                          setJobDescription("");
                        }
                      }}
                      className="size-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="general-audit-mode" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                      Check without Job Description (General Resume Audit)
                    </label>
                  </div>

                  {!generalAuditMode && (
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Job Description (JD)
                      </label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the target job description or requirements here..."
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all h-40 resize-none font-sans"
                        required
                      ></textarea>
                      {jobDescription && (
                        <div className="flex justify-end mt-1.5">
                          <button
                            type="button"
                            onClick={() => setJobDescription("")}
                            className="text-xs font-bold text-slate-400 hover:text-red-650 transition-colors cursor-pointer flex items-center gap-1 active:scale-95 duration-200"
                          >
                            <TrashIcon className="size-3.5" />
                            <span>Clear Text</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  disabled={isCheckingAts}
                  className="w-full py-3.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {isCheckingAts && (
                    <LoaderCircleIcon className="animate-spin size-4 text-white" />
                  )}
                  {isCheckingAts 
                    ? "Running AI Audit..." 
                    : (generalAuditMode ? "Run General Resume Audit" : "Calculate ATS Score")
                  }
                </button>
              </form>

              {/* Right Column - Results */}
              <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center min-h-[300px] max-h-[80vh] overflow-y-auto">
                {!atsResult && !isCheckingAts && (
                  <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400">
                    <SparklesIcon className="size-16 stroke-1 text-slate-300 mb-4 animate-pulse" />
                    <h3 className="text-base font-bold text-slate-600 mb-1">Waiting for analysis</h3>
                    <p className="text-xs max-w-xs leading-relaxed">Fill out the form on the left and click "Calculate ATS Score" to view match analytics.</p>
                  </div>
                )}

                {isCheckingAts && (
                  <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400">
                    <LoaderCircleIcon className="size-16 text-blue-500 animate-spin stroke-1 mb-4" />
                    <h3 className="text-base font-bold text-slate-600 mb-1">Scanning Resume & JD</h3>
                    <p className="text-xs max-w-xs leading-relaxed">Gemini AI is parsing keywords, analyzing skills, and calculating match percentages...</p>
                  </div>
                )}

                {atsResult && !isCheckingAts && (
                  <div className="h-full flex flex-col justify-between py-2">
                    <div>
                      {/* Score circle */}
                      <div className="flex items-center gap-6 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="relative size-20 flex items-center justify-center">
                          <svg className="size-full" viewBox="0 0 80 80">
                            <g transform="rotate(-90 40 40)">
                              <circle
                                cx="40"
                                cy="40"
                                r="34"
                                className="stroke-slate-200 fill-none"
                                strokeWidth="6"
                              />
                              <circle
                                cx="40"
                                cy="40"
                                r="34"
                                className="fill-none transition-all duration-1000"
                                strokeWidth="6"
                                strokeDasharray={`${2 * Math.PI * 34}`}
                                strokeDashoffset={`${2 * Math.PI * 34 * (1 - atsResult.score / 100)}`}
                                strokeLinecap="round"
                                style={{
                                  stroke: atsResult.score >= 75 ? "#10b981" : atsResult.score >= 50 ? "#f59e0b" : "#ef4444",
                                }}
                              />
                            </g>
                          </svg>
                          <span
                            className="absolute text-xl font-bold font-sans"
                            style={{
                              color: atsResult.score >= 75 ? "#047857" : atsResult.score >= 50 ? "#b45309" : "#b91c1c",
                            }}
                          >
                            {atsResult.score}%
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-800">
                            {jobDescription.trim()
                              ? (atsResult.score >= 75 ? "Excellent Match" : atsResult.score >= 50 ? "Moderate Match" : "Low Match")
                              : (atsResult.score >= 75 ? "Excellent Strength" : atsResult.score >= 50 ? "Good Strength" : "Needs Improvement")
                            }
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-sans">
                            {jobDescription.trim()
                              ? `Your resume matches this JD profile with a calculated ATS score of ${atsResult.score}%.`
                              : `Your resume has been audited against general ATS benchmarks with a readiness score of ${atsResult.score}%.`
                            }
                          </p>
                        </div>
                      </div>

                      {/* Matching and Missing Keywords */}
                      <div className="mb-6">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <CheckCircle2Icon className="size-4 text-emerald-500" />
                          {jobDescription.trim() ? "Matching Keywords" : "Strong Keywords Found"} ({atsResult.matching_keywords?.length || 0})
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(atsResult.matching_keywords || []).map((keyword, i) => (
                            <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100 font-medium">
                              {keyword}
                            </span>
                          ))}
                          {(!atsResult.matching_keywords || atsResult.matching_keywords.length === 0) && (
                            <span className="text-xs text-slate-400 italic">No matching keywords found.</span>
                          )}
                        </div>

                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <AlertTriangleIcon className="size-4 text-amber-500" />
                          {jobDescription.trim() ? "Missing Keywords" : "Areas for Improvement"} ({atsResult.missing_keywords?.length || 0})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(atsResult.missing_keywords || []).map((keyword, i) => (
                            <span key={i} className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-100 font-medium font-sans">
                              {keyword}
                            </span>
                          ))}
                          {(!atsResult.missing_keywords || atsResult.missing_keywords.length === 0) && (
                            <span className="text-xs text-slate-400 italic">No missing keywords! You're fully covered.</span>
                          )}
                        </div>
                      </div>

                      {/* Structural/Fit Feedback */}
                      <div className="mb-6">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Recruiter Audit Feedback
                        </h4>
                        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 font-sans">
                          <p>
                            <strong className="text-slate-800 block mb-0.5">Structure & Layout:</strong>
                            {atsResult.feedback?.structural || "Clean layout profile."}
                          </p>
                          <p>
                            <strong className="text-slate-800 block mb-0.5">Experience Alignment:</strong>
                            {atsResult.feedback?.experience_fit || "Relevant job skills."}
                          </p>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Actionable Recommendations
                        </h4>
                        <ul className="space-y-2 bg-blue-50/30 p-4 rounded-xl border border-blue-100/50 text-xs text-slate-600 font-sans">
                          {(atsResult.recommendations || []).map((rec, i) => (
                            <li key={i} className="flex gap-2 items-start">
                              <span className="text-blue-500 font-bold mt-0.5">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cover Letter Modal */}
        {showCoverLetter && (
          <div
            onClick={() => setShowCoverLetter(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl w-full max-w-4xl p-6 overflow-hidden flex flex-col md:flex-row gap-6 max-h-[85vh]"
            >
              {/* Left Column - Form */}
              <form onSubmit={handleGenerateCoverLetter} className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100 mb-1">AI Cover Letter Writer</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Create a highly targeted cover letter using your resume details.</p>
                  
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Resume Source</label>
                    <div className="flex gap-4 mb-3">
                      <label className="flex items-center gap-2 text-xs text-slate-705 dark:text-slate-350 cursor-pointer">
                        <input
                          type="radio"
                          name="coverLetterSource"
                          value="saved"
                          checked={coverLetterSource === "saved"}
                          onChange={() => setCoverLetterSource("saved")}
                          className="accent-amber-500"
                        />
                        <span>Saved Resume</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-705 dark:text-slate-355 cursor-pointer">
                        <input
                          type="radio"
                          name="coverLetterSource"
                          value="upload"
                          checked={coverLetterSource === "upload"}
                          onChange={() => setCoverLetterSource("upload")}
                          className="accent-amber-500"
                        />
                        <span>Upload PDF</span>
                      </label>
                    </div>

                    {coverLetterSource === "saved" ? (
                      <select
                        value={coverLetterResumeId}
                        onChange={(e) => setCoverLetterResumeId(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 dark:text-slate-100 rounded-xl outline-none text-sm focus:border-amber-500"
                        required={coverLetterSource === "saved"}
                      >
                        <option value="">-- Choose a resume --</option>
                        {allResumes.map((r, i) => (
                          <option key={i} value={r._id}>{r.title}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setCoverLetterFile(e.target.files[0])}
                        className="w-full text-xs text-slate-505 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-amber-950 dark:file:text-amber-400 cursor-pointer"
                        required={coverLetterSource === "upload"}
                      />
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tone of Letter</label>
                    <select
                      value={coverLetterTone}
                      onChange={(e) => setCoverLetterTone(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 dark:text-slate-100 rounded-xl outline-none text-sm focus:border-amber-500"
                    >
                      <option value="professional">Professional & Structured</option>
                      <option value="confident">Confident & Impactful</option>
                      <option value="enthusiastic">Enthusiastic & Eager</option>
                      <option value="creative">Creative & Unique</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Job Description / Role Details (Optional)</label>
                    <textarea
                      value={coverLetterJd}
                      onChange={(e) => setCoverLetterJd(e.target.value)}
                      placeholder="Paste details of the role or company to customize the letter..."
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 dark:text-slate-100 rounded-xl outline-none text-sm h-36 resize-none focus:border-amber-500"
                    ></textarea>
                  </div>
                </div>

                <button
                  disabled={isGeneratingCoverLetter}
                  className="w-full py-3.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  {isGeneratingCoverLetter && <LoaderCircleIcon className="animate-spin size-4 text-white" />}
                  {isGeneratingCoverLetter ? "Drafting Cover Letter..." : "Generate Cover Letter"}
                </button>
              </form>

              {/* Right Column - Results */}
              <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between overflow-y-auto max-h-[75vh]">
                {!coverLetterResult && !isGeneratingCoverLetter && (
                  <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400 dark:text-slate-500 h-full">
                    <FileText className="size-16 stroke-1 text-slate-300 dark:text-slate-700 mb-4" />
                    <h3 className="text-base font-bold text-slate-650 dark:text-slate-400 mb-1">Your letter will appear here</h3>
                    <p className="text-xs max-w-xs leading-relaxed">Fill out the details on the left to write a personalized cover letter using Gemini AI.</p>
                  </div>
                )}

                {isGeneratingCoverLetter && (
                  <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400 dark:text-slate-500 h-full">
                    <LoaderCircleIcon className="size-16 text-amber-500 animate-spin stroke-1 mb-4" />
                    <h3 className="text-base font-bold text-slate-655 dark:text-slate-400 mb-1">Drafting Letter</h3>
                    <p className="text-xs max-w-xs leading-relaxed">Gemini is aligning your professional experience with the target job details...</p>
                  </div>
                )}

                {coverLetterResult && !isGeneratingCoverLetter && (
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Letter</h4>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(coverLetterResult);
                            toast.success("Copied to clipboard!");
                          }}
                          className="text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer"
                        >
                          Copy to Clipboard
                        </button>
                      </div>
                      <pre className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono max-h-[50vh] overflow-y-auto leading-relaxed select-text font-sans">
                        {coverLetterResult}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                type="button"
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer"
                onClick={() => setShowCoverLetter(false)}
              >
                <XIcon className="size-5" />
              </button>
            </div>
          </div>
        )}

        {/* Interview Prep Modal */}
        {showInterviewPrep && (
          <div
            onClick={() => setShowInterviewPrep(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl w-full max-w-4xl p-6 overflow-hidden flex flex-col md:flex-row gap-6 max-h-[85vh]"
            >
              {/* Left Column - Form */}
              <form onSubmit={handleGenerateInterviewPrep} className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100 mb-1">AI Interview Prep</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Generate target behavioral & technical questions based on your resume.</p>
                  
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Resume Source</label>
                    <div className="flex gap-4 mb-3">
                      <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-350 cursor-pointer">
                        <input
                          type="radio"
                          name="interviewSource"
                          value="saved"
                          checked={interviewSource === "saved"}
                          onChange={() => setInterviewSource("saved")}
                          className="accent-rose-500"
                        />
                        <span>Saved Resume</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-350 cursor-pointer">
                        <input
                          type="radio"
                          name="interviewSource"
                          value="upload"
                          checked={interviewSource === "upload"}
                          onChange={() => setInterviewSource("upload")}
                          className="accent-rose-500"
                        />
                        <span>Upload PDF</span>
                      </label>
                    </div>

                    {interviewSource === "saved" ? (
                      <select
                        value={interviewResumeId}
                        onChange={(e) => setInterviewResumeId(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 dark:text-slate-100 rounded-xl outline-none text-sm focus:border-rose-500"
                        required={interviewSource === "saved"}
                      >
                        <option value="">-- Choose a resume --</option>
                        {allResumes.map((r, i) => (
                          <option key={i} value={r._id}>{r.title}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setInterviewFile(e.target.files[0])}
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 dark:file:bg-rose-955 dark:file:text-rose-400 cursor-pointer"
                        required={interviewSource === "upload"}
                      />
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Target Job Role (e.g. Frontend developer)</label>
                    <input
                      value={interviewJobTitle}
                      onChange={(e) => setInterviewJobTitle(e.target.value)}
                      type="text"
                      placeholder="e.g. Senior Product Manager"
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 dark:text-slate-100 rounded-xl outline-none text-sm focus:border-rose-500"
                      required
                    />
                  </div>
                </div>

                <button
                  disabled={isGeneratingInterview}
                  className="w-full py-3.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 font-semibold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  {isGeneratingInterview && <LoaderCircleIcon className="animate-spin size-4 text-white" />}
                  {isGeneratingInterview ? "Analyzing Profile & Role..." : "Generate Interview Guide"}
                </button>
              </form>

              {/* Right Column - Results */}
              <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-6 md:pt-0 md:pl-6 flex flex-col justify-between overflow-y-auto max-h-[75vh]">
                {!interviewResult && !isGeneratingInterview && (
                  <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400 dark:text-slate-500 h-full">
                    <MessageSquare className="size-16 stroke-1 text-slate-300 dark:text-slate-700 mb-4" />
                    <h3 className="text-base font-bold text-slate-655 dark:text-slate-400 mb-1">Your questions will appear here</h3>
                    <p className="text-xs max-w-xs leading-relaxed">Fill out the details on the left to compile standard technical and behavioral prep questions.</p>
                  </div>
                )}

                {isGeneratingInterview && (
                  <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400 dark:text-slate-500 h-full">
                    <LoaderCircleIcon className="size-16 text-rose-500 animate-spin stroke-1 mb-4" />
                    <h3 className="text-base font-bold text-slate-655 dark:text-slate-400 mb-1">Creating Q&A Guide</h3>
                    <p className="text-xs max-w-xs leading-relaxed">Gemini is structuring real-world questions and model answer metrics for you...</p>
                  </div>
                )}

                {interviewResult && !isGeneratingInterview && (
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tailored Prep Questions</h4>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(interviewResult);
                            toast.success("Copied to clipboard!");
                          }}
                          className="text-xs font-bold text-rose-605 hover:text-rose-700 transition-colors cursor-pointer"
                        >
                          Copy to Clipboard
                        </button>
                      </div>
                      <pre className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans max-h-[50vh] overflow-y-auto leading-relaxed select-text">
                        {interviewResult}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                type="button"
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer"
                onClick={() => setShowInterviewPrep(false)}
              >
                <XIcon className="size-5" />
              </button>
            </div>
          </div>
          )}
      </div>
    </div>
  );
};

export default Dashboard;
