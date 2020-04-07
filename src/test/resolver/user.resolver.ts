import { QueryService } from '@nestjs-query/core';
import { ReadResolver } from '@nestjs-query/query-graphql';
import { InjectTypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Resolver } from '@nestjs/graphql';
import { AuthorEntity } from "../entity/author.entity";
import { UserEntity } from "../../second/entity/user.entity";

@Resolver(of => UserEntity)
export class UserResolver extends ReadResolver(UserEntity, {
    defaultResultSize: 50,
    maxResultsSize: 500,
    relations: {
        many: {
            // don't work because the relation is not implemented
            authors: { DTO: AuthorEntity, disableRemove: true },
        },
    },
}) {
    constructor(
        @InjectTypeOrmQueryService(UserEntity) readonly service: QueryService<UserEntity>,
    ) {
        super(service);
    }

}