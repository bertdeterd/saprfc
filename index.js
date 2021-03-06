import xmlbuilder from "xmlbuilder";
//import axios from "axios";
import xml2js from "xml2js";

const rfcbuilder = function (name) {
  this.name = name;
  this.root = xmlbuilder.create(`urn:${this.name}`, { headless: true });
  this.rawresponse = null;
  this.requestbody = null;
  this.request = null;
  this.soapprefix =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions"><soapenv:Header/><soapenv:Body>';
  this.soappostfix = "</soapenv:Body></soapenv:Envelope>";
  this._responsetag = `${this.name}.Response`;
};

rfcbuilder.prototype.setRequest = function (object) {
  if (object) this.root.ele(object);
  this.requestbody = this.root.end({ pretty: false });
  this.request = this.soapprefix + this.requestbody + this.soappostfix;
};

rfcbuilder.prototype.getRoot = function () {
  return this.root;
};

rfcbuilder.prototype.getRequest = function () {
  return this.request;
};

rfcbuilder.prototype.call = async function (req) {
  console.debug(`Calling: ${this.name}`)
  if (req) this.setRequest(req);
  if (!this.request) {
    this.requestbody = this.root.end({ pretty: false });
    this.request = this.soapprefix + this.requestbody + this.soappostfix;
  }

  try {
    const fetchData = { method: 'POST', body: this.request, headers: { 'Content-Type': 'text/xml' } }
    const r = await fetch(process.env.VUE_APP_SAPSOAPURI || process.env.REACT_APP_SAPSOAPURI, fetchData)
    return await r.text()
  } catch (e) {
    throw new Error(`Call to ${this.name} failed`)
  }



  //axios disabled. see top of page
  //return await axios.post(process.env.VUE_APP_SAPSOAPURI || process.env.REACT_APP_SAPSOAPURI , this.request, {
  //  headers: { "Content-Type": "text/xml" },
  //});
};

rfcbuilder.prototype.json = function (resp) {
  const that = this;
  let res = null;
  const stripPrefix = xml2js.processors.stripPrefix;
  const parser = new xml2js.Parser({
    explicitArray: false,
    tagNameProcessors: [stripPrefix],
    attrNameProcessors: [stripPrefix],
  });
  //parser.parseString(resp.data, function(err, result) {
  parser.parseString(resp, function (err, result) {
    res = result.Envelope.Body[that._responsetag];
    delete res.$;
  });
  return res;
};

rfcbuilder.prototype.castToArray = function (r) {
  if (r == undefined) {
    return []
  }
  switch (typeof r) {
    case "string":
      return [];
    case undefined:
      return [];
    case "object":
      return Array.isArray(r) ? r : [r];
  }
};


rfcbuilder.prototype.abapBoolean = function (b) {
  switch (b) {
    case false:
      return "";
    case true:
      return "X";
    default:
      return "";
  }
};

rfcbuilder.toABAPArray = function (arr) {
  const mappedArr = arr.map(i => ({ item: i }))
  return mappedArr
}


rfcbuilder.bapiretOK = function (ret) {
  switch (ret.TYPE) {
    case "E":
      return false;
    case "A":
      return false;
    case "X":
      return false;
    default:
      return true;
  }
}



rfcbuilder.bapiretTabOK = function (tab) {
  let hasError = false
  if (tab == "") {
    return true
  }

  if (typeof tab === 'object') {
    if (tab.item.TYPE == "S" || tab.item.TYPE == "W" || tab.item.TYPE == "") {
      return true
    } else {
      return false
    }
  }

  tab.item.forEach(x => {
    if (x.TYPE == "E" || x.TYPE == "X" || x.TYPE == "A") {
      hasError = true
    }
  })

  return !hasError
}

rfcbuilder.toJSArray = function (r) {
  switch (typeof r) {
    case "string":
      return [];
    case "undefined":
      return [];
    case undefined:
      return [];
    case "object":
      return Array.isArray(r) ? r : [r];
  }
};

rfcbuilder.convertAbapMessageType = function (t) {
  switch (t) {
    case 'S': return "success";
    case "": return "success";
    case 'E': return "error";
    case 'W': return "warning";
    case 'I': return "information";
    default: return t
  }
}

export default rfcbuilder;