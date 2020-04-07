import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { NestFactory } from "@nestjs/core";
import { configuration } from "../../config/config";
import { NestjsQueryTypeOrmModule } from "@nestjs-query/query-typeorm";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { fileExistsSync } from "tsconfig-paths/lib/filesystem";
const waterfall = require('async-waterfall');

let moduleName = 'test';
let keepRuning = false;

// On récupère le nom du module pour lequel créer le schema depuis la ligne de commande s'il y en a.
if (process.argv.length > 2) {
    moduleName = process.argv[2];
}
if (process.argv.length > 3 && "keep" == process.argv[3]) {
    keepRuning = true;
}
let schemaPath = 'src/' + moduleName + '/schema/' + moduleName + '.graphql';

waterfall([
        function (callback) {
            if (fileExistsSync("../" + moduleName + "/enum/graphql.enum")) {
                import("../" + moduleName + "/enum/graphql.enum").then(data => callback(null, true));
            } else {
                callback(null, true);
            }
        },
        function (res, callback) {
            import("../" + moduleName + "/entity/allEntities").then(data => callback(null, data.entities));
        },
        function (entities, callback) {
            import("../" + moduleName + "/resolver/allResolvers").then(data => callback(null, entities, data.resolvers));
        },
    ],
    function (err, entities, resolvers) {
        // On commence par initialiser les connections BDD et les entitées existantes
        const typeOrmConnections = [], nestqueryEntities = [];
        for (const i in configuration.db) {
            if ("undefined" == typeof entities[configuration.db[i].name] || !entities[configuration.db[i].name].length) { continue; }
            typeOrmConnections.push(
                TypeOrmModule.forRoot({
                    // use in memory sqlite
                    ...configuration.db[i],
                    type: "mysql",
                    entities: (entities[configuration.db[i].name] ?? []),
                })
            );
            nestqueryEntities.push(NestjsQueryTypeOrmModule.forFeature(entities[configuration.db[i].name], configuration.db[i].name));
        }

        // On créé le module temporaire avec tous le paramétrage pour générer le fichier GQL
        @Module({
            imports: [
                forwardRef(() => TmpAppModule),
                ...nestqueryEntities,
                GraphQLModule.forRoot({
                    include: [TmpModule],
                    path: '/graphql/' + moduleName,
                    autoSchemaFile: schemaPath,
                    definitions: {
                        path: join(process.cwd(), 'src/' + moduleName + '/schema/graphql.ts'),
                        outputAs: 'class',
                    },
                }),
            ],
            providers: [...resolvers],
        })
        class TmpModule { }

        // Puis on créé le module master qui ne charge que notre module temporaire
        @Module({
            imports: [
                ...typeOrmConnections,
                TmpModule,
            ],
        })
        class TmpAppModule { }

        async function bootstrap() {
            const app = await NestFactory.create(TmpAppModule);
            await app.listen(7777);
            console.log('schema correctement généré : "' + schemaPath + '"')
            if (!keepRuning) {
                console.log('Fermeture de l\'application')
                app.close();
            }
        }
        bootstrap();
    }
);

