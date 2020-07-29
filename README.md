# SAP RFC 

Call Rfc modules from SAP with ease<br>

example:<br>
const rfcsys = new RFC('GET_SYSTEM_DATA_RFC')<br>
const xmlsys = await rfcsys.call()<br>
state.system = rfcsys.json(xmlsys)<br>
