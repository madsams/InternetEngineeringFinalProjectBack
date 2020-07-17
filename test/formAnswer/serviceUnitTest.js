
const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const faker = require("faker");

describe("Form", function() {
	describe("create", function() {
		it("should create a new formAnswer", async function () {
			const stabValue = {
				title: faker.name.title(),
				fields: {
					type: [
						name: faker.name.findName(),
						
					]
				}				
			}
		})
	})
})