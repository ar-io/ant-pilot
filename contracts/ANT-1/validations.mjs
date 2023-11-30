"use strict";export const validateSetRecord = validate10;const schema11 = {"$id":"#/definitions/setRecord","type":"object","properties":{"function":{"type":"string","const":"setRecord"},"subDomain":{"type":"string","pattern":"^(?:[a-zA-Z0-9_-]+|@)$"},"transactionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]{43}$"},"ttlSeconds":{"type":"integer","minimum":900,"maximum":2592000}},"required":["subDomain","transactionId","ttlSeconds"],"additionalProperties":false};const pattern0 = new RegExp("^(?:[a-zA-Z0-9_-]+|@)$", "u");const pattern1 = new RegExp("^[a-zA-Z0-9_-]{43}$", "u");function validate10(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){/*# sourceURL="#/definitions/setRecord" */;let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((((data.subDomain === undefined) && (missing0 = "subDomain")) || ((data.transactionId === undefined) && (missing0 = "transactionId"))) || ((data.ttlSeconds === undefined) && (missing0 = "ttlSeconds"))){validate10.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!((((key0 === "function") || (key0 === "subDomain")) || (key0 === "transactionId")) || (key0 === "ttlSeconds"))){validate10.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];return false;break;}}if(_errs1 === errors){if(data.function !== undefined){let data0 = data.function;const _errs2 = errors;if(typeof data0 !== "string"){validate10.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}if("setRecord" !== data0){validate10.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/const",keyword:"const",params:{allowedValue: "setRecord"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.subDomain !== undefined){let data1 = data.subDomain;const _errs4 = errors;if(errors === _errs4){if(typeof data1 === "string"){if(!pattern0.test(data1)){validate10.errors = [{instancePath:instancePath+"/subDomain",schemaPath:"#/properties/subDomain/pattern",keyword:"pattern",params:{pattern: "^(?:[a-zA-Z0-9_-]+|@)$"},message:"must match pattern \""+"^(?:[a-zA-Z0-9_-]+|@)$"+"\""}];return false;}}else {validate10.errors = [{instancePath:instancePath+"/subDomain",schemaPath:"#/properties/subDomain/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}var valid0 = _errs4 === errors;}else {var valid0 = true;}if(valid0){if(data.transactionId !== undefined){let data2 = data.transactionId;const _errs6 = errors;if(errors === _errs6){if(typeof data2 === "string"){if(!pattern1.test(data2)){validate10.errors = [{instancePath:instancePath+"/transactionId",schemaPath:"#/properties/transactionId/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{43}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{43}$"+"\""}];return false;}}else {validate10.errors = [{instancePath:instancePath+"/transactionId",schemaPath:"#/properties/transactionId/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}var valid0 = _errs6 === errors;}else {var valid0 = true;}if(valid0){if(data.ttlSeconds !== undefined){let data3 = data.ttlSeconds;const _errs8 = errors;if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){validate10.errors = [{instancePath:instancePath+"/ttlSeconds",schemaPath:"#/properties/ttlSeconds/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];return false;}if(errors === _errs8){if((typeof data3 == "number") && (isFinite(data3))){if(data3 > 2592000 || isNaN(data3)){validate10.errors = [{instancePath:instancePath+"/ttlSeconds",schemaPath:"#/properties/ttlSeconds/maximum",keyword:"maximum",params:{comparison: "<=", limit: 2592000},message:"must be <= 2592000"}];return false;}else {if(data3 < 900 || isNaN(data3)){validate10.errors = [{instancePath:instancePath+"/ttlSeconds",schemaPath:"#/properties/ttlSeconds/minimum",keyword:"minimum",params:{comparison: ">=", limit: 900},message:"must be >= 900"}];return false;}}}}var valid0 = _errs8 === errors;}else {var valid0 = true;}}}}}}}else {validate10.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate10.errors = vErrors;return errors === 0;}export const validateRemoveRecord = validate11;const schema12 = {"$id":"#/definitions/removeRecord","type":"object","properties":{"function":{"type":"string","const":"removeRecord"},"subDomain":{"type":"string","pattern":"^[a-zA-Z0-9_-]+$"}},"required":["subDomain"],"additionalProperties":false};const pattern2 = new RegExp("^[a-zA-Z0-9_-]+$", "u");function validate11(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){/*# sourceURL="#/definitions/removeRecord" */;let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.subDomain === undefined) && (missing0 = "subDomain")){validate11.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!((key0 === "function") || (key0 === "subDomain"))){validate11.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];return false;break;}}if(_errs1 === errors){if(data.function !== undefined){let data0 = data.function;const _errs2 = errors;if(typeof data0 !== "string"){validate11.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}if("removeRecord" !== data0){validate11.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/const",keyword:"const",params:{allowedValue: "removeRecord"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.subDomain !== undefined){let data1 = data.subDomain;const _errs4 = errors;if(errors === _errs4){if(typeof data1 === "string"){if(!pattern2.test(data1)){validate11.errors = [{instancePath:instancePath+"/subDomain",schemaPath:"#/properties/subDomain/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]+$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]+$"+"\""}];return false;}}else {validate11.errors = [{instancePath:instancePath+"/subDomain",schemaPath:"#/properties/subDomain/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}var valid0 = _errs4 === errors;}else {var valid0 = true;}}}}}else {validate11.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate11.errors = vErrors;return errors === 0;}export const validateSetController = validate12;const schema13 = {"$id":"#/definitions/setController","type":"object","properties":{"function":{"type":"string","const":"setController"},"target":{"type":"string","pattern":"^[a-zA-Z0-9_-]{43}$"}},"required":["target"],"additionalProperties":false};function validate12(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){/*# sourceURL="#/definitions/setController" */;let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.target === undefined) && (missing0 = "target")){validate12.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!((key0 === "function") || (key0 === "target"))){validate12.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];return false;break;}}if(_errs1 === errors){if(data.function !== undefined){let data0 = data.function;const _errs2 = errors;if(typeof data0 !== "string"){validate12.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}if("setController" !== data0){validate12.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/const",keyword:"const",params:{allowedValue: "setController"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.target !== undefined){let data1 = data.target;const _errs4 = errors;if(errors === _errs4){if(typeof data1 === "string"){if(!pattern1.test(data1)){validate12.errors = [{instancePath:instancePath+"/target",schemaPath:"#/properties/target/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{43}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{43}$"+"\""}];return false;}}else {validate12.errors = [{instancePath:instancePath+"/target",schemaPath:"#/properties/target/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}var valid0 = _errs4 === errors;}else {var valid0 = true;}}}}}else {validate12.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate12.errors = vErrors;return errors === 0;}export const validateRemoveController = validate13;const schema14 = {"$id":"#/definitions/removeController","type":"object","properties":{"function":{"type":"string","const":"removeController"},"target":{"type":"string","pattern":"^[a-zA-Z0-9_-]{43}$"}},"required":["target"],"additionalProperties":false};function validate13(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){/*# sourceURL="#/definitions/removeController" */;let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.target === undefined) && (missing0 = "target")){validate13.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!((key0 === "function") || (key0 === "target"))){validate13.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];return false;break;}}if(_errs1 === errors){if(data.function !== undefined){let data0 = data.function;const _errs2 = errors;if(typeof data0 !== "string"){validate13.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}if("removeController" !== data0){validate13.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/const",keyword:"const",params:{allowedValue: "removeController"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.target !== undefined){let data1 = data.target;const _errs4 = errors;if(errors === _errs4){if(typeof data1 === "string"){if(!pattern1.test(data1)){validate13.errors = [{instancePath:instancePath+"/target",schemaPath:"#/properties/target/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{43}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{43}$"+"\""}];return false;}}else {validate13.errors = [{instancePath:instancePath+"/target",schemaPath:"#/properties/target/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}var valid0 = _errs4 === errors;}else {var valid0 = true;}}}}}else {validate13.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate13.errors = vErrors;return errors === 0;}export const validateSetName = validate14;const schema15 = {"$id":"#/definitions/setName","type":"object","properties":{"function":{"type":"string","const":"setName"},"name":{"type":"string"}},"required":["name"],"additionalProperties":false};function validate14(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){/*# sourceURL="#/definitions/setName" */;let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.name === undefined) && (missing0 = "name")){validate14.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!((key0 === "function") || (key0 === "name"))){validate14.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];return false;break;}}if(_errs1 === errors){if(data.function !== undefined){let data0 = data.function;const _errs2 = errors;if(typeof data0 !== "string"){validate14.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}if("setName" !== data0){validate14.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/const",keyword:"const",params:{allowedValue: "setName"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.name !== undefined){const _errs4 = errors;if(typeof data.name !== "string"){validate14.errors = [{instancePath:instancePath+"/name",schemaPath:"#/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs4 === errors;}else {var valid0 = true;}}}}}else {validate14.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate14.errors = vErrors;return errors === 0;}export const validateSetTicker = validate15;const schema16 = {"$id":"#/definitions/setTicker","type":"object","properties":{"function":{"type":"string","const":"setTicker"},"ticker":{"type":"string"}},"required":["ticker"],"additionalProperties":false};function validate15(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){/*# sourceURL="#/definitions/setTicker" */;let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.ticker === undefined) && (missing0 = "ticker")){validate15.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!((key0 === "function") || (key0 === "ticker"))){validate15.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];return false;break;}}if(_errs1 === errors){if(data.function !== undefined){let data0 = data.function;const _errs2 = errors;if(typeof data0 !== "string"){validate15.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}if("setTicker" !== data0){validate15.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/const",keyword:"const",params:{allowedValue: "setTicker"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.ticker !== undefined){const _errs4 = errors;if(typeof data.ticker !== "string"){validate15.errors = [{instancePath:instancePath+"/ticker",schemaPath:"#/properties/ticker/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}var valid0 = _errs4 === errors;}else {var valid0 = true;}}}}}else {validate15.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate15.errors = vErrors;return errors === 0;}export const validateBalance = validate16;const schema17 = {"$id":"#/definitions/balance","type":"object","properties":{"function":{"type":"string","const":"balance"},"target":{"type":"string","pattern":"^[a-zA-Z0-9_-]{43}$"}},"required":["target"],"additionalProperties":false};function validate16(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){/*# sourceURL="#/definitions/balance" */;let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.target === undefined) && (missing0 = "target")){validate16.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!((key0 === "function") || (key0 === "target"))){validate16.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];return false;break;}}if(_errs1 === errors){if(data.function !== undefined){let data0 = data.function;const _errs2 = errors;if(typeof data0 !== "string"){validate16.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}if("balance" !== data0){validate16.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/const",keyword:"const",params:{allowedValue: "balance"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.target !== undefined){let data1 = data.target;const _errs4 = errors;if(errors === _errs4){if(typeof data1 === "string"){if(!pattern1.test(data1)){validate16.errors = [{instancePath:instancePath+"/target",schemaPath:"#/properties/target/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{43}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{43}$"+"\""}];return false;}}else {validate16.errors = [{instancePath:instancePath+"/target",schemaPath:"#/properties/target/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}var valid0 = _errs4 === errors;}else {var valid0 = true;}}}}}else {validate16.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate16.errors = vErrors;return errors === 0;}export const validateTransferTokens = validate17;const schema18 = {"$id":"#/definitions/transferTokens","type":"object","properties":{"function":{"type":"string","const":"transfer"},"target":{"type":"string","pattern":"^[a-zA-Z0-9_-]{43}$"}},"required":["target"],"additionalProperties":false};function validate17(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){/*# sourceURL="#/definitions/transferTokens" */;let vErrors = null;let errors = 0;if(errors === 0){if(data && typeof data == "object" && !Array.isArray(data)){let missing0;if((data.target === undefined) && (missing0 = "target")){validate17.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];return false;}else {const _errs1 = errors;for(const key0 in data){if(!((key0 === "function") || (key0 === "target"))){validate17.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];return false;break;}}if(_errs1 === errors){if(data.function !== undefined){let data0 = data.function;const _errs2 = errors;if(typeof data0 !== "string"){validate17.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}if("transfer" !== data0){validate17.errors = [{instancePath:instancePath+"/function",schemaPath:"#/properties/function/const",keyword:"const",params:{allowedValue: "transfer"},message:"must be equal to constant"}];return false;}var valid0 = _errs2 === errors;}else {var valid0 = true;}if(valid0){if(data.target !== undefined){let data1 = data.target;const _errs4 = errors;if(errors === _errs4){if(typeof data1 === "string"){if(!pattern1.test(data1)){validate17.errors = [{instancePath:instancePath+"/target",schemaPath:"#/properties/target/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9_-]{43}$"},message:"must match pattern \""+"^[a-zA-Z0-9_-]{43}$"+"\""}];return false;}}else {validate17.errors = [{instancePath:instancePath+"/target",schemaPath:"#/properties/target/type",keyword:"type",params:{type: "string"},message:"must be string"}];return false;}}var valid0 = _errs4 === errors;}else {var valid0 = true;}}}}}else {validate17.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];return false;}}validate17.errors = vErrors;return errors === 0;}