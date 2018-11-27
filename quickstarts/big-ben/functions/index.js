/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors')({origin: true});
const app = express();

app.use(cors);

// This endpoint provides displays the index page.
app.get('/', (req, res) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr;
  res.set('Cache-Control', `public, max-age=${secondsLeftBeforeEndOfHour(date)}`);
  res.send(`
  <!doctype html>
    <head>
      <title>Time</title>
      <link rel="stylesheet" href="/style.css">
      <script src="/script.js"></script>
    </head>
    <body>
      <p>In London, the clock strikes: <span id="bongs">${'BONG '.repeat(hours)}</span></p>
      <button onClick="refresh(this)">Refresh</button>
    </body>
  </html>`);
});

// This endpoint is the BONG API.
app.get('/api', (req, res) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr;
  res.set('Cache-Control', `public, max-age=${secondsLeftBeforeEndOfHour(date)}`);
  res.send('BONG '.repeat(hours));
});

// Returns the number of seconds left before the next hour starts.
function secondsLeftBeforeEndOfHour(date) {
  const m = date.getMinutes();
  const s = date.getSeconds();
  return 3600 - (m*60) - s;
}

// 
exports.app = functions.https.onRequest(app);
