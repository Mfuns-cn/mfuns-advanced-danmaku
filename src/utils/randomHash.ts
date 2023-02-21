/** 获取随机Hash值 */

function initHash() {
  let count: number = 100;

  return function (hashLength: number = 8) {
    let ar: Array<string> = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    let hs: Array<string> = [];
    let hl: number = Number(hashLength);
    let al: number = ar.length;
    for (let i = 0; i < hl; i++) {
      hs.push(ar[Math.floor(Math.random() * al)]);
    }
    count++;
    return hs.join("") + `${count}`;
  };
}

const randomHash: (hashLength: number) => string = initHash();

export default randomHash;
