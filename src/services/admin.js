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

async function getComplianceReportsService() {
    try {
        const complianceReportsRef = db.collection("compliance_reports");
        const snapshot = await complianceReportsRef.get();

        if (snapshot.empty) {
            return [];
        }

        const reports = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return reports;
    } catch (error) {
        console.error("Error fetching compliance reports:", error);
        throw new Error("Failed to fetch compliance reports.");
    }
}

module.exports = { getJobOffersAndApplicantsService,getComplianceReportsService };
