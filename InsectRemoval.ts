/* global ngapp, xelib, modulePath */
import {Executor, Helpers, ModuleInfo, Patcher, ProcessBlock} from "@zedit/upf";
//let ReplacementPart = "CrFeralGhoul1A \"Feral Ghoul\" [CREA:0009FAFA]"
//get the ghoul record
let ReplaceReal = null
let ReplaceCombat = null

class InsectRemovalInfo implements ModuleInfo {
    author = "Noah Gooder";
    name = "InsectsRemoval"
    id = "InsectRemoval-Noah-1"
    version = "1.0"
    released = "6/11/2021"
    updated = "6/11/2021"
    description = "Replace Insects with other parts"
}

let myProcessBlock: ProcessBlock<any, any> = {
    load: {signature: "CREA", overrides: false, filter: filterFunction},
    patch: patchRecordProcessing
};

function filterFunction(RecordPart) {
    return xelib.GetValue(RecordPart, "DATA - \\Type") === "Mutated Insect"
}

function patchRecordProcessing(RecordPart, HelperParts: Helpers) {
    try {
        //replace template with ghoul to make use of the model/animation
        xelib.SetLinksTo(RecordPart, ReplaceReal, "TPLT");
        xelib.SetLinksTo(RecordPart,ReplaceCombat,"ZNAM");
        //xelib.SetValue(RecordPart,"TPLT",ReplacementPart); this code works but will quickly throw errors
        xelib.SetFlag(RecordPart, "ACBS - Configuration\\Template Flags", "Use Model/Animation", true);
    } catch (e) {
        HelperParts.logMessage(e);
    }
}

class PatchInsectoids implements Executor<any, any> {
    initialize = (a,b) => {
        ReplaceReal = xelib.GetRecord(0, 0x0009FAFA)
        ReplaceCombat = xelib.GetRecord(0, 0x0003A36F)
    }
    process = [myProcessBlock];

}

class InsectRemoval implements Patcher<any, any> {

    gameModes = [xelib.gmFNV]
    info: ModuleInfo = new InsectRemovalInfo;
    settings = {label: "InsectsRemove", hide: true, templateUrl: "", defaultSettings: {}}
    execute = new PatchInsectoids

}

registerPatcher(new InsectRemoval);
