
rest-fetcher
============

[![npm stable version][npm-image]][npm-url]
[![npm next version][npm-next-image]][npm-url]

A simple REST API fetcher module.

## Install

```sh
$ npm install rest-fetcher --save
```

## Features

- Lightway REST API module (based on node-fetch).
- Built-in client-side timeout.
- Error handling.

## Usage
```javascript
import Fetcher from 'rest-fetcher';
const fetcher = new Fetcher('http://<your_server_url>');


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


 // Fethcer module has a built-in client-side timeout (set to 1 minute by default)
 // You can set your own default by sending a second parameter to the constructor:
 const fetcher = new Fetcher('http://<your_server_url>', 12000);

 // Furthetrmore, you can overwite the default timeout on a psecific API call:
 response = await fetcher.post('/some/api/path', args, 300000);


```