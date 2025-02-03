
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export default client;  // here we are exporting client from @prisma/client from node modules which will be used in http