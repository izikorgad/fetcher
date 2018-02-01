
rest-fetcher
============

A simple REST API fetcher module.

## Install
```sh
$ npm install rest-fetcher --save
```

## Usage
```javascript
import Fetcher from 'rest-fetcher';
const fetcher = new Fetcher('http://<your_server_url>');

//For get requests
const response = await fetcher.get('/some/api/path', args);


// For post requests
 response = await fetcher.post('/some/api/path', args);

 // Fethcer module has a built-in client-side timeout (set to 1 minute by default)
 // You can set your own default by sending a second parameter to the constructor:
 const fetcher = new Fetcher('http://<your_server_url>', 12000);

 // Furthetrmore, you can overwite the default timeout on a psecific API call:
 response = await fetcher.post('/some/api/path', args, 300000);


```