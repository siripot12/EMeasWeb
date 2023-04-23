import "pinia";
import { AxiosInstance } from "axios";

declare module "pinia" {
  export interface PiniaCustomProperties {
    $axios: AxiosInstance;
  }
}