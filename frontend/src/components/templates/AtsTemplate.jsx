import React from "react";

const AtsTemplate = ({ data, accentColor }) => {
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
      className="max-w-4xl mx-auto p-10 bg-white text-black leading-normal text-[13.5px]"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Header */}
      <header className="text-center mb-5">
        <h1 className="text-2xl font-bold uppercase tracking-wide mb-1" style={{ color: accentColor || "#000000" }}>
          {data.personal_info?.full_name || "Your Name"}
        </h1>

        <div className="flex flex-wrap justify-center gap-1.5 text-xs text-gray-700 font-sans">
          {data.personal_info?.phone && (
            <>
              <span>{data.personal_info.phone}</span>
              <span>|</span>
            </>
          )}
          {data.personal_info?.email && (
            <>
              <a href={`mailto:${data.personal_info.email}`} className="hover:underline">{data.personal_info.email}</a>
              <span>|</span>
            </>
          )}
          {data.personal_info?.location && (
            <>
              <span>{data.personal_info.location}</span>
              <span>|</span>
            </>
          )}
          {data.personal_info?.linkedin && (
            <>
              <a href={data.personal_info.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
              {data.personal_info?.website && <span>|</span>}
            </>
          )}
          {data.personal_info?.website && (
            <a href={data.personal_info.website} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professional_summary && (
        <section className="mb-4">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1.5" style={{ color: accentColor || "#000000" }}>
            Summary
          </h2>
          <p className="text-justify leading-relaxed">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1.5" style={{ color: accentColor || "#000000" }}>
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-baseline font-bold">
                  <span>{edu.institution}</span>
                  <span className="font-normal text-xs text-gray-700">{formatDate(edu.graduation_date)}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs italic text-gray-700">
                  <span>{edu.degree} {edu.field && `in ${edu.field}`}</span>
                  {edu.gpa && <span className="font-normal not-italic">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1.5" style={{ color: accentColor || "#000000" }}>
            Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-baseline font-bold">
                  <span>{exp.position}</span>
                  <span className="font-normal text-xs text-gray-700">
                    {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <div className="text-xs italic text-gray-700 mb-1">{exp.company}</div>
                {exp.description && (
                  <ul className="list-disc pl-4 space-y-1 text-slate-800 leading-normal">
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

      {/* Projects */}
      {data.project && data.project.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1.5" style={{ color: accentColor || "#000000" }}>
            Projects
          </h2>
          <div className="space-y-3">
            {data.project.map((proj, index) => (
              <div key={index} className="flex flex-col">
                <div className="font-bold">{proj.name}</div>
                {proj.description && (
                  <ul className="list-disc pl-4 space-y-1 text-slate-800 leading-normal">
                    {proj.description.split("\n").filter(bullet => bullet.trim()).map((bullet, idx) => (
                      <li key={idx} className="text-justify text-xs">
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

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[14px] font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5 mb-1.5" style={{ color: accentColor || "#000000" }}>
            Technical Skills
          </h2>
          <div className="leading-relaxed">
            <span className="font-bold">Skills: </span>
            <span>{data.skills.join(", ")}</span>
          </div>
        </section>
      )}
    </div>
  );
};

export default AtsTemplate;
