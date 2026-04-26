/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
    GithubComTryingmyb3StPolyTweetInternalCoreDomainCustomError,
    GithubComTryingmyb3StPolyTweetInternalCoreDomainInternalError,
    InternalFeaturesAuthTransportHttpProfileResponse,
    InternalFeaturesPostsTransportHttpGetPostByIdDTOResponse,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Users<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
    /**
     * @description Ищет посты пользователя по ID с поддержкой пагинации через параметры page и pageSize.
     *
     * @tags Posts
     * @name PostsList
     * @summary Поиск постов пользователя
     * @request GET:/users/{UserId}/posts
     */
    postsList = (
        userId: string,
        query?: {
            /**
             * Номер страницы
             * @min 1
             * @default 1
             */
            page?: number;
            /**
             * Размер страницы
             * @min 1
             * @max 30
             * @default 15
             */
            page_size?: number;
        },
        params: RequestParams = {},
    ) =>
        this.request<
            InternalFeaturesPostsTransportHttpGetPostByIdDTOResponse,
            | GithubComTryingmyb3StPolyTweetInternalCoreDomainCustomError
            | GithubComTryingmyb3StPolyTweetInternalCoreDomainInternalError
        >({
            path: `/users/${userId}/posts`,
            method: 'GET',
            query: query,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * @description Получить профиль пользователя с постами по id пользователя
     *
     * @tags Profile
     * @name ProfileList
     * @summary Получить профиль пользователя
     * @request GET:/users/{UserId}/profile
     */
    profileList = (userId: string, params: RequestParams = {}) =>
        this.request<
            InternalFeaturesAuthTransportHttpProfileResponse,
            | GithubComTryingmyb3StPolyTweetInternalCoreDomainCustomError
            | GithubComTryingmyb3StPolyTweetInternalCoreDomainInternalError
        >({
            path: `/users/${userId}/profile`,
            method: 'GET',
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
}
