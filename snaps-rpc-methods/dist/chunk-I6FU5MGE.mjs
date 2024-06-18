// src/permitted/getFile.ts
import { rpcErrors } from "@metamask/rpc-errors";
import { AuxiliaryFileEncoding, enumValue } from "@metamask/snaps-sdk";
import { assertStruct } from "@metamask/utils";
import { object, optional, string, union } from "superstruct";
var GetFileArgsStruct = object({
  path: string(),
  encoding: optional(
    union([
      enumValue(AuxiliaryFileEncoding.Base64),
      enumValue(AuxiliaryFileEncoding.Hex),
      enumValue(AuxiliaryFileEncoding.Utf8)
    ])
  )
});
var hookNames = {
  getSnapFile: true
};
var getFileHandler = {
  methodNames: ["snap_getFile"],
  implementation,
  hookNames
};
async function implementation(req, res, _next, end, { getSnapFile }) {
  const { params } = req;
  assertStruct(
    params,
    GetFileArgsStruct,
    'Invalid "snap_getFile" parameters',
    rpcErrors.invalidParams
  );
  try {
    res.result = await getSnapFile(
      params.path,
      params.encoding ?? AuxiliaryFileEncoding.Base64
    );
  } catch (error) {
    return end(error);
  }
  return end();
}

export {
  GetFileArgsStruct,
  getFileHandler
};
//# sourceMappingURL=chunk-I6FU5MGE.mjs.map