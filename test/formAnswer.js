
const mongoos = require("mongoose");
const FormAnswer = require("../formAnswer/model");

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const should = chai.should();
const faker = require("faker");

const server = require("../app")
const log = require('../logger/logger');
const service = require('../form/service');


chai.use(chaiHttp);

describe("FormAnswers", () => {

	beforeEach((done) => {
		FormAnswer.remove({}, (err) => {
			done();
		});
	});

	describe("/GET formAnswers", () => {
		it('it should return all the form-answers', (done) => {
			chai.request(server)
				.get('/api/form-answers')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});
});

