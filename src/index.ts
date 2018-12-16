// tslint:disable no-default-export match-export-name export-name
import { error, Route, Server } from '@origami/core';

export interface GAPluginOptions {
  trackingID: string;
}

export default (server: Server, options: GAPluginOptions) => {
  if (!options.trackingID) {
    error('GoogleAnalyticsPlugin', 'No \'trackingID\' option provided');
    return;
  }

  if (typeof options.trackingID !== 'string') {
    error('GoogleAnalyticsPlugin', '\'trackingID\' option is not a string');
    return;
  }

  if (!/\w{2}-\d+-\d/.test(options.trackingID)) {
    error(
      'GoogleAnalyticsPlugin',
      '\'trackingID\' is not the right format for GA tracking ID'
    );
    return;
  }

  const template = `
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=${options.trackingID}"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${options.trackingID}');
        </script>
    </head>`;

  const r = new Route('*');
  r.position('pre-send').get((req, res, next) => {

    if (res.headersSent || !res.locals.content.hasContent) {
      next();
      return;
    }
    const content = res.locals.content.get();

    if (typeof content !== 'string') {
      next();
      return;
    }

    if (
      // Starts with <! doctype
      content.match(/^\s*<\s*\!(DOCTYPE|doctype)\s+/gm) ||
      // Starts with <html
      content.match(/^\s*<\s*(html|HTML)\s+/gm)
    ) {
      // Replaces </head> with GA code + </head>
      res.locals.content.override(content.replace(/<\/head>/gm, template));
    }

    next();
  });

  server.useRouter(r);
};
