import { entities as testEntities } from './test/entity/allEntities';

const submodules = [
    testEntities,
];
let allEntities = {};

submodules.forEach(entities => {
    for (let dbName in entities) {
        if ('undefined' == typeof allEntities[dbName]) {
            allEntities[dbName] = [];
        }
        allEntities[dbName] = allEntities[dbName].concat(entities[dbName]);
    }
});

export const entities = allEntities;