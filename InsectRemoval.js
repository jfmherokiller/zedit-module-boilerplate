let ReplacementPart = "CrFeralGhoul1A \"Feral Ghoul\" [CREA:0009FAFA]";
class InsectRemovalInfo {
    constructor() {
        this.author = "NoahGooder";
        this.name = "InsectsRemoval";
        this.id = "InsectRemoval-Noah-1";
        this.version = "1.0";
        this.released = "6/11/2021";
        this.updated = "6/11/2021";
        this.description = "Replace Insects with other parts";
    }
}
let myProcessBlock = {
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
class PatchInsectoids {
    constructor() {
        this.process = [myProcessBlock];
    }
}
class InsectRemoval {
    constructor() {
        this.gameModes = [xelib.gameModes.gmFNV];
        this.info = new InsectRemovalInfo;
        this.settings = { label: "InsectsRemove", hide: true, templateUrl: "", defaultSettings: {} };
        this.execute = new PatchInsectoids;
    }
}
registerPatcher(new InsectRemoval);
export {};
//# sourceMappingURL=InsectRemoval.js.map