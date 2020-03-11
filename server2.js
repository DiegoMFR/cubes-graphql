var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var cors = require('cors');
// GraphQL schema
var schema = buildSchema(`
    type Query {
        cube(id: Int!): Cube
        cubes(what: String): [Cube]
    },
    type Mutation {
        updateCube(id: Int!, what: String, where: String, when: String): Cube
        addCube(what: String, where: String, when: String): Cube
    }
    type Cube {
        id: Int
        when: String
        where: String
        what: String
        content: String
    }
`);
var cubesData = [
    {
        id: 1,
        when: 'friday',
        where: 'Almere vomar supermarket',
        what: '#groceries',
        content: 'Get beer!'
    }
]
var getCube = function(args) { 
    var id = args.id;
    return cubesData.filter(cube => {
        return cube.id == id;
    })[0];
}

//TODO make arg type dynamic to get by what, where or when
var getCubeByDimension = function(args) {
    if (args.what) {
        var what = args.what;
        return cubesData.filter(cube => cube.what === what);
    } else {
        return cubesData;
    }
}
var updateCube = function({id, what, when, where}) {
    cubesData.map(cube => {
        if (cube.id === id) {
            cube.what = what;
            cube.when = when;
            cube.where = where;
            return cube;
        }
    });
    return cubesData.filter(cube => cube.id === id) [0];
}

var addCube = function({what, when, where}) {
    let id = cubesData.length + 1;
    cubesData.push({
        what, when, where, id
    });
    return cubesData.filter(cube => cube.id === id) [0];
}

var root = {
    cube: getCube,
    cubes: getCubeByDimension,
    updateCube: updateCube,
    addCube: addCube
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use(cors());
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));