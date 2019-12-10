import { get as getField } from "lodash";
import { parseCookies, setCookie, destroyCookie } from "nookies";
var cookie = require("cookie");

const get = (ctx, name) => {
  const cookieObj = parseCookies(ctx);
  return getField(cookieObj, name) || getField(ctx, ["tempCookie", name]);
};

const set = (ctx, name, value) => {
  console.log("set cookie for ", name);
  console.log(`value of ${name}: `, value);
  setCookie(ctx, name, value, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/"
  });

  if (ctx) {
    ctx.tempCookie = ctx.tempCookie || {};
    ctx.tempCookie[name] = value;
  }
};

const destroy = (ctx, name) => {
  console.log("destroy cookie for ", name);
  if (ctx) {
    destroyCookie(ctx, name);
  } else {
    cookie.serialize(name);
  }
};

export default {
  get,
  set,
  destroy
};
