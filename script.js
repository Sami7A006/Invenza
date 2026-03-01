// ========== COUNTDOWN TIMER — Event: March 5th 9 AM – March 7th 12 PM IST ==========
// Start: March 5, 2026 9:00 AM IST  |  End: March 7, 2026 12:00 PM IST
// Countdown shows time left until event STARTS. Use +05:30 for IST.
const COUNTDOWN_TARGET = new Date('2026-03-05T09:00:00+05:30');

function updateCountdown() {
  const labelEl = document.getElementById('countdown-label');
  const daysEl = document.getElementById('countdown-days');
  if (!daysEl) return;

  const now = new Date();
  const diff = COUNTDOWN_TARGET - now;

  if (diff <= 0) {
    daysEl.textContent = '00';
    document.getElementById('countdown-hours').textContent = '00';
    document.getElementById('countdown-minutes').textContent = '00';
    document.getElementById('countdown-seconds').textContent = '00';
    if (labelEl) labelEl.textContent = 'Event started';
    return;
  }

  if (labelEl) labelEl.textContent = 'Time left';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, '0');
  document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
}

// Start countdown and update every second
if (document.getElementById('countdown-days')) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ========== Ideathon Schedule / Timeline — edit here ==========
// Update dates (YYYY-MM-DD) and/or session timings below in ONE place.
// The schedule UI on the homepage reads from this object.
const eventConfig = {
  startDate: "2026-03-05",
  endDate: "2026-03-07",
  schedule: {
    day1: [
      { time: "9:00 AM", title: "Event Starts" },
      { time: "11:40 AM", title: "Problem Statement Auction" },
      { time: "12:40 PM", title: "Lunch" },
      { time: "1:30 PM – 3:20 PM", title: "Masterclass" }
    ],
    day2: [
      { time: "9:00 AM – 10:00 AM", title: "Pitch Preparation" },
      { time: "10:00 AM – 12:40 PM", title: "Pitching (Round 1)" },
      { time: "12:40 PM", title: "Lunch" },
      { time: "1:30 PM – 3:20 PM", title: "Pitching Continues" }
    ],
    day3: [
      { time: "9:00 AM – 12:40 PM", title: "Final Pitching" },
      { time: "12:40 PM", title: "Lunch" },
      { time: "1:30 PM – 3:20 PM", title: "Valedictory & Results" }
    ]
  }
};

/**
 * Formats "YYYY-MM-DD" as "March 5, 2026" for display.
 */
