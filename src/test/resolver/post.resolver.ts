import { QueryService } from '@nestjs-query/core';
import { CRUDResolver } from '@nestjs-query/query-graphql';
import { InjectTypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PostEntity } from "../entity/post.entity";
import { AuthorEntity } from "../entity/author.entity";

@Resolver(() => PostEntity)
export class PostResolver extends CRUDResolver(PostEntity, {
    read: {
        defaultResultSize: 50,
        maxResultsSize: 500,
    },
    relations: {
        one: {
            // Comment this if you want to add override
            author: { DTO: AuthorEntity }
        }
    }
}) {
    constructor(
        @InjectTypeOrmQueryService(PostEntity) readonly service: QueryService<PostEntity>,
    ) {
        super(service);
    }

    // // 1-n sub-relations have to be manually implemented for now otherwise they end up with a mysql error
    // @ResolveField('author', returns => AuthorEntity)
    // author(@Parent() parent: PostEntity) {
    //     // Should use dataloader
    //     return this.service.findRelation(AuthorEntity, 'author', parent);
    // }

}