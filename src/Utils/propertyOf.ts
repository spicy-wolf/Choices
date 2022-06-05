// https://stackoverflow.com/questions/33547583/safe-way-to-extract-property-names
export const propertyOf = <TObj>(name: keyof TObj) => name;
