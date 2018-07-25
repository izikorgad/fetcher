
rest-fetcher
============

[![npm version](https://img.shields.io/npm/v/rest-fetcher.svg?style=flat-square)](https://www.npmjs.com/package/rest-fetcher)
[![npm downloads](https://img.shields.io/npm/dm/rest-fetcher.svg?style=flat-square)](https://www.npmjs.com/package/rest-fetcher)

A simple REST API fetcher module.

## Install

```sh
$ npm install rest-fetcher --save
```

## Features

- Lightweight REST API module (based on node-fetch).
- Built-in client-side timeout.
- Error handling.

## Usage
```javascript
import { Fetcher } from 'rest-fetcher';
const config = {baseUrl: 'http://<your_server_url>'};
const fetcher = new Fetcher(config);


// For GET requests
// args are optional parameter.
const response = await fetcher.get('/some/api/path', args);

// For POST requests
 response = await fetcher.post('/some/api/path', args);

 // For PUT requests
 response = await fetcher.put('/some/api/path', args);

 // For PATCH requests
 response = await fetcher.patch('/some/api/path', args);

 // For DELETE requests
 response = await fetcher.delete('/some/api/path', args);


 // Fetcher module has a built-in client-side timeout (set to 1 minute by default)
 // You can set your own default by sending a second parameter to the constructor:
 const config = {baseUrl: 'http://<your_server_url>', defaultTimeout: 12000};
 const fetcher = new Fetcher(config);

 // Furthermore, you can overwrite the default timeout on a specific API call:
 response = await fetcher.post('/some/api/path', args, 300000);


```

## Headers Support
```javascript
import { Fetcher } from 'rest-fetcher';

// You can assign default headers (optional) that will be sent upon each request
const config = {
        baseUrl: 'http://<your_server_url>',
        defaultHeaders: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      };

const fetcher = new Fetcher(config);


// Or send headers for a specific request (in this case those headers will be added to the default).
const response = await fetcher.get('/some/api/path', args, headers);


```

## Credentials Mode Support
```javascript
import { Fetcher } from 'rest-fetcher';

// You can set credentials mode (optional) that will be sent upon each request
const config = {
        baseUrl: 'http://<your_server_url>',
        credentialsMode: "include" // | "same-origin" | "omit"
      };

const fetcher = new Fetcher(config);

```