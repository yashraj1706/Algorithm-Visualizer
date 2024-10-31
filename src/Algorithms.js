export function getMergeSortAnimations(array) {
    const animations = [];
    if (array.length <= 1) return array;
    const auxiliaryArray = array.slice();
    mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
    return animations;
  }
  
  function mergeSortHelper(
    mainArray,
    startIdx,
    endIdx,
    auxiliaryArray,
    animations,
  ) {
    if (startIdx === endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
    mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
    doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
  }
  
  function doMerge(
    mainArray,
    startIdx,
    middleIdx,
    endIdx,
    auxiliaryArray,
    animations,
  ) {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    while (i <= middleIdx && j <= endIdx) {
      animations.push([i, j]);
      animations.push([i, j]);
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        animations.push([k, auxiliaryArray[i]]);
        mainArray[k++] = auxiliaryArray[i++];
      } else {
        animations.push([k, auxiliaryArray[j]]);
        mainArray[k++] = auxiliaryArray[j++];
      }
    }
    while (i <= middleIdx) {
      animations.push([i, i]);
      animations.push([i, i]);
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    }
    while (j <= endIdx) {
      animations.push([j, j]);
      animations.push([j, j]);
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }

  export function getBubbleSortAnimations(array) {
    const animations = [];
    const n = array.length;
    let sorted = false;
    
    for (let i = 0; i < n - 1 && !sorted; i++) {
      sorted = true;
      for (let j = 0; j < n - 1 - i; j++) {
        animations.push([j, j + 1]); // Comparison (color change)
        animations.push([j, j + 1]); // Revert color back
  
        if (array[j] > array[j + 1]) {
          animations.push([j, array[j + 1]]); // Height change
          animations.push([j + 1, array[j]]); // Height change
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          sorted = false;
        } else {
          animations.push([j, array[j]]); // No height change, keep same
          animations.push([j + 1, array[j + 1]]); // No height change, keep same
        }
      }
    }
    return animations;
  }

  export function getInsertionSortAnimations(array) {
    const animations = [];
    const n = array.length;
  
    for (let i = 1; i < n; i++) {
      let key = array[i];
      let j = i - 1;
  
      while (j >= 0 && array[j] > key) {
        animations.push([j, j + 1]); // Comparison (color change)
        animations.push([j, j + 1]); // Revert color back
        animations.push([j + 1, array[j]]); // Shift value to the right
        array[j + 1] = array[j];
        j--;
      }
      animations.push([j + 1, key]); // Place key in correct position
      array[j + 1] = key;
    }
  
    return animations;
  }

  export function getSelectionSortAnimations(array) {
    const animations = [];
    const n = array.length;
  
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        animations.push([minIdx, j]); // Comparison (color change)
        animations.push([minIdx, j]); // Revert color back
        if (array[j] < array[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        animations.push([i, array[minIdx]]); // Height change
        animations.push([minIdx, array[i]]); // Height change
        [array[i], array[minIdx]] = [array[minIdx], array[i]];
      }
    }
  
    return animations;
  }
  