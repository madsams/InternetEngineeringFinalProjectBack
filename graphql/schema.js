const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, 
       GraphQLID, GraphQLInt, GraphQLSchema, GraphQLList,
	   GraphQLBoolean, GraphQLEnumType} = graphql;
const Form = require('./../form/model');
const FormAnswer = require('./../formAnswer/model');
const GraphQLDate = require('graphql-date');

const FieldsTypeEnumType = new GraphQLEnumType({
	name: "FieldsTypeEnumType",
	values : {
		Text: {
			string: 0,
		},
		Number: {
			value: 1,
		},
		Date: {
			value: 2,
		},
		Location: {
			value: 3,
		}
	}
});

const OptionsItemType = new GraphQLObjectType({
	name: 'OptionsItem',

	fields: () => ({
		label: {type: GraphQLString}
	})
});

const FieldsItemType = new GraphQLObjectType({
	name: 'FieldsItem',

	fields: () => ({
		name: {type: GraphQLString},
		title: {type: GraphQLString},
		type: {type: FieldsTypeEnumType},
		required: {type: GraphQLBoolean},
		options: {type: GraphQLList(OptionsItemType)}
	})
});

const FormType = new GraphQLObjectType({
    name: 'Form',
    //We are wrapping fields in the function as we dont want to execute this ultil 
    //everything is inilized. For example below code will throw error AuthorType not 
    //found if not wrapped in a function
    fields: () => ({
        id: { type: GraphQLID  },
        title: { type: GraphQLString }, 
        createdAt: { type: GraphQLDate },
        fields: {type: GraphQLList(FieldsItemType)}
    })
});


const RootQuery = new GraphQLObjectType({
	name: 'RootTypeQuery',
	fields:{
		form: {
			type: FormType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Form.findById(args.id);
			}
		},
		forms: {
			type: FormType,
			resolve(parent, args){
				return Form.findById({});
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery
});
