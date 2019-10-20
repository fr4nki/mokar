const express = require('express');
const fs = require('fs');
const path = require('path');

const { getStructure } = require('./utils/readFiles');
const { paths } = require('./mokar');

const app = express();
const files = getStructure(path.resolve(__dirname), paths);
