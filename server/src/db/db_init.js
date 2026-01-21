import { createDatabase, createTables } from "./db_setup.js";

const initializeDatabase = async () => {
  await createDatabase();
  await createTables();
};
initializeDatabase();
