const DashboardQueries = require('../queries/dashboard');

exports.getDashboardData = async (req, res) => {
  try {
    const workerId = req.params.workerId;
    
    const data = await DashboardQueries.getWorkerStats(workerId);
    const recommendations = await DashboardQueries.getJobRecommendations(workerId);

    res.json({
      status: 'success',
      data: {
        stats: data,
        recommendations
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to load dashboard data',
      error: error.message
    });
  }
};

exports.searchJobs = async (req, res) => {
  try {
    const workerId = req.params.workerId;
    const { location, profession, page = 1, limit = 10 } = req.query;
    
    const result = await DashboardQueries.searchJobs({
      workerId,
      location,
      profession,
      page,
      limit
    });

    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Error searching jobs:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to search jobs',
      error: error.message
    });
  }
};

exports.applyForJob = async (req, res) => {
    const { jobId, userId } = req.body;
    
    if (!jobId || !userId) {
      return res.status(400).json({
        status: 'error',
        message: 'Both jobId and userId are required'
      });
    }
  
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
  
      // 1. Verify job exists
      const [job] = await connection.query(
        'SELECT id FROM job_offers WHERE id = ?',
        [jobId]
      );
      
      if (!job.length) {
        return res.status(404).json({
          status: 'error',
          message: `Job ${jobId} not found`
        });
      }
  
      // 2. Get interim_collaborator_id for this user
      const [worker] = await connection.query(
        `SELECT id FROM interim_collaborators WHERE user_id = ?`,
        [userId]
      );
      
      if (!worker.length) {
        return res.status(404).json({
          status: 'error',
          message: `User ${userId} has no worker profile`
        });
      }
  
      // 3. Create application
      await connection.query(
        `INSERT INTO job_applications 
         (job_offer_id, interim_collaborator_id, status)
         VALUES (?, ?, 'pending')`,
        [jobId, worker[0].id]
      );
  
      await connection.commit();
      
      return res.status(201).json({
        status: 'success',
        message: 'Application submitted successfully'
      });
  
    } catch (error) {
      await connection.rollback();
      console.error('Application error:', error);
      
      return res.status(500).json({
        status: 'error',
        message: 'Failed to submit application',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } finally {
      if (connection) connection.release();
    }
};