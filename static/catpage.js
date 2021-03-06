'use strict';

const BASE = '/api/';
const AWS = 'https://catsstorage.s3.eu-central-1.amazonaws.com/'
const catId = Number((window.location.search).substring(7));
console.log(catId);
const src = AWS + `${catId}.jpg`;
let currentGrade = null;

const GRADES_STRING = {
  '-1': 'Dislike',
  0: 'Neutral',
  1: 'Like'
};

const GRADES_DB = {
  0: 1,
  1: -1,
  2: 0
};

const loadMethods = methods => {
  const api = {};
  for (const method of methods)
  {
  api[method] = (args = {}) =>  new Promise((resolve, reject) => {
    const url = BASE + method;
    console.log(url, args);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(args),
    }).then(res => {
      const { status } = res;
      if (status !== 200) {
        reject(new Error(`Status Code: ${status}`));
        return;
      }
      resolve(res.json());
      });
    });
  }
  return api;
};

const api = loadMethods([
  'saveGrade',
  'getCatInfo',
  'checkPreviousGrade'
]);


let color = "RED";
let eyeColor = "GREEN";
let fluffy = "SHORT";


const scenario = async () => {
  const catInfo = await api.getCatInfo(catId);
  console.log(catInfo);
  color = (catInfo.cat).color;
  eyeColor = catInfo.cat.eyecolor;
  fluffy = catInfo.cat.fluffy;

}

//getPhoto();
scenario();



setTimeout(() => {
  document.getElementById("content").children[0].children[1].innerHTML = `<p style='margin-left: 15px;'>${color}</p>`
  document.getElementById("content").children[1].children[1].innerHTML = `<p style='margin-left: 15px;'>${eyeColor}</p>`
  document.getElementById("content").children[2].children[1].innerHTML = `<p style='margin-left: 15px;'>${fluffy}</p>`

  document.getElementById("content").children[3].innerHTML = `<div><img src=${src} height="200px"></div>`
}, 1000)


const getCurrentMark = async () => {

  currentGrade = await api.checkPreviousGrade({catId: catId})
  console.dir(currentGrade);
  currentGrade = GRADES_STRING[currentGrade.grade[0].grade];

  let currentMarkDiv = document.getElementById("currentMark");
  currentMarkDiv.innerHTML =  `<p style='margin-left: 15px;'>${currentGrade}</p>`

}


const getMark = async () => {
  let radioForm = document.getElementById("formA");
  const buttonsNumber = 3;

  for (let i = 0; i < buttonsNumber; i++){
      if (radioForm.children[i].children[0].checked){
          const gradeToDB = GRADES_DB[i];
          console.log(gradeToDB);
          const id = await api.saveGrade({catId: catId, grade: gradeToDB});
          console.log(id);
      }
    }
}

getMark();
