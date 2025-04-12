import { useEffect, useState } from "react";

type Method = "GET" | "POST" | "PUT" | "DELETE";
type ParseTo = "json" | "text";

interface Success<T> {
  readonly ok: true,
  readonly status: number,
  body: T,
}

interface Failure {
  readonly ok: false,
  readonly status: number,
}

type Result<T> = Success<T> | Failure;

export const useFetch = <Data>(
    initUrl: string, 
    fetchOnInit: boolean = true, 
    opts: RequestInit = {}, 
    initialData: Data | null = null) => {
    const [data, setData] = useState<Data | null>(initialData);
    const [loading, setLoading] = useState<boolean>(fetchOnInit);
    const [error, setError] = useState<Error | null>(null);

    let url = initUrl;

    const setUrl = (newUrl: string) => {
        url = newUrl;
    };

    const request = async (method: Method, parseTo: ParseTo = "json", body?: Record<string, any>, params?: URLSearchParams, ): Promise<Result<Data>> => {
        setLoading(true);
        setError(null);

        let [cleanUrl, searchParams] = url.split("?");
        cleanUrl = `${cleanUrl}?`;

        if (params) {
            params.forEach((val, key) => { cleanUrl = cleanUrl.concat(`${key}=${val}&`); });
        }
      
        const res = await fetch(cleanUrl.concat(searchParams || ""), { method, ...opts, headers: { ...opts.headers, "Content-Type": (body ? "application/json" : "none") }, body: JSON.stringify(body), });
    
        setLoading(false);

        if (!res.ok) {
            setError(new Error());
            setData(initialData);

            return { status: res.status, ok: false };
        } else {
            const data = await res[parseTo]();
            setData(data);

            return { status: res.status, ok: true, body: data }; 
        }

    };

    const get = async (params?: URLSearchParams, parseTo?: ParseTo) => {
        return request("GET", parseTo, undefined, params);
    };

    const post = async (body: Record<string, any>, params?: URLSearchParams, parseTo?: ParseTo) => {
        return request("POST", parseTo, body, params);
    };

    const del = async (params?: URLSearchParams, parseTo?: ParseTo) => {
        return request("DELETE", parseTo, undefined, params);
    };

    const put = async (body: Record<string, any>, params?: URLSearchParams, parseTo?: ParseTo) => {
        return request("PUT", parseTo, body, params);
    };

    if (fetchOnInit) {
        useEffect(() => {
            get();
        }, []);
    }

    return { data, setData, setUrl, loading, error, get, post, del, put };
};
