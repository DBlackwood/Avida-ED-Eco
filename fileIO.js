// folders will be:
// cwd = current working directory
// saved = where files are put to save to user workspace

//http://stackoverflow.com/questions/41890009/file-download-not-working-in-safari
// works in Chrome but not Safari works with no user input in Chrome (because chrome defaults to downloads))
//var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
//saveAs(blob, "helloWorld.txt");

//---------------------------------- Call to selecct the Default workspace ---------------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
//https://thiscouldbebetter.wordpress.com/2013/08/06/reading-zip-files-in-javascript-using-jszip/

var av = av || {};  //incase av already exists

av.fio.readZipWS = function(zipFileName, loadConfigFlag) {
  if (av.debug.fio) console.log('zipFileName', zipFileName, '; loadConfigFlag=', loadConfigFlag);
  'use strict';
  if (loadConfigFlag) av.fzr.clearFzrFn();
  else av.fzr.clearMainFzrFn();  // clear freezer (globals.js)
  //Clear each section of the freezer
  if (av.debug.fio) console.log('before  av.dnd.fzConfig.selectAll');
  av.dnd.fzConfig.selectAll().deleteSelectedNodes();  //http://stackoverflow.com/questions/11909540/how-to-remove-delete-an-item-from-a-dojo-drag-and-drop-source
  if (av.debug.fio) console.log('before av.dnd.fzConfig.sync');
  av.dnd.fzConfig.sync('');   //should be done after insertion or deletion
  if (av.debug.fio) console.log('before av.dnd.fzOrgan.selectAll', av.dnd.fzOrgan);
  av.dnd.fzOrgan.selectAll().deleteSelectedNodes();
  if (av.debug.fio) console.log('before av.dnd.fzOrgan.sync');
  av.dnd.fzOrgan.sync();
  if (av.debug.fio) console.log('before av.dnd.fzMdish.selectAll', av.dnd.fzMdish);
  av.dnd.fzMdish.selectAll().deleteSelectedNodes();
  av.dnd.fzMdish.sync();

  if (av.debug.fio) console.log('before av.dnd.fzRdish.selectAll', av.dnd.fzMdish);
  av.dnd.fzRdish.selectAll().deleteSelectedNodes();
  av.dnd.fzRdish.sync();
  if (av.debug.fio) console.log('before av.dnd.fzTdish.selectAll', av.dnd.fzMdish);
  av.dnd.fzTdish.selectAll().deleteSelectedNodes();
  av.dnd.fzTdish.sync();

  if (av.debug.fio) console.log('before av.dnd.fzWorld.selectAll', av.dnd.fzWorld);
  av.dnd.fzWorld.selectAll().deleteSelectedNodes();
  av.dnd.fzWorld.sync();
  if (av.debug.fio) console.log('after av.dnd.fzWorld.selectAll');
  //Change loading a workspace will change the freezer, but not parents or configuration
/*  av.parents.clearParentsFn();  //globals.js
  av.dnd.ancestorBox.selectAll().deleteSelectedNodes();
  av.dnd.ancestorBox.sync();
  av.dnd.activeOrgan.selectAll().deleteSelectedNodes();
  av.dnd.activeOrgan.sync();
*/
  var oReq = new XMLHttpRequest();
  oReq.open("GET", zipFileName, true);
  oReq.responseType = "arraybuffer";
  oReq.onload = function (oEvent) {
    var arybuf = oReq.response;
    if (av.debug.fio) console.log("have ziptest.zip", arybuf);
    // do something to extract it
    av.fio.zipfile = new av.fio.JSZip();
    if (av.debug.fio) console.log("loading arybuf");
    av.fio.zipfile.load(arybuf, {base64: false});
    if (av.debug.fio) console.log("arybuf loaded");
    //if (av.debug.fio) console.log('before call procesfiles');
    av.fio.zipPathRoot = null;
    for (var nameOfFileContainedInZipFile in av.fio.zipfile.files) {
      /*Mac generated workspaces have the string '.avidaedworkspace/'  or '.avidaWs/' before the folders for each freezerItem.
       This prefix needs to be removed if present. av.fio.zipPathRoot will be assigned the beginning of the path name within the zip file.
       */
      //if (av.debug.fio) console.log('nameOfFileContainedInZipFile=', nameOfFileContainedInZipFile, '; fileContainedInZipFile.asText()=', fileContainedInZipFile.asText());
      //if (av.debug.fio) console.log('nameOfFileContainedInZipFile=', nameOfFileContainedInZipFile);
      if (null === av.fio.zipPathRoot) {
        if (0 < nameOfFileContainedInZipFile.indexOf('avidaWs') && 0 > nameOfFileContainedInZipFile.indexOf('MACOSX')) {
          av.fio.zipPathRoot = wsb('/', nameOfFileContainedInZipFile);
        }
        else if (0 > nameOfFileContainedInZipFile.indexOf('MACOSX')) {av.fio.zipPathRoot='';}
      }
      av.fio.thisfile = av.fio.zipfile.files[nameOfFileContainedInZipFile];
      av.fio.fName = nameOfFileContainedInZipFile;
      if (10 < av.fio.zipPathRoot.length) av.fio.anID = wsa(av.fio.zipPathRoot+'/', av.fio.fName);
      else av.fio.anID = av.fio.fName;
      //if (av.debug.fio) console.log('nameOfFileContainedInZipFile=', nameOfFileContainedInZipFile,';___fName=',av.fio.fName, '; ___zipPathRoot=', av.fio.zipPathRoot, '; ____anID=',av.fio.anID);
      //if (av.debug.fio) console.log('fName=',av.fio.fName, '; ____anID=',av.fio.anID);

      //this section needs to be fixed for multidish I think.
      if (3 < av.fio.fName.length) {
        var tmpr = wsb('/', av.fio.anID);
        if (0 < tmpr.indexOf('/')) {av.fzr.fziType = 'subDish';}
        else {av.fzr.fziType = tmpr.charAt(0);}
        //console.log('av.fio.fName', av.fio.fName, '; av.fio.anID', av.fio.anID, '; tmpr=', tmpr, '; av.fzr.fziType=',av.fzr.fziType);
        av.fio.processFiles(loadConfigFlag);
      }  //do not load configfile
    };
    //want to sort TestDishes here
    av.dnd.sortDnD('fzTdish');

    //note setup form is updated when the files are read.
    //if (av.debug.fio) console.log('after read loop: fzr', av.fzr);
    av.fio.fileReadingDone = true;
    //if (av.debug.fio) console.log('before DrawGridSetup')
    av.grd.drawGridSetupFn('av.fio.readZipWS');
    av.fzr.cNum++;  //now the Num value refer to the next (new) item to be put in the freezer.
    av.fzr.gNum++;
    av.fzr.wNum++;
  };
  oReq.send();
  av.fzr.saveUpdateState('default');
  av.fzr.wsNameMsg = 'Default';
};

  //------------------------------ call to read in a user selected Workspace -------------------------------------------
  //https://thiscouldbebetter.wordpress.com/2013/08/06/reading-zip-files-in-javascript-using-jszip/
  av.fio.userPickZipRead = function () {
    'use strict';
    av.fzr.usrFileLoaded = false;
    //if (av.debug.fio) console.log('in av.fio.userPickZipRead');
    var inputWSfile, zipFileToLoad, fileReader, zip2unpack, zipFileLoaded, nameOfFileContainedInZipFile;

    try {
      inputWSfile = document.getElementById('putWS');
      if (av.debug.fio) console.log('file to read=', inputWSfile);
      zipFileToLoad = inputWSfile.files[0];
      if (av.debug.fio) console.log('filename=',zipFileToLoad.name ,'; zipFileToLoad= ', zipFileToLoad);
      fileReader = new FileReader();
    }
    catch(err) {
      alert('Unable to open file. Please check the file and try again or contact Avida-ED-development@googlegroups.com for help');
      av.debug.log += '\nworkspace fileReader error:' + err;
    };

    console.log('before ileReader.onloadend = function(fileLoadedEvent)');
    fileReader.onloadend = function(fileLoadedEvent)
    {
      try {
        if (av.debug.fio) console.log('fileLoadedEvent', fileLoadedEvent);
        zip2unpack = fileLoadedEvent.target.result;

        zipFileLoaded = new av.fio.JSZip(zip2unpack);
        if (av.debug.fio) console.log('zipFileLoaded', zipFileLoaded);
        av.fio.zipPathRoot = null;
        av.fzr.clearMainFzrFn();  // clear freezer (globals.js)
        if (av.debug.fio) console.log('after clearMainFzrFn');
        if (av.debug.fio) console.log('zipFileLoaded.files=', zipFileLoaded.files);
        for (nameOfFileContainedInZipFile in zipFileLoaded.files) {
          var fileContainedInZipFile = zipFileLoaded.files[nameOfFileContainedInZipFile];
          //Mac generated workspaces have the string '.avidaedworkspace/' before the folders for each freezerItem.
          // This prefix needs to be removed if present. av.fio.zipPathRoot will be assigned the beginning of the path name within the zip file.
          //
          //if (av.debug.fio) console.log('nameOfFileContainedInZipFile=', nameOfFileContainedInZipFile, '; fileContainedInZipFile.asText()=', fileContainedInZipFile.asText());
          //if (av.debug.fio) console.log('nameOfFileContainedInZipFile=', nameOfFileContainedInZipFile);
          if (null === av.fio.zipPathRoot) {
            console.log('av.fio.zipPathRoot=',av.fio.zipPathRoot);
            //if (0 < nameOfFileContainedInZipFile.indexOf('avidaedworkspace') && 0 > nameOfFileContainedInZipFile.indexOf('MACOSX')) {
            if (0 > nameOfFileContainedInZipFile.indexOf('MACOSX')) {
              av.fio.zipPathRoot = wsb('/', nameOfFileContainedInZipFile);
            }
            else if (0 > nameOfFileContainedInZipFile.indexOf('MACOSX')) {
              av.fio.zipPathRoot = '';
            }
          }
          av.fio.thisfile = zipFileLoaded.files[nameOfFileContainedInZipFile];
          av.fio.fName = nameOfFileContainedInZipFile;
          if (0 < av.fio.zipPathRoot.length) av.fio.anID = wsa(av.fio.zipPathRoot + '/', av.fio.fName);
          else av.fio.anID = av.fio.fName;
          //if (av.debug.fio) console.log('nameOfFileContainedInZipFile=', nameOfFileContainedInZipFile,';___fName=',av.fio.fName, '; ___zipPathRoot=', av.fio.zipPathRoot, '; ____anID=',av.fio.anID);
          //if (av.debug.fio) console.log('fName=',av.fio.fName, '; ____anID=',av.fio.anID);
          //if (3 < av.fio.fName.length) {
          if (3 < av.fio.anID.length) {
            av.fzr.fziType = wsb('/', av.fio.anID).charAt(0);
            if (av.fio.anID.lastIndexOf('/') != av.fio.anID.indexOf('/') && av.fzr.fziType == 'm') {
              av.fzr.fziType = 'subDish';
            }
            //if (av.debug.fio) console.log('av.fio.fName', av.fio.fName, '; av.fio.anID', av.fio.anID, '; av.fzr.fziType=',av.fzr.fziType);
            av.fio.processFiles(false);  //load files
          }
        }
        if (av.debug.fio) console.log('cNum=',av.fzr.cNum, '; gNum=', av.fzr.gNum, '; mNum', av.fzr.mNum, '; wNum', av.fzr.wNum);
        if ('populationBlock' === av.ui.page) av.grd.drawGridSetupFn('av.fio.userPickZipRead');
        av.fzr.cNum++;  //now the Num value refer to the next (new) item to be put in the freezer.
        av.fzr.gNum++;
        av.fzr.mNum++;
        av.fzr.rNum++;
        av.fzr.tNum++;
        av.fzr.wNum++;
        //tiba; will need to increment cNum and wNum for each superdish when userInterface is built.
        for (var key in av.fzr.mDish) {
          if (av.debug.fio) console.log('key=', key, '; object=', av.fzr.mDish[key]);
          av.fzr.mDish[key].cNum++;
          av.fzr.mDish[key].wNum++;
          if (av.debug.fio) console.log('key=', key, '; cNum=', av.fzr.mDish[key].cNum, '; wNum=', av.fzr.mDish[key].cNum, '; dir=', av.fzr.mDish[key].dir);
        }
        console.log('name=',zipFileToLoad.name);
        wsNameMsg.textContent = zipFileToLoad.name;
        av.fzr.saveUpdateState('yes');
        if (av.debug.fio) console.log('av.fzr', av.fzr);

        if (!av.fzr.usrFileLoaded) alert('It appears that the zip file was not an Avida-ED Workspace. '
          + 'Please choose another file or load the default workspace. '
          + 'If you continue to have propblem, ask your instructor or write Avida-ED-development@googlegroups.com');
      }
      catch (error) {
        console.log('In catch; error= ', error);
        av.debug.log += '\nworkspace jsZip error:' + error;
        alert('Unable to extract an Avida Workspace Zip file, please check the file and try again. If you continue to have trouble, use "Report Problem" in the help menu');
      }
    };
    fileReader.readAsArrayBuffer(zipFileToLoad);  //calls function that reads the zip file
  };

  //------------------------------- call to import a freezer item ------------------------------------------------------
  //https://thiscouldbebetter.wordpress.com/2013/08/06/reading-zip-files-in-javascript-using-jszip/
  av.fio.importZipRead = function () {
    'use strict';
    var fileReader, inputWSfile, zipFileToLoad;
    try {
      inputWSfile = document.getElementById('importFzrItem');
      //console.log('inputWSfile', inputWSfile);
      zipFileToLoad = inputWSfile.files[0];
      fileReader = new FileReader();
    }
    catch(err) {
      alert('Unable to open Freezer Item file. Please check the file and try again or contact Avida-ED-development@googlegroups.com for help');
      av.debug.log += '\nfreezerItem fileReader error:' + err;
    }

    fileReader.readAsArrayBuffer(zipFileToLoad);  //calls the function above //was 215
    av.fzr.saveUpdateState('no');

    fileReader.onload = function(fileLoadedEvent) {
      var fileContainedInZipFile, zipFileLoaded;
      try {
        zipFileLoaded = new av.fio.JSZip(fileLoadedEvent.target.result);

        av.fio.zipPathRoot = null;
        for (var nameOfFileContainedInZipFile in zipFileLoaded.files) {
          fileContainedInZipFile = zipFileLoaded.files[nameOfFileContainedInZipFile];
          //Mac generated freezerItems have the string '.avidaedfreezeritem/' before the files for each freezerItem.
          //This prefix needs to be removed if present. av.fio.zipPathRoot will be assigned the beginning of the path name within the zip file.

          //console.log('nameOfFileContainedInZipFile=', nameOfFileContainedInZipFile, '; fileContainedInZipFile.asText()=', fileContainedInZipFile.asText());
          //console.log('nameOfFileContainedInZipFile=', nameOfFileContainedInZipFile);
          if (null === av.fio.zipPathRoot) {
            if (0 < nameOfFileContainedInZipFile.indexOf('avidaedfreezeritem') && 0 > nameOfFileContainedInZipFile.indexOf('MACOSX')) {
              av.fio.zipPathRoot = wsb('/', nameOfFileContainedInZipFile);
            }
            else if (0 > nameOfFileContainedInZipFile.indexOf('MACOSX')) {
              av.fio.zipPathRoot = '';
            }
          }
          av.fio.thisfile = zipFileLoaded.files[nameOfFileContainedInZipFile];
          av.fio.fName = nameOfFileContainedInZipFile;

          //console.log('zipPathRoot', av.fio.zipPathRoot, '; fName', av.fio.fName);
          if (2 < av.fio.zipPathRoot.length) av.fio.anID = wsa(av.fio.zipPathRoot + '/', av.fio.fName);
          else av.fio.anID = av.fio.fName;
          //console.log('nameOfFileContainedInZipFile=', nameOfFileContainedInZipFile, ';___fName=', av.fio.fName, '; ___zipPathRoot=', av.fio.zipPathRoot, '; ____anID=', av.fio.anID);
          //console.log('fName=', av.fio.fName, '; ____anID=', av.fio.anID);
          //console.log('-------------------------------------------------------------------------------------------------');
          if (2 < av.fio.fName.length) av.fio.processItemFiles();  //do not load configfile
        }
        //console.log('freezer', av.fzr);
        av.fio.fixFname();
        
        
        if ('populationBlock' === av.ui.page) av.grd.drawGridSetupFn('av.fio.importZipRead');
      }
      catch (error) {
        alert('Unable to extract an Avida Freezer Item Zip file, please check the file and try again. If you continue to have trouble, use "Report Problem" in the help menu');
        av.debug.log += '\nfreezerItem jsZip error:' + error;
      }
    };
  };

