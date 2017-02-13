'use strict';

const NmrPredictor = require('..');
const fs = require('fs');

const db1H = JSON.parse(fs.readFileSync(__dirname + '/../data/h1.json').toString());
const db13C = JSON.parse(fs.readFileSync(__dirname + '/../data/nmrshiftdb2.json').toString());



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

describe('Spinus prediction', function () {
    this.timeout(10000);
    it('1H chemical shift prediction expanded', function (done) {
            var predictor = new NmrPredictor('spinus');
            predictor.spinus(molfile).then(prediction => {
                prediction.length.should.eql(10);
                done();
            }).catch(reason => {return new Error(reason)});
    });
    it('1H chemical shift prediction grouped', function (done) {
        var predictor = new NmrPredictor('spinus');
        predictor.spinus(molfile, {group: true}).then(prediction => {
            prediction.length.should.eql(5);
            done()
        }).catch(reason => {return new Error(reason)});
    });
});


describe('HOSE assignment prediction', function () {
    it('1H chemical shift prediction expanded', function (done) {
        var predictor = new NmrPredictor({'H': db1H});
        predictor.proton(molfile).then(prediction => {
            prediction.length.should.eql(10);
            done();
        }).catch(reason => {return new Error(reason)});
    });

    it('1H chemical shift prediction grouped', function (done) {
        var predictor = new NmrPredictor({'H': db1H});
        predictor.proton(molfile, {group:true}).then(prediction => {
            prediction.length.should.eql(5);
            done();
        }).catch(reason => {return new Error(reason)});
    });

    it('13C chemical shift prediction expanded', function (done) {
        var predictor = new NmrPredictor({'C': db13C});
        predictor.carbon(molfile).then(prediction => {
            prediction.length.should.eql(8);
            done();
        }).catch(reason => {return new Error(reason)});
    });

    it('13C chemical shift prediction grouped', function (done) {
        var predictor = new NmrPredictor({'C': db13C});
        predictor.carbon(molfile, {group:true}).then(prediction => {
            prediction.length.should.eql(6);
            done();
        }).catch(reason => {return new Error(reason)});
    });
});