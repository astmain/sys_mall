import 'reflect-metadata';
export declare function Api_group(version: 'common' | 'v1' | 'v2' | 'test', name: string): <T extends {
    new (...args: any[]): {};
}>(target: T) => void;
