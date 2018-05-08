'use strict';

describe('ZIS3', () => {
    // console.log('#_config', require('util').inspect(_config, 0, 10, 1));
    const s3 = new _ZIS3(_config);

    before(function(done) {
        this.timeout(60000);
        const s1 = new Promise((res) => {
                s3._head('test/sample.jpeg')
                    .then(() => s3.crud.delete('test/sample.jpeg'))
                    .then(res)
                    .catch(() => res());
            }),
            s2 = new Promise((res) => {
                s3._head('test/sample.json')
                    .then(() => s3.crud.delete('test/sample.json'))
                    .then(res)
                    .catch(() => res());
            });

        Promise.all([s1, s2])
            .then(() => done());
    });
    it('catch contructor to AWS-SDK s3', () => {
        const s3 = () => new _ZIS3();
        _expect(s3).to.throw('zi-s3: accessKeyId & secretAccessKey are required');
    });
    describe('file: crud', () => {
        const fs = {
            createReadStream: require('fs').createReadStream,
        };
        it('create', function(done) {
            this.timeout(4000);
            s3.crud.create({
                key: 'test/sample.jpeg',
                contentType: 'image/jpeg',
                body: fs.createReadStream(_path.get('/test/files/sample.jpeg')),
            })
                .then((data) => {
                    // console.log('#data', require('util').inspect(data, 0, 10, 1));
                    _expect(data.location).to.be.equal(
                        'https://s3.amazonaws.com/nunchee1.0.0/test/sample.jpeg'
                    );
                    _expect(data.key).to.be.equal('test/sample.jpeg');
                    _expect(data.bucket).to.be.equal('nunchee1.0.0');
                    return Promise.resolve();
                })
                .then(() => s3.crud.create({
                    key: 'test/sample.jpeg',
                    contentType: 'image/jpeg',
                    body: fs.createReadStream(_path.get('/test/files/sample.jpeg')),
                }))
                .catch((err) => {
                    // console.log('#err', require('util').inspect(err, 0, 10, 1));
                    _expect(err.code).to.be.equal(102);
                    _expect(err.name).to.be.equal('alreadyExist');
                    done();
                });
        });
        it('read', function(done) {
            this.timeout(4000);
            s3.crud.read('test/sample.jpeg')
                .then((data) => {
                    // console.log('#data', require('util').inspect(data, 0, 10, 1));
                    _expect(data.contentType).to.be.equal('image/jpeg');
                    _expect(data.body).to.exist;
                    _expect(data.lastModified).to.exist;
                    return Promise.resolve();
                })
                .then(() => s3.crud.read('test/asdf.jpeg'))
                .catch((err) => {
                    _expect(err.code).to.be.equal(101);
                    _expect(err.name).to.be.equal('notFound');
                    done();
                });
        });
        it('update', function(done) {
            this.timeout(4000);
            s3.crud.update({key: 'test/sample.jpeg', acl: 'authenticated-read'})
                .then((data) => {
                    _expect(data.ETag).to.exist;
                    return Promise.resolve();
                })
                .then(() => s3.crud.update({key: 'test/sample.jpeg'}))
                .then((data) => {
                    _expect(data.ETag).to.exist;
                    done();
                })
                .catch(done);
        });
        it('delete', function(done) {
            this.timeout(4000);
            s3.crud.delete('test/sample.jpeg')
                .then(() => done())
                .catch(done);
        });
    });
    describe('json', () => {
        it('crud', function(done) {
            this.timeout(60000);
            let key;
            s3.crud.create({
                key: 'test/sample.json',
                contentType: 'aplication/json',
                body: JSON.stringify({foo: 'bar'}),
            })
                .then((data) => {
                    // console.log('#data', require('util').inspect(data, 0, 10, 1));
                    _expect(data.location).to.be.equal(
                        'https://s3.amazonaws.com/nunchee1.0.0/test/sample.json'
                    );
                    _expect(data.key).to.be.equal('test/sample.json');
                    _expect(data.bucket).to.be.equal('nunchee1.0.0');
                    key = data.key;
                    return Promise.resolve();
                })
                .then(() => s3.crud.read(key))
                .then((data) => {
                    data.body = JSON.parse(data.body.toString('utf8'));
                    _expect(data.contentType).to.be.equal('aplication/json');
                    _expect(data.body.foo).to.be.equal('bar');
                    _expect(data.body.bar).to.be.undefined;
                    _expect(data.lastModified).to.exist;
                    return Promise.resolve();
                })
                .then(() => s3.crud.update({
                    key: key, body: JSON.stringify({foo: 'bar', bar: 'foo'}),
                }))
                .then((data) => {
                    // console.log('#data', require('util').inspect(data, 0, 10, 1));
                    _expect(data.ETag).to.exist;
                    return Promise.resolve();
                })
                .then(() => s3.crud.read(key))
                .then((data) => {
                    data.body = JSON.parse(data.body.toString('utf8'));
                    // console.log('#data', require('util').inspect(data, 0, 10, 1));
                    _expect(data.contentType).to.be.equal('aplication/json');
                    _expect(data.body.foo).to.be.equal('bar');
                    _expect(data.body.bar).to.be.equal('foo');
                    _expect(data.lastModified).to.exist;
                    return Promise.resolve();
                })
                .then(() => s3.crud.delete(key))
                .then(() => s3.crud.read(key))
                .catch((err) => {
                    _expect(err.code, 101);
                    // console.log('#err', require('util').inspect(err, 0, 10, 1));
                    done();
                });
        });
    });
    after(function(done) {
        this.timeout(60000);
        const s1 = new Promise((res) => {
                s3._head('test/sample.jpeg')
                    .then(() => s3.crud.delete('test/sample.jpeg'))
                    .then(res)
                    .catch(() => res());
            }),
            s2 = new Promise((res) => {
                s3._head('test/sample.json')
                    .then(() => s3.crud.delete('test/sample.json'))
                    .then(res)
                    .catch(() => res());
            });

        Promise.all([s1, s2])
            .then(() => done());
    });
});