//
av.fio.fixFname = function() {
  'use strict';
  var domid, name, type, dir;
  if (av.fzr.item['entryname.txt']) { name = av.fzr.item['entryname.txt'].trim(); }
  else { name = wsb('.', av.fio.zipPathRoot); }
  //console.log('name', name, '; zipPathRoot', av.fio.zipPathRoot);

  if (av.fzr.item['entrytype.txt']) {
    type = av.fzr.item['entrytype.txt'].trim();
    switch (type) {
      case 'c':
        domid = av.fio.addFzItem(av.dnd.fzConfig, name, type, av.fzr.cNum);
        if ('dndSection is undefined' == domid) console.log('av.dnd.fzConfig is undefined');
        dir = 'c' + av.fzr.cNum;
        av.fzr.cNum++;
        //if (av.debug.fio) console.log('c: num', num, '; name', name, 'flag', loadConfigFlag);
        break;
      case 'g':
        domid = av.fio.addFzItem(av.dnd.fzOrgan, name, type, av.fzr.gNum);
        if ('dndSection is undefined' == domid) console.log('av.dnd.fzOrgan is undefined');
        dir = 'g' + av.fzr.gNum;
        av.fzr.gNum++;
        break;
      case 'w':
        domid = av.fio.addFzItem(av.dnd.fzWorld, name, type, av.fzr.wNum);
        if ('dndSection is undefined' == domid) console.log('av.dnd.fzWorld is undefined');
        dir = 'w' + av.fzr.wNum;
        av.fzr.wNum++;
        break;
    }
    for (var fname in av.fzr.item) {
      //if (av.debug.fio) console.log('av.fzr.item', fname);
      if ('entrytype.txt' !== fname) {
        av.fzr.file[dir+'/'+fname] = av.fzr.item[fname];
        //if (av.debug.fio) console.log('dir', dir+'/'+fname, '; contents=', av.fzr.file[dir+'/'+fname]);
      }
      av.fwt.deleteFzrItem(fname);
    }
    av.fzr.domid[dir] = domid;
    av.fzr.dir[domid] = dir;
    //if (av.debug.fio) console.log('av.fzr', av.fzr);
  }
};

