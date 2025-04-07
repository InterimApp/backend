const { fetchJobOffersAndApplicants } = require('../queries/admin');  
const db = require("../../config/firestore");

const getJobOffersAndApplicantsService = async () => {

    try {
        const rows = await fetchJobOffersAndApplicants();

        const jobOffersMap = new Map();

        rows.forEach(row => {

            const {
                job_offer_id,
                job_title,
                company_name,
                name,
                job_created_at,
                applicant_id,
                cv_path,
                academic_level,
                profession,
                experience_years,
                age
            } = row;

            if (!jobOffersMap.has(job_offer_id)) {
                jobOffersMap.set(job_offer_id, {
                    job_offer_id,
                    job_title,
                    company_name,
                    recruiter_name: name, // Renamed 'name' for clarity
                    job_created_at,
                    applicants: [] // Empty array for applicants
                });
            }

            if (applicant_id) {
                jobOffersMap.get(job_offer_id).applicants.push({
                    applicant_id,
                    cv_path,
                    academic_level,
                    profession,
                    experience_years,
                    age
                });
            }
        });

        const result = Array.from(jobOffersMap.values());
        return result;
    } catch (error) {
        console.error("Error in getJobOffersAndApplicantsService:", error);
        throw error;
    }
};

const fetchComplianceReports = async () => {
    try {
      // Fetch all compliance reports from Firestore
      const complianceReportsSnapshot = await db.collection('compliance_reports').get();
  
      // Prepare the response array
      const complianceReports = [];
  
      // Loop through each report document
      for (let doc of complianceReportsSnapshot.docs) {
        const reportData = doc.data();
        const reportId = doc.id;
  
        // Fetch the client company data using the submitted_by field
        const companyRef = db.collection('client_company').doc(String(reportData.submitted_by));
        const companySnapshot = await companyRef.get();
  
        // If the company exists, add company name and prepare the response data
        if (companySnapshot.exists) {
          const companyData = companySnapshot.data();
          const companyName = companyData.name; // Assuming 'name' field is present in the client_company document
  
          // Push the report with company name to the result array
          complianceReports.push({
            ID: reportId,
            company_name: companyName,
            subject: reportData.subject,
            description: reportData.description,
            created_at: reportData.created_at.toDate().toLocaleString(), // formatting the created_at timestamp
            report_url: reportData.report_url || "No URL provided", // Default message if report_url is null
          });
        }
      }
  
      return complianceReports;
    } catch (error) {
      console.error("Error fetching compliance reports:", error);
      throw new Error("Error fetching compliance reports");
    }
  };
  

module.exports = { getJobOffersAndApplicantsService,fetchComplianceReports };
