declare const axios_instance: import("axios").AxiosInstance;
export declare const axios_api: import("axios").AxiosInstance;
declare global {
    interface Window {
        axios_api: typeof axios_instance;
    }
}
export {};
