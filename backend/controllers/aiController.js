import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";
import mongoose from "mongoose";
import https from "https";

// Controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent, experienceLevel } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!process.env.GROQ_API_KEY && !process.env.XAI_API_KEY && !process.env.GROK_API_KEY) {
      return res.status(400).json({ message: "AI features are disabled because GROQ_API_KEY is not configured in the server's .env file." });
    }

    let systemContent = "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. And only return text no options or anything else.";
    if (experienceLevel) {
      systemContent += ` Tailor the summary specifically for an ${experienceLevel}-level candidate.`;
      if (experienceLevel.toLowerCase() === "entry") {
        systemContent += " Focus on drive, relevant project coursework, rapid learning ability, and academic alignment, as professional years of experience might be lower.";
      } else if (experienceLevel.toLowerCase() === "senior") {
        systemContent += " Focus on senior leadership, large-scale systems or team ownership, business outcomes, and key strategic highlights.";
      }
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for enhancing a resume's job description
// POST: /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent, experienceLevel } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!process.env.GROQ_API_KEY && !process.env.XAI_API_KEY && !process.env.GROK_API_KEY) {
      return res.status(400).json({ message: "AI features are disabled because GROQ_API_KEY is not configured in the server's .env file." });
    }

    let systemContent = "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. And only return text no options or anything else.";
    if (experienceLevel) {
      systemContent += ` Tailor the description specifically for an ${experienceLevel}-level candidate.`;
      if (experienceLevel.toLowerCase() === "entry") {
        systemContent += " Highlight technical skill application, execution efficiency, collaboration, and learning eagerness.";
      } else if (experienceLevel.toLowerCase() === "senior") {
        systemContent += " Highlight system design, architectural impact, project ownership, mentorship, scale, and high-value business output.";
      }
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!process.env.GROQ_API_KEY && !process.env.XAI_API_KEY && !process.env.GROK_API_KEY) {
      return res.status(400).json({ message: "AI features are disabled because GROQ_API_KEY is not configured in the server's .env file." });
    }

    const systemPrompt =
      "You are an expert AI Agent to extract data from resume.";

    const userPrompt = `extract data from this resume: ${resumeText}
    
    Provide data in the following JSON format with no additional text before or after:

    {
      "professional_summary": "string",
      "skills": ["string"],
      "personal_info": {
        "image": "string",
        "full_name": "string",
        "profession": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "linkedin": "string",
        "website": "string"
      },
      "experience": [
        {
          "company": "string",
          "position": "string",
          "start_date": "string",
          "end_date": "string",
          "description": "string",
          "is_current": false
        }
      ],
      "project": [
        {
          "name": "string",
          "type": "string",
          "description": "string"
        }
      ],
      "education": [
        {
          "institution": "string",
          "degree": "string",
          "field": "string",
          "graduation_date": "string",
          "gpa": "string"
        }
      ]
    }
    `;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);

    // create new resume in the database
    const newResume = await Resume.create({ userId, title, ...parsedData });

    res.json({ resumeId: newResume._id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for checking ATS score based on Resume and Job Description
// POST: /api/ai/check-ats
export const checkAtsScore = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing resume content" });
    }

    if (!process.env.GROQ_API_KEY && !process.env.XAI_API_KEY && !process.env.GROK_API_KEY) {
      return res.status(400).json({ message: "AI features are disabled because GROQ_API_KEY is not configured in the server's .env file." });
    }

    const hasJd = jobDescription && jobDescription.trim().length > 0;
    let systemPrompt, userPrompt;

    if (hasJd) {
      systemPrompt = "You are an expert ATS (Applicant Tracking System) reviewer and hiring consultant. Analyze the resume compared to the job description.";
      userPrompt = `Resume Content:
${resumeText}

Job Description:
${jobDescription}

Compare the resume against the Job Description. Return a JSON object with:
- score: match score percentage (0-100)
- matching_keywords: list of keywords in both
- missing_keywords: list of key skills/keywords from the JD that are missing in the resume
- feedback: object containing structural (layout, format, readability) and experience_fit feedback
- recommendations: specific list of steps to improve this resume for this job description

Return ONLY the JSON object, formatted like this:
{
  "score": 85,
  "matching_keywords": ["JavaScript", "React"],
  "missing_keywords": ["TypeScript", "AWS"],
  "feedback": {
    "structural": "The resume has a clean structure but could use bullet points instead of paragraphs.",
    "experience_fit": "Excellent frontend experience, but lacks cloud architecture experience required by the JD."
  },
  "recommendations": [
    "Add TypeScript to your skills list and highlight any projects built with it.",
    "Mention any AWS or cloud experience in your professional experience section."
  ]
}`;
    } else {
      systemPrompt = "You are an expert ATS (Applicant Tracking System) reviewer and hiring consultant. Analyze the resume's general strength, layout formatting, and content quality based on standard industry best practices.";
      userPrompt = `Resume Content:
${resumeText}

Analyze the resume for general quality and ATS readiness. Return a JSON object with:
- score: general resume score percentage (0-100) based on completeness, action verbs, formatting, and layout standards.
- matching_keywords: list of strong industry/technical keywords already found in the resume.
- missing_keywords: list of common general keywords, critical sections, or structural elements that are typically expected but missing.
- feedback: object containing structural (layout, format, readability) and experience_fit (general impact, action verbs, quantifiable achievements) feedback.
- recommendations: specific list of steps to improve this resume's overall strength and compliance.

Return ONLY the JSON object, formatted like this:
{
  "score": 75,
  "matching_keywords": ["JavaScript", "Project Management"],
  "missing_keywords": ["Quantifiable metrics", "Action verbs"],
  "feedback": {
    "structural": "The formatting is clean but missing clear dates for projects.",
    "experience_fit": "Descriptions should start with action verbs and include measurable accomplishments."
  },
  "recommendations": [
    "Include more action verbs (e.g. Led, Designed, Built) instead of passive descriptions.",
    "Add numerical achievements to highlight impact."
  ]
}`;
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    let content = response.choices[0].message.content || "";
    if (content.includes("```")) {
      content = content.replace(/```json/gi, "").replace(/```/g, "").trim();
    }
    const parsedData = JSON.parse(content);
    return res.status(200).json(parsedData);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for generating a customized cover letter
// POST: /api/ai/generate-cover-letter
export const generateCoverLetter = async (req, res) => {
  try {
    const { resumeText, jobDescription, tone } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing resume content" });
    }

    if (!process.env.GROQ_API_KEY && !process.env.XAI_API_KEY && !process.env.GROK_API_KEY) {
      return res.status(400).json({ message: "AI features are disabled because GROQ_API_KEY is not configured." });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert career writer. Write a professional, high-converting cover letter based on the resume and job description. Use a ${tone || "professional"} tone. Customize the letter body to match the user's skills to the JD responsibilities. Return ONLY the letter body ready to copy.`
        },
        {
          role: "user",
          content: `Resume details:\n${resumeText}\n\nJob Description:\n${jobDescription || "N/A"}`
        }
      ]
    });

    return res.status(200).json({ content: response.choices[0].message.content });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Controller for generating interview prep Q&A
