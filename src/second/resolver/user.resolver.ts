import { QueryService } from '@nestjs-query/core';
import { CRUDResolver } from '@nestjs-query/query-graphql';
import { InjectTypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Resolver } from '@nestjs/graphql';
import { UserEntity } from "../entity/user.entity";

@Resolver(of => UserEntity)
export class UserResolver extends CRUDResolver(UserEntity, {
    read: {
        defaultResultSize: 50,
        maxResultsSize: 500,
    },
}) {
    constructor(
        @InjectTypeOrmQueryService(UserEntity) readonly service: QueryService<UserEntity>,
    ) {
        super(service);
    }

}