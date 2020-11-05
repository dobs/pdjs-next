export interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
    timeout?: number;
}
export declare function request(url: string | URL, options?: RequestOptions): Promise<Response>;
