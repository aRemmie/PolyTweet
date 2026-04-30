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
    InternalFeaturesAuthTransportHttpUpdateProfileRequest,
    InternalFeaturesAuthTransportHttpUpdateProfileResp,
    InternalFeaturesAuthTransportHttpUploadAvatarResponse,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Profile<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
    /**
     * @description Загрузить аватарку в SeaweedFS и обновить профиль пользователя
     *
     * @tags Profile
     * @name AvatarCreate
     * @summary Загрузить аватарку пользотвалея
     * @request POST:/profile/avatar
     */
    avatarCreate = (
        data: {
            /** Файл аватарки */
            file: File;
        },
        params: RequestParams = {},
    ) =>
        this.request<
            InternalFeaturesAuthTransportHttpUploadAvatarResponse,
            | GithubComTryingmyb3StPolyTweetInternalCoreDomainCustomError
            | GithubComTryingmyb3StPolyTweetInternalCoreDomainInternalError
        >({
            path: `/profile/avatar`,
            method: 'POST',
            body: data,
            type: ContentType.FormData,
            format: 'json',
            ...params,
        });
    /**
     * @description Обновить профиль пользователя (аватарка и о себе)
     *
     * @tags Profile
     * @name UpdateUpdate
     * @summary Обновить профиль пользователя
     * @request PUT:/profile/update
     */
    updateUpdate = (
        request: InternalFeaturesAuthTransportHttpUpdateProfileRequest,
        params: RequestParams = {},
    ) =>
        this.request<
            InternalFeaturesAuthTransportHttpUpdateProfileResp,
            | GithubComTryingmyb3StPolyTweetInternalCoreDomainCustomError
            | GithubComTryingmyb3StPolyTweetInternalCoreDomainInternalError
        >({
            path: `/profile/update`,
            method: 'PUT',
            body: request,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
}
