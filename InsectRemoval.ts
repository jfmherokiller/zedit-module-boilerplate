/* global ngapp, xelib, modulePath */
import {Executor, Helpers, ModuleInfo, Patcher, ProcessBlock} from "@zedit/upf";
import {GameMode, RecordHandle} from "xelib";

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

function filterFunction(RecordPart:RecordHandle) {
    return xelib.GetValue(RecordPart, "DATA\\Type") === "Mutated Insect"
}

function patchRecordProcessing(RecordPart:RecordHandle, HelperParts:Helpers) {

}

class PatchInsectoids implements Executor<any, any>{

    process = [myProcessBlock];

}
class InsectRemoval implements Patcher<any, any>{

    gameModes: GameMode[] = [GameMode.gmFNV]
    info: ModuleInfo = new InsectRemovalInfo;
    settings: { label: "InsectsRemove", hide: true, templateUrl: "", defaultSettings: {} }
    execute = new PatchInsectoids

}