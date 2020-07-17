

const mongoos = require("mongoos");
const Form = require("../../form/model");

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const should = chai.should();
const faker = require("faker");

const server = require("../../app")
const log = require('./../logger/logger');


chai.use(chaiHttp);

describe("Form", () => {
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
});



// describe("Form", () => {
// 	describe("createForm", async() => {
// 		it("should have a .then that returns a form", function(done) {

// 			var stabValue = {
// 				title: faker.name.title(),
// 				fields: {
// 					[
// 						{
// 						name: faker.name.findName(),
// 						title: faker.name.title(),
// 						type: faker.random.arrayElement([
// 							'Text', 'Number', 'Date', 'Location']),
// 						required: faker.random.boolean()
// 						},
// 						{
// 						name: faker.name.findName(),
// 						title: faker.name.title(),
// 						type: faker.random.arrayElement([
// 							'Text', 'Number', 'Date', 'Location']),
// 						required: faker.random.boolean(),
// 						options: [
// 							{
// 								label: faker.name.findName(),
// 								value: faker.objectElement()
// 							}
// 						]
// 						},
// 						{
// 						name: faker.name.findName(),
// 						title: faker.name.title(),
// 						type: faker.random.arrayElement([
// 							'Text', 'Number', 'Date', 'Location']),
// 						required: faker.random.boolean(),
// 						options: [
// 							{
// 								label: faker.name.findName(),
// 								value: faker.objectElement()
// 							}
// 						]
// 						},
// 					]
// 				}				
// 			}

// 			var result = createForm(stabValue);

// 			result.then(function(data){
// 				expect(data).to.equal(stabValue);
// 				done();
// 			}), function(error){
// 				assert.fail(error);
// 				done();
// 			}


// 		})
// 	})

// })