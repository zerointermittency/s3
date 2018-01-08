'use strict';

describe('errors', () => {
    const errors = require('../core/errors.js');
    it('internal', () => {
        const e = errors.internal({msg: 'foo:bar'});
        _expect(e.code).to.be.equal(100);
        _expect(e.name).to.be.equal('internal');
        _expect(e.extra.msg).to.be.equal('foo:bar');
    });
    it('notFound', () => {
        const e = errors.notFound({msg: 'foo:bar'});
        _expect(e.code).to.be.equal(101);
        _expect(e.name).to.be.equal('notFound');
        _expect(e.extra.msg).to.be.equal('foo:bar');
    });
    it('alreadyExist', () => {
        const e = errors.alreadyExist;
        _expect(e.code).to.be.equal(102);
        _expect(e.name).to.be.equal('alreadyExist');
    });
});