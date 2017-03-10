'use strict';

module.exports = function group(prediction, options) {
    if (options.group) {
        prediction.sort((a, b) => {
            if (a.diaIDs[0] < b.diaIDs[0]) return -1;
            if (a.diaIDs[0] > b.diaIDs[0]) return 1;
            return 0;
        });
        for (var i = prediction.length - 2; i >= 0; i--) {
            if (prediction[i].diaIDs[0] === prediction[i + 1].diaIDs[0]) {
                prediction[i].integral += prediction[i + 1].integral;
                prediction[i].atomIDs = prediction[i].atomIDs.concat(prediction[i + 1].atomIDs);
                prediction.splice(i + 1, 1);
            }
        }
    }
    return prediction;
};
