
REST-FETCHER
A simple rest API fetcher module.

Installation
  $ [sudo] npm install rest-fetcher --save

Usage
import { Fetcher } from 'rest-fetcher';
const fetcher = new Fetcher('http://<your_server_url>');
fetcher.get('/some/api/path')