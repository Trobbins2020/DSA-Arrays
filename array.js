const MEMORY = require("./memory");
let Memory = new MEMORY();
class Array {
  constructor() {
    this.length = 0;
    this._capacity = 0;
    this.ptr = Memory.allocate(this.length);
  }
  push(val) {
    if (this.length >= this._capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }
    Memory.set(this.ptr + this.length, val);
    this.length++;
  }
  _resize(size) {
    const oldPtr = this.ptr;
    this.ptr = Memory.allocate(size);
    if (this.ptr === null) {
      throw new Error("Out of memory");
    }
    Memory.copy(this.ptr, oldPtr, this.length);
    Memory.free(oldPtr);
    this._capacity = size;
  }
  get(index) {
    if (index < 0 || index >= this.length) {
      throw new Error("Index error");
    }
    return Memory.get(this.ptr + index);
  }
  pop() {
    if (this.length === 0) {
      throw new Error("Index error");
    }
    const value = Memory.get(this.ptr + this.length - 1);
    this.length--;
    return value;
  }
  insert(index, value) {
    if (index < 0 || index >= this.length) {
      throw new Error("Index error");
    }
    if (this.length >= this._capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }
    Memory.copy(this.ptr + index + 1, this.ptr + index, this.length - index);
    Memory.set(this.ptr + index, value);
    this.length++;
  }
  remove(index) {
    if (index < 0 || index >= this.length) {
      throw new Error("Index error");
    }
    Memory.copy(
      this.ptr + index,
      this.ptr + index + 1,
      this.length - index - 1
    );
    this.length--;
  }
}
function main() {
  Array.SIZE_RATIO = 3;
  // Create an instance of the Array class
  let arr = new Array();
  // Add an item to the array
  arr.push(3);
  //   console.log(arr);
  arr.push(5);
  arr.push(15);
  arr.push(19);
  arr.push(45);
  arr.push(10);
  //   console.log(arr);
  arr.pop();
  arr.pop();
  arr.pop();
  //   console.log(arr);
  //   console.log(arr.get(0));
  arr.pop();
  arr.pop();
  arr.pop();
  arr.push("tauhida");
  console.log(arr);
  console.log(arr.get(0));
}
main();
// 1. Array { length: 1, _capacity: 3, ptr: 0 }
// 2. Array { length: 6, _capacity: 12, ptr: 3 } - Pushed Number is added at the beginning of the array
// 3. Array { length: 3, _capacity: 12, ptr: 3 } - New values added to the array as empty spaces, length decreased by 3 because of Pop
// 4. 3
// Nan - Allocates memory for new values into an array
// 5. _resize() function in array class is used to freeing the old space and assigning new space in memory, array will still perform same just memory address will be new.
