/* global ngapp, xelib, modulePath */
ngapp.service('exampleService', function() {
    this.helloWorld = function() {
        console.log('Hello World!');
    };
});

// this code makes the exampleService accessible from
// zEdit scripts and UPF patchers
ngapp.run(function(exampleService, interApiService) {
    interApiService.register({
        api: { exampleService }
    });
});
ngapp.controller('exampleSettingsController', function($scope) {
    $scope.printMessage = function() {
        console.log($scope.settings.exampleModule.message);
    };
});

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
/**
 * @param {number} iFormId
 */
function GetRecordByCardinal(iFormId) {
     return xelib.GetRecord(xelib.FileByLoadOrder(iFormId >> 24), iFormId)
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
function GetGridCellString(iElement) {
    if(xelib.Signature(iElement) !== "CELL") return;
}