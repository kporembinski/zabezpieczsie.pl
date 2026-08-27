import { component$, useStyles$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";

import tailwind from './styles/tailwind.css?inline';

import "./styles/global.css";

export default component$(() => {

  useStyles$(tailwind);
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <script
          dangerouslySetInnerHTML={`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KS8CB3C3');`}
        />
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body lang="pl" data-theme="dark" class="flex flex-col justify-between min-h-screen max-w-full overflow-x-hidden">
        <noscript dangerouslySetInnerHTML={`<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KS8CB3C3"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`}
        />
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
