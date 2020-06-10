# Mokar
It's a simple lightweight and zero-dependency mock server which provide 
mapping between mock server endpoints and your file tree.  

## Installation

`yarn add mokar` or `npm install mokar`

## Usage

- Read about configuration below
- Create Mokar config in `package.json` or make `.mokarrc` file in root of your project
- `npx mokar run` or add script in `package.json` script section and run via `mokar run`  

## CLI 

Mokar provide two cli actions - `help` and `run`.

- `help` or just `mokar`. Help with descriptions of all actions.

- `run`. Run Mokar with passed cli parameters and read `package.json` and `.mokarrc` to make config.
    
    All of cli arguments can be set in config. List of available arguments:
    
     `-d` or `--delay`
     
     `-p` or `--port`
     
     `-m` or `--mocks`
     
     `-se` or `--saveextension`
     
     `-h` or `--help` 

## Configuration
Mokar read configuration from CLI or from package.json or from '.mokarrc' config 
file which should be stored at root of the project. Whenever would be used default 
configuration. 

Configs reading priority: 
1. CLI
2. .mokarrc 
3. package.json.
  
Default config: 
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

- **`port`** Number. Default `9000`.
    Port to start server from,

- **`delay`** Number. Default `50`.
    Delay in milliseconds between request and response,

- **`saveExtension`**. Boolean. Default `false`.
    Endpoints creates with extesions of the files.
    
    Example: map file `/mocks/foo.json` to endpoint `localhost:9000/foo`. If passed `true` 
    endpoint will be `localhost:9000/foo.json`.

- **`mocks`**. Array. Default `[ { "path": "mocks", "prefix": "/' } ]`.

    That means Mokar read file tree from from passed path (`mocks`) and map to `/` 
    endpoints. 
    
    Example: `mocks` directory contains two json files (a.json, b.json) and one jpeg (c.jpg).
    Mokar make three endpoints localhost:9000/a, localhost:9000/b, localhost:9000/c.    

## File naming in mocks directories

Every file in directory which provided like mock separate on three part.

- **Method**

    If filename starts with `[GET]`, `[POST]`, `[PUT]`, `[PATCH]`, `[DELETE]` or 
    `[HEAD]` it means that file will be served only by this method. Also available 
    `[ALL]` - serves any type of reqests. If method not passed, endpoint will serves 
    with any type of requests.   

- **Mime-type**

    Mime-type detect depends on file extension. So if file is json, response header - application/json.
    List of supported file types: json, png, jpeg, jpg, gif, svg, txt, html, js, css, mpeg, mp3, wav, ogg, mp4.

- **Variable part** 

    Variable part of endpoint setting by `{}`. There can be set type and length. 
    Types are number, string, any. Length is setting inside of curly braces and separated
    from type by `#`.   

- **Name**

    Name of file except method or variable part will be and endpoint. 

## Examples

```
root of the project
    └ mocks
        ├ foo
        │   ├ a.json
        │   └ [POST]b?id={number#5,10}.json
        │   └ b?id={string#1,3}.json           
        └ bar.jpeg
```

In this case Mokar will generate 4 endpoints:
`/foo/a`,
`/foo/b?id={number#5,10}.json`,
`/foo/b?id={string#1,3}.json`,
`/bar.jpeg`,

`/foo/b?id={number#5,10}.json` - working only with POST requests and only if id is number with length from 5 to 10.
    So if to curl `/foo/b?id=12345` with method POST, Mokar return in response content of this file.
 
`/foo/b?id={string#1,3}.json` - same as example upper, but id query parameters should be string with length from 1 to 3.
 
 
## Feature plans
- Redis support to store all of files content in memory
- JSON templates
- Persist response with JSON Templates
- Working with openAPI
