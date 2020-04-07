import { AuthorEntity } from "./author.entity";
import { PostEntity } from "./post.entity";
import { UserEntity } from "../../second/entity/user.entity";

// On charge les entités de ce module et on spécifie leur database
export const entities = {
    test: [
        AuthorEntity,
        PostEntity,
    ],
    second: [
        UserEntity,
    ],
};