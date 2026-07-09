import { Zap, CheckCircle2, FileEdit, Award, LayoutGrid } from "lucide-react";

const Features = () => {
  return (
    <div
      id="features"
      className="max-w-7xl mx-auto px-6 py-20 scroll-mt-12 bg-white"
    >
      {/* Top Tagline */}
      <div className="flex flex-col items-center mb-20 text-center">
        <div className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-500/10 rounded-full px-4 py-1.5 mb-4">
          <Zap className="size-3.5 fill-green-600 stroke-none" />
          <span>Intelligent Resume Suite</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          AI-Powered Capabilities Built for Careers
        </h2>
        <p className="text-slate-500 text-sm max-w-lg mt-3 leading-relaxed">
          Explore our three core modules designed to help you build professional resumes, match job descriptions, and pass screening filters.
        </p>
      </div>

      {/* Feature Rows */}
      <div className="space-y-24">
        {/* Feature 1: Create & Edit Resume */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column: Text Info */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileEdit className="size-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-indigo-650 uppercase tracking-widest">Core Builder</span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Create & Customize Premium Resumes
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Build professional resumes from scratch or parse details from an existing file. Customize layouts, choose curated template themes (Classic, Modern, Minimal), and adjust color schemes in real-time.
              </p>
            </div>
            <ul className="space-y-3 pt-2 text-slate-650 text-sm">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                <span>Live interactive preview builder template</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                <span>Custom color pickers and typography fonts</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                <span>Structured sections for experience, projects, & skills</span>
              </li>
            </ul>
          </div>
          {/* Right Column: Image screenshot */}
          <div className="w-full lg:w-1/2 max-w-md mx-auto">
            <div className="relative group">
              {/* Blur backdrop overlay */}
              <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-2xl group-hover:bg-indigo-500/15 transition-colors duration-500"></div>
              {/* 3D isometric mockup frame */}
              <div className="relative border border-slate-250/80 rounded-2xl overflow-hidden bg-slate-100 p-2 isometric-left shadow-lg">
                <img
                  src="/modern.png"
                  alt="Resume Builder Template Customization"
                  className="rounded-xl w-full h-auto object-cover border border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: ATS Checker (Alternated) */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
          {/* Left Column (Right visual): Text Info */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="size-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">AI Keyword Audit</span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                AI-Powered ATS Score Checker
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Don't guess if your resume matches a role. Paste the target Job Description to run an automated AI review. Get match scores, identify missing keywords, and view feedback.
              </p>
            </div>
            <ul className="space-y-3 pt-2 text-slate-650 text-sm">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                <span>Instant percentage match score calculations</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                <span>Lists matching and missing critical keywords</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                <span>Actionable recruiter feedback and suggestions</span>
              </li>
            </ul>
          </div>
          {/* Right Column (Left visual): Image screenshot */}
          <div className="w-full lg:w-1/2 max-w-md mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-2xl group-hover:bg-emerald-500/15 transition-colors duration-500"></div>
              {/* 3D isometric mockup frame */}
              <div className="relative border border-slate-250/80 rounded-2xl overflow-hidden bg-slate-100 p-2 isometric-right shadow-lg">
                <img
                  src="/ats.png"
                  alt="AI ATS Score Calculator Keywords"
                  className="rounded-xl w-full h-auto object-cover border border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature 3: Resume Dashboard & Profile */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column: Text Info */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-655 flex items-center justify-center">
              <LayoutGrid className="size-6" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-indigo-650 uppercase tracking-widest">Dashboard Manager</span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Secure Dashboard & Profile
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Log in to find all your resume variations stored in your personalized vault. Manage, edit titles, duplicate layouts, or prune outdated versions.
              </p>
            </div>
            <ul className="space-y-3 pt-2 text-slate-650 text-sm">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                <span>Interactive personal profile interface</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                <span>Saved resumes card grid manager layout</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                <span>Fast title edits, duplicates, and deletions</span>
              </li>
            </ul>
          </div>
          {/* Right Column: Image screenshot */}
          <div className="w-full lg:w-1/2 max-w-md mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-2xl group-hover:bg-indigo-500/15 transition-colors duration-500"></div>
              {/* 3D isometric mockup frame */}
              <div className="relative border border-slate-250/80 rounded-2xl overflow-hidden bg-slate-100 p-2 isometric-left shadow-lg">
                <img
                  src="/minimal.png"
                  alt="User Profile Dashboard Resume Storage"
                  className="rounded-xl w-full h-auto object-cover border border-slate-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    
        * {
            font-family: 'Poppins', sans-serif;
        }

        .isometric-left {
          transform: perspective(1000px) rotateY(-12deg) rotateX(8deg) rotateZ(2deg);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          transform-style: preserve-3d;
        }
        .isometric-left:hover {
          transform: perspective(1000px) rotateY(0deg) rotateX(0deg) rotateZ(0deg) scale(1.04);
          box-shadow: 0 35px 60px -15px rgba(99, 102, 241, 0.22);
        }

        .isometric-right {
          transform: perspective(1000px) rotateY(12deg) rotateX(8deg) rotateZ(-2deg);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          transform-style: preserve-3d;
        }
        .isometric-right:hover {
          transform: perspective(1000px) rotateY(0deg) rotateX(0deg) rotateZ(0deg) scale(1.04);
          box-shadow: 0 35px 60px -15px rgba(16, 185, 129, 0.22);
        }
      `}</style>
    </div>
  );
};

export default Features;
