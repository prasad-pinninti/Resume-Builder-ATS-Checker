import React from "react";

const AcademicTemplate = ({ data, accentColor }) => {
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
      className="max-w-4xl mx-auto p-10 bg-white text-slate-900 leading-relaxed text-[13.5px] min-h-[1050px]"
      style={{ fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif" }}
    >
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wide mb-1" style={{ color: accentColor || "#1e293b" }}>
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        {data.personal_info?.profession && (
          <p className="text-sm italic text-slate-600 mb-2">{data.personal_info.profession}</p>
        )}

        <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-600">
          {data.personal_info?.phone && (
            <>
              <span>{data.personal_info.phone}</span>
              <span className="text-slate-400">•</span>
            </>
          )}
          {data.personal_info?.email && (
            <>
              <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a>
              <span className="text-slate-400">•</span>
            </>
          )}
          {data.personal_info?.location && (
            <>
              <span>{data.personal_info.location}</span>
              <span className="text-slate-400">•</span>
            </>
          )}
          {data.personal_info?.linkedin && (
            <>
              <a href={data.personal_info.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
              {data.personal_info?.website && <span className="text-slate-400">•</span>}
            </>
          )}
          {data.personal_info?.website && (
            <a href={data.personal_info.website} target="_blank" rel="noreferrer" className="hover:underline">Curriculum Vitae / Website</a>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professional_summary && (
        <section className="mb-5">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2" style={{ color: accentColor || "#1e293b" }}>
            Research Summary & Objectives
          </h2>
          <p className="text-justify text-slate-700 leading-relaxed">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Education - Academic priority */}
      {data.education && data.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2" style={{ color: accentColor || "#1e293b" }}>
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-baseline font-bold text-slate-800">
                  <span>{edu.institution}</span>
                  <span className="font-normal text-xs text-slate-600">{formatDate(edu.graduation_date)}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-slate-600">
                  <span className="italic">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                  {edu.gpa && <span className="font-normal">Cumulative GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Research & Teaching Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2" style={{ color: accentColor || "#1e293b" }}>
            Appointments & Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-baseline font-bold text-slate-800">
                  <span>{exp.position}</span>
                  <span className="font-normal text-xs text-slate-600">
                    {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <div className="text-xs italic text-slate-600 mb-1">{exp.company}</div>
                {exp.description && (
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-normal text-[12.5px]">
                    {exp.description.split("\n").filter(bullet => bullet.trim()).map((bullet, idx) => (
                      <li key={idx} className="text-justify">
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

      {/* Publications / Projects */}
      {data.project && data.project.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2" style={{ color: accentColor || "#1e293b" }}>
            Publications, Research & Projects
          </h2>
          <div className="space-y-4">
            {data.project.map((proj, index) => (
              <div key={index} className="flex flex-col">
                <div className="font-bold text-slate-800 flex justify-between items-baseline">
                  <span>{proj.name}</span>
                  {proj.type && <span className="font-normal italic text-xs text-slate-500">{proj.type}</span>}
                </div>
                {proj.description && (
                  <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-normal text-[12.5px] mt-1">
                    {proj.description.split("\n").filter(bullet => bullet.trim()).map((bullet, idx) => (
                      <li key={idx} className="text-justify">
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

      {/* Skills / Methods */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 mb-2" style={{ color: accentColor || "#1e293b" }}>
            Skills & Research Methodologies
          </h2>
          <div className="text-slate-700 text-xs">
            <span className="font-bold">Core Methodologies & Technologies: </span>
            <span>{data.skills.join(", ")}</span>
          </div>
        </section>
      )}
    </div>
  );
};

export default AcademicTemplate;
