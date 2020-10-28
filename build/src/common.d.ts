export interface CustomInit extends RequestInit {
    params?: Record<string, string>;
    server?: string;
    timeout?: number;
}
export declare function request(url: string | URL, init?: CustomInit): Promise<Response>;
