// core/utils/getParam.ts
export const getParam = (param: string | string[]): string => {
  return Array.isArray(param) ? param[0] : param;
};