//----------------------------------------- Save datarecorder info to a csv file ---------------------------------------
av.fio.fzSaveCsvfn = function () {
  if (0 === av.fio.csvFileName.length) av.fio.csvFileName = prompt('Choose a name for your csv file', av.fzr.actConfig.name + '@' + av.grd.popStatsMsg.update);
  if (0 === av.fio.csvFileName.length) av.fio.csvFileName = 'avidaDataRecorder.csv';
  var end = av.fio.csvFileName.substring(av.fio.csvFileName.length - 4);
  if ('.csv' != end) av.fio.userFname = av.fio.csvFileName + '.csv';

  var typeStrng = 'data:attachment/csv;charset=utf-8,';
  //console.log('brs', av.brs);
  if (av.brs.isSafari) alert("The name of the file will be 'unknown' in Safari. Please change the name to end in .csv. Safari will also open a blank tab. Please close the tab when you are done saving and resume work in Avida-ED");
  av.fio.SaveUsingDomElement(av.fwt.csvStrg, av.fio.csvFileName, typeStrng);
};

av.fio.SaveUsingDomElement = function(aStr, fName, typeStr) {
  "use strict";
  var a = document.createElement('a');
  a.href     = typeStr + encodeURI(aStr);
  a.target   = '_blank';
  a.download = fName;
  document.body.appendChild(a);
  a.click();
  setTimeout(function(){
    document.body.removeChild(a);   //does not remove blank tab
    window.URL.revokeObjectURL(a.href);
  }, 100);
};

