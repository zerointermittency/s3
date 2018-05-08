'use strict';

const ZIError = require('@zerointermittency/error');

class S3Error extends ZIError {
    constructor(opts) {
        opts.prefix = 'zi-s3';
        super(opts);
    }
}

module.exports = {
    internal: extra => new S3Error({
        code: 100,
        name: 'internal',
        message: 'Internal error',
        level: ZIError.level.fatal,
        extra: extra,
    }),
    notFound: extra => new S3Error({
        code: 101,
        name: 'notFound',
        message: 'Not found',
        level: ZIError.level.error,
        extra: extra,
    }),
    alreadyExist: new S3Error({
        code: 102,
        name: 'alreadyExist',
        message: 'Already exist',
        level: ZIError.level.error,
    }),
};
