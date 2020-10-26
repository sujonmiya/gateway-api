const {expect} = require("chai")

const {isObjectId} = require('../common/helpers')

describe('helpers',  () => {
    it('#isObjectId', function () {
        expect(isObjectId('sfsdfsdf')).to.be.false
        expect(isObjectId('5f9657a2f73cc11c5c7c4285')).to.be.true
    });
});