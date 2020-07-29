# SAP RFC 

Call RFC modules from SAP with ease. <br>No need for creating SAP Gateway oData services or creating them through SAP API Management<br>
If your app has access to the ABAP Backend, just call a Remote Function Module (SE37) directly.<br>
<br>
import RFC from 'saprfc'
<br><br>
Simplest call<br>

```javascript
const rfcsys = new RFC('GET_SYSTEM_DATA_RFC')
const xmlsys = await rfcsys.call()
state.system = rfcsys.json(xmlsys)
```

Simple call with parameters<br>

```javascript
 const rfc = new RFC('Z_MYRFC_USERSEARCH');
 const xml = await rfc.call({ LASTNAME: name })
 const resp = rfc.json(xml);
 state.users = rfc.castToArray( resp.RESULT.item )
```
ps: the castToArray is necessary for arrays because SAP will return empty arrays as "" and an array with 1 entry as an object. This castToArray will fix this and always return an array


## Env var
Set env var `VUE_APP_SAPSOAPURI` or `REACT_APP_SAPSOAPURI` to:<br>
VUE_APP_SAPSOAPURI=/sap/bc/soap/rfc?sap-client={{your-client-number}}