av.fio.fzSaveCurrentWorkspaceFn = function () {
  'use strict';
  if (av.debug.fio) console.log('defaultUserFname', av.fio.defaultUserFname);
  if (null === av.fio.userFname) {
    av.fio.userFname = av.fio.defaultUserFname;
  }
  else if (0 === av.fio.userFname.length) {
    av.fio.userFname = av.fio.defaultUserFname;
  }
  var end = av.fio.userFname.substring(av.fio.userFname.length-4);
  if ('.zip' != end) av.fio.userFname = av.fio.userFname + '.zip';
  console.log('userName=', av.fio.userFname);
  var folderName = wsb('.zip', av.fio.userFname);
  if (av.debug.fio) console.log('end', end, '; userFname', av.fio.userFname, '; folderName', folderName);

  //make zipfile as a blob
  var WSzip = new av.fio.JSZip();
  //console.log('number of files', av.utl.objectLength(av.fzr.file) );
  var numFiles = 0;
  var aFolderName, itemName, itemNameContent;
  var generalContent = 'AvidaED writes this file, but does not read it. \n'
                      + 'Changing this file by hand will not change the entryname. \n'
                      + 'You must change the file entryname.txt, to change the name within Avida-ED';
  if (av.fzr.file) {
    for (var fname in av.fzr.file) {
      WSzip.file(folderName + '.avidaWs/' + fname, av.fzr.file[fname]);
      
      if (av.debug.fio) console.log('fname=', fname);
       //console.log('end of fname=', fname.substring(fname.length-13, fname.length), '; len=', fname.length-13);
      if ('entryname.txt' == fname.substring(fname.length-13, fname.length) ) {
        aFolderName = fname.substring(0,fname.length-13);
        itemName = aFolderName + av.utl.makeFileName(av.fzr.file[fname]) + '.txt';
        itemNameContent = itemName + '\n\n' + generalContent;
        if (av.debug.fio) console.log('itemName=', itemName);
        WSzip.file(folderName + '.avidaWs/' + itemName, itemNameContent);        
        numFiles++;
      };
      numFiles++;
    }
  }
  var content = WSzip.generate({type:"blob"});
  //console.log('content', content.size, content);

  var fsaver = saveAs(content, av.fio.userFname);
  //console.log('file saved via saveAs');
  av.fzr.saveUpdateState('maybe');
};

