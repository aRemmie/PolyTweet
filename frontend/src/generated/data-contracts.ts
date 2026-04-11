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

export interface GithubComTryingmyb3StPolyTweetInternalCoreDomainCustomError {
  code?:
    | "INVALID_REQUEST"
    | " INTERNAL_ERROR"
    | " SCHEDULE_EXISTS"
    | " SLOT_ALREADY_BOOKED"
    | " FORBIDEN"
    | " NOT_FOUND";
  /** @example "invalid request" */
  message?: string;
}

export interface GithubComTryingmyb3StPolyTweetInternalCoreDomainInternalError {
  code?: "INTERNAL_ERROR";
  /** @example "internal server error" */
  message?: string;
}

export interface GithubComTryingmyb3StPolyTweetInternalCoreDomainPagination {
  page?: number;
  page_size?: number;
  total?: number;
  total_pages?: number;
}

export interface GithubComTryingmyb3StPolyTweetInternalCoreDomainPost {
  /**
   * @minLength 1
   * @maxLength 280
   */
  content: string;
  created_at?: string;
  id: string;
  image_url?: string;
  parent_id?: string;
  reply_to?: string;
  user_id: string;
}

export interface InternalFeaturesAuthTransportHttpDummyLoginDTO {
  /** @example "user" */
  role?: string;
}

export interface InternalFeaturesAuthTransportHttpDummyLoginDTOResponse {
  token?: string;
}

export interface InternalFeaturesAuthTransportHttpLoginDTO {
  /** @example "useremail@gmail.com" */
  email?: string;
  /** @example "supersecretpass" */
  password?: string;
}

export interface InternalFeaturesAuthTransportHttpLoginDTOResponse {
  token?: string;
}

export interface InternalFeaturesAuthTransportHttpRegisterDTO {
  /** @example "useremail@gmail.com" */
  email?: string;
  /** @example "supersecretpass" */
  password?: string;
  /** @example "admin" */
  role?: string;
}

export interface InternalFeaturesAuthTransportHttpRegisterDTOResponse {
  /** @example "3fa85f64-5717-4562-b3fc-2c963f66afa6" */
  id?: string;
  /** @example "useremail@gmail.com" */
  email?: string;
  password?: string;
  /** @example "admin" */
  role?: string;
  /** @example "2026-03-25T12:00:41.267Z" */
  createdAt?: string;
}

export interface InternalFeaturesPostsTransportHttpCreatePostDTO {
  /** @example "Hello, world!" */
  content?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  parent_id?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  reply_to?: string;
  /** @example "https://example.com/image.jpg" */
  image_url?: string;
}

export interface InternalFeaturesPostsTransportHttpCreatePostDTOResponse {
  /** @example "3fa85f64-5717-4562-b3fc-2c963f66afa6" */
  id?: string;
  /** @example "3fa85f64-5717-4562-b3fc-2c963f66afa6" */
  user_id?: string;
  /** @example "Hello, world!" */
  content?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  parent_id?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  reply_to?: string;
  /** @example "https://example.com/image.jpg" */
  image_url?: string;
  /** @example "2026-03-25T12:00:41.267Z" */
  created_at?: string;
}

export interface InternalFeaturesPostsTransportHttpDeletePostDTOResponse {
  message?: string;
  post_id?: string;
}

export interface InternalFeaturesPostsTransportHttpGetLastWeekPostsDTOResponse {
  pagination?: GithubComTryingmyb3StPolyTweetInternalCoreDomainPagination;
  posts?: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost[];
}

export interface InternalFeaturesPostsTransportHttpGetPostByIdDTOResponse {
  /** @example "3fa85f64-5717-4562-b3fc-2c963f66afa6" */
  id?: string;
  /** @example "3fa85f64-5717-4562-b3fc-2c963f66afa6" */
  user_id?: string;
  /** @example "Hello, world!" */
  content?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  parent_id?: string;
  /** @example "123e4567-e89b-12d3-a456-426614174000" */
  reply_to?: string;
  /** @example "https://example.com/image.jpg" */
  image_url?: string;
  /** @example "2026-03-25T12:00:41.267Z" */
  created_at?: string;
}
