'use strict';

const S3 = require('aws-sdk/clients/s3'),
    core = {
        crud: require('./core/crud'),
        errors: require('./core/errors.js'),
    };

class ZIS3 {

    constructor(s3 = {}) {
        if (!s3.accessKeyId && !s3.secretAccessKey)
            throw Error('zi-s3: accessKeyId & secretAccessKey are required');
        this.bucket = s3.bucket;
        this.s3 = new S3(s3);
    }

    _head(key, bucket) {
        const self = this;
        return new Promise((res, rej) => {
            self.s3.headObject(
                {
                    Key: key,
                    Bucket: bucket || self.bucket,
                },
                (err, data) => {
                    if (err) {
                        /* istanbul ignore else */
                        if (err.code === 'NotFound')
                            return rej(core.errors.notFound(err));
                        /* istanbul ignore next */
                        return rej(core.errors.internal(err));
                    }
                    res(data);
                }
            );
        });
    }

    get crud() {
        return core.crud(this);
    }

}

module.exports = ZIS3;