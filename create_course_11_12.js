require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  const marketingData = {
    "title": "AI SUPER KIDS - AI FUTURE LEADERS (Grades 11-12)",
    "format": "Live and Online",
    "duration": "16 Weeks",
    "thumbnail": "",
    "brochureUrl": "",
    "description": "Advanced learning for higher education, AI careers, entrepreneurship and responsible technology leadership.",
    "originalPrice": "15000",
    "discountedPrice": "12000",
    "modulesData": {
      "title": "Course Curriculum",
      "categories": [
        {
          "title": "AI TECHNOLOGY (Programming, data and intelligent applications)",
          "modules": [
            { "num": "01", "title": "Python Fundamentals", "desc": "Use variables, conditions, loops and functions." },
            { "num": "02", "title": "Data Handling with Python", "desc": "Organise, clean and analyse simple datasets." },
            { "num": "03", "title": "Data Visualisation", "desc": "Communicate findings through clear charts." },
            { "num": "04", "title": "Machine Learning Fundamentals", "desc": "Understand data, features, models and predictions." },
            { "num": "05", "title": "Generative AI and Language Models", "desc": "Explore modern content and task support." },
            { "num": "06", "title": "Prompt Engineering", "desc": "Use context, constraints, examples and formats." },
            { "num": "07", "title": "Application Programming Interfaces", "desc": "Learn how applications exchange information." },
            { "num": "08", "title": "AI Automation", "desc": "Connect tools, data and AI-supported workflows." }
          ]
        },
        {
          "title": "CAREER READINESS (Entrepreneurship, portfolio and professional preparation)",
          "modules": [
            { "num": "09", "title": "AI Product Development", "desc": "Plan an AI service around a clear user need." },
            { "num": "10", "title": "Market and User Research", "desc": "Study users, industries and current solutions." },
            { "num": "11", "title": "Business Models and Startup Strategy", "desc": "Explore value, customers, revenue and costs." },
            { "num": "12", "title": "Introduction to AI Agents", "desc": "Understand tool use and multi-step task planning." },
            { "num": "13", "title": "Future AI Careers", "desc": "Explore technical, product and research pathways." },
            { "num": "14", "title": "Portfolio Development", "desc": "Organise projects, presentations and achievements." },
            { "num": "15", "title": "Resume and LinkedIn Preparation", "desc": "Present skills and experience professionally." },
            { "num": "16", "title": "Interview and Presentation Skills", "desc": "Explain projects clearly and confidently." }
          ]
        }
      ]
    },
    "whyDigitalGhuru": {
      "title": "Why Choose the AI Future Leaders Program?",
      "reasons": [
        {
          "num": "01",
          "title": "School Partnership Program",
          "iconName": "Users",
          "description": "Advanced learning for higher education, AI careers, entrepreneurship and responsible technology leadership."
        },
        {
          "num": "02",
          "title": "Technical Learning Path",
          "iconName": "Laptop2",
          "description": "Code, Analyse data, Model concepts, Connect tools, Automate, Build applications. Technical foundations for higher education and portfolio projects."
        },
        {
          "num": "03",
          "title": "Career Preparation",
          "iconName": "Target",
          "description": "Career pathways, Portfolio, Resume, Interview, Entrepreneurship, Professional conduct. Clearer direction for higher education, careers and entrepreneurship."
        }
      ]
    },
    "numberedFeatures": {
      "title": "AI Capstone Project (From Learning to Leadership)",
      "description": "The capstone combines technical knowledge, research, responsible design, testing and presentation.",
      "features": [
        {
          "num": "01",
          "title": "Capstone Development Process",
          "border": "group-hover:border-blue-500/30",
          "gradient": "from-blue-500/10 to-indigo-500/10",
          "iconName": "Search",
          "iconColor": "text-blue-600",
          "description": "1. Identify, 2. Research, 3. Design, 4. Develop, 5. Test, 6. Improve, 7. Present"
        },
        {
          "num": "02",
          "title": "Final Submission",
          "border": "group-hover:border-emerald-500/30",
          "gradient": "from-emerald-500/10 to-teal-500/10",
          "iconName": "FileText",
          "iconColor": "text-emerald-600",
          "description": "Problem and verified research, Data and AI method, Technical workflow, Prototype or proof of concept, Testing and improvements, Responsible AI review, Product potential, Final demonstration."
        },
        {
          "num": "03",
          "title": "Suggested Capstone Areas",
          "border": "group-hover:border-amber-500/30",
          "gradient": "from-amber-500/10 to-orange-500/10",
          "iconName": "CheckCircle",
          "iconColor": "text-amber-600",
          "description": "Education, Healthcare awareness, Agriculture, Sustainability, Accessibility, Local business, Community development."
        },
        {
          "num": "04",
          "title": "Student Portfolio & Outcomes",
          "border": "group-hover:border-rose-500/30",
          "gradient": "from-rose-500/10 to-pink-500/10",
          "iconName": "Target",
          "iconColor": "text-rose-600",
          "description": "Python, Data projects, AI activities, Product concepts, Capstone, Certificates. Learning Outcome: Technical Capability + Career Readiness + Responsible Leadership."
        }
      ]
    },
    "whoIsThisForData": [
      {
        "title": "High School Students (Grades 11-12)",
        "role": "High School Students (Grades 11-12)",
        "desc": "Advanced learning for higher education, AI careers, entrepreneurship and responsible technology leadership.",
        "points": [
          "Python, Data Analysis, and Machine Learning",
          "AI Product Development and Startup Strategy",
          "Portfolio building and Career Readiness"
        ],
        "iconName": "User",
        "iconColor": "text-blue-600",
        "dotColor": "bg-blue-500",
        "gradient": "from-blue-500/10 to-indigo-500/10",
        "border": "group-hover:border-blue-500/30"
      }
    ],
    "overviewLearnings": [
      "Python Fundamentals & Data Handling: Organise, clean and analyse simple datasets.",
      "Data Visualisation & Machine Learning: Understand data, features, models and predictions.",
      "Generative AI & Prompt Engineering: Explore modern content and task support.",
      "API & AI Automation: Connect tools, data and AI-supported workflows.",
      "AI Product Development & Research: Plan an AI service around a clear user need.",
      "Business Models & Startup Strategy: Explore value, customers, revenue and costs.",
      "Portfolio & Career Readiness: Organise projects, presentations, resumes, and interview skills."
    ],
    "showCareerFeatures": true,
    "overviewDescription": [
      "Students develop practical foundations in programming, data analysis, machine learning and connected AI services.",
      "Students connect technical learning with product development, career pathways and professional communication.",
      "The capstone combines technical knowledge, research, responsible design, testing and presentation to prepare students for technical capability, product thinking and leadership."
    ],
    "categorizedToolsData": [
      {
        "title": "AI & Technical Tools",
        "category": "AI & Technical Tools",
        "bgClass": "bg-white",
        "textClass": "text-[#0d2f62]",
        "description": "Learn modern tools for programming and AI development.",
        "tools": [
          { "name": "Python", "iconUrl": "/tools/python.svg" },
          { "name": "ChatGPT", "iconUrl": "/tools/openai.svg" }
        ],
        "items": [
          { "name": "Python", "iconUrl": "/tools/python.svg" },
          { "name": "ChatGPT", "iconUrl": "/tools/openai.svg" }
        ]
      }
    ]
  };

  const title = "AI Super Kids - AI Future Leaders Grade 11-12";
  const slug = "ai-super-kids-grade-11-12";
  const description = "Advanced learning for higher education, AI careers, entrepreneurship and responsible technology leadership.";
  const price = 15000;

  try {
    const query = `
      INSERT INTO courses (title, slug, description, price, "isPublished", marketing_data)
      VALUES ($1, $2, $3, $4, true, $5)
      RETURNING id;
    `;
    const res = await pool.query(query, [title, slug, description, price, marketingData]);
    console.log("Successfully created course with ID:", res.rows[0].id);
  } catch (err) {
    console.error("Error creating course:", err);
  } finally {
    await pool.end();
  }
}

run();
