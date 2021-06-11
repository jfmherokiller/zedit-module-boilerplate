"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReplacementPart = "CrFeralGhoul1A \"Feral Ghoul\" [CREA:0009FAFA]";
var InsectRemovalInfo = /** @class */ (function () {
    function InsectRemovalInfo() {
        this.author = "NoahGooder";
        this.name = "InsectsRemoval";
        this.id = "InsectRemoval-Noah-1";
        this.version = "1.0";
        this.released = "6/11/2021";
        this.updated = "6/11/2021";
        this.description = "Replace Insects with other parts";
    }
    return InsectRemovalInfo;
}());
var myProcessBlock = {
    load: { signature: "CREA", overrides: true, filter: filterFunction },
    patch: patchRecordProcessing
};
function filterFunction(RecordPart) {
    return xelib.GetValue(RecordPart, "DATA\\Type") === "Mutated Insect";
}
function patchRecordProcessing(RecordPart, HelperParts) {
    xelib.SetValue(RecordPart, "TPLT", ReplacementPart);
    xelib.SetFlag(RecordPart, "ACBS - Configuration\\Template Flags", "Use Model/Animation", true);
}
var PatchInsectoids = /** @class */ (function () {
    function PatchInsectoids() {
        this.process = [myProcessBlock];
    }
    return PatchInsectoids;
}());
var InsectRemoval = /** @class */ (function () {
    function InsectRemoval() {
        this.gameModes = [xelib.gameModes.gmFNV];
        this.info = new InsectRemovalInfo;
        this.execute = new PatchInsectoids;
    }
    return InsectRemoval;
}());
//# sourceMappingURL=InsectRemoval.js.map