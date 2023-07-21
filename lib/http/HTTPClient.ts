import { Nocular } from "../../deps.ts";
import { NoctURL, NoctVersion } from "../../mod.ts";
import { APIVersion, HTTPClientOptions } from "../types/http.ts";

export default class HTTPClient {
  engine: Nocular;

  baseURL?: string = "https://discord.com/api";
  apiVersion?: APIVersion = 10;
  userAgent?: string = `Noct (${NoctURL}, ${NoctVersion})`;
  token: string;
  
  constructor(options: HTTPClientOptions) {
    this.baseURL = options.baseURL;
    this.userAgent = options.userAgent;
    this.token = options.token;
  }
}