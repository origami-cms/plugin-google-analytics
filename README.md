# Origami: Google Analytics Plugin

This plugin automatically injects [Google Analytics code](https://developers.google.com/analytics/devguides/collection/analyticsjs/) into any HTML template served from Origami.

## Installation

```bash
yarn add origami-plugin-google-analytics
```

## Usage

In your `.origami` file, add it to the plugins:
`.origami`

```json
{
    ...
    "plugins": {
        "google-analytics": {
            "trackingID": "UA-123456-7"
        }
    }
    ...
}
```

## Limitations

Currently, any HTML page served from `server.static()` or any streams (`res.send()`) will not include the injected code.

## Moving forward / TODO

- [ ] Add testing

## Issues

If you find a bug, please file an issue on the issue tracker on GitHub.

## Contributions

All pull requests and contributions are most welcome. Let's make the internet better!
