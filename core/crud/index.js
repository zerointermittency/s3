'use strict';

const core = {
    errors: require('./../errors.js'),
};

module.exports = (self) => {
    return {
        create: ({
            acl = 'public-read', bucket, key, contentType, body, expire,
        }) => new Promise((res, rej) => {
            self._head(key, bucket)
                .then(() => rej(core.errors.alreadyExist))
                .catch((err) => {
                    /* istanbul ignore else */
                    if (err.name === 'notFound') {
                        self.s3.upload(
                            {
                                ACL: acl,
                                Bucket: bucket || self.bucket,
                                Key: key,
                                ContentType: contentType,
                                Body: body,
                                Expires: expire,
                            },
                            (err, data) => {
                                /* istanbul ignore if */
                                if (err) return rej(core.errors.internal(err));
                                res({
                                    location: data.Location,
                                    key: data.Key,
                                    bucket: data.Bucket,
                                });
                            }
                        );
                    } else return rej(err);
                });
        }),
        read: (key, bucket) => new Promise((res, rej) => {
            self._head(key, bucket)
                .then(() => {
                    self.s3.getObject(
                        {
                            Key: key,
                            Bucket: bucket || self.bucket,
                        },
                        (err, data) => {
                            /* istanbul ignore if */
                            if (err) return rej(core.errors.internal(err));
                            res({
                                contentType: data.ContentType,
                                body: data.Body,
                                lastModified: data.LastModified,
                            });
                        }
                    );
                })
                .catch(rej);
        }),
        update: ({
            acl = 'public-read', bucket, key, contentType, body, expire,
        }) => new Promise((res, rej) => {
            self._head(key, bucket)
                .then((data) => {
                    self.s3.putObject(
                        {
                            ACL: acl,
                            Bucket: bucket || self.bucket,
                            Key: key,
                            ContentType: contentType || data.ContentType,
                            Body: body,
                            Expires: expire,
                        },
                        (err, data) => {
                            /* istanbul ignore if */
                            if (err) return rej(core.errors.internal(err));
                            res(data);
                        }
                    );
                })
                .catch(rej);
        }),
        delete: (key, bucket) => new Promise((res, rej) => {
            self._head(key, bucket)
                .then(() => {
                    self.s3.deleteObject(
                        {
                            Key: key,
                            Bucket: bucket || self.bucket,
                        },
                        (err, data) => {
                            /* istanbul ignore if */
                            if (err) return rej(core.errors.internal(err));
                            res(data);
                        }
                    );
                })
                .catch(rej);
        }),
    };
};