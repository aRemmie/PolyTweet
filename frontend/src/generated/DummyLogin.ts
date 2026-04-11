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
  InternalFeaturesAuthTransportHttpDummyLoginDTO,
  InternalFeaturesAuthTransportHttpDummyLoginDTOResponse,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class DummyLogin<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Выдаёт тестовый JWT для указанной роли (admin / user). Для каждой роли возвращается фиксированный UUID пользователя: один и тот же UUID для всех запросов с ролью admin и один и тот же UUID для роли user.
   *
   * @tags Auth
   * @name DummyLoginCreate
   * @summary Получить тестовый JWT по роли
   * @request POST:/dummyLogin
   */
  dummyLoginCreate = (
    request: InternalFeaturesAuthTransportHttpDummyLoginDTO,
    params: RequestParams = {},
  ) =>
    this.request<
      InternalFeaturesAuthTransportHttpDummyLoginDTOResponse,
      | GithubComTryingmyb3StPolyTweetInternalCoreDomainCustomError
      | GithubComTryingmyb3StPolyTweetInternalCoreDomainInternalError
    >({
      path: `/dummyLogin`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
