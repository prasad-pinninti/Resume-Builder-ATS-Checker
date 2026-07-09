import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Folder } from "lucide-react";

const CreativeTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (!dateStr.includes("-")) return dateStr;
    const [year, month] = dateStr.split("-");
    const parsedDate = new Date(year, month - 1);
    if (isNaN(parsedDate.getTime())) return dateStr;
    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div 
      className="max-w-4xl mx-auto bg-white text-slate-800 shadow-sm min-h-[1050px] grid grid-cols-12"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* Left Sidebar */}
      <aside className="col-span-4 bg-slate-50 border-r border-slate-100 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Avatar / Photo */}
          {data.personal_info?.image && (
            <div className="flex justify-center mb-6">
              <div 
                className="w-28 h-28 rounded-full border-4 overflow-hidden shadow-sm"
                style={{ borderColor: accentColor || "#3B82F6" }}
              >
                <img 
                  src={data.personal_info.image} 
                  alt={data.personal_info?.full_name || "Profile"} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div>
            <h3 
              className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b"
              style={{ borderBottomColor: `${accentColor || "#3B82F6"}40` }}
            >
              Contact info
            </h3>
            <ul className="space-y-3 text-xs text-slate-600">
              {data.personal_info?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="size-3.5 shrink-0" style={{ color: accentColor || "#3B82F6" }} />
                  <a href={`mailto:${data.personal_info.email}`} className="hover:underline truncate">
                    {data.personal_info.email}
                  </a>
                </li>
              )}
              {data.personal_info?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="size-3.5 shrink-0" style={{ color: accentColor || "#3B82F6" }} />
                  <span>{data.personal_info.phone}</span>
                </li>
              )}
              {data.personal_info?.location && (
                <li className="flex items-center gap-2">
                  <MapPin className="size-3.5 shrink-0" style={{ color: accentColor || "#3B82F6" }} />
                  <span>{data.personal_info.location}</span>
                </li>
              )}
              {data.personal_info?.linkedin && (
                <li className="flex items-center gap-2">
                  <Linkedin className="size-3.5 shrink-0" style={{ color: accentColor || "#3B82F6" }} />
                  <a 
                    href={data.personal_info.linkedin} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:underline truncate"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {data.personal_info?.website && (
                <li className="flex items-center gap-2">
                  <Globe className="size-3.5 shrink-0" style={{ color: accentColor || "#3B82F6" }} />
                  <a 
                    href={data.personal_info.website} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:underline truncate"
                  >
                    Portfolio
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Skills Section */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <h3 
                className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b"
                style={{ borderBottomColor: `${accentColor || "#3B82F6"}40` }}
              >
                Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md text-white bg-slate-700"
                    style={{ backgroundColor: accentColor || "#475569" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-slate-400 text-center font-sans tracking-tight pt-4">
          Generated via AI Resume Builder
        </div>
      </aside>

      {/* Right Main Content */}
      <main className="col-span-8 p-8 space-y-6">
        {/* Name and Professional Title */}
        <div className="border-l-4 pl-4 py-1" style={{ borderLeftColor: accentColor || "#3B82F6" }}>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-1.5">
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          <p 
            className="text-sm font-semibold tracking-wider uppercase"
            style={{ color: accentColor || "#3B82F6" }}
          >
            {data.personal_info?.profession || "Profession / Title"}
          </p>
        </div>

        {/* Summary */}
        {data.professional_summary && (
          <section>
            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <Briefcase className="size-4" style={{ color: accentColor || "#3B82F6" }} />
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-slate-800 text-sm">{exp.position}</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <div 
                    className="text-xs font-semibold"
                    style={{ color: accentColor || "#3B82F6" }}
                  >
                    {exp.company}
                  </div>
                  {exp.description && (
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1 mt-1 leading-relaxed">
                      {exp.description.split("\n").filter(b => b.trim()).map((bullet, idx) => (
                        <li key={idx}>
                          {bullet.replace(/^[-\*\u2022]\s*/, "")}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.project && data.project.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <Folder className="size-4" style={{ color: accentColor || "#3B82F6" }} />
              Projects
            </h2>
            <div className="space-y-4">
              {data.project.map((proj, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-slate-800 text-xs">{proj.name}</span>
                    {proj.type && (
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {proj.type}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-0.5 leading-relaxed">
                      {proj.description.split("\n").filter(b => b.trim()).map((bullet, idx) => (
                        <li key={idx}>
                          {bullet.replace(/^[-\*\u2022]\s*/, "")}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2 pb-1 border-b border-slate-100">
              <GraduationCap className="size-4" style={{ color: accentColor || "#3B82F6" }} />
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-xs">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-medium">{formatDate(edu.graduation_date)}</span>
                    {edu.gpa && <p className="text-[10px] text-slate-400">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CreativeTemplate;
