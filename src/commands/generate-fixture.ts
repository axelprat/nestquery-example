import * as path from 'path';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import { createConnection, getRepository } from 'typeorm';
import { configuration } from "../../config/config";
import { entities } from "../test/entity/allEntities"

const loadFixtures = async (fixturesPath: string, dbNum, dbName) => {
    let connection;

    try {
        connection = await createConnection({
                ...configuration.db[dbNum],
                type: "mysql",
                entities: (entities[dbName] ?? []),
        });

        await connection.synchronize(true);

        const loader = new Loader();
        loader.load(path.resolve(fixturesPath));

        const resolver = new Resolver();
        const fixtures = resolver.resolve(loader.fixtureConfigs);
        const builder = new Builder(connection, new Parser());

        for (const fixture of fixturesIterator(fixtures)) {
            const entity = await builder.build(fixture);
            await getRepository(entity.constructor.name, dbName).save(entity);
        }
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

loadFixtures(__dirname + '/fixtures', 0, 'test')
    .then(() => {
        console.log('Fixtures are successfully loaded.');
    })
    .catch(err => console.log(err));
loadFixtures(__dirname + '/fixtures2', 1, 'second')
    .then(() => {
        console.log('Fixtures are successfully loaded.');
    })
    .catch(err => console.log(err));