//    wsSavedMsg.textcontent = 'Workspace: default  ';
av.fzr.saveUpdateState = function (newSaveState) {
  'use strict';
  //console.log('oldState', av.fzr.saveState, '; newState', newSaveState);
  if ('maybe' === newSaveState) {
    //console.log('newSaveState', newSaveState)
    if ('no' === av.fzr.saveState) {
      //console.log('oldSaveState', av.fzr.saveState)
      av.fzr.saveState = 'maybe';
    }
  } 
  else {
    //console.log('newSaveState', newSaveState, ' is not maybe');
    av.fzr.saveState = newSaveState;
  }
  switch (av.fzr.saveState) {
    case 'yes':
      wsSavedMsg.textContent = ' is saved ';
      wsSavedMsg.style.color = 'green';
      break;
    case 'maybe':
      wsSavedMsg.textContent = ' might be saved';
      wsSavedMsg.style.color = 'orangered';
      break;
    case 'no':
      wsSavedMsg.textContent = ' is not saved';
      wsSavedMsg.style.color = 'red';
      break;
    case 'default':
      wsSavedMsg.textContent = ' not changed ';
      wsSavedMsg.style.color = 'blue';
      break;
    default:
      wsSavedMsg.textContent = ' is confused ';
      wsSavedMsg.style.color = 'deeppink';
      break;
  }
};

