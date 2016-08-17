'use strict'
/**
 * Created by acastillo on 7/5/16.
 */
const request = require('request');
const OCLE = require('openchemlib-extended');
const Matrix = require('ml-matrix');


class NmrPredictor{

    constructor(db){
        this.db =db;//File.loadJSON("../h1_database.json");
    }

    predict(molfile, options){
        if(typeof db === "object"){
            return _askErno(molfile, options);
        }
        if(db === "spinus"){
            return _fromSpinus(molfile, options);
        }
        if(db === "nmrshiftdb2"){
            return _froNnmrshiftdb2(molfile, options);
        }
    }

    /**
     * @function nmrShiftDBPred1H(molfile)
     * This function predict shift for 1H-NMR, from a molfile by using the cheminfo reference data base.
     * @param    molfile:string    A molfile content
     * @returns    +Object an array of NMRSignal1D
     */
    _askErno(molfile, options) {
        var currentDB = null;
        var options = options || {};
        if (options.db) {
            currentDB = options.db;
        }
        else {
            if(!this.db)
                this.db =[[],[],[],[],[],[],[]];
            currentDB = this.db;
        }

        options.debug = options.debug || false;
        var algorithm = options.algorithm || 0;
        var levels = options.hoseLevels || [6,5,4,3,2];
        var couplings = options.getCouplings || false;
        levels.sort(function(a, b) {
            return b - a;
        });

        var mol = molfile;
        if(typeof molfile==="string"){
            mol = OCLE.Molecule.fromMolfile(molfile);
            mol.addImplicitHydrogens();
        }
        var diaIDs = mol.getDiastereotopicAtomIDs("H");

        var infoCOSY = [];//mol.getCouplings();
        if(couplings){
            //    infoCOSY = mol.predictCouplings();
        }

        var atoms = {};
        var atomNumbers = [];
        var i, k, j, atom, hosesString;
        for (j = diaIDs.length-1; j >=0; j--) {
            hosesString = OCLE.Util.getHoseCodesFromDiastereotopicID(diaIDs[j].id,  {maxSphereSize:levels[0], type: algorithm});
            atom = {
                diaIDs: [diaIDs[j].id + ""]
            };
            for(k=0;k<levels.length;k++){
                atom["hose"+levels[k]] = hosesString[levels[k]-1]+"";
            }
            for (k = diaIDs[j].atoms.length - 1; k >= 0; k--) {
                atoms[diaIDs[j].atoms[k]] = JSON.parse(JSON.stringify(atom));
                atomNumbers.push(diaIDs[j].atoms[k]);
            }
        }
        //Now, we predict the chimical shift by using our copy of NMRShiftDB
        //var script2 = "select chemicalShift FROM assignment where ";//hose5='dgH`EBYReZYiIjjjjj@OzP`NET'";
        var toReturn = new Array(atomNumbers.length);
        for (j = 0; j < atomNumbers.length; j++) {
            atom = atoms[atomNumbers[j]];
            var res=null;
            k=0;
            //A really simple query
            while(res==null&&k<levels.length){
                res = currentDB[levels[k]][atom["hose"+levels[k]]];
                k++;
            }
            if (res == null) {
                res = { cs: -9999999, ncs: 0, std: 0, min: 0, max: 0 };//Default values
            }
            atom.level = levels[k-1];
            atom.delta = res.cs;
            atom.atomIDs = ["" + atomNumbers[j]];
            atom.ncs = res.ncs;
            atom.std = res.std;
            atom.min = res.min;
            atom.max = res.max;
            atom.j = [];

            //Add the predicted couplings
            //console.log(atomNumbers[j]+" "+infoCOSY[0].atom1);
            for (i = infoCOSY.length - 1; i >= 0; i--) {
                if (infoCOSY[i].atom1 - 1 == atomNumbers[j] && infoCOSY[i].coupling > 2) {
                    atom.j.push({
                        "assignmentTo": infoCOSY[i].atom2 - 1 + "",//Put the diaID instead
                        "coupling": infoCOSY[i].coupling,
                        "multiplicity": "d"
                    });
                }
            }

            toReturn[j]=atom;
        }
        //TODO this will not work because getPaths is not implemented yet!!!!
        if(options.ignoreLabile){
            var linksOH = mol.getPaths(1,1,"H","O",false);
            var linksNH = mol.getPaths(1,1,"H","N",false);
            for(j=toReturn.length-1;j>=0;j--){
                for(var k=0;k<linksOH.length;k++){
                    if(toReturn[j].diaIDs[0]==linksOH[k].diaID1){
                        toReturn.splice(j,1);
                        break;
                    }
                }
            }
            //console.log(h1pred.length);
            for(j=toReturn.length-1;j>=0;j--){
                for(var k=0;k<linksNH.length;k++){
                    if(toReturn[j].diaIDs[0]==linksNH[k].diaID1){
                        toReturn.splice(j,1);
                        break;
                    }
                }
            }
        }

        return toReturn;
    }

    _fromSpinus(molfile, options){

        request.post("http://www.nmrdb.org/service/predictor",{form:{molfile:molfile}},function(error, response, result){
            var lines = result.split('\n');
            var nspins = lines.length - 1;
            var cs = new Array(nspins);
            var integrals = new Array(nspins);
            var ids = {};
            var jc = Matrix.zeros(nspins, nspins);

            for (let i = 0; i < nspins; i++) {
                var tokens = lines[i].split('\t');
                cs[i] = +tokens[2];
                ids[tokens[0] - 1] = i;
                integrals[i] = +tokens[5];//Is it always 1??
            }

            for (let i = 0; i < nspins; i++) {
                tokens = lines[i].split('\t');
                var nCoup = (tokens.length - 4) / 3;
                for (j = 0; j < nCoup; j++) {
                    var withID = tokens[4 + 3 * j] - 1;
                    var idx = ids[withID];
                    jc[i][idx] = (+tokens[6 + 3 * j])/2;
                }
            }

            for (var j = 0; j < nspins; j++) {
                for (var i = j; i < nspins; i++) {
                    jc[j][i] = jc[i][j];
                }
            }


            return new SpinSystem(cs, jc, newArray(nspins, 2), "1H");
        });
    }

    _froNnmrshiftdb2(molfile, options){

    }

}


module.exports = nmrShiftDBPred;