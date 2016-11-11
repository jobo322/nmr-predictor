'use strict';

const NmrPredictor = require('..');
const request = require('request');
const fs = require('fs');

const db = JSON.parse(fs.readFileSync(__dirname + "/h1_database.json").toString());


const molfile = `Benzene, ethyl-, ID: C100414
  NIST    16081116462D 1   1.00000     0.00000
Copyright by the U.S. Sec. Commerce on behalf of U.S.A. All rights reserved.
  8  8  0     0  0              1 V2000
    0.5015    0.0000    0.0000 C   0  0  0  0  0  0           0  0  0
    0.0000    0.8526    0.0000 C   0  0  0  0  0  0           0  0  0
    1.5046    0.0000    0.0000 C   0  0  0  0  0  0           0  0  0
    2.0062    0.8526    0.0000 C   0  0  0  0  0  0           0  0  0
    3.0092    0.8526    0.0000 C   0  0  0  0  0  0           0  0  0
    1.5046    1.7554    0.0000 C   0  0  0  0  0  0           0  0  0
    0.5015    1.7052    0.0000 C   0  0  0  0  0  0           0  0  0
    3.5108    0.0000    0.0000 C   0  0  0  0  0  0           0  0  0
  1  2  2  0     0  0
  3  1  1  0     0  0
  2  7  1  0     0  0
  4  3  2  0     0  0
  4  5  1  0     0  0
  6  4  1  0     0  0
  5  8  1  0     0  0
  7  6  2  0     0  0
M  END
`;

const body = `9	1	7.260	4	14	6	3.507	15	7	0.000	10	2	7.718	11	3	7.758
10	2	7.196	4	9	1	7.718	11	3	1.292	14	6	1.293	15	7	7.718
11	3	7.162	4	9	1	7.758	10	2	1.292	15	7	3.524	14	6	0.000
12	5	2.653	3	16	8	7.392	17	8	7.392	18	8	7.392
13	5	2.653	3	16	8	7.392	17	8	7.392	18	8	7.392
14	6	7.162	4	9	1	3.507	10	2	1.293	11	3	0.000	15	7	7.758
15	7	7.260	4	9	1	0.000	10	2	7.718	11	3	3.524	14	6	7.758
16	8	0.992	2	12	5	7.392	13	5	7.392
17	8	0.992	2	12	5	7.392	13	5	7.392
18	8	0.992	2	12	5	7.392	13	5	7.392
`;

describe('Spinus prediction', function () {
    it('1H chemical shift prediction expanded', function () {
        //request.post("http://www.nmrdb.org/service/predictor", {form: {molfile: molfile}}, function (error, response, body) {
            var predictor = new NmrPredictor("spinus");
            var prediction = predictor.predict(molfile, body);
            prediction.length.should.eql(10);
            //console.log("Spinus prediction ");
            //console.log(JSON.stringify(prediction));
        //});
    });
    it('1H chemical shift prediction grouped', function () {
        //request.post("http://www.nmrdb.org/service/predictor", {form: {molfile: molfile}}, function (error, response, body) {
        var predictor = new NmrPredictor("spinus");
        var prediction = predictor.predict(molfile, body, {group:true});
        //console.log(JSON.stringify(prediction));

        prediction.length.should.eql(5);
        //console.log("Spinus prediction ");
        //console.log(JSON.stringify(prediction));
        //});
    });
});


describe('Ask Erno prediction', function () {
    it('1H chemical shift prediction expanded', function () {
        var predictor = new NmrPredictor(db);
        var prediction = predictor.predict(molfile);
        prediction.length.should.eql(10);
        //console.log("Ask Erno prediction ");
        //console.log(prediction);
    });

    it('1H chemical shift prediction grouped', function () {
        var predictor = new NmrPredictor(db);
        var prediction = predictor.predict(molfile, {group:true});
        prediction.length.should.eql(5);
        //console.log("Ask Erno prediction ");
        //console.log(prediction);
    });
});