import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import toast from "react-hot-toast";
import {
  FilePenLineIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
  SparklesIcon,
  ArrowLeftIcon,
  UserIcon,
  MailIcon,
  CalendarIcon,
} from "lucide-react";

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [allResumes, setAllResumes] = useState([]);
  const [editResumeId, setEditResumeId] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];
  const navigate = useNavigate();

  // Get first letter of name for the avatar
  const initial = user?.name ? user.name[0].toUpperCase() : "P";

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: { Authorization: token },
      });
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const editTitle = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.put(
        "/api/resumes/update",
        { resumeId: editResumeId, resumeData: { title } },
        {
          headers: { Authorization: token },
        }
      );

      setAllResumes(
        allResumes.map((resume) =>
          resume._id === editResumeId ? { ...resume, title } : resume
        )
      );
      setTitle("");
      setEditResumeId("");

      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this resume?"
      );
      if (confirm) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers: { Authorization: token },
        });

        setAllResumes(allResumes.filter((resume) => resume._id !== resumeId));
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  // Format member since date
  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Joined";

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/app")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-semibold group cursor-pointer"
        >
          <ArrowLeftIcon className="size-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        {/* Profile Card Section */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs mb-10">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Large Avatar Initial "P" */}
            <div className="size-28 md:size-32 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-extrabold text-5xl md:text-6xl flex items-center justify-center shadow-lg border-4 border-white animate-fade-in uppercase">
              {initial}
            </div>

            {/* Profile Info Details */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {user?.name}
                </h1>
                <p className="text-indigo-600 font-semibold text-sm mt-1">
                  AI Resume Builder Account Member
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-xl mx-auto md:mx-0">
                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-600">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <UserIcon className="size-4 text-slate-500" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Username
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {user?.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-600">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <MailIcon className="size-4 text-slate-500" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Email Address
                    </span>
                    <span className="text-sm font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-none">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-600 sm:col-span-2">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <CalendarIcon className="size-4 text-slate-500" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Member Since
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Resumes Listing inside Profile */}
        <div className="border-t border-slate-200 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <SparklesIcon className="size-5 text-indigo-500 animate-pulse" />
                Your Saved Resumes
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Manage, edit, and export your created resume templates.
              </p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl text-indigo-700 text-xs font-bold self-start sm:self-auto">
              Total: {allResumes.length} Resume{allResumes.length !== 1 ? "s" : ""}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-xs">
              <p className="text-slate-400 text-sm">Loading your resumes...</p>
            </div>
          ) : allResumes.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-xs">
              <p className="text-slate-400 text-sm">
                No saved resumes found. Go back to the dashboard to build one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {allResumes.map((resume, index) => {
                const baseColor = colors[index % colors.length];
                return (
                  <div
                    key={index}
                    onClick={() => navigate(`/app/builder/${resume._id}`)}
                    className="relative bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl p-5 flex flex-col justify-between group shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer h-48"
                  >
                    <div className="flex flex-col items-center justify-center flex-grow gap-3">
                      <div
                        className="size-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                        style={{
                          background: `${baseColor}15`,
                          color: baseColor,
                        }}
                      >
                        <FilePenLineIcon className="size-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-700 text-center px-1 truncate w-full">
                        {resume.title}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between w-full">
                      <span className="text-[10px] text-slate-400">
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </span>
                      <div
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setEditResumeId(resume._id);
                            setTitle(resume.title);
                          }}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700 transition-colors"
                        >
                          <PencilIcon className="size-3.5" />
                        </button>
                        <button
                          onClick={() => deleteResume(resume._id)}
                          className="p-1 hover:bg-red-55 rounded text-slate-500 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Edit Title Modal */}
        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId("")}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white border border-slate-100 shadow-xl rounded-2xl w-full max-w-md p-6"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Edit Resume Title
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Enter a new name for your resume layout.
              </p>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter title"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-6 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm transition-all"
                required
              />

              <button className="w-full py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 font-semibold text-sm shadow-sm active:scale-95 transition-all">
                Update
              </button>

              <button
                type="button"
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId("");
                  setTitle("");
                }}
              >
                <XIcon className="size-5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
