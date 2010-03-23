/** Settings window
*/

// The Android can't do a grouped table layout but it does have sections.
// Also, I don't think that it can have controls in the table rows, can it?
//
var win = Titanium.UI.currentWindow;

var orangeColor = '#d56009';


var inputData = [];

//var networkRow = addControlRow('Enabled');
//networkRow.header = 'Network';
//inputData.push(networkRow);
//inputData.push(addControlRow('Server'));
//inputData.push(addControlRow('Database'));

var resumeRow = addControlRow('Auto-resume','autoResume',false);
resumeRow.header = 'Configuration';
inputData.push(resumeRow);
inputData.push(addControlRow('Metric Units','useMetric'));
inputData.push(addControlRow('Monitor Sound Levels','monitorSound',true));

// should this actually modify the stored data in the db,
// or control whether or not the user ID field is included
// in uploaded or exported data?
inputData.push(addControlRow('Anonymous Export','omitDeviceID',false));

// trying to get the export to work
var exportRow = addExportRow('Export Format','exportFormat',{csv:'CSV',json:'JSON',gc:'Golden Cheetah'},'csv');
inputData.push(exportRow);

// Set up an about message
var aboutString = 
'Log location, heading, speed, altitude, accelerometer, sound level, trip duration and distance. '+
'Export logs via e-mail in CSV, JSON or Golden Cheetah format.\n\n'+
'By default, logs contain a unique identifier for this device. It may be omitted by enabling the "Anonymous Export" option.\n\n'+
'This application has been released as open source software under the GPLv3. '+
'Source code is available at: http://github.com/rcarlsen/Mobile-Logger \n\n'+
'Created by Robert Carlsen in the Interactive Telecommunications Program at New York University.';

inputData.push(addAboutRow('About Mobile Logger',aboutString));


// methods for creating custom rows
function addControlRow(label,property,initialValue)
{
    if(initialValue == null) initialValue = false;

	var row = Ti.UI.createTableViewRow({height:50});
    row.backgroundColor = '#fff';

    // add a label to the left
    // should be bold
    var cellLabel = Ti.UI.createLabel({
        text:label,
        font:{fontSize:16,fontWeight:'bold'},
        left:10
    });
    row.add(cellLabel);

    // enable the property to be omitted
    // TODO: use a type variable to create different styles of controls?
    if(property != null){
        // add a switch to the right
        var sw = Ti.UI.createSwitch({
            right:10,
            value:Ti.App.Properties.getBool(property,initialValue)
        });

        // add a callback function to set application
        // properties when the value is changed
        sw.addEventListener('change', function(e)
        {
            // update the property with the state of the switch
            Ti.App.Properties.setBool(property,e.value);

            Ti.API.info('Property changed: '+property+', '+e.value);
        });

        row.add(sw);

	}

	row.className = 'control';
	return row;
}


function addExportRow(label,property,valuesList,initialValue)
{
    if(initialValue == null) initialValue = false;

	var row = Ti.UI.createTableViewRow({height:50});
    row.backgroundColor = '#fff';

    // add a label to the left
    // should be bold
    var cellLabel = Ti.UI.createLabel({
        text:label,
        font:{fontSize:16,fontWeight:'bold'},
        left:10
    });
    row.add(cellLabel);

    // enable the property to be omitted
    // TODO: use a type variable to create different styles of controls?
    if(property != null){
        row.hasChild = true;
        row.value = Ti.App.Properties.getString(property,initialValue);

        var cellValue = Ti.UI.createLabel({
            text:valuesList[row.value],
            font:{fontSize:14},
            textAlign:'right',
            right:20
        });
        row.add(cellValue);

        // add an event listener to this row
        row.addEventListener('click',function(e){
            // push a table view with these valuesList
           Ti.API.info('In the export table row click event');

            var exportWin = Ti.UI.createWindow({
                title:'Export Format',
                backgroundColor: '#ccc',
                barColor:orangeColor
            });

            var thisTable = Ti.UI.createTableView();
            thisTable.style = Ti.UI.iPhone.TableViewStyle.GROUPED;
            thisTable.backgroundColor = '#ccc';
            var data = [];
            for(var i in valuesList) {
                var thisRow = Ti.UI.createTableViewRow({backgroundColor:'#fff'});
                thisRow.title = valuesList[i];
                thisRow.value = i;

                // check the currently selected export format
                if(row.value == thisRow.value) thisRow.hasCheck = true;
                data.push(thisRow);
            }
            thisTable.setData(data);

            thisTable.addEventListener('click',function(r){
                Ti.API.info('In the export format window click event');
                var rowValue = r.rowData.value;

                // trying to get the parentTable to update.
                cellValue.text = r.rowData.title;
                row.value = rowValue;

                Ti.App.Properties.setString(property,rowValue);
                Ti.API.info('Set the property: '+property +' to: '+rowValue);

                // deselect all rows in the table
                var index = r.index;
                var section = r.section;

                setTimeout(function()
                {
                    // reset checks
                    for (var i=0;i<section.rows.length;i++) {
                        section.rows[i].hasCheck = false;
                    }
                    // set current check
                    section.rows[index].hasCheck = true;
                },250);
            });

            exportWin.add(thisTable);
            Ti.API.info('Added export table to export window');

            Titanium.UI.currentTab.open(exportWin,{animated:true});
            Ti.API.info('Export format window whould have opened');
        });

	}

	row.className = 'export';
	return row;
}

function addAboutRow(label,value)
{
    if(label == null) label = 'About';
        
	var row = Ti.UI.createTableViewRow({height:50});
    row.backgroundColor = '#fff';
    row.hasChild = true;
    row.header = ' ';

    // add a label to the left
    // should be bold
    var cellLabel = Ti.UI.createLabel({
        text:label,
        font:{fontSize:16,fontWeight:'bold'},
        left:10
    });
    row.add(cellLabel);

    // add a child view
    row.addEventListener('click',function(e){
        Ti.API.info('In the about row click event');

        // push a new window
        var aboutWin = Ti.UI.createWindow({
            title:label,
            backgroundColor:'#ccc',
            barColor:orangeColor
        });
        Ti.API.info('Created about window');

        var aboutField = Ti.UI.createTextArea({
            value:value,
            //width:300,
            //height:300,
            //top:10,
            //borderWidth:1,
            //borderColor:'#999',
            //borderRadius:10,
            editable:false,
            touchEnabled:false,
            font:{fontSize:15}
        });
        Ti.API.info('Created about field');
        //Ti.API.info('Added about string to about field: '+value);

        aboutWin.add(aboutField);
        //aboutWin.open();//{modal:true});
        Titanium.UI.currentTab.open(aboutWin,{animated:true});
    
        Ti.API.info('Should have opened the about window');
    });

	row.className = 'aboutrow';
	return row;
}

var tableView = Titanium.UI.createTableView({ 
	data:inputData, 
	style:Titanium.UI.iPhone.TableViewStyle.GROUPED, 
    backgroundColor: '#ccc'
}); 
win.add(tableView);