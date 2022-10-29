import React from "react";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import isAlphanumeric from "validator/lib/isNumeric";


const Error = (props) => <div {...props} className="error-message" />;

export const required = (value, props, components) => {
  value = ("" + value).trim();
  if (!value) {
    return <Error>{"This field is required."}</Error>;
  }
};
export const email = (value, props, components) => {
  if (!isEmail(value)) {
    return <Error>{`${value} is not a valid email.`}</Error>;
  }
};
export const minlength = (value, props, components) => {
  if (!isLength(value, { min: 14 })) {
    return <Error>{`Password should be minimum 14 digit.`}</Error>;
  }
};
export const stringwithnumber = (value, props, components) => {
  if (isAlphanumeric(value)) {
    return <Error>{"Password should be alpha and numeric"}</Error>;
  }
};
