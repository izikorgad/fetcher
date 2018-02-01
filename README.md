
rest-fetcher
============

A simple rest API fetcher module.

## Install
```sh
$ npm install rest-fetcher --save
```

## Usage
```javascript
import { Fetcher } from 'rest-fetcher';
const fetcher = new Fetcher('http://<your_server_url>');
fetcher.get('/some/api/path')
```