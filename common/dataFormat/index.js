import React from "react";

export const dropDownFormat = (data) => {
  const finalFormatData = data.map((item) => {
    return {
      label: item.name ? item.name : item.value,
      value: item.id,
    };
  });
  return finalFormatData;
};

export const userLicenseFormat = (data) => {
  data.forEach((element) => {
    let stateList = [
      {
        id: element.state_id,
        value: element.state_name,
      },
    ];
    element.stateList = stateList;
    element.id = new Date();
  });
  return data;
};

export const reqeustBodyArrayFormat = (data) => {
    let dataArray =
      data &&
      data.map((x) => {
        return {
          id: x.value,
        };
      });
    return dataArray;
  };