
const mongoos = require("mongoose");
const Form = require("../form/model");

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const should = chai.should();
const faker = require("faker");

const server = require("../app")
const log = require('../logger/logger');
const service = require('../form/service');


chai.use(chaiHttp);

describe("Forms", () => {

	beforeEach((done) => {
		Form.remove({}, (err) => {
			done();
		});
	});

	describe("/GET form", () => {
		it('it should return all the forms', (done) => {
			chai.request(server)
				.get('/api/forms')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a("array");
					res.body.length.should.be.eql(0);
					done();
				});
		});
	});

describe("/POST form", () => {
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
				]
						
		}

	it('it should not create a form in db because fields is required', (done) => {
		
		let fakeFormNoFields = JSON.parse(JSON.stringify(fakeForm));
		delete fakeFormNoFields.fields
		
		chai.request(server)
           .post('/api/forms')
           .send(fakeFormNoFields)
           .end((err, res) => {
                 res.should.have.status(422);
                 res.body.should.be.a('object');
                 res.body.should.have.property('message');
             done();
           });

	});


	it('it should not create a form in db because fields[0].type is not from enum', (done) => {
		
		let fakeFormWrongFieldsType = JSON.parse(JSON.stringify(fakeForm));
		fakeFormWrongFieldsType.fields[0].type = "AnyThing";
		chai.request(server)
           .post('/api/forms')
           .send(fakeFormWrongFieldsType)
           .end((err, res) => {
                 res.should.have.status(422);
                 res.body.should.be.a('object');
                 res.body.should.have.property('message');
             done();
           });

	});

	it('it should create a form in db', (done) => {
		
		chai.request(server)
           .post('/api/forms')
           .send(fakeForm)
           .end((err, res) => {
                 res.should.have.status(200);
                 res.body.should.be.a('object');
                 res.body.should.have.property('title');
                 res.body.should.have.property('id');
             done();
           });

	});

	it('it should not create a form with two identical id', (done) => {

		// TODO make it work
		let first_id;
		let second_id;
		chai.request(server)
			.post('/api/forms')
			.send(fakeForm)
			.end((err, res) => {
				res.should.have.status(200);
				first_id = res.body.id;
				done();
			});

		// first_id.should.not.eq(second_id);

	});

	it('it should get the form created by given id', (done) => {
		let resultPromise = service.createForm(fakeForm);
		resultPromise.then(result =>{
	        chai.request(server)
	        	.get(`/api/forms/${result.body.id}`)
	        	.send(fakeForm)
	        	.end((err, res) => {
	        		res.should.have.status(200);
	        		res.body.should.be.a('object');
	        		res.body.should.have.property('id').eq(`${result.body.id}`);
	        		res.body.should.have.property('fields').eq(fakeForm.fields);
	        		done();
	        	});
	    })
	    .catch(err=>{
	        log(err)
	    });
	});


});
});

