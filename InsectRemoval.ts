/* global ngapp, xelib, modulePath */
import {Executor, Helpers, ModuleInfo, Patcher, ProcessBlock} from "@zedit/upf";
//let ReplacementPart = "CrFeralGhoul1A \"Feral Ghoul\" [CREA:0009FAFA]"
let ReplaceReal = xelib.GetRecord(0,0x0009FAFA)
class InsectRemovalInfo implements ModuleInfo {
    author = "NoahGooder";
    name = "InsectsRemoval"
    id = "InsectRemoval-Noah-1"
    version = "1.0"
    released = "6/11/2021"
    updated = "6/11/2021"
    description = "Replace Insects with other parts"
}

let myProcessBlock:ProcessBlock<any, any> = {
    load:{signature:"CREA",overrides: true,filter:filterFunction},
    patch:patchRecordProcessing
};

function filterFunction(RecordPart) {
    return xelib.GetValue(RecordPart, "DATA\\Type") === "Mutated Insect"
}

function patchRecordProcessing(RecordPart, HelperParts:Helpers) {
    try {
        xelib.SetLinksTo(RecordPart,ReplaceReal,"TPLT");
        //xelib.SetValue(RecordPart,"TPLT",ReplacementPart);
        xelib.SetFlag(RecordPart,"ACBS - Configuration\\Template Flags","Use Model/Animation",true);
    } catch (e) {
        HelperParts.logMessage(e);
    }
}

class PatchInsectoids implements Executor<any, any>{

    process = [myProcessBlock];

}
class InsectRemoval implements Patcher<any, any>{

    gameModes= [xelib.gmFNV]
    info: ModuleInfo = new InsectRemovalInfo;
    settings = { label: "InsectsRemove", hide: true, templateUrl: "", defaultSettings: {},controler:(ass) => {} }
    execute = new PatchInsectoids

}
registerPatcher(new InsectRemoval);