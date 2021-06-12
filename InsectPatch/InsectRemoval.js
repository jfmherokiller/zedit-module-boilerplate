//let ReplacementPart = "CrFeralGhoul1A \"Feral Ghoul\" [CREA:0009FAFA]"
//get the ghoul record
let ReplaceReal = null;
let ReplaceCombat = null;
class InsectRemovalInfo {
    constructor() {
        this.author = "Noah Gooder";
        this.name = "InsectsRemoval";
        this.id = "InsectRemoval-Noah-1";
        this.version = "1.0";
        this.released = "6/11/2021";
        this.updated = "6/11/2021";
        this.description = "Replace Insects with other parts";
    }
}
let myProcessBlock = {
    load: { signature: "CREA", overrides: false, filter: filterFunction },
    patch: patchRecordProcessing
};
function filterFunction(RecordPart) {
    let MutatedInsectCheck = xelib.GetValue(RecordPart, "DATA - \\Type") === "Mutated Insect";
    let InventoryFix = xelib.GetFlag(RecordPart, "ACBS - Configuration\\Template Flags", "Use Inventory");
    return MutatedInsectCheck && !InventoryFix;
}
function patchRecordProcessing(RecordPart, HelperParts) {
    try {
        //replace template with ghoul to make use of the model/animation
        xelib.SetLinksTo(RecordPart, ReplaceReal, "TPLT");
        xelib.SetLinksTo(RecordPart, ReplaceCombat, "ZNAM");
        //xelib.SetValue(RecordPart,"TPLT",ReplacementPart); this code works but will quickly throw errors
        xelib.SetFlag(RecordPart, "ACBS - Configuration\\Template Flags", "Use Model/Animation", true);
    }
    catch (e) {
        HelperParts.logMessage("Woopsie");
        HelperParts.logMessage(e.name);
        HelperParts.logMessage(e.message);
        HelperParts.logMessage(e.stack);
        HelperParts.logMessage(xelib.ElementToJSON(RecordPart));
    }
}
class PatchInsectoids {
    constructor() {
        this.initialize = (a, b) => {
            ReplaceReal = xelib.GetRecord(0, 0x0009FAFA);
            ReplaceCombat = xelib.GetRecord(0, 0x0003A36F);
        };
        this.process = [myProcessBlock];
    }
}
class InsectRemoval {
    constructor() {
        this.gameModes = [xelib.gmFNV];
        this.info = new InsectRemovalInfo;
        this.settings = { label: "InsectsRemove", hide: true, templateUrl: "", defaultSettings: {} };
        this.execute = new PatchInsectoids;
    }
}
registerPatcher(new InsectRemoval);

