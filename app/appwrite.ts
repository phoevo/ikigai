import { Client, Databases } from "appwrite";

const appwrite = new Client();

appwrite
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67e67c1900063583821e");

const databases = new Databases(appwrite);

export { appwrite, databases };
