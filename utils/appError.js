class AppError {
  constructor(error, res) {
    let errorObj = {
      status: 'error',
      message: error.message
    }
    if(error.data){
      errorObj.data = error.data
    }
    return res.status(error.status_code).json(errorObj)
  }
}

module.exports = AppError;