// POST: /api/ai/interview-prep
export const generateInterviewPrep = async (req, res) => {
  try {
    const { resumeText, jobTitle } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing resume content" });
    }

    if (!process.env.GROQ_API_KEY && !process.env.XAI_API_KEY && !process.env.GROK_API_KEY) {
      return res.status(400).json({ message: "AI features are disabled because GROQ_API_KEY is not configured." });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer and HR consultant. Generate a list of 10 highly relevant interview questions (covering technical core competencies, behavioral scenarios, and project accomplishments) tailored specifically to the user's resume and target job role. For each question, provide a detailed model answer guideline or response strategy. Return the result in a clean, beautifully formatted markdown structure with bold headers."
        },
        {
          role: "user",
          content: `Resume details:\n${resumeText}\n\nTarget Job Role:\n${jobTitle || "Software Engineer"}`
        }
      ]
    });

    return res.status(200).json({ content: response.choices[0].message.content });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const runDiagnostics = async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY || process.env.XAI_API_KEY || process.env.GROK_API_KEY;
  const isGroq = apiKey && apiKey.startsWith("gsk_");

  const report = {
    timestamp: new Date(),
    database: "Unknown",
    active_provider: isGroq ? "Groq" : "Grok (xAI)",
    api_key_status: "Unknown",
    api_connection: "Unknown"
  };

  // 1. Check Database
  try {
    const dbStatus = mongoose.connection.readyState;
    const states = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting"
    };
    report.database = states[dbStatus] || "Unknown";
  } catch (err) {
    report.database = `Error: ${err.message}`;
  }

  // 2. Check API Key
  if (!apiKey) {
    report.api_key_status = "Missing";
  } else {
    report.api_key_status = `Configured (Length: ${apiKey.length})`;
  }

  // 3. Check API Connection
  if (apiKey) {
    const pingUrl = isGroq ? "https://api.groq.com/" : "https://api.x.ai/";
    try {
      await new Promise((resolve) => {
        const request = https.get(pingUrl, { timeout: 4000 }, (response) => {
          report.api_connection = `Reachable (Status: ${response.statusCode})`;
          resolve();
        });
        request.on("error", (err) => {
          report.api_connection = `Unreachable: ${err.message}`;
          resolve();
        });
        request.on("timeout", () => {
          request.destroy();
          report.api_connection = "Unreachable: Connection Timeout";
          resolve();
        });
      });
    } catch (err) {
      report.api_connection = `Unreachable: ${err.message}`;
    }
  } else {
    report.api_connection = "N/A (No API key configured)";
  }

  return res.status(200).json(report);
};

export const testGrok = async (req, res) => {
  try {
    const defaultModel = (process.env.GROQ_API_KEY || process.env.XAI_API_KEY || "").startsWith("gsk_") ? "llama-3.3-70b-versatile" : "grok-2-1212";
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || defaultModel,
      messages: [
        { role: "user", content: "Say hello in one word." }
      ]
    });
    return res.status(200).json({
      success: true,
      modelUsed: process.env.OPENAI_MODEL || defaultModel,
      reply: response.choices[0].message.content
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
};

