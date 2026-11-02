import ky from "ky";
import { env } from "../config/env";

export const backendClient = ky.create({
  baseUrl: `${env.backendApiBaseUrl}/`,
});