'use strict'
/**
 * Created by acastillo on 7/5/16.
 */
const OCLE = require('openchemlib-extended');
const Matrix = require('ml-matrix');
const newArray = require('new-array');
const fetch = require('node-fetch');
const FormData = require('form-data');

const defaultOptions = {atomLabel:'H', ignoreLabile: true, use: 'median'};

class NmrPredictor {

    constructor(db) {
        this.db = db;
    }

    setDB(db) {
        this.db = db;
    }

    spinus(molfile, options) {
        var mol = molfile;
        if(typeof molfile === 'string') {
            mol = OCLE.Molecule.fromMolfile(molfile);
            mol.addImplicitHydrogens();
        }
        let opt = Object.assign({}, defaultOptions, options);

        return fromSpinus(mol, opt).then(prediction => {return group(prediction, opt)});
    }

    protonSync(molfile, options) {
        if(!this.db) {
            this.db = {"H": fetchDB("H")};
        }
        var mol = molfile;
        if(typeof molfile === 'string') {
            mol = OCLE.Molecule.fromMolfile(molfile);
            mol.addImplicitHydrogens();
        }
        let opt = Object.assign({}, defaultOptions, options, {atomLabel: "H"});

        return group(queryByHose(mol, this.db, opt), opt);
    }

    proton(molfile, options) {
        let result = this.protonSync(molfile, options);
        return new Promise(function(resolve, reject){
            resolve(result);
        });
    }

    carbonSync(molfile, options) {
        if(!this.db) {
            this.db = {"C": fetchDB("C")};
        }
        var mol = molfile;
        if(typeof molfile === 'string') {
            mol = OCLE.Molecule.fromMolfile(molfile);
            mol.addImplicitHydrogens();
        }
        let opt = Object.assign({}, defaultOptions, options, {atomLabel: "C"});

        return group(queryByHose(mol, this.db, opt), opt);
    }

    carbon(molfile, options) {
        let result = this.carbonSync(molfile, options);
        return new Promise(function(resolve, reject){
            resolve(result);
        });
    }

    twoD(dim1, dim2, molfile, opt) {
        var result = this.towDSync(dim1, dim2, molfile, opt);
        return new Promise(function(resolve, reject) {
            resolve(result);
        });
    }

    towDSync(dim1, dim2, molfile, opt) {
        let mol = molfile;
        let fromAtomLabel = '';
        let toAtomLabel = '';
        if(dim1 && dim1.length > 0) {
            fromAtomLabel = dim1[0].atomLabel;
        }
        if(dim2 && dim2.length > 0) {
            toAtomLabel = dim2[0].atomLabel;
        }

        let options = Object.assign({}, {minLength: 1, maxLength:3}, opt,
            {fromLabel: fromAtomLabel, toLabel: toAtomLabel});

        if(typeof molfile === 'string') {
            mol = OCLE.Molecule.fromMolfile(molfile);
            mol.addImplicitHydrogens();
        }
        let paths = mol.getAllPaths(options);

        let idMap1 = {};
        dim1.forEach(prediction => {
            idMap1[prediction["diaIDs"][0]] = prediction;
        });

        let idMap2 = {};
        dim2.forEach(prediction => {
            idMap2[prediction["diaIDs"][0]] = prediction;
        });


        paths.forEach(element => {
            element.fromChemicalShift = idMap1[element.fromDiaID].delta;
            element.toChemicalShift = idMap2[element.toDiaID].delta;
            element.fromAtomLabel = fromAtomLabel;
            element.toAtomLabel = toAtomLabel;
            //@TODO Add the coupling constants in any case!!!!!!
            element.j = getCouplingConstant(idMap1, element.fromDiaID, element.toDiaID);
        });

        return paths;
    }
}

function group(prediction, param) {
    if(param && param.group) {
        prediction.sort(function(a, b) {
            if(a.diaIDs[0] < b.diaIDs[0]) return -1;
            if(a.diaIDs[0] > b.diaIDs[0]) return 1;
            return 0;
        });
        for(var i = prediction.length - 2; i >= 0; i--){
            if(prediction[i].diaIDs[0] === prediction[i + 1].diaIDs[0]){
                prediction[i].integral += prediction[i + 1].integral;
                prediction[i].atomIDs = prediction[i].atomIDs.concat(prediction[i + 1].atomIDs);
                prediction.splice(i + 1, 1);
            }
        }
    }
    return prediction;
}