/*--------------------------------------------------------------------------------------------------------------------*/

// Source: http://pixelscommander.com/en/javascript/javascript-file-download-ignore-content-type/
window.downloadFile = function (sUrl) {

  //iOS devices do not support downloading. We have to inform user about this.
  if (/(iP)/g.test(navigator.userAgent)) {
    //alert('Your device does not support files downloading. Please try again in desktop browser.');
    window.open(sUrl, '_blank');
    return false;
  }

  //If in Chrome or Safari - download via virtual link click
  console.log('downloadFile.isChrome=', window.downloadFile.isChrome, '   isSafari=', window.downloadFile.isSafari)
  if (window.downloadFile.isChrome || window.downloadFile.isSafari) {
    //Creating new link node.
    var link = document.createElement('a');
    link.href = sUrl;
    link.setAttribute('target','_blank');

    if (link.download !== undefined) {
      //Set HTML5 download attribute. This will prevent file from opening if supported.
      var fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
      link.download = fileName;
    }

    //Dispatching click event.
    if (document.createEvent) {
      var e = document.createEvent('MouseEvents');
      e.initEvent('click', true, true);
      link.dispatchEvent(e);
      return true;
    }
  }

  // Force file download (whether supported by server).
  if (sUrl.indexOf('?') === -1) {
    sUrl += '?download';
  }

  window.open(sUrl, '_blank');
  return true;
};

