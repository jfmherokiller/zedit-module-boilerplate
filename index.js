/* global ngapp, xelib, modulePath */
//= require ./src/exampleService.js
//= require ./src/exampleSettings.js

ngapp.run(function (exampleService, settingsService) {
    exampleService.helloWorld();

    settingsService.registerSettings({
        label: 'Example Module',
        templateUrl: `${modulePath}/partials/exampleSettings.html`,
        controller: 'exampleSettingsController',
        defaultSettings: {
            exampleModule: {
                message: 'HI!'
            }
        }
    });
});
//function GetRecordByCardinal(iFormId: cardinal): IInterface;
//begin
//Result := RecordByFormID(FileByLoadOrder(iFormId shr 24), iFormId, true);
//end;
function GetRecordByCardinal(iFormId) {
     xelib.GetRecord(xelib.FileByLoadOrder(iFormId >> 24), iFormId)
}
// function GetGridCellString(iElement: IInterface): string;
// var
//     grid: TwbGridCell;
// begin
// Result := '';
// if Signature(iElement) <> 'CELL' then
// exit;
//
// grid := GetGridCell(iElement);
//
// Result := IntToStr(grid.x) + ',' + IntToStr(grid.y);
//
// if Result <> '0,0' then exit; //Skip below if garenteed not persistent
//
// if GetIsPersistent(iElement) then //Kind of time consuming check
// Result := 'Persistent';
// end;
