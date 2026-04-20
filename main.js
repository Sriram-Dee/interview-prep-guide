function moveZero(arr) {
    let nonZeroIndex = 0;

    for(let i =0; i <arr.length; i++) {
        if(arr[i] !== 0) {
            arr[nonZeroIndex] = arr[i];
            nonZeroIndex++;
        }    }

        while(nonZeroIndex < arr.length) {
            arr[nonZeroIndex] = 0;
            nonZeroIndex++;
        }
    return arr;
}

/*{
1 : nonZeroIndex = 0, i = 0, arr[i] = 0, arr = [0, 1, 0, 3, 12]
if(arr[i] !== 0) {
    false and skips to next iteration, nonZeroIndex remains 0
}
2 : nonZeroIndex = 0, i = 1, arr[i] = 1, arr = [0, 1, 0, 3, 12]
if(arr[i] !== 0) {
    true
    arr[nonZeroIndex] = arr[i]; // arr[0] = 1
    nonZeroIndex++; // nonZeroIndex = 1
}
3 : nonZeroIndex = 1, i = 2, arr[i] = 0, arr = [1, 1, 0, 3, 12]
if(arr[i] !== 0) {
    false and skips to next iteration, nonZeroIndex remains 1  
}    
4 : nonZeroIndex = 1, i = 3, arr[i] = 3, arr = [1, 1, 0, 3, 12]
if(arr[i] !== 0) {
    true
    arr[nonZeroIndex] = arr[i]; // arr[1] = 3
    nonZeroIndex++; // nonZeroIndex = 2
}
5 : nonZeroIndex = 2, i = 4, arr[i] = 12, arr = [1, 3, 0, 3, 12]
if(arr[i] !== 0) {
    true
    arr[nonZeroIndex] = arr[i]; // arr[2] = 12
    nonZeroIndex++; // nonZeroIndex = 3
}
    
while(nonZeroIndex < arr.length) {
    arr[nonZeroIndex] = 0;
    nonZeroIndex++;
}
    
*/
// console.log(moveZero([0, 1, 0, 3, 12])); // Output: [1, 3, 12, 0, 0]

/*
function test (record) {
    if (record.age  ==30) {
        console.log("you are adult");
}else if(record.age === 30){
    console.log("you are still adult");
}else {
    console.log("you are not adult");}
}

test({age : 30}); // Output: "you are still adult"
test({age : 15}); // Output: "you are not adult"

*/



// console.log(+true);
// console.log(!"test");




/*
var a = {};
var b = {key: 'b'};
var c = {key: 'c'};

a[b] = 123;
b[c] = 456;

log(a); 
console.log(a[c]);
console.log(a[b]);
console.log(b[b]);
console.log(b[c]);

// step by step execution

// 1. a[b] = 123; // a["[object Object]"] = 123
// 2. b[c] = 456; // b["[object Object]"] = 456
// 3. log(a); // { '[object Object]': 123 }
// 4. console.log(a[c]); // a["[object Object]"] => 123
// 5. console.log(a[b]); // a["[object Object]"] => 123
// 6. console.log(b[b]); // b["[object Object]"] => 456
// 7. console.log(b[c]); // b["[object Object]"] => 456


"Because in JavaScript, when you use an object as a key in another object, it is converted to a string. In this case, both b and c are objects, so they are both converted to the string "[object Object]". Therefore, when you set a[b] and b[c], they both refer to the same key in their respective objects, which is why a[c] and a[b] return the same value (123), and b[b] and b[c] return the same value (456).
*/



/*
let str = "abcdef";
let str2 = 123
// output: "a1b2c3def"
let str3 = "abc";
let str4 = 123456;
// output: "a1b2c3456"

function interleaveStrings(str1, str2) {

    let index = str1.toString().length - 1 > str2.toString().length - 1 ? str1.toString().length - 1 : str2.toString().length - 1;

    let convertedStr1 = str1.toString();
    let convertedStr2 = str2.toString();
    let result = "";
    for (let i = 0; i <= index; i++) {
        result += convertedStr1[i] || "";
        result += convertedStr2[i] || "";
    }
    return result;

}

console.log(interleaveStrings(str, str2));
console.log(interleaveStrings(str3, str4));

// Clean code version

function interleaveStrings(str1, str2) {
  str1 = String(str1);
  str2 = String(str2);

  let result = "";
  let maxLength = Math.max(str1.length, str2.length);

  for (let i = 0; i < maxLength; i++) {
    if (str1[i]) result += str1[i];
    if (str2[i]) result += str2[i];
  }

  return result;
}

console.log(interleaveStrings("abcdef", 123));   // a1b2c3def
console.log(interleaveStrings("abc", 123456));   // a1b2c3456

*/
