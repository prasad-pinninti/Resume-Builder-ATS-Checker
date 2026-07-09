import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// 3D Tilt Card Wrapper Component
const TiltCard = ({ children, className }) => {
  const [tiltStyle, setTiltStyle] = React.useState({});

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 12; // Tilts up to 12 degrees
    const rotateY = ((x - centerX) / centerX) * 12;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: "transform 0.1s ease-out, box-shadow 0.1s ease-out",
      boxShadow: "0 25px 40px -15px rgba(0, 0, 0, 0.12)",
      zIndex: 10
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease-out, box-shadow 0.5s ease-out"
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className={`${className} cursor-pointer transform-gpu`}
    >
      {children}
    </div>
  );
};

const Hero = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <div className="pb-20">
        {/* Hero Section */}
        <div className="relative flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 text-black overflow-hidden">
          <div className="absolute top-28 xl:top-10 -z-10 left-1/4 size-72 sm:size-96 xl:size-120 2xl:size-132 bg-green-300 blur-[100px] opacity-30"></div>

          {/* Floating 3D Glass Spheres */}
          <div className="absolute top-24 left-10 size-16 rounded-full bg-gradient-to-tr from-green-400/20 to-emerald-100/5 border border-white/20 shadow-xl pointer-events-none animate-float blur-[0.5px]"></div>
          <div className="absolute top-1/2 right-12 size-24 rounded-full bg-gradient-to-br from-blue-400/15 to-indigo-100/5 border border-white/20 shadow-xl pointer-events-none animate-float-reverse blur-[1px]"></div>
          <div className="absolute bottom-20 left-1/3 size-20 rounded-full bg-gradient-to-tr from-purple-400/10 to-pink-100/5 border border-white/20 shadow-xl pointer-events-none animate-float blur-[0.8px]"></div>

          {/* Avatars + Stars */}
          <div className="flex items-center mt-24">
            <div className="flex -space-x-3 pr-3">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
                alt="user3"
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[1]"
              />
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                alt="user1"
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-2"
              />
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                alt="user2"
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[3]"
              />
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
                alt="user3"
                className="size-8 object-cover rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[4]"
              />
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="user5"
                className="size-8 rounded-full border-2 border-white hover:-translate-y-0.5 transition z-[5]"
              />
            </div>

            <div>
              <div className="flex ">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-star text-transparent fill-green-600"
                      aria-hidden="true"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                    </svg>
                  ))}
              </div>
              <p className="text-sm text-gray-700">Used by 10,000+ users</p>
            </div>
          </div>

          {/* Headline + CTA */}
          <h1 className="text-5xl md:text-6xl font-semibold max-w-5xl text-center mt-4 md:leading-[70px]">
            Land your dream job with{" "}
            <span className=" bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent text-nowrap">
              {" "}
              AI-powered{" "}
            </span>{" "}
            resumes.
          </h1>

          <p className="max-w-md text-center text-base my-7">
            Create, edit and download professional resumes with AI-powered
            assistance.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 ">
            <Link
              to="/app"
              className="bg-green-500 hover:bg-green-600 text-white rounded-full px-9 h-12 m-1 ring-offset-2 ring-1 ring-green-400 flex items-center transition-colors"
            >
              Get started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right ml-1 size-4"
                aria-hidden="true"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
            <button className="flex items-center gap-2 border border-slate-400 hover:bg-green-50 transition rounded-full px-7 h-12 text-slate-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-video size-5"
                aria-hidden="true"
              >
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                <rect x="2" y="6" width="14" height="12" rx="2"></rect>
              </svg>
              <span>Try demo</span>
            </button>
          </div>

          {/* Mini Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-20 pt-12 border-t border-slate-200/50">
            {/* Feature 1 */}
            <TiltCard className="flex flex-col items-center text-center p-5 bg-white/45 backdrop-blur-xs rounded-2xl border border-slate-200/60 hover:border-green-300 hover:bg-white/80 transition-all duration-350 group shadow-xs">
              <div className="size-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center mb-3 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">AI Resume Builder</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[220px] font-sans">
                Create and edit professional resumes from scratch with real-time AI guided writing.
              </p>
            </TiltCard>

            {/* Feature 2 */}
            <TiltCard className="flex flex-col items-center text-center p-5 bg-white/45 backdrop-blur-xs rounded-2xl border border-slate-200/60 hover:border-blue-300 hover:bg-white/80 transition-all duration-350 group shadow-xs">
              <div className="size-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">AI ATS Auditor</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[220px] font-sans">
                Scan your resume against job descriptions to calculate match score and keyword gap.
              </p>
            </TiltCard>

            {/* Feature 3 */}
            <TiltCard className="flex flex-col items-center text-center p-5 bg-white/45 backdrop-blur-xs rounded-2xl border border-slate-200/60 hover:border-amber-300 hover:bg-white/80 transition-all duration-350 group shadow-xs">
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">AI Cover Letter Writer</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[220px] font-sans">
                Generate highly targeted cover letters tailored to any job description or role.
              </p>
            </TiltCard>

            {/* Feature 4 */}
            <TiltCard className="flex flex-col items-center text-center p-5 bg-white/45 backdrop-blur-xs rounded-2xl border border-slate-200/60 hover:border-rose-300 hover:bg-white/80 transition-all duration-350 group shadow-xs">
              <div className="size-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-3 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">AI Interview Prep</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[220px] font-sans">
                Practice custom behavioral and technical Q&A guides compiled for your profile.
              </p>
            </TiltCard>


            {/* Feature 6 */}
            <TiltCard className="flex flex-col items-center text-center p-5 bg-white/45 backdrop-blur-xs rounded-2xl border border-slate-200/60 hover:border-purple-300 hover:bg-white/80 transition-all duration-350 group shadow-xs">
              <div className="size-10 rounded-xl bg-purple-500/10 text-purple-650 flex items-center justify-center mb-3 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="9" rx="1" />
                  <rect x="14" y="3" width="7" height="5" rx="1" />
                  <rect x="14" y="12" width="7" height="9" rx="1" />
                  <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Resume Vault & Storage</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[220px] font-sans">
                Securely store and manage multiple customized resume versions in one place.
              </p>
            </TiltCard>
          </div>

        </div>
      </div>
      <style>
        {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

            * {
                font-family: 'Poppins', sans-serif;
            }

            @keyframes float {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(5deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }

            @keyframes float-reverse {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(18px) rotate(-8deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }

            .animate-float {
              animation: float 7s ease-in-out infinite;
            }

            .animate-float-reverse {
              animation: float-reverse 9s ease-in-out infinite;
            }
        `}
      </style>
    </>
  );
};

export default Hero;