function getCouplingConstant(idMap, fromDiaID, toDiaID) {
    let j = idMap[fromDiaID].j;
    if(j) {
        let index = j.length - 1;
        while(index-- > 0) {
            if(j[index].diaID === toDiaID) {
                return j[index].coupling;
            }
        }
    }

    return 0;
}

/**
 * This function towD shift for 1H-NMR, from a molfile by using the cheminfo reference data base.
 * @param    molfile: string    A molfile content
 * @returns    +Object an array of NMRSignal1D
 */
function queryByHose(mol, db, options) {
    var currentDB = null;
    const atomLabel = options.atomLabel || 'H';
    const use  = options.use;
    if (db) {
        currentDB = db[atomLabel];
    }
    else {
        currentDB = [[], [], [], [], [], [], []];
    }
    options.debug = options.debug || false;
    var algorithm = options.algorithm || 0;
    var levels = options.hoseLevels || [6, 5, 4, 3, 2];
    var couplings = options.getCouplings || false;
    levels.sort(function(a, b) {
        return b - a;
    });
    var diaIDs = mol.getGroupedDiastereotopicAtomIDs({atomLabel: atomLabel});
    var infoCOSY = [];//mol.getCouplings();
    if(couplings) {
        //    infoCOSY = mol.predictCouplings();
    }

    var atoms = {};
    var atomNumbers = [];
    var i, k, j, atom, hosesString;
    for (j = diaIDs.length - 1; j >= 0; j--) {
        hosesString = OCLE.Util.getHoseCodesFromDiastereotopicID(diaIDs[j].oclID,  {maxSphereSize: levels[0], type: algorithm});
        atom = {
            diaIDs: [diaIDs[j].oclID + '']
        };
        for(k = 0; k < levels.length; k++) {
            atom['hose'+levels[k]] = hosesString[levels[k]-1]+'';
        }
        for (k = diaIDs[j].atoms.length - 1; k >= 0; k--) {
            atoms[diaIDs[j].atoms[k]] = JSON.parse(JSON.stringify(atom));
            atomNumbers.push(diaIDs[j].atoms[k]);
        }
    }
    //Now, we towD the chimical shift by using our copy of NMRShiftDB
    //var script2 = 'select chemicalShift FROM assignment where ';//hose5='dgH`EBYReZYiIjjjjj@OzP`NET'';
    var toReturn = new Array(atomNumbers.length);
    for (j = 0; j < atomNumbers.length; j++) {
        atom = atoms[atomNumbers[j]];
        var res = null;
        k = 0;
        //A really simple query
        while(res === null && k < levels.length) {
            if(currentDB[levels[k]]) {
                res = currentDB[levels[k]][atom['hose' + levels[k]]];
            }
            k++;
        }
        if (res == null) {
            res = { cs: null, ncs: 0, std: 0, min: 0, max: 0 };//Default values
        }
        atom.atomLabel = atomLabel;
        atom.level = levels[k-1];
        atom.delta = res.cs;
        if(use === 'median' && res.median)
            atom.delta = res.median;
        else if (use === 'mean' && res.mean)
            atom.delta = res.mean;
        atom.integral = 1;
        atom.atomIDs = ['' + atomNumbers[j]];
        atom.ncs = res.ncs;
        atom.std = res.std;
        atom.min = res.min;
        atom.max = res.max;
        atom.j = [];

        //Add the predicted couplings
        //console.log(atomNumbers[j]+' '+infoCOSY[0].atom1);
        for (i = infoCOSY.length - 1; i >= 0; i--) {
            if (infoCOSY[i].atom1 - 1 == atomNumbers[j] && infoCOSY[i].coupling > 2) {
                atom.j.push({
                    'assignment': infoCOSY[i].atom2 - 1 + '',//Put the diaID instead
                    'diaID': infoCOSY[i].diaID2,
                    'coupling': infoCOSY[i].coupling,
                    'multiplicity': 'd'
                });
            }
        }
        toReturn[j] = atom;
    }
    //TODO this will not work because getPaths is not implemented yet!!!!
    if(options.ignoreLabile) {
        var linksOH = mol.getAllPaths({
            fromLabel: 'H',
            toLabel: 'O',
            minLength: 1,
            maxLength: 1
        });
        var linksNH = mol.getAllPaths({
            fromLabel: 'H',
            toLabel: 'N',
            minLength: 1,
            maxLength: 1
        });
        for(j = toReturn.length-1; j >= 0; j--) {
            for(var k = 0; k < linksOH.length; k++) {
                if(toReturn[j].diaIDs[0] === linksOH[k].fromDiaID) {
                    toReturn.splice(j, 1);
                    break;
                }
            }
        }
        //console.log(h1pred.length);
        for(j = toReturn.length-1; j >= 0; j--) {
            for(var k = 0;k < linksNH.length; k++) {
                if(toReturn[j].diaIDs[0] === linksNH[k].fromDiaID) {
                    toReturn.splice(j, 1);
                    break;
                }
            }
        }
    }
    return toReturn;
}

