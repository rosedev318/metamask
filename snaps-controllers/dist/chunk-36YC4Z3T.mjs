import {
  Timer
} from "./chunk-VOZOZKRC.mjs";

// src/utils.ts
import { getErrorMessage } from "@metamask/snaps-sdk";
import {
  encodeBase64,
  getValidatedLocalizationFiles,
  validateFetchedSnap
} from "@metamask/snaps-utils";
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
  return delayWithTimer(new Timer(ms), result);
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
  const timer = typeof timerOrMs === "number" ? new Timer(timerOrMs) : timerOrMs;
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
        file.data.base64 = await encodeBase64(file);
      })
    );
    const localizationFiles = await getSnapFiles(
      location,
      manifest.result.source.locales
    );
    const validatedLocalizationFiles = getValidatedLocalizationFiles(localizationFiles);
    const files = {
      manifest,
      sourceCode,
      svgIcon,
      auxiliaryFiles,
      localizationFiles: validatedLocalizationFiles
    };
    await validateFetchedSnap(files);
    return files;
  } catch (error) {
    throw new Error(
      `Failed to fetch snap "${snapId}": ${getErrorMessage(error)}.`
    );
  }
}

export {
  setDiff,
  delay,
  delayWithTimer,
  hasTimedOut,
  withTimeout,
  getSnapFiles,
  fetchSnap
};
//# sourceMappingURL=chunk-36YC4Z3T.mjs.map