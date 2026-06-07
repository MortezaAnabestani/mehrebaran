// object-id.type.ts
export type ObjectId = string & { readonly _bsontype: "ObjectId" };
