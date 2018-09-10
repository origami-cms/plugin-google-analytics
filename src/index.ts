import {error, Route} from 'origami-core-lib';
import Server from 'origami-core-server';

export interface GAPluginOptions {
    trackingID: string;
}

module.exports = (server: Server, options: GAPluginOptions) => {
    if (!options.trackingID) {
        return error('GoogleAnalyticsPlugin', 'No \'trackingID\' option provided');
    }
    if (typeof options.trackingID !== 'string') {
        return error('GoogleAnalyticsPlugin', '\'trackingID\' option is not a string');
    }
    if (!/\w{2}-\d+-\d/.test(options.trackingID)) {
        return error('GoogleAnalyticsPlugin', '\'trackingID\' is not the right format for GA tracking ID');
    }

    const template = `
        <!-- Google Analytics -->
        <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', '${options.trackingID}', 'auto');
        ga('send', 'pageview');
        </script>
        <!-- End Google Analytics -->
    </head>`;

    const r = new Route('*');
    r
        .position('pre-send')
        .get((req, res, next) => {
            if (res.headersSent || !res.body) return;

            if (
                // Starts with <! doctype
                res.body.match(/^\s*<\s*\!(DOCTYPE|doctype)\s+/gm) ||
                // Starts with <html
                res.body.match(/^\s*<\s*(html|HTML)\s+/gm)
            ) {
                // Replaces </head> with GA code + </head>
                res.body = res.body.replace(/<\/head>/gm, template);
            }
            next();
        });

    server.useRouter(r);
};
