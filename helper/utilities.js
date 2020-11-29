const clone = (obj) => Object.assign({}, obj);

function replaceKey(object, oldKey, newKey) {
    if (oldKey !== newKey) {
        const clonedObj = clone(object);
        let isKeyInDoubleQuote = oldKey.includes(`"`);
        oldKey = isKeyInDoubleQuote ? oldKey.replace(/"/g, '') : oldKey;

        const targetKey = clonedObj[oldKey];

        delete clonedObj[oldKey];
        clonedObj[newKey] = targetKey;
        return clonedObj;
    }
}


/**
 * 
 * @param {array<Object>} keysArray is the array of object, each object containing key value pairs of oldKey and newKey based on which json object would be modified
 * @param {string} keyToAppendIn_url accepts the string value that need to be appended at the end of the _url
 * @param {Object} jsonObject that needs to be transformed in the way import accepts file.
 * @returns the transformed object suitable to post on the import extractors
 */
function _replaceKeys(keysArray, keyToAppendIn_url, jsonObject) {
    if (keysArray.length && jsonObject) {
        keysArray.forEach(key => {
            if (key.old && key.new) {
                if (key.new != "_url") {
                    let oldKey = key.old;
					let isKeyInDoubleQuote = oldKey.includes(`"`);
					oldKey = isKeyInDoubleQuote ? oldKey.replace(/"/g, '') : oldKey;
                    let temp = jsonObject[oldKey];
                    jsonObject[oldKey] = [temp];
                }
                jsonObject = replaceKey(jsonObject, key.old, key.new);
            }
        });

        // appending the TAG in the url, if the tag is provided
        if (keyToAppendIn_url) {
            jsonObject._url = `${jsonObject._url}${keyToAppendIn_url}`;
        }

        return jsonObject;
    } else {
        console.log('Object is not formatted');
        console.log(jsonObject)
        return {}
    }
}


module.exports = { _replaceKeys }