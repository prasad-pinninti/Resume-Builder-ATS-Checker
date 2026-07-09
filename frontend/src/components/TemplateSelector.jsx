import { Check, Layout, X } from "lucide-react";
import { useState } from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    {
      id: "ats",
      name: "ATS LaTeX Template",
      image: "/ats.png",
      preview:
        "Modeled after the top Overleaf templates (like Jake's Resume) with 100% ATS readability. Single-column, Times New Roman, and optimized formatting that parsers read flawlessly.",
    },
    {
      id: "classic",
      name: "Classic Template",
      image: "/classic.png",
      preview:
        "A clean, traditional resume format with clear sections and professional typography. Excellent for standard corporate roles.",
    },
    {
      id: "modern",
      name: "Modern Template",
      image: "/modern.png",
      preview:
        "Sleek design with creative layouts, subtle color accents, and structured timeline styling. Great for tech and design roles.",
    },
    {
      id: "minimal-image",
      name: "Minimal Image",
      image: "/minimal_image.png",
      preview:
        "Clean, minimalist layout with a modern profile photo section and balanced columns. Ideal for modern professionals.",
    },
    {
      id: "minimal",
      name: "Minimal Text",
      image: "/minimal.png",
      preview:
        "Ultra-clean typographic layout that focuses entirely on content and text readability. Perfect for executive or academic profiles.",
    },
  ];

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:bg-blue-200 transition-all px-3 py-2 rounded-lg cursor-pointer active:scale-95 shadow-xs"
      >
        <Layout size={14} />
        <span>Change Template</span>
      </button>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-55"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-100 shadow-xl rounded-2xl w-full max-w-6xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Layout className="size-5 text-blue-500" />
                Select Template Layout
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-8 font-sans">Choose one of our premium professionally crafted resume layouts. Your content will automatically fit into the new template!</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => {
                const isSelected = selectedTemplate === template.id;
                return (
                  <div
                    key={template.id}
                    onClick={() => {
                      onChange(template.id);
                      setIsOpen(false);
                    }}
                    className={`relative overflow-hidden bg-white border-2 rounded-xl cursor-pointer group shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-100"
                        : "border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      {/* Image Mockup Preview */}
                      <div className="relative h-44 bg-slate-50 border-b border-slate-100 overflow-hidden flex items-center justify-center">
                        <img 
                          src={template.image} 
                          alt={template.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            // Fallback in case they haven't run copy-images.js yet
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden absolute inset-0 flex flex-col items-center justify-center bg-blue-50/50 text-blue-500 p-4 text-center">
                          <Layout className="size-10 stroke-1 mb-2 animate-bounce" />
                          <span className="text-[10px] font-semibold uppercase tracking-wider">Preview Available</span>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 shadow-sm">
                            <Check className="size-4" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                            {isSelected ? "Currently Active" : "Apply Template"}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-sans">
                          {template.preview}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        className={`w-full py-2 rounded-lg text-xs font-semibold active:scale-95 transition-all ${
                          isSelected
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "bg-slate-50 text-slate-600 border border-slate-200 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500"
                        }`}
                      >
                        {isSelected ? "Active Layout" : "Select Layout"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