//console.log('navigator.userAgent = ', navigator.userAgent);
window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

/* PouchDB websites
 http://pouchdb.com/api.html#database_information
 https://github.com/webinista/PouchNotes
 http://pouchdb.com/guides/databases.html
 */

/* web sites on Promises
 first one does a good job of explaining.
 http://www.html5rocks.com/en/tutorials/es6/promises/
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 http://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
 */

/* JSzip Websites
 http://stuk.github.io/jszip/documentation/api_jszip/load.html
 http://stuk.github.io/jszip/documentation/limitations.html
 https://thiscouldbebetter.wordpress.com/2013/08/06/reading-zip-files-in-javascript-using-jszip/

 binary data
 https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
 */

/* Writing files
 http://jsfiddle.net/uselesscode/qm5ag/
 http://jsfiddle.net/cowboy/hHZa9/
 http://jsfiddle.net/uselesscode/qm5ag/          // Pure JS
 FileSaver cannot tell when a file is done saving
 https://github.com/eligrey/FileSaver.js/     //for browsers that don't support SaveAs; does not know when done saving
    http://stackoverflow.com/questions/19521894/close-window-after-file-save-in-filesaver-js

 study these to see try to figure out if a file was actually saved
 http://stackoverflow.com/questions/13405129/javascript-create-and-save-file
 http://www.html5rocks.com/en/tutorials/file/filesystem/#toc-direntry
 */

/* Reading files
 API = https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 http://www.html5rocks.com/en/tutorials/file/dndfiles/
 http://jsfiddle.net/ebSS2/235/
 http://stackoverflow.com/questions/3582671/how-to-open-a-local-disk-file-with-javascript
 http://stackoverflow.com/questions/6463439/how-to-open-a-file-browse-dialog-using-javascript
 http://stackoverflow.com/questions/20822273/best-way-to-get-folder-and-file-list-in-javascript
 */

/* Name Spaces and single page apps
 http://singlepageappbook.com/index.html
 http://stackoverflow.com/questions/881515/how-do-i-declare-a-namespace-in-javascript
 http://stackoverflow.com/questions/881515/how-do-i-declare-a-namespace-in-javascript#answer-3588712
 https://www.kenneth-truyers.net/2013/04/27/javascript-namespaces-and-modules/
 https://addyosmani.com/blog/essential-js-namespacing/
 */

//console.log("tests for different browsers for download"); //wish I knew where the stuff below came from
//window.downloadFile.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
//window.downloadFile.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;

// Dojo file uploads and downloads
// https://infrequently.org/2005/12/file-uploading-with-dojo/
// http://www.mikejuniper.com/fun-with-dojoioiframesend/

// Iframe file download
// http://encosia.com/ajax-file-downloads-and-iframes/

// JQuery
// http://jsfiddle.net/a856P/51/
// http://jsfiddle.net/cowboy/hHZa9/

// usefule Dexie.db websites
//https://github.com/dfahlander/Dexie.js/wiki/Best%20Practices

/***********************************************************************************************************************
 * Trying to get a string from binary so we can save that in Safari .
 * So far it does not work in Safari, but looked like the idea worked in Firefox where we don't need it.
 /***********************************************************************************************************************

 //var theStr = btoa(content);  //does not work in either Firefox or Safari

 http://stackoverflow.com/questions/18650168/convert-blob-to-base64
 // Seems to work in Firefox, but not safari
 var reader = new window.FileReader();
 reader.readAsDataURL(content);
 reader.onloadend = function() {
    var base64data = reader.result;
    console.log(base64data );
  };
 var source = reader.readAsBinaryString(content);

 */