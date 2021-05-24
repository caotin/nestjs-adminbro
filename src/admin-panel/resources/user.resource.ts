import { ResourceWithOptions } from "admin-bro";
import { UserEntity } from "../../user/user.entity";

const UserResource: ResourceWithOptions = {
  resource: UserEntity,
  options: {
    actions: {
      new: {
        before: async (request, { currentAdmin }) => {
          request.payload = {
            ...request.payload,
            ownerId: currentAdmin._id,
          };
          return request;
        },
      },
    },
  },
};

export default UserResource;
