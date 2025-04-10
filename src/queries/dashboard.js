const pool = require('../../config/mySql');

class DashboardQueries {
  static async getWorkerStats(workerId) {
    const [user] = await pool.query(
      `SELECT u.firstName, u.lastName, i.profession, i.location 
       FROM users u
       JOIN interim_collaborators i ON u.id = i.user_id
       WHERE u.id = ?`, 
      [workerId]
    );

    if (!user.length) throw new Error('Worker not found');

    const [stats] = await pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM contracts c 
         JOIN interim_collaborators i ON c.interim_collaborator_id = i.id 
         WHERE i.user_id = ? AND c.signed = TRUE) AS contractsSigned,
         
        (SELECT COUNT(*) FROM missions m 
         JOIN interim_collaborators i ON m.interim_collaborator_id = i.id 
         WHERE i.user_id = ? AND m.status = 'active') AS activeMissions,
         
        (SELECT COUNT(*) FROM job_applications ja 
         JOIN interim_collaborators i ON ja.interim_collaborator_id = i.id 
         WHERE i.user_id = ? AND ja.status = 'pending') AS pendingApplications,
         
        (SELECT COALESCE(SUM(work_hours), 0) FROM missions m 
         JOIN interim_collaborators i ON m.interim_collaborator_id = i.id 
         WHERE i.user_id = ?) AS totalHoursWorked
      `,
      [workerId, workerId, workerId, workerId]
    );

    return {
      worker: {
        name: `${user[0].firstName} ${user[0].lastName}`,
        profession: user[0].profession,
        location: user[0].location
      },
      ...stats[0]
    };
  }

  static async getJobRecommendations(workerId) {
    const [worker] = await pool.query(
      `SELECT profession, location FROM interim_collaborators 
       WHERE user_id = ?`,
      [workerId]
    );

    if (!worker.length) throw new Error('Worker not found');

    const [jobs] = await pool.query(
      `SELECT jo.id, jo.location, jo.salary, jo.duration, jo.created_at,
       cc.company_name, rr.job_title, rr.job_description
       FROM job_offers jo
       JOIN client_companies cc ON jo.client_company_id = cc.id
       JOIN recruitment_requests rr ON jo.request_id = rr.id
       WHERE jo.location LIKE ? OR rr.job_title LIKE ?
       ORDER BY jo.created_at DESC
       LIMIT 6`,
      [`%${worker[0].location}%`, `%${worker[0].profession}%`]
    );

    return jobs.map(job => ({
      id: job.id,
      title: job.job_title || 'No title available',
      location: job.location,
      type: job.duration ? 'Temporary' : 'Permanent',
      salary: job.salary ? `${job.salary} TND/hour` : 'Negotiable',
      profession: worker[0].profession,
      posted: this.formatTimeAgo(job.created_at),
      company: job.company_name,
      description: job.job_description || 'No description available'
    }));
  }

  static async searchJobs({ workerId, location, profession, page = 1, limit = 10 }) {
    try {
      const numericLimit = parseInt(limit, 10);
      const numericPage = parseInt(page, 10);
      const offset = (numericPage - 1) * numericLimit;

      let baseQuery = `
          SELECT 
              jo.id, jo.location, jo.salary, jo.duration, jo.created_at,
              cc.company_name, rr.job_title, rr.job_description
          FROM job_offers jo
          JOIN client_companies cc ON jo.client_company_id = cc.id
          JOIN recruitment_requests rr ON jo.request_id = rr.id
          WHERE jo.id NOT IN (
              SELECT ja.job_offer_id 
              FROM job_applications ja
              JOIN interim_collaborators i ON ja.interim_collaborator_id = i.id
              WHERE i.user_id = ?
          )
      `;
      
      const params = [workerId];
      
      if (location) {
          baseQuery += ` AND jo.location = ?`;
          params.push(location);
      }
      
      if (profession) {
          baseQuery += ` AND rr.job_title LIKE ?`;
          params.push(`%${profession}%`);
      }

      const countQuery = `SELECT COUNT(*) as total FROM (${baseQuery}) AS count_table`;
      const [totalResult] = await pool.query(countQuery, params);
      const total = totalResult[0].total;

      const paginatedQuery = `${baseQuery} ORDER BY jo.created_at DESC LIMIT ? OFFSET ?`;
      const [jobs] = await pool.query(paginatedQuery, [...params, numericLimit, offset]);

      return {
          jobs: jobs.map(job => ({
              id: job.id,
              title: job.job_title || 'No title',
              location: job.location,
              type: job.duration ? 'Temporary' : 'Permanent',
              salary: job.salary ? `${job.salary} TND/hour` : 'Negotiable',
              profession: job.job_title.split(' ')[0] || 'Various',
              posted: this.formatTimeAgo(job.created_at),
              company: job.company_name,
              description: job.job_description || 'No description'
          })),
          pagination: {
              page: numericPage,
              limit: numericLimit,
              total,
              pages: Math.ceil(total / numericLimit)
          }
      };
    } catch (error) {
      console.error('Error in searchJobs:', error);
      throw error;
    }
  }

  static formatTimeAgo(date) {
    const now = new Date();
    const diffInDays = Math.floor((now - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  }
}

module.exports = DashboardQueries;