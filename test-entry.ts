import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as chaiAsPromised from 'chai-as-promised';
import * as path from 'path';

chai.use(chaiAsPromised);
chai.use(chaiHttp)

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

require('dotenv').config({ path: path.join(__dirname, './.env') });
