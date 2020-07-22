
// const mongoos = require("mongoose");
// const FormAnswer = require("../formAnswer/model");

// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const sinon = require("sinon");
// const should = chai.should();
// const faker = require("faker");

// const server = require("../app")
// const log = require('../logger/logger');
// const service = require('../formAnswer/service');
// const formService = require('../form/service');


// chai.use(chaiHttp);

// describe("Form Answers", () => {

// 	beforeEach((done) => {
// 		FormAnswer.remove({}, (err) => {
// 			done();
// 		});
// 	});

// 	describe("/POST from answer to a form", () => {
// 			let fakeForm = {
// 			title: faker.name.title(),
// 			fields: 
// 				[
// 					{
// 					name: faker.name.findName(),
// 					title: faker.name.title(),
// 					type: faker.random.arrayElement([
// 						'Text', 'Number', 'Date', 'Location'])
// 					},
// 					{
// 					name: faker.name.findName(),
// 					title: faker.name.title(),
// 					type: faker.random.arrayElement([
// 						'Text', 'Number', 'Date', 'Location']),
// 					options: [
// 						{
// 							label: faker.name.findName(),
// 							value: faker.objectElement
// 						}
// 					]
// 					},
// 					{
// 					name: faker.name.findName(),
// 					title: faker.name.title(),
// 					type: faker.random.arrayElement([
// 						'Text', 'Number', 'Date', 'Location']),
// 					options: [
// 						{
// 							label: faker.name.findName(),
// 							value: faker.objectElement
// 						}
// 					]
// 					}
// 				]
						
// 		}



// 		let resultPromise = formService.createForm(fakeForm);
// 		let formObject;
// 		resultPromise.then(result => {
// 			formObject = result.body;
// 		});

// 		it('it should not create a form answer to a given form id because a required filled is not given', (done) => {
// 			let fakeFormNotFilledField = JSON.parse(JSON.stringify(fakeForm));
// 			fakeFormNotFilledField.fields[0].required = true;
// 			log('*********');
// 			log(fakeForm.fields);
// 			let fakeFormAnswer = {};
// 			fakeFormAnswer[fakeForm.fields[1].name] = faker.name.findName();
// 			fakeFormAnswer[fakeForm.fields[2].name] = faker.name.findName();
// 			chai.request(server)
// 				.post(`/api/form-asnwers/${formObject.id}`)
// 				.send(fakeFormAnswer)
// 				.end((err, res) => {
// 					log('*****************');
// 					log(res);
// 				})
// 			done();
// 		});
// 	});

// });