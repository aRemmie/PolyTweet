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
  InternalFeaturesAuthTransportHttpLoginDTO,
  InternalFeaturesAuthTransportHttpLoginDTOResponse,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Login<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Авторизует пользователя по email и паролю, возвращает JWT. Для авторизации в рамках теста - /dummyLogin.
   *
   * @tags Auth
   * @name LoginCreate
   * @summary Авторизация по email и паролю
   * @request POST:/login
   */
  loginCreate = (
    request: InternalFeaturesAuthTransportHttpLoginDTO,
    params: RequestParams = {},
  ) =>
    this.request<
      InternalFeaturesAuthTransportHttpLoginDTOResponse,
      | GithubComTryingmyb3StPolyTweetInternalCoreDomainCustomError
      | GithubComTryingmyb3StPolyTweetInternalCoreDomainInternalError
    >({
      path: `/login`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