function fromSpinus(mol, options){
    let form = new FormData();
    form.append('molfile', mol.toMolfile());

    return fetch('https://www.nmrdb.org/service/predictor', {
        method: 'POST',
        body: form
    }).then(value => {return value.text()}).then(body => {
        //Convert to the ranges format and include the diaID for each atomID
        const data = spinusParser(body);
        const ids = data.ids;
        const jc = data.couplingConstants;
        const cs = data.chemicalShifts;
        const multiplicity = data.multiplicity;
        const integrals = data.integrals;

        const nspins = cs.length;

        const diaIDs = mol.getGroupedDiastereotopicAtomIDs({atomLabel: 'H'});
        var result = new Array(nspins);
        var atoms = {};
        var atomNumbers = [];
        var i, j, k, oclID, tmpCS;
        var csByOclID = {};
        for (j = diaIDs.length - 1; j >= 0; j--) {
            oclID = diaIDs[j].oclID + '';
            for (k = diaIDs[j].atoms.length - 1; k >= 0; k--) {
                atoms[diaIDs[j].atoms[k]] = oclID;
                atomNumbers.push(diaIDs[j].atoms[k]);
                if(!csByOclID[oclID]){
                    csByOclID[oclID] = {nc: 1, cs: cs[ids[diaIDs[j].atoms[k]]]};
                } else {
                    csByOclID[oclID].nc++;
                    csByOclID[oclID].cs += cs[ids[diaIDs[j].atoms[k]]];
                }
            }
        }

        //Average the entries for the equivalent protons
        var idsKeys = Object.keys(ids);
        for (i = 0; i < nspins; i++) {
            tmpCS = csByOclID[atoms[idsKeys[i]]].cs / csByOclID[atoms[idsKeys[i]]].nc;
            result[i] = {atomIDs: [idsKeys[i]], diaIDs: [atoms[idsKeys[i]]], integral: integrals[i],
                delta: tmpCS, atomLabel: 'H', j: []};

            for (j = 0; j < nspins; j++) {
                if(jc[i][j] !== 0 ) {
                    result[i].j.push({
                        'assignment': idsKeys[j],
                        'diaID': atoms[idsKeys[j]],
                        'coupling': jc[i][j],
                        'multiplicity': multiplicityToString(multiplicity[j])
                    });
                }
            }
        }

        return result;
    }).catch(ex => {return new Error('http request fail ' + ex)});
}

function multiplicityToString(mul) {
    switch(mul) {
        case 2:
            return 'd';
            break;
        case 3:
            return 't';
            break;
        case 4:
            return 'q';
            break;
        default:
            return '';
    }
}

function spinusParser(result){
    var lines = result.split('\n');
    var nspins = lines.length - 1;
    var cs = new Array(nspins);
    var integrals = new Array(nspins);
    var ids = {};
    var jc = Matrix.zeros(nspins, nspins);
    var i, j;

    for (i = 0; i < nspins; i++) {
        var tokens = lines[i].split('\t');
        cs[i] = +tokens[2];
        ids[tokens[0] - 1] = i;
        integrals[i] = 1;//+tokens[5];//Is it always 1??
    }

    for (i = 0; i < nspins; i++) {
        tokens = lines[i].split('\t');
        var nCoup = (tokens.length - 4) / 3;
        for (j = 0; j < nCoup; j++) {
            var withID = tokens[4 + 3 * j] - 1;
            var idx = ids[withID];
            jc[i][idx] = (+tokens[6 + 3 * j]) / 2;
        }
    }

    for (j = 0; j < nspins; j++) {
        for (i = j; i < nspins; i++) {
            jc[j][i] = jc[i][j];
        }
    }

    return {ids, chemicalShifts: cs, integrals, couplingConstants: jc, multiplicity: newArray(nspins, 2)};

}e

module.exports = {NmrPredictor, fetch};