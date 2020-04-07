import { Module } from '@nestjs/common';
import { configuration } from '../config/config';
import { TestModule } from './test/test.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "./allEntities";
import { SecondModule } from "./second/second.module";


const typeOrmConnections = [];
for (const i in configuration.db) {
    typeOrmConnections.push(
        TypeOrmModule.forRoot({
            // use in memory sqlite
            ...configuration.db[i],
            type: "mysql",
            entities: (entities[configuration.db[i].name] ?? []),
        })
    );
}

@Module({
    imports: [
        ...typeOrmConnections,
        TestModule,
        SecondModule,
    ],
    exports: [ ],
})

export class AppModule { }
