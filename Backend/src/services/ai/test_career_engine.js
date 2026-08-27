require("dotenv").config({ path: ".env" });
const { runCareerAnalysisPipeline } = require("./analysisPipeline");

async function runTestCases() {
  console.log("==================================================");
  console.log("🧪 STARTING CAREER ANALYSIS ENGINE VERIFICATION");
  console.log("==================================================");

  const testCases = [
    {
      name: "Test 1: Backend Developer + only Node.js",
      jobDescription: "I want to become backend developer",
      selfDescription: "I only know node.js",
      resume: ""
    },
    {
      name: "Test 2: React Developer + only HTML",
      jobDescription: "I want to become a React Developer",
      selfDescription: "I only know HTML",
      resume: ""
    },
    {
      name: "Test 3: Java Developer + Java basics and OOP",
      jobDescription: "I want to become a Java Developer",
      selfDescription: "I know Java basics and OOP",
      resume: ""
    },
    {
      name: "Test 4: Chartered Accountant + basic accounting",
      jobDescription: "I want to become a Chartered Accountant",
      selfDescription: "I know basic accounting",
      resume: ""
    },
    {
      name: "Test 5: CMA + basic accounting",
      jobDescription: "I want to become a CMA",
      selfDescription: "I know basic accounting",
      resume: ""
    },
    {
      name: "Test 6: Mechanical Engineer + CAD fundamentals",
      jobDescription: "I want to become a Mechanical Engineer",
      selfDescription: "I know CAD fundamentals",
      resume: ""
    },
    {
      name: "Test 7: Unknown/Unusual Career: Drone Logistics Architect",
      jobDescription: "I want to become a Drone Logistics Architect",
      selfDescription: "I know basic flight dynamics",
      resume: ""
    }
  ];

  for (const tc of testCases) {
    console.log(`\n--------------------------------------------------`);
    console.log(`▶️ RUNNING: ${tc.name}`);
    console.log(`--------------------------------------------------`);

    try {
      const result = await runCareerAnalysisPipeline({
        jobDescription: tc.jobDescription,
        selfDescription: tc.selfDescription,
        resume: tc.resume
      });

      console.log(`✅ [TARGET ROLE]: ${result.targetRole}`);
      console.log(`📊 [CALCULATED MATCH SCORE]: ${result.matchScore}%`);
      console.log(`🔑 [KNOWN SKILLS]:`, result.knownSkills);
      console.log(`⚡ [PARTIAL SKILLS]:`, result.partialSkills);
      console.log(`❌ [MISSING SKILLS COUNT]: ${result.missingSkills?.length}`);
      console.log(`❓ [TECHNICAL QUESTIONS COUNT]: ${result.technicalQuestions?.length}`);
      console.log(`💬 [BEHAVIORAL QUESTIONS COUNT]: ${result.behavioralQuestions?.length}`);
      console.log(`🚀 [PROJECTS COUNT]: ${result.projectRoadmap?.length}`);
      console.log(`🗺️ [LEARNING STEPS COUNT]: ${result.learningOrder?.length}`);
      console.log(`📄 [RESUME DATA FABRICATED?]: ${Boolean(result.resume?.name || result.resume?.experience?.length)} (Expected: false)`);

      // Mandatory Assertions
      if (result.technicalQuestions.length < 5) {
        console.error(`❌ ASSERTION FAILED: technicalQuestions count is ${result.technicalQuestions.length} (<5)`);
      } else {
        console.log(`  ✓ technicalQuestions count >= 5 PASS`);
      }
      if (result.behavioralQuestions.length < 5) {
        console.error(`❌ ASSERTION FAILED: behavioralQuestions count is ${result.behavioralQuestions.length} (<5)`);
      } else {
        console.log(`  ✓ behavioralQuestions count >= 5 PASS`);
      }
      if (result.projectRoadmap.length < 3) {
        console.error(`❌ ASSERTION FAILED: projectRoadmap count is ${result.projectRoadmap.length} (<3)`);
      } else {
        console.log(`  ✓ projectRoadmap count >= 3 PASS`);
      }
      if (result.learningOrder.length < 4) {
        console.error(`❌ ASSERTION FAILED: learningOrder count is ${result.learningOrder.length} (<4)`);
      } else {
        console.log(`  ✓ learningOrder count >= 4 PASS`);
      }
      if (result.resume?.name || (result.resume?.experience && result.resume.experience.length > 0)) {
        console.error(`❌ ASSERTION FAILED: Resume data was fabricated when no resume was provided!`);
      } else {
        console.log(`  ✓ Resume data fabrication check PASS`);
      }

    } catch (err) {
      console.error(`❌ TEST FAILED with error:`, err.message);
    }
  }

  console.log("\n==================================================");
  console.log("🎉 ALL TESTS EXECUTED");
  console.log("==================================================");
}

runTestCases();
