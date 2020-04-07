import { AuthorResolver } from "./author.resolver";
import { PostResolver } from "./post.resolver";
import { UserResolver } from "./user.resolver";

export const resolvers = [
    AuthorResolver,
    PostResolver,
    UserResolver,
];
