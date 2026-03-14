/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/adicionar-jogo`; params?: Router.UnknownInputParams; } | { pathname: `/calendario`; params?: Router.UnknownInputParams; } | { pathname: `/classificacao`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/resultado`; params?: Router.UnknownInputParams; } | { pathname: `/times`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/adicionar-jogo`; params?: Router.UnknownOutputParams; } | { pathname: `/calendario`; params?: Router.UnknownOutputParams; } | { pathname: `/classificacao`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/resultado`; params?: Router.UnknownOutputParams; } | { pathname: `/times`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/adicionar-jogo${`?${string}` | `#${string}` | ''}` | `/calendario${`?${string}` | `#${string}` | ''}` | `/classificacao${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/resultado${`?${string}` | `#${string}` | ''}` | `/times${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/adicionar-jogo`; params?: Router.UnknownInputParams; } | { pathname: `/calendario`; params?: Router.UnknownInputParams; } | { pathname: `/classificacao`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/resultado`; params?: Router.UnknownInputParams; } | { pathname: `/times`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; };
    }
  }
}
