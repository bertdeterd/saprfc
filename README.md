# SAP RFC 

[![License](http://img.shields.io/npm/l/saprfc.svg?style=flat-square)](http://opensource.org/licenses/ISC)
[![NPM Version](http://img.shields.io/npm/v/saprfc.svg?style=flat-square)](https://npmjs.com/package/saprfc)
[![NPM Downloads](https://img.shields.io/npm/dm/saprfc.svg?style=flat-square)](https://npmjs.com/package/saprfc)

Call RFC modules from SAP with Ease. <br>
No need for creating SAP Gateway oData services or creating them through SAP API Management<br>
If your app has access to the ABAP Backend, just call a Remote Function Module (SE37) directly.<br>
<br>
```javascript
import RFC from 'saprfc'
```
<br><br>
Simplest call (if no import parameters are needed)<br>

```javascript
const rfcsys = new RFC('GET_SYSTEM_DATA_RFC')
const xmlsys = await rfcsys.call()
state.system = rfcsys.json(xmlsys)
//state.system results in : {EV_CLIENT: "100", EV_SYSID: "DEV"}
```

Simple call with parameters<br>

```javascript
 const rfc = new RFC('Z_MYRFC_USERSEARCH');
 const xml = await rfc.call({ LASTNAME: name })
 const resp = rfc.json(xml);
 state.users = rfc.castToArray( resp.RESULT.item )
```
ps: the castToArray is necessary for arrays because SAP will return empty arrays as "" and an array with 1 entry as an object. This castToArray will fix this and always return an array

<br>

For complex calls you can use javascript<br>
```javascript
 //give me all users from SAP with some part of a lastname (_name) and between userids 000000 - 999999
 const rfc = new RFC('BAPI_USER_GETLIST');
 const xml = await rfc.call(
    { WITH_USERNAME: "X", 
      USERLIST: { item: [] }, 
      SELECTION_RANGE: { item: 
        [   { PARAMETER: "ADDRESS", FIELD: "LASTNAME", SIGN : "I", OPTION: "CP", LOW: `*${_name}*`}, 
            { PARAMETER: "USERNAME", FIELD: "", SIGN : "I", OPTION: "BT", LOW: "000000", HIGH: "999999"}
        ] 
      } 
    } )
const { USERLIST } = rfc.json(xml);
state.users = rfc.castToArray(USERLIST.item) 
//state.users results in : [ { FULLNAME: "S.A.P. Test", LASTNAME: "Test", USERNAME: "100000" }, .....]  
```
<br>
For even more complex calls you can get the root object with getRoot() and build the request payload yourself. See the documentation from xmlbuilder package how to do that. You can do a lot with plain JS though so probably you do not need this:<br>

```javascript
const root = rfc.getRoot()
const p = root.ele("PARAMETERS");
p.ele("CASEGUID", state.guid );
p.ele("CHANGETIME", state.changetoken );
const r = await rfc.call();
```



## Env var
Set env var `VUE_APP_SAPSOAPURI` or `REACT_APP_SAPSOAPURI` to:<br>
VUE_APP_SAPSOAPURI=/sap/bc/soap/rfc?sap-client={{your-client-number}}

