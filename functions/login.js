exports.handler = (event, context, callback) => {
    return callback(null, {
        statusCode: 200,
        body: {code: 1, message: 'Works'}
    });
}
