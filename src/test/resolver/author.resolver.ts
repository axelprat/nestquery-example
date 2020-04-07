import { Filter, QueryService } from '@nestjs-query/core';
import { ConnectionType, CRUDResolver } from '@nestjs-query/query-graphql';
import { InjectTypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { AuthorEntity } from "../entity/author.entity";
import { PostEntity } from "../entity/post.entity";
import { PostResolver } from "./post.resolver";
import { UserEntity } from "../../second/entity/user.entity";

@Resolver(of => AuthorEntity)
export class AuthorResolver extends CRUDResolver(AuthorEntity, {
    read: {
        defaultResultSize: 50,
        maxResultsSize: 500,
    },
    relations: {
        one: {
            // Can't work because the relation doesn't exist on author entity
            // user: { DTO: UserEntity, disableRemove: true },
        },
        many: {
            // Comment this if you want to add override
            posts: { DTO: PostEntity, disableRemove: true }
        },
    },
}) {
    constructor(
        @InjectTypeOrmQueryService(AuthorEntity) readonly service: QueryService<AuthorEntity>,
        @InjectTypeOrmQueryService(UserEntity) readonly userService: QueryService<UserEntity>,
        readonly postResolver: PostResolver,
    ) {
        super(service);
    }

    // // n-* sub-relations without paging: {} end up with a mysql error
    // // => keeping it here for now because we loose filters in sub-relations
    // @ResolveField('posts', returns => ConnectionType(PostEntity))
    // posts(@Parent() parent: AuthorEntity) : Promise<ConnectionType<PostEntity>> {
    //     // return this.briefService.findById(parent.briefId);
    //     // add the completed filter the user provided filter
    //     const filter: Filter<PostEntity> = {
    //         ...{ authorId: { eq: parent.id } },
    //     };
    //
    //     // call the original queryMany method with the new query
    //     return this.postResolver.queryMany({...{ filter } });
    // }

    // Relation with an other database
    @ResolveField('user', returns => UserEntity)
    user(@Parent() parent: AuthorEntity) {
        // Should use dataloader
        // Since it's a simple query the database doesn't matter
        return this.userService.findById(parent.userId);
    }

}