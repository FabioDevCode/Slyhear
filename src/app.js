import * as path from "node:path";
import consoleStamp from "console-stamp";
import cookieParser from "cookie-parser";
import cors from "cors";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import express from "express";
import i18n from "i18n";
import morgan from "morgan";
import split from "split";

dayjs.extend(utc);
dayjs.extend(timezone);

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//- CONSOLE WRITE ------//
const morgan_config = {
    skip: req => {
        if(req.url == '/') {
            return true
        }
    },
    stream: split().on('data', line => {
        process.stdout.write(`[${dayjs().tz('Europe/Paris').format('YYYY-MM-DD HH:mm:ss-SSS')}] ${line} \n`)
    })
}

app.use(morgan('dev', morgan_config))

consoleStamp(console, {
    formatter: function() {
        return dayjs().tz('Europe/Paris').format('YYYY-MM-DD HH:mm:ss-SSS');
    },
    label: false,
    datePrefix: '',
    dateSuffix: ''
})

app.use(cors());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//- TEMPLATE ENGINE ------------------------ //
import { create } from 'express-handlebars';
import hbs_fn from './helpers/hbs_fn.js';

const hbs = create({
    defaultLayout: 'main_layout', // layout or false
    layoutsDir: __dirname + '/views/layouts', // layout folder name
    partialsDir: __dirname + '/views/partials', // partials folder name
    extname: '.hbs',
    helpers: hbs_fn // handlebars helpers
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', [__dirname + '/views/pages']);