function formatEventDate(isoDate) {
  const d = new Date(isoDate + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/**
 * Returns true if the given YYYY-MM-DD string is today (local date).
 */
function isToday(isoDate) {
  const today = new Date();
  const y = today.getFullYear(), m = String(today.getMonth() + 1).padStart(2, "0"), day = String(today.getDate()).padStart(2, "0");
  return isoDate === y + "-" + m + "-" + day;
}

/**
 * Returns a YYYY-MM-DD string for date + N days.
 */
function addDaysIso(isoDate, daysToAdd) {
  const d = new Date(isoDate + "T12:00:00");
  d.setDate(d.getDate() + daysToAdd);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

/**
 * Returns true when today's date is between start and end (inclusive).
 */
function isEventOngoing(startIso, endIso) {
  const today = new Date();
  const start = new Date(startIso + "T00:00:00");
  const end = new Date(endIso + "T23:59:59");
  return today >= start && today <= end;
}

/**
 * Builds timeline items from eventConfig and renders them into #timelineList.
 * Highlights the current day when the event is ongoing.
 */
function renderTimeline() {
  const container = document.getElementById("timelineList");
  if (!container || !eventConfig.startDate || !eventConfig.endDate) return;

  const day1 = eventConfig.startDate;
  const day2 = addDaysIso(eventConfig.startDate, 1);
  const day3 = eventConfig.endDate;
  const ongoing = isEventOngoing(eventConfig.startDate, eventConfig.endDate);

  const items = [
    { title: "Registration Open", dateLabel: "Open now", dateIso: null, entries: [] },
    { title: "Day 1", dateLabel: formatEventDate(day1), dateIso: day1, entries: (eventConfig.schedule && eventConfig.schedule.day1) || [] },
    { title: "Day 2", dateLabel: formatEventDate(day2), dateIso: day2, entries: (eventConfig.schedule && eventConfig.schedule.day2) || [] },
    { title: "Day 3", dateLabel: formatEventDate(day3), dateIso: day3, entries: (eventConfig.schedule && eventConfig.schedule.day3) || [] }
  ];

  container.innerHTML = items
    .map(function (item, index) {
      const isCurrent = ongoing && item.dateIso && isToday(item.dateIso);
      const cardClass = "timeline-card" + (isCurrent ? " timeline-card--current" : "");
      const badge = isCurrent ? '<span class="timeline-badge">Today</span>' : "";

      const listHtml =
        item.entries && item.entries.length
          ? '<ul class="timeline-card-list">' +
          item.entries
            .map(function (entry) {
              return (
                '<li class="timeline-card-item">' +
                '<span class="timeline-time">' + escapeHtml(entry.time) + "</span>" +
                '<span class="timeline-session">' + escapeHtml(entry.title) + "</span>" +
                "</li>"
              );
            })
            .join("") +
          "</ul>"
          : "";

      return (
        '<div class="timeline-item" style="animation-delay: ' + index * 0.1 + 's">' +
        '<div class="timeline-dot" aria-hidden="true"></div>' +
        '<article class="' + cardClass + '">' +
        badge +
        '<h3 class="timeline-card-title">' + escapeHtml(item.title) + "</h3>" +
        '<p class="timeline-card-date">' + escapeHtml(item.dateLabel) + "</p>" +
        listHtml +
        "</article>" +
        "</div>"
      );
    })
    .join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderTimeline);
} else {
  renderTimeline();
}

// ========== Problem statements data ==========
const data = {
  "Healthcare": [
    {
      title: "AI-Powered Medical Imaging",
      background: "Diagnosing diseases from medical scans such as X-rays, MRIs, or CT scans is a critical yet time-consuming process that heavily depends on human expertise. Radiologists often face fatigue and high data volume, increasing risks of oversight.",
      statement: "Develop an intelligent software tool that can automatically analyse uploaded medical images and highlight abnormal or suspicious regions to assist medical professionals in early detection and decision-making."
    },
    {
      title: "Remote Patient Monitoring Dashboard",
      background: "Chronic diseases require continuous monitoring, yet many systems rely on manual updates or disconnected platforms, leading to fragmented patient data.",
      statement: "Build a system that simulates real-time monitoring of patient vitals and allows healthcare providers to visualize multiple patients simultaneously, receive alerts, and view historical trends."
    },
    {
      title: "AI Chatbot for Mental Health",
      background: "Stress, anxiety, and depression are rising rapidly, while access to mental health professionals remains limited due to stigma, cost, and accessibility barriers.",
      statement: "Create an AI-based system that understands user input, detects emotional distress, provides coping strategies, and connects users to professional resources when necessary."
    },
    {
      title: "Hospital Queue & Appointment Optimizer",
      background: "Long waiting times in hospitals reduce efficiency and patient satisfaction due to overlapping appointments and poor coordination.",
      statement: "Develop an intelligent scheduling system that predicts waiting times, manages appointments, and dynamically adjusts to real-time changes."
    },
    {
      title: "Disease Progression Predictor",
      background: "Doctors often rely on periodic check-ups, which may delay detection of early warning signs in chronic disease management.",
      statement: "Develop an AI-based system that predicts risk levels (low, medium, high) for patient condition worsening using historical and real-time health data."
    },
    {
      title: "Health Equality Predictor",
      background: "Health disparities based on gender and ethnicity impact access to care and health outcomes globally.",
      statement: "Develop an AI system that identifies disparities in healthcare access and classifies inequality risk levels to support equitable decision-making."
    },

    {
      title: "Smart, Safe, and Sustainable Healthcare",
      background: "Healthcare contributes significantly to global emissions and faces operational inefficiencies affecting safety and sustainability.",
      statement: "Develop an intelligent system that optimizes hospital operations, reduces environmental impact, and enhances patient safety."
    },
    {
      title: "Forever Vital",
      background: "Chronic diseases require long-term proactive management, yet healthcare systems remain largely reactive.",
      statement: "Develop an AI-driven chronic disease management system that predicts disease progression and provides personalized preventive recommendations."
    },
    {
      title: "Infection Prevention and Control",
      background: "Antimicrobial resistance and healthcare-associated infections pose major global health threats.",
      statement: "Develop an AI-powered system that predicts infection risk, monitors antimicrobial resistance, and provides outbreak alerts."
    },
    {
      title: "In-Hospital System Change",
      background: "Operational inefficiencies in hospital workflows cause delays, burnout, and reduced patient satisfaction.",
      statement: "Design a structured system that improves workflow efficiency and patient care without requiring complex digital tools."
    },
    {
      title: "Pregnancy Symptom Tracker",
      background: "First-time mothers often struggle to differentiate normal pregnancy symptoms from warning signs.",
      statement: "Develop a structured tracking system that monitors maternal and newborn health while providing timely alerts and educational guidance."
    },
    {
      title: "Healthcare Communication Aid",
      background: "Language barriers and disabilities can limit effective communication between patients and healthcare providers.",
      statement: "Develop an accessible communication aid with features such as real-time translation, visual tools, or adaptive interfaces."
    },
    {
      title: "Healthcare Provider Relaxation App",
      background: "Healthcare professionals face burnout due to long shifts, stress, and administrative burdens.",
      statement: "Develop a relaxation and resilience app tailored for medical professionals with adaptive stress-relief features."
    },
    {
      title: "Pill and Medication Tracker",
      background: "Managing multiple medications can lead to missed doses or errors, especially among elderly patients.",
      statement: "Develop a simple medication tracking system that provides reminders, monitors adherence, and minimizes medication errors."
    },
    {
      title: "Child Health App and Activities",
      background: "Children often struggle to describe symptoms accurately due to limited vocabulary and fear.",
      statement: "Develop a child-focused system using visuals and interactive tools to help children communicate symptoms effectively."
    },
    {
      title: "Mental Health Tracking Tool",
      background: "Mental and physical health are interconnected, yet often monitored separately.",
      statement: "Develop an integrated tracking system that monitors emotional and physical health patterns while providing coping resources."
    },
    {
      title: "Healthcare Knowledge Game",
      background: "Health literacy remains low due to complex medical terminology and inaccessible learning materials.",
      statement: "Develop an engaging game-based learning system that simplifies medical concepts for diverse audiences."
    },
    {
      title: "Physical Therapy Support Booklet",
      background: "Patients often struggle to follow physical therapy routines consistently outside clinical settings.",
      statement: "Develop a structured system that promotes adherence, proper technique, and rehabilitation tracking."
    },
    {
      title: "Diagnosis Optimization Tools",
      background: "Outdated diagnostic tools reduce efficiency and accessibility, especially in underserved areas.",
      statement: "Design an optimized diagnostic tool that improves accuracy, efficiency, and accessibility."
    },
    {
      title: "Healthcare Donation Aid System",
      background: "Healthcare supplies are unevenly distributed, especially during emergencies.",
      statement: "Develop a centralized system that tracks medical supply inventory and ensures equitable distribution."
    }
  ],
  "Artificial Intelligence": [
    {
      title: "AI Study Assistant",
      background: "Students often struggle to understand complex subjects and don’t get instant help outside class hours.",
      statement: "Build an AI-powered study assistant that answers subject-related questions clearly using well-designed prompts."
    },
    {
      title: "AI Resume & SOP Generator",
      background: "Students find it difficult to write professional resumes and Statements of Purpose.",
      statement: "Create an AI tool that generates resumes and SOPs based on user input using structured prompt engineering."
    },
    {
      title: "Smart Notes Generator",
      background: "Students spend hours summarizing textbooks and lectures.",
      statement: "Develop an AI system that converts long study materials into concise notes using effective prompting techniques."
    },
    {
      title: "AI-Based Doubt Solver",
      background: "Many students hesitate to ask doubts in class.",
      statement: "Design an AI chatbot that explains concepts step-by-step in simple language."
    },
    {
      title: "Personalized Study Planner",
      background: "Students struggle to manage time and prepare efficiently for exams.",
      statement: "Build an AI-powered planner that creates personalized study schedules based on syllabus and deadlines."
    },
    {
      title: "AI Interview Preparation Coach",
      background: "Students lack real interview practice and feedback.",
      statement: "Create an AI system that simulates interviews and gives feedback on answers using prompt-based evaluation."
    },
    {
      title: "AI Plagiarism Checker with Explanation",
      background: "Students unknowingly submit content with high similarity.",
      statement: "Develop an AI tool that detects similarity and also explains how to improve originality."
    },
    {
      title: "AI Code Debugging Assistant",
      background: "Beginner programmers struggle to debug errors efficiently.",
      statement: "Build an AI coding assistant that explains errors and suggests fixes clearly."
    },
    {
      title: "AI-Based Career Recommendation System",
      background: "Students are unsure which career matches their skills and interests.",
      statement: "Create an AI tool that analyzes skills and interests to suggest suitable career paths."
    },
    {
      title: "AI Content Simplifier",
      background: "Technical research papers are difficult for beginners to understand.",
      statement: "Develop an AI system that simplifies complex content into easy language."
    },
    {
      title: "AI Language Learning Companion",
      background: "Students want personalized help while learning new languages.",
      statement: "Build an AI language tutor that provides grammar correction, vocabulary suggestions, and conversation practice."
    },
    {
      title: "AI-Based Attendance Prediction System",
      background: "Low attendance often affects student performance.",
      statement: "Create an AI system that predicts attendance risks and suggests improvement strategies."
    },
    {
      title: "AI Mental Wellness Chat Support",
      background: "Students face stress and anxiety but hesitate to seek help.",
      statement: "Design an AI chatbot that provides basic emotional support and guidance resources."
    },
    {
      title: "AI Research Paper Assistant",
      background: "Students struggle to structure research papers properly.",
      statement: "Build an AI tool that helps structure research papers and suggests improvements."
    },
    {
      title: "AI Project Idea Generator",
      background: "Students often struggle to come up with innovative project ideas.",
      statement: "Develop an AI system that generates project ideas based on selected domains and interests."
    },
    {
      title: "AI Fake News Detector",
      background: "Students frequently encounter misinformation online.",
      statement: "Create an AI tool that analyzes news content and identifies possible misinformation."
    },
    {
      title: "AI Smart Quiz Generator",
      background: "Teachers spend time creating quizzes manually.",
      statement: "Build an AI tool that generates quizzes automatically from given study material."
    },
    {
      title: "AI Productivity Tracker",
      background: "Students lack awareness of how they spend their study time.",
      statement: "Develop an AI system that analyzes study habits and provides improvement suggestions."
    },
    {
      title: "AI-Powered Accessibility Tool",
      background: "Students with disabilities need better learning support tools.",
      statement: "Create an AI system that converts text to speech, summarizes audio, or simplifies content for accessibility."
    },
    {
      title: "AI Debate & Argument Coach",
      background: "Students want to improve critical thinking and argument skills.",
      statement: "Build an AI tool that helps students practice debates and gives logical feedback."
    }
  ],
  "Environment and Sustainability": [
    {
      title: "AI-Based Air Quality Monitoring System",
      background: "Air pollution levels are rising, but real-time awareness is limited.",
      statement: "Build an AI-powered system that collects air quality data and provides alerts, predictions, and safety recommendations."
    },
    {
      title: "Smart Waste Segregation Assistant",
      background: "Many people do not properly separate dry and wet waste.",
      statement: "Develop an AI tool that identifies waste type using images and guides users on proper disposal."
    },
    {
      title: "AI Water Quality Prediction System",
      background: "Water contamination often goes unnoticed until it becomes harmful.",
      statement: "Create a system that analyzes water quality data and predicts contamination risks."
    },
    {
      title: "Food Waste Redistribution Platform",
      background: "Large amounts of food are wasted daily while many people go hungry.",
      statement: "Design a digital platform that connects food donors with NGOs for real-time redistribution."
    },
    {
      title: "Carbon Footprint Tracker",
      background: "Individuals are unaware of their daily carbon emissions.",
      statement: "Build an app that calculates personal carbon footprint and suggests ways to reduce it."
    },
    {
      title: "Smart Energy Consumption Monitor",
      background: "Households and campuses waste electricity due to lack of monitoring.",
      statement: "Develop a system that tracks energy usage and provides AI-based saving suggestions."
    },
    {
      title: "E-Waste Collection & Recycling Platform",
      background: "Improper disposal of electronic waste harms the environment.",
      statement: "Create a platform that connects users with certified e-waste recyclers and tracks disposal status."
    },
    {
      title: "Tree Plantation Tracking System",
      background: "Tree plantation drives lack proper monitoring and survival tracking.",
      statement: "Build a digital system to register, track, and monitor planted trees using geolocation and updates."
    },
    {
      title: "AI Flood Prediction Alert System",
      background: "Floods cause major damage due to lack of early warnings.",
      statement: "Develop an AI system that predicts flood risks using weather and water-level data."
    },
    {
      title: "Plastic Usage Reduction App",
      background: "Single-use plastic consumption remains high.",
      statement: "Create an app that tracks plastic usage and suggests eco-friendly alternatives."
    },
    {
      title: "Smart Irrigation System",
      background: "Farmers often overuse water due to inefficient irrigation methods.",
      statement: "Build a system that analyzes soil and weather data to recommend optimal irrigation schedules."
    },
    {
      title: "Sustainable Transport Recommendation System",
      background: "People rely heavily on private vehicles, increasing pollution.",
      statement: "Design an app that suggests eco-friendly travel options based on distance and availability."
    },
    {
      title: "AI Wildlife Monitoring System",
      background: "Wildlife populations are declining due to habitat loss and poaching.",
      statement: "Develop an AI system that analyzes camera or sensor data to detect and monitor wildlife activity."
    },
    {
      title: "Smart Rainwater Harvesting Tracker",
      background: "Rainwater harvesting systems are not properly monitored.",
      statement: "Create a platform that tracks water collection levels and usage efficiency."
    },
    {
      title: "Environmental Awareness Chatbot",
      background: "People lack basic knowledge about sustainability practices.",
      statement: "Build an AI chatbot that educates users about eco-friendly habits and environmental protection."
    },
    {
      title: "Green Campus Management System",
      background: "Colleges struggle to track sustainability initiatives effectively.",
      statement: "Develop a dashboard to monitor energy use, waste management, and green initiatives on campus."
    },
    {
      title: "Air Pollution Route Optimizer",
      background: "Travelers are unaware of pollution levels on different routes.",
      statement: "Create an app that suggests travel routes with lower pollution exposure."
    },
    {
      title: "Sustainable Product Recommendation App",
      background: "Consumers struggle to identify environmentally friendly products.",
      statement: "Build an AI system that recommends sustainable alternatives based on product inputs."
    },
    {
      title: "Climate Change Awareness Platform",
      background: "Climate change information is often complex and difficult to understand.",
      statement: "Develop an interactive platform that explains climate change impacts using simple visualizations."
    },
    {
      title: "Smart Recycling Reward System",
      background: "People lack motivation to recycle consistently.",
      statement: "Create a digital platform that tracks recycling activities and rewards users for sustainable behavior."
    }
  ],
  "Education": [
    {
      title: "AI Virtual Tutor",
      background: "Many students need one-on-one explanations and practice but classrooms and instructors have limited bandwidth. Personalized tutoring—adapting to a student’s pace, gaps, and learning style—boosts understanding and retention, yet is often expensive or inaccessible. Intelligent tutoring systems can fill that gap by delivering targeted guidance, practice problems, and explanations when students need them.",
      statement: "Build an AI-driven tutoring system that interactively explains concepts, adapts to a student’s pace, and provides practice tailored to their strengths and weaknesses. The solution should support multi-turn interaction, clarify misunderstandings, and present explanations at an appropriate level for the learner."
    },
    {
      title: "Student Performance Predictor",
      background: "Teachers often realize too late when students begin to fall behind. Early signs like irregular attendance, missed assignments, or declining test scores are easy to miss without consistent tracking. Technology can help educators identify these patterns early and support students before poor performance becomes failure.",
      statement: "Create a system that analyses student-related data to identify those at risk of underperforming. The solution should highlight learning trends and provide clear insights to help teachers or mentors take timely action and offer personalized support."
    },
    {
      title: "Plagiarism & AI-Generated Content Detector",
      background: "With AI tools becoming widely accessible, students can generate essays, reports, and assignments in seconds. While such tools can support learning, they also blur the line between original effort and automated output. Educators face growing difficulty in distinguishing genuine student work from copied or AI-generated text, calling for smarter detection systems.",
      statement: "Design a system that analyses student submissions to identify possible plagiarism and detect AI-generated writing. The tool should assess text originality, highlight suspicious sections, and provide clear, interpretable indicators of content authenticity."
    },
    {
      title: "Coding Practice Assistant",
      background: "Students learning to code often get stuck on small errors or inefficient patterns and need immediate, contextual guidance. Waiting for instructor feedback or searching forums interrupts flow and slows learning. Real-time, helpful hints—not just final answers—accelerate mastery and teach debugging as a skill.",
      statement: "Create an intelligent tool that analyses student code and offers actionable, stepwise suggestions: bug explanation, probable fixes, style or complexity improvements, and hints that nudge learners toward the solution without giving it away. The system should be pedagogically aware and produce clear, interpretable feedback that students and instructors can trust."
    },
    {
      title: "AI Auto-Grader for Code Submissions",
      background: "Instructors face a heavy burden grading large volumes of programming assignments. Manual grading is slow, inconsistent, and often focuses on output correctness while missing style, efficiency, and pedagogical feedback. Students benefit more from fast, constructive feedback that helps them learn from mistakes immediately.",
      statement: "Design an AI-driven auto-grading system that evaluates programming assignments by running tests, checking correctness, and providing actionable, pedagogical feedback. The system should help instructors scale assessment while giving students meaningful, timely guidance to improve their code and understanding."
    },
    {
      title: "Smart Academic Management Platform",
      background: "Colleges use different systems for attendance, marks, assignments, and notices. Students and faculty struggle to manage everything in one place.",
      statement: "Build a simple platform that connects attendance, marks, assignments, and announcements into one dashboard with automated updates and basic monitoring."
    },
    {
      title: "AI-Based Career Guidance System",
      background: "Students are confused about career choices and don’t know which skills or courses match their interests.",
      statement: "Create a system that connects student interests, academic performance, and job market data to give personalized career suggestions using AI prompts."
    },
    {
      title: "Course & College Finder App",
      background: "Students search multiple websites to find courses, colleges, and eligibility details.",
      statement: "Develop a mobile app that gathers course and college data in one place with easy search and filtering options."
    },
    {
      title: "Transparent Exam Re-Evaluation System",
      background: "Students don’t know the status of their re-evaluation requests and the process takes time.",
      statement: "Build a digital system that allows students to apply for re-evaluation and track the status in real time."
    },
    {
      title: "Low-Data Online Learning Platform",
      background: "Many students have slow internet and low-end devices, making online learning difficult.",
      statement: "Design a lightweight education platform that works smoothly on low bandwidth and supports offline content access."
    },
    {
      title: "AI Study Assistant",
      background: "Students struggle to understand complex topics and don’t always get instant help.",
      statement: "Create an AI-powered chatbot that answers subject-related questions using well-designed prompts."
    },
    {
      title: "Smart Attendance System",
      background: "Manual attendance takes time and can lead to errors.",
      statement: "Build a digital attendance system that automatically updates student records and sends notifications."
    },
    {
      title: "Internship Matching Platform",
      background: "Students find it hard to discover internships relevant to their skills.",
      statement: "Develop a platform that matches student skills with internship opportunities using AI-based recommendations."
    },
    {
      title: "Digital Certificate Verification System",
      background: "Verifying student certificates manually is slow and inefficient.",
      statement: "Create a system that allows instant digital certificate verification for colleges and employers."
    },
    {
      title: "Scholarship Finder Portal",
      background: "Students miss scholarship opportunities due to scattered information.",
      statement: "Build a platform that collects and filters scholarships based on eligibility criteria."
    },
    {
      title: "Smart Notes Generator",
      background: "Students spend a lot of time making notes from textbooks and lectures.",
      statement: "Develop a tool that uses AI prompts to generate summarized notes from uploaded content."
    },
    {
      title: "Parent-Student Communication Portal",
      background: "Parents don’t always receive timely updates about student performance.",
      statement: "Create a platform that sends automated updates about attendance, marks, and notices to parents."
    },
    {
      title: "College Event Management System",
      background: "Managing registrations and event communication is often manual.",
      statement: "Build a simple system to handle registrations, confirmations, and updates for college events."
    },
    {
      title: "AI Resume Builder for Students",
      background: "Students struggle to create professional resumes.",
      statement: "Develop an AI-powered resume builder that generates resumes based on student inputs using effective prompts."
    },
    {
      title: "Online Doubt Clearing Platform",
      background: "Students hesitate to ask doubts in class.",
      statement: "Design a platform where students can anonymously post questions and get AI-generated or peer responses."
    },
    {
      title: "Smart Timetable Generator",
      background: "Creating class timetables manually is time-consuming.",
      statement: "Build a system that automatically generates optimized timetables based on available resources."
    },
    {
      title: "Learning Progress Tracker",
      background: "Students cannot easily track their academic improvement over time.",
      statement: "Develop a dashboard that tracks grades, attendance, and skill development in one place."
    },
    {
      title: "AI-Based Exam Preparation Planner",
      background: "Students don’t know how to plan their exam preparation effectively.",
      statement: "Create an AI-powered study planner that generates personalized study schedules."
    },
    {
      title: "Digital Library Access System",
      background: "Students struggle to find study materials across multiple sources.",
      statement: "Build a centralized platform that connects e-books, notes, and reference materials."
    },
    {
      title: "Peer Learning & Group Finder",
      background: "Students want to study with like-minded peers but don’t know how to connect.",
      statement: "Design a platform that matches students based on subjects, interests, and availability."
    }
  ],
  "Fintech": [
    {
      title: "AI-Based Expense Tracker",
      background: "Students and young professionals struggle to track daily expenses.",
      statement: "Build an AI-powered app that automatically categorizes expenses and provides smart saving suggestions."
    },
    {
      title: "Smart Budget Planner",
      background: "Many people fail to manage monthly budgets effectively.",
      statement: "Develop a budgeting tool that analyzes spending patterns and suggests optimized budget plans."
    },
    {
      title: "Fraud Detection System",
      background: "Online financial fraud and scams are increasing rapidly.",
      statement: "Create an AI-based system that detects suspicious transactions and alerts users in real time."
    },
    {
      title: "Digital Micro-Savings Platform",
      background: "People find it difficult to build savings habits.",
      statement: "Design a platform that automatically rounds up small transactions and saves the spare amount."
    },
    {
      title: "AI Investment Advisor for Beginners",
      background: "New investors lack knowledge about safe investment options.",
      statement: "Build a simple AI tool that suggests beginner-friendly investment strategies based on risk level."
    },
    {
      title: "Credit Score Awareness App",
      background: "Many individuals don’t understand how credit scores work.",
      statement: "Develop an app that explains credit scores and provides tips to improve them."
    },
    {
      title: "Peer-to-Peer Lending Platform",
      background: "Students and small businesses struggle to access quick loans.",
      statement: "Create a secure platform that connects borrowers and lenders with transparent tracking."
    },
    {
      title: "Smart Bill Payment Reminder",
      background: "People often forget to pay bills on time.",
      statement: "Build a system that tracks recurring bills and sends automated reminders with payment links."
    },
    {
      title: "AI Loan Eligibility Checker",
      background: "Loan approval processes are time-consuming and unclear.",
      statement: "Develop a tool that quickly analyzes user financial data and predicts loan eligibility."
    },
    {
      title: "Subscription Management Tracker",
      background: "Users forget about active subscriptions and waste money.",
      statement: "Create an app that tracks subscriptions and suggests cancellations to save money."
    },
    {
      title: "Financial Literacy Chatbot",
      background: "Students lack basic knowledge about savings, taxes, and investments.",
      statement: "Build an AI chatbot that explains financial concepts in simple language."
    },
    {
      title: "Digital Wallet for Campus Use",
      background: "Students carry cash or use multiple payment apps on campus.",
      statement: "Design a unified campus wallet system for payments in canteens, libraries, and events."
    },
    {
      title: "Smart Tax Estimator",
      background: "Many individuals struggle to estimate taxes correctly.",
      statement: "Create a tool that calculates estimated taxes based on income and expenses."
    },
    {
      title: "AI-Based EMI Planner",
      background: "People struggle to choose the best EMI option while purchasing products.",
      statement: "Develop a system that compares EMI plans and suggests the most affordable option."
    },
    {
      title: "Small Business Finance Tracker",
      background: "Small businesses lack proper tools to track income and expenses.",
      statement: "Build a simple financial dashboard to manage daily transactions and generate reports."
    },
    {
      title: "Cryptocurrency Risk Analyzer",
      background: "Many young investors invest in crypto without understanding risks.",
      statement: "Create an AI-based tool that analyzes crypto trends and explains risk levels clearly."
    },
    {
      title: "Secure Digital Payment Verification System",
      background: "Fake payment screenshots are common in online transactions.",
      statement: "Develop a verification system that confirms real-time payment authenticity."
    },
    {
      title: "Smart Donation Transparency Platform",
      background: "Donors often lack visibility into how funds are used.",
      statement: "Design a transparent digital system that tracks donation usage and impact."
    },
    {
      title: "Student Loan Management App",
      background: "Students struggle to manage loan repayment schedules.",
      statement: "Build an app that tracks loan repayments and provides payoff strategies."
    },
    {
      title: "AI-Based Financial Goal Planner",
      background: "People set financial goals but fail to plan properly.",
      statement: "Develop an AI tool that creates step-by-step financial plans to achieve specific goals."
    }
  ]
};


const PROBLEMS_PER_PAGE = 10;
const REGISTRATION_START_DATE = new Date("2026-03-05T09:30:00+05:30");

const domainLogos = {
  "Artificial Intelligence": `<svg class="domain-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="10" y="10" width="28" height="28" rx="6" stroke="currentColor" stroke-width="2"/>
    <circle cx="18" cy="18" r="2" fill="currentColor"/>
    <circle cx="30" cy="18" r="2" fill="currentColor"/>
    <path d="M18 30c2 2 4 3 6 3s4-1 6-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M14 24h4M30 24h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  "Healthcare": `<svg class="domain-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" fill="none"/>
    <path d="M24 16v16M16 24h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
  "Environment and Sustainability": `<svg class="domain-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M24 8c-4 4-8 10-8 16 0 6.6 5.4 12 12 12s12-5.4 12-12c0-6-4-12-8-16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24 20v12M18 26h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  "Education": `<svg class="domain-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M24 8l16 8v8H8v-8l16-8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M8 24v8c0 2 2 4 4 4h24c2 0 4-2 4-4v-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24 8v32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  "Fintech": `<svg class="domain-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="8" y="10" width="32" height="24" rx="4" stroke="currentColor" stroke-width="2"/>
    <path d="M14 20h8M14 26h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="32" cy="23" r="5" stroke="currentColor" stroke-width="2"/>
    <path d="M32 20v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`
};

function getDomainLogo(domain) {
  return domainLogos[domain] || `<svg class="domain-logo" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2"/>
    <path d="M24 16v16M16 24h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

let currentDomain = "";
let currentProblemIndex = 0;
let currentPage = 0;

function showDomains() {
  const domainsEl = document.getElementById("domains");
  if (!domainsEl) {
    window.location.href = "domains.html";
    return;
  }
  hideAll();
  domainsEl.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const domainList = document.getElementById("domainList");
  if (!domainList) return;
  domainList.innerHTML = "";

  Object.keys(data).forEach((domain, i) => {
    domainList.innerHTML += `
      <div class="card domain-card" style="--i: ${i}" onclick="showProblems('${domain}')">
        <span class="domain-logo-wrap">${getDomainLogo(domain)}</span>
        <span class="domain-name">${domain}</span>
      </div>
    `;
  });
}

function showProblems(domain) {
  currentDomain = domain;
  currentPage = 0;
  hideAll();
  const problemsEl = document.getElementById("problems");
  if (problemsEl) problemsEl.classList.remove("hidden");
  const problemListView = document.getElementById("problemListView");
  if (problemListView) problemListView.classList.remove("hidden");
  const problemDetailView = document.getElementById("problemDetailView");
  if (problemDetailView) problemDetailView.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderProblemList();
}

function renderProblemList() {
  const problems = data[currentDomain];
  const total = problems.length;
  const totalPages = Math.ceil(total / PROBLEMS_PER_PAGE);
  const start = currentPage * PROBLEMS_PER_PAGE;
  const pageProblems = problems.slice(start, start + PROBLEMS_PER_PAGE);

  document.getElementById("problemDomainTitle").innerText = currentDomain;
  const end = Math.min(start + PROBLEMS_PER_PAGE, total);
  document.getElementById("pageInfo").innerText = total > 0
    ? `Showing ${start + 1}–${end} of ${total}`
    : "";

  const listEl = document.getElementById("problemNameList");
  listEl.innerHTML = "";
  pageProblems.forEach((problem, i) => {
    const globalIndex = start + i;
    const card = document.createElement("div");
    card.className = "card problem-name-card";
    card.style.setProperty("--i", i);
    card.textContent = problem.title;
    card.onclick = () => showProblemDetail(globalIndex);
    listEl.appendChild(card);
  });

  document.getElementById("prevPageBtn").disabled = currentPage === 0;
  document.getElementById("nextPageBtn").disabled = currentPage >= totalPages - 1;
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderProblemList();
  }
}

function nextPage() {
  const total = data[currentDomain].length;
  const totalPages = Math.ceil(total / PROBLEMS_PER_PAGE);
  if (currentPage < totalPages - 1) {
    currentPage++;
    renderProblemList();
  }
}

function showProblemDetail(index) {
  currentProblemIndex = index;
  document.getElementById("problemListView").classList.add("hidden");
  document.getElementById("problemDetailView").classList.remove("hidden");
  renderCurrentProblem();
}

function backToList() {
  document.getElementById("problemDetailView").classList.add("hidden");
  document.getElementById("problemListView").classList.remove("hidden");
}

function renderCurrentProblem() {
  const problems = data[currentDomain];
  const problem = problems[currentProblemIndex];
  const total = problems.length;

  document.getElementById("problemDetailDomainTitle").innerText = currentDomain;
  document.getElementById("problemCounter").innerText = `${currentProblemIndex + 1} / ${total}`;
  document.getElementById("problemTitle").innerText = problem.title;
  document.getElementById("problemBackground").innerText = problem.background;
  document.getElementById("problemStatement").innerText = problem.statement;

  document.getElementById("prevBtn").disabled = currentProblemIndex === 0;
  document.getElementById("nextBtn").disabled = currentProblemIndex === total - 1;

  const registerBtn = document.getElementById("registerCtaBtn");
  if (registerBtn) {
    const now = new Date();
    if (now < REGISTRATION_START_DATE) {
      registerBtn.disabled = true;
      registerBtn.textContent = "Registration opens Mar 5, 9:30 AM";
      registerBtn.style.opacity = "0.7";
      registerBtn.style.cursor = "not-allowed";
    } else {
      registerBtn.disabled = false;
      registerBtn.textContent = "Select & Register";
      registerBtn.style.opacity = "1";
      registerBtn.style.cursor = "pointer";
    }
  }
}

function nextProblem() {
  const total = data[currentDomain].length;
  if (currentProblemIndex < total - 1) {
    currentProblemIndex++;
    renderCurrentProblem();
  }
}

function prevProblem() {
  if (currentProblemIndex > 0) {
    currentProblemIndex--;
    renderCurrentProblem();
  }
}

function goHome() {
  const homeEl = document.getElementById("home");
  if (!homeEl) {
    window.location.href = "index.html";
    return;
  }
  hideAll();
  homeEl.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAll() {
  const home = document.getElementById("home");
  if (home) home.classList.add("hidden");
  const domains = document.getElementById("domains");
  if (domains) domains.classList.add("hidden");
  const problems = document.getElementById("problems");
  if (problems) problems.classList.add("hidden");
}

// ========== Select & Register — localStorage key for selected problem ==========
const INVENZA_SELECTED_KEY = "invenza_selected_problem";

function openRegisterModal() {
  const now = new Date();
  if (typeof REGISTRATION_START_DATE !== 'undefined' && now < REGISTRATION_START_DATE) {
    alert("Registration has not opened yet. It opens on March 5, 2026 at 9:30 AM IST.");
    return;
  }

  const problems = data[currentDomain];
  const problem = problems[currentProblemIndex];
  document.getElementById("modalProblemName").textContent = problem.title;
  const modal = document.getElementById("registerModal");
  modal.classList.add("modal-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeRegisterModal() {
  const modal = document.getElementById("registerModal");
  modal.classList.remove("modal-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function confirmRegisterRedirect() {
  const problems = data[currentDomain];
  const problem = problems[currentProblemIndex];
  const payload = { domain: currentDomain, title: problem.title };
  try {
    localStorage.setItem(INVENZA_SELECTED_KEY, JSON.stringify(payload));
  } catch (e) {
    return;
  }
  closeRegisterModal();
  window.location.href = "register.html";
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.hash === "#domains") showDomains();

  var modal = document.getElementById("registerModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeRegisterModal();
    });
  }
});
