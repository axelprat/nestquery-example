import { forwardRef, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { entities } from "./entity/allEntities";
import { resolvers } from "./resolver/allResolvers";
import { enums } from "./enum/graphql.enum";
import { NestjsQueryTypeOrmModule } from "@nestjs-query/query-typeorm";
import { AppModule } from "../app.module";

const nestqueryEntities = [];
for (const dbName in entities) {
    nestqueryEntities.push(NestjsQueryTypeOrmModule.forFeature(entities[dbName], dbName));
}

const moduleName = 'test';
@Module({
    imports: [
        forwardRef(() => AppModule),
        ...nestqueryEntities,
        GraphQLModule.forRoot({
            include: [TestModule],
            path: '/graphql/' + moduleName,
            typePaths: ['src/' + moduleName + '/schema/*.graphql'],
            definitions: {
                path: join(process.cwd(), 'src/' + moduleName + '/schema/graphql.ts'),
                outputAs: 'class',
            },
            context:({ req }) => ({ req }),
        }),
    ],
    providers: [ ...resolvers ],
    exports: [ ]
})
export class TestModule { }
