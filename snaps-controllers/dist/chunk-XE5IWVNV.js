"use strict";Object.defineProperty(exports, "__esModule", {value: true});

var _chunkNOLPMHXSjs = require('./chunk-NOLPMHXS.js');

// src/utils.ts
var _snapssdk = require('@metamask/snaps-sdk');




var _snapsutils = require('@metamask/snaps-utils');
function setDiff(objectA, objectB) {
  return Object.entries(objectA).reduce(
    (acc, [key, value]) => {
      if (!(key in objectB)) {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );
}
function delay(ms, result) {
  return delayWithTimer(new (0, _chunkNOLPMHXSjs.Timer)(ms), result);
}
function delayWithTimer(timer, result) {
  let rejectFunc;
  const promise = new Promise((resolve, reject) => {
    timer.start(() => {
      result === void 0 ? resolve() : resolve(result);
    });
    rejectFunc = reject;
  });
  promise.cancel = () => {
    if (timer.status !== "finished") {
      timer.cancel();
      rejectFunc(new Error("The delay has been canceled."));
    }
  };
  return promise;
}
var hasTimedOut = Symbol(
  "Used to check if the requested promise has timeout (see withTimeout)"
);
async function withTimeout(promise, timerOrMs) {
  const timer = typeof timerOrMs === "number" ? new (0, _chunkNOLPMHXSjs.Timer)(timerOrMs) : timerOrMs;
  const delayPromise = delayWithTimer(timer, hasTimedOut);
  try {
    return await Promise.race([promise, delayPromise]);
  } finally {
    delayPromise.cancel();
  }
}
async function getSnapFiles(location, files) {
  if (!files || files.length === 0) {
    return [];
  }
  return await Promise.all(
    files.map(async (filePath) => location.fetch(filePath))
  );
}
async function fetchSnap(snapId, location) {
  try {
    const manifest = await location.manifest();
    const sourceCode = await location.fetch(
      manifest.result.source.location.npm.filePath
    );
    const { iconPath } = manifest.result.source.location.npm;
    const svgIcon = iconPath ? await location.fetch(iconPath) : void 0;
    const auxiliaryFiles = await getSnapFiles(
      location,
      manifest.result.source.files
    );
    await Promise.all(
      auxiliaryFiles.map(async (file) => {
        file.data.base64 = await _snapsutils.encodeBase64.call(void 0, file);
      })
    );
    const localizationFiles = await getSnapFiles(
      location,
      manifest.result.source.locales
    );
    const validatedLocalizationFiles = _snapsutils.getValidatedLocalizationFiles.call(void 0, localizationFiles);
    const files = {
      manifest,
      sourceCode,
      svgIcon,
      auxiliaryFiles,
      localizationFiles: validatedLocalizationFiles
    };
    await _snapsutils.validateFetchedSnap.call(void 0, files);
    return files;
  } catch (error) {
    throw new Error(
      `Failed to fetch snap "${snapId}": ${_snapssdk.getErrorMessage.call(void 0, error)}.`
    );
  }
}









exports.setDiff = setDiff; exports.delay = delay; exports.delayWithTimer = delayWithTimer; exports.hasTimedOut = hasTimedOut; exports.withTimeout = withTimeout; exports.getSnapFiles = getSnapFiles; exports.fetchSnap = fetchSnap;
//# sourceMappingURL=chunk-XE5IWVNV.js.map