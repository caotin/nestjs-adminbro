import { INestApplication } from "@nestjs/common";
import { Database, Resource } from "admin-bro-typeorm";
import AdminBro from "admin-bro";
import * as AdminBroExpress from "admin-bro-expressjs";
import UserResource from "./resources/user.resource";
import { UserEntity } from "../user/user.entity";
import * as argon2 from "argon2";

export async function setupAdminPanel(app: INestApplication): Promise<void> {
  AdminBro.registerAdapter({ Database, Resource });
  const adminBro = new AdminBro({
    resources: [UserResource], // Here we will put resources
    rootPath: "/admin", // Define path for the admin panel
  });

  const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
      const user = await UserEntity.findOne({ email });
      if (user) {
        const matched = await argon2.verify(
          await argon2.hash(password),
          user.password
        );
        if (matched) {
          return user;
        }
      }
      return false;
    },
    cookiePassword: "some-secret-password-used-to-secure-cookie",
  });
  // const router = AdminBroExpress.buildRouter(adminBro)

  app.use(adminBro.options.rootPath, router);
}
