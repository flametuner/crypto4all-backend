"use strict";
exports.__esModule = true;
exports.getContractAddress = void 0;
var ADDRESSES = {
    Mumbai: "0x622D608C79ac1deB9eA0673a7b5b84F8D4474E04"
};
function getContractAddress(blockchain) {
    return ADDRESSES[blockchain];
}
exports.getContractAddress = getContractAddress;
