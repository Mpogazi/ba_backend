/**
 * module name: request-wrapper
 * use: Will be used to wrapp a response
 *      with meta data so that the frontend 
 *      can find better interpretations of
 *      the data that we will be sending them.
*/

exports.wrapper_response = (code, resp) => {
     return { "code": code, "data" : resp };
}

exports.STATUS_CODES = {
     OK:                  200,
     NO_CONTENT:          204,
     NO_MODIFIED:         304,
     BAD_REQUEST:         400,
     UNAUTHORIZED:        401,
     FORBIDDEN:           403,
     NOT_FOUND:           404,
     SERVER_ERROR:        500,
     SERVICE_UNAVAILABLE: 503
}