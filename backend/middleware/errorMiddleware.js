const errorHandler = (err, req, res, next) => {
    //err.status lo pone httpError (utils.js); lo demás es igual al repo base
    const statusCode = err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500)

    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = errorHandler
