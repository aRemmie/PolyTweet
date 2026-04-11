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
  InternalFeaturesPostsTransportHttpCreatePostDTO,
  InternalFeaturesPostsTransportHttpCreatePostDTOResponse,
  InternalFeaturesPostsTransportHttpDeletePostDTOResponse,
  InternalFeaturesPostsTransportHttpGetLastWeekPostsDTOResponse,
  InternalFeaturesPostsTransportHttpGetPostByIdDTOResponse,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Posts<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Ищет посты за последние 7 дней с поддержкой пагинации через параметры page и pageSize.
   *
   * @tags Posts
   * @name GetPosts
   * @summary Поиск постов за последние 7 дней
   * @request GET:/posts/all
   */
  getPosts = (
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
      InternalFeaturesPostsTransportHttpGetLastWeekPostsDTOResponse,
      | GithubComTryingmyb3StPolyTweetInternalCoreDomainCustomError
      | GithubComTryingmyb3StPolyTweetInternalCoreDomainInternalError
    >({
      path: `/posts/all`,
      method: "GET",
      query: query,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Создает пост длиной <= 280 символов
   *
   * @tags Posts
   * @name CreateCreate
   * @summary Создание поста
   * @request POST:/posts/create
   */
  createCreate = (
    request: InternalFeaturesPostsTransportHttpCreatePostDTO,
    params: RequestParams = {},
  ) =>
    this.request<
      InternalFeaturesPostsTransportHttpCreatePostDTOResponse,
      | GithubComTryingmyb3StPolyTweetInternalCoreDomainCustomError
      | GithubComTryingmyb3StPolyTweetInternalCoreDomainInternalError
    >({
      path: `/posts/create`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Ищет пост по ID
   *
   * @tags Posts
   * @name PostsDetail
   * @summary Поиск поста по ID
   * @request GET:/posts/{PostId}
   */
  postsDetail = (postId: string, params: RequestParams = {}) =>
    this.request<
      InternalFeaturesPostsTransportHttpGetPostByIdDTOResponse,
      | GithubComTryingmyb3StPolyTweetInternalCoreDomainCustomError
      | GithubComTryingmyb3StPolyTweetInternalCoreDomainInternalError
    >({
      path: `/posts/${postId}`,
      method: "GET",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Удаляет пост, если запрос на удаление исходит от автора поста
   *
   * @tags Posts
   * @name DeleteDelete
   * @summary Удаление поста
   * @request DELETE:/posts/{PostId}/delete
   */
  deleteDelete = (postId: string, params: RequestParams = {}) =>
    this.request<
      InternalFeaturesPostsTransportHttpDeletePostDTOResponse,
      | GithubComTryingmyb3StPolyTweetInternalCoreDomainCustomError
      | GithubComTryingmyb3StPolyTweetInternalCoreDomainInternalError
    >({
      path: `/posts/${postId}/delete`,
      method: "DELETE",
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
