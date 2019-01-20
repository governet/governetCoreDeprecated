function checkHealth(req, res, next){
    res.status(200)
          .json({
            status: 'success',
            data: "Healthy",
            message: 'You got it!'
          });
}

module.exports = {
    checkHealth: checkHealth
};