# Mokar
Mokar a simple, lightweight, and zero-dependency mock tool for prototyping and development. It provides a mapping between mock endpoints and your file tree.

## Installation

`yarn add mokar` or `npm install mokar`

## Usage

- Read about the configuration below
- Create Mokar config in `package.json` or make `.mokarrc` file in the root of your project
- `npx mokar run` or add a script in `package.json` script section and run via `mokar run`

## CLI

Mokar provides two CLI actions - `help` and `run`.

- `help` or just `mokar`. It shows a list of all commands with description.

- `run`. Run Mokar with passed CLI parameters and read `package.json` and `.mokarrc` to make config.

    List of available arguments:

    `-d` or `--delay`

    `-p` or `--port`

    `-m` or `--mocks`

    `-se` or `--saveextension`

    `-h` or `--help`

## Configuration
Mokar read configuration from CLI or `package.json` or `.mokarrc`.

Configs reading priority:
1. CLI
2. .mokarrc
3. package.json.

Config example:
```js
{
    "port": 9000,
    "delay": 50,
    "saveExtensions": false,
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

- **`port`** Type _Number_. Default `9000`.

    Port to start a server from,

- **`delay`** Type _Number_. Default `50`.

    Delay in milliseconds between request and response,

- **`saveExtension`**. Type _Boolean_. Default `false`.

    Should be endpoints created with extensions or not.

    Example: map file `/mocks/foo.json` to endpoint `localhost:9000/foo`. If passed `true` endpoint will be `localhost:9000/foo.json`.

- **`mocks`**. Type _Array_. Default `[ { "path": "mocks", "prefix": "/' } ]`.

    That means Mokar read the file tree from the passed path (`mocks`) and map to `/` endpoints.

    Example: `mocks` directory contains two json files (a.json, b.json) and one jpeg (c.jpg). Mokar make three endpoints localhost:9000/a, localhost:9000/b, localhost:9000/c.

## File naming in mocks directories

Each file in the directories will be separated into three parts:

- **Method**

    If a filename starts with `[GET]`, `[POST]`, `[PUT]`, `[PATCH]`, `[DELETE]` or `[HEAD]` it means that file will be served only by this method. Also available `[ALL]` - serves any request. If the method is not passed, the endpoint will serve with any request types - same as `[ALL]`.

- **Mime-type**

    Mime-type depends on the file extension. So if the file is JSON, the response header will be application/json. List of supported file types: json, png, jpeg, jpg, gif, svg, txt, html, js, css, mpeg, mp3, wav, ogg, mp4.

- **Variable part**

    Variable part of the endpoint is setting by `{}`. There can be set type and length. Types can be `number`, `string` or `any`. Length is setting inside of curly braces and separated from type by `#`.

- **Name**

    Endpoint will be created as a result of extract mime-type, variable part, and method from filename.

## Examples

```
root of the project
    └ mocks
        ├ foo
        │   ├ a.json
        │   ├ [POST]b?id={number#5,10}.json
        │   └ b?id={string#1,3}.json
        └ bar.jpeg
```

In this case Mokar will generate 4 endpoints:
`/foo/a`,
`/foo/b?id={number#5,10}.json`,
`/foo/b?id={string#1,3}.json`,
`/bar.jpeg`,

`/foo/b?id={number#5,10}.json` - content of this file will be returned only to POST requests and only if `id` is a number with length from 5 to 10. So if to Curl `/foo/b?id=12345` with method POST, Mokar return content of this file.

`/foo/b?id={string#1,3}.json` - same as example above, but `id` query parameter should be string with length from 1 to 3.


## Feature plans
- Store mock data in memory to prevent reading files on each request,
- JSON files with variables,
- User defined JS handlers,
- Supporting OpenAPI.
