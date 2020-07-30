
const mongoos = require("mongoose");
const FormAnswer = require("../formAnswer/model");

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const should = chai.should();
const faker = require("faker");

const server = require("../app")
const log = require('../logger/logger');
const service = require('../formAnswer/service');
const formService = require('../form/service');


chai.use(chaiHttp);

let USER_ID_TOKEN = `Bearer ${process.env.TEST_ID_TOKEN}`;

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
				.set('Authorization', USER_ID_TOKEN)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});

	describe("/POST formAnswer", () => {
		let fakeFormAnswer = {
			"name1": faker.name.title(),
			"name2": faker.name.title()
		}
		let fakeForm = {
			title: faker.name.title(),
			fields: 
				[
					{
					name: faker.name.findName(),
					title: faker.name.title(),
					type: faker.random.arrayElement([
						'Text', 'Number', 'Date', 'Location']),
					required: faker.random.boolean()
					},
					{
					name: faker.name.findName(),
					title: faker.name.title(),
					type: faker.random.arrayElement([
						'Text', 'Number', 'Date', 'Location']),
					required: faker.random.boolean(),
					options: [
						{
							label: faker.name.findName(),
							value: faker.objectElement
						}
					]
					},
					{
					name: faker.name.findName(),
					title: faker.name.title(),
					type: faker.random.arrayElement([
						'Text', 'Number', 'Date', 'Location']),
					required: faker.random.boolean(),
					options: [
						{
							label: faker.name.findName(),
							value: faker.objectElement
						}
					]
					}
				],
				createdAt: faker.date.past()
						
		}


		it('it should create a form-answer', (done) => {
			let resultPromise = formService.createForm(fakeForm);
			console.log(fakeFormAnswer);
			resultPromise.then(result => {
				chai.request(server)
					.post(`/api/form-answers/${result.body.id}`)
					.set('Authorization', USER_ID_TOKEN)
					.send(fakeFormAnswer)
					.end((err, res) => {
					// res.should.have.status(201);
					// res.body.should.be.a("object");
					// res.body.should.have.property("id");
					done();
				});
			});
		});

		it('it should get a form form-answers', (done) => {
			let resultPromise = formService.createForm(fakeForm);
			console.log(fakeFormAnswer);
			resultPromise.then(result => {
				chai.request(server)
					.get(`/api/forms/${result.body.id}/form-answers`)
					.set('Authorization', USER_ID_TOKEN)
					.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a("object");
					done();
				});
			});
		});
	});
});

