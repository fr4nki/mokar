# mokar

## config
```js
{
    "port": 9000, 
    "delay": 50,
    //"followSymlinks": false,
    //"persistResponse": false,
    //"useExtensions": false,
    "mocks": [
        {
            "path": "relative/path/to/mockfiles",
            "prefix": "/api/v1/",
        },
        {
            "path": "/my/absolute/path",
            "prefix": "",
        },
        {
            "path": "./another/one/relative/path",
        }
    ],
}
```

- у cli приоритет перед конфигом
- конфиг собирается следующим образом: сначала берется файл .mokarrc, потом раздел "mokar" в package.json, затем cli. 

+path/images/ololosh.png == [ALL]path/images/ololosh.png
+[GET]path/to/request.json
+[POST]path/{number}/request.json
+[GET]path/to/request&some=type.json

+{number},
+{any},
+{string},
+{number#4},
+{string#5-10},
{[0-9]+}


help
run

