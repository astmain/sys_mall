/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { login } from '../models/login';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * 首页文档
     * 首页文档:undefined
     * @param token token
     * @returns any
     * @throws ApiError
     */
    public static homeDoc(
        token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE1MTYwMzE1MTEwIiwicGhvbmUiOiIxNTE2MDMxNTExMCIsImlkIjoxLCJ1c2VyX2lkIjoxLCJyb2xlSWRzIjpbXSwiZGVwYXJ0bWVudCI6W3siaWQiOjJ9XSwiaWF0IjoxNzU3NDMyNDgxLCJleHAiOjI2MjEzNDYwODEsInJvbGVzIjpbXSwiZXh0cmEiOnsiY2hlY2tlZCI6dHJ1ZX19.dHfLiPbWiLKdu5NYvNPcXTnVWvaSq3XQsIzyj-v6bJ0',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
            headers: {
                'token': token,
            },
        });
    }
    /**
     * 首页文档
     * 首页文档:undefined
     * @param requestBody
     * @param token token
     * @returns any
     * @throws ApiError
     */
    public static homeApi222(
        requestBody: login,
        token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjE1MTYwMzE1MTEwIiwicGhvbmUiOiIxNTE2MDMxNTExMCIsImlkIjoxLCJ1c2VyX2lkIjoxLCJyb2xlSWRzIjpbXSwiZGVwYXJ0bWVudCI6W3siaWQiOjJ9XSwiaWF0IjoxNzU3NDMyNDgxLCJleHAiOjI2MjEzNDYwODEsInJvbGVzIjpbXSwiZXh0cmEiOnsiY2hlY2tlZCI6dHJ1ZX19.dHfLiPbWiLKdu5NYvNPcXTnVWvaSq3XQsIzyj-v6bJ0',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api222',
            headers: {
                'token': token,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
