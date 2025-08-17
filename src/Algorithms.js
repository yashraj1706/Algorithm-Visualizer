// Unified animation step format across algorithms
// Step types:
// - { type: 'highlight', indices: [i, j] }
// - { type: 'unhighlight', indices: [i, j] }
// - { type: 'set', index: i, value: number }
// - { type: 'mark', index: i, color: string }

// Merge Sort
export function getMergeSortSteps(input) {
  const arr = input.slice();
  const aux = arr.slice();
  const steps = [];
  function mergeSort(start, end) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    mergeSort(start, mid);
    mergeSort(mid + 1, end);
    merge(start, mid, end);
  }
  function merge(start, mid, end) {
    let i = start,
      j = mid + 1,
      k = start;
    while (i <= mid && j <= end) {
      steps.push({ type: "highlight", indices: [i, j] });
      steps.push({ type: "unhighlight", indices: [i, j] });
      if (aux[i] <= aux[j]) {
        steps.push({ type: "set", index: k, value: aux[i] });
        arr[k++] = aux[i++];
      } else {
        steps.push({ type: "set", index: k, value: aux[j] });
        arr[k++] = aux[j++];
      }
    }
    while (i <= mid) {
      steps.push({ type: "highlight", indices: [i, i] });
      steps.push({ type: "unhighlight", indices: [i, i] });
      steps.push({ type: "set", index: k, value: aux[i] });
      arr[k++] = aux[i++];
    }
    while (j <= end) {
      steps.push({ type: "highlight", indices: [j, j] });
      steps.push({ type: "unhighlight", indices: [j, j] });
      steps.push({ type: "set", index: k, value: aux[j] });
      arr[k++] = aux[j++];
    }
    // copy back to aux
    for (let t = start; t <= end; t++) aux[t] = arr[t];
  }
  mergeSort(0, arr.length - 1);
  return steps;
}

// Bubble Sort
export function getBubbleSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  const n = arr.length;
  let sorted = false;
  for (let i = 0; i < n - 1 && !sorted; i++) {
    sorted = true;
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push({ type: "highlight", indices: [j, j + 1] });
      steps.push({ type: "unhighlight", indices: [j, j + 1] });
      if (arr[j] > arr[j + 1]) {
        const a = arr[j + 1],
          b = arr[j];
        arr[j] = a;
        arr[j + 1] = b;
        steps.push({ type: "set", index: j, value: a });
        steps.push({ type: "set", index: j + 1, value: b });
        sorted = false;
      } else {
        // keep as is to maintain consistent timing
        steps.push({ type: "set", index: j, value: arr[j] });
        steps.push({ type: "set", index: j + 1, value: arr[j + 1] });
      }
    }
  }
  return steps;
}

// Insertion Sort
export function getInsertionSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      steps.push({ type: "highlight", indices: [j, j + 1] });
      steps.push({ type: "unhighlight", indices: [j, j + 1] });
      arr[j + 1] = arr[j];
      steps.push({ type: "set", index: j + 1, value: arr[j] });
      j--;
    }
    arr[j + 1] = key;
    steps.push({ type: "set", index: j + 1, value: key });
  }
  return steps;
}

// Selection Sort
export function getSelectionSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ type: "highlight", indices: [minIdx, j] });
      steps.push({ type: "unhighlight", indices: [minIdx, j] });
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      const a = arr[minIdx],
        b = arr[i];
      arr[i] = a;
      arr[minIdx] = b;
      steps.push({ type: "set", index: i, value: a });
      steps.push({ type: "set", index: minIdx, value: b });
    }
  }
  return steps;
}

// Quick Sort (Lomuto partition)
export function getQuickSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  function swap(i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
    steps.push({ type: "set", index: i, value: arr[i] });
    steps.push({ type: "set", index: j, value: arr[j] });
  }
  function partition(lo, hi) {
    const pivot = arr[hi];
    steps.push({ type: "mark", index: hi, color: "orange" });
    let i = lo;
    for (let j = lo; j < hi; j++) {
      steps.push({ type: "highlight", indices: [j, hi] });
      steps.push({ type: "unhighlight", indices: [j, hi] });
      if (arr[j] <= pivot) {
        if (i !== j) swap(i, j);
        i++;
      }
    }
    swap(i, hi);
    return i;
  }
  function qsort(lo, hi) {
    if (lo >= hi) return;
    const p = partition(lo, hi);
    qsort(lo, p - 1);
    qsort(p + 1, hi);
  }
  qsort(0, arr.length - 1);
  return steps;
}

// Heap Sort (max-heap)
export function getHeapSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  const n = arr.length;
  const left = (i) => 2 * i + 1;
  const right = (i) => 2 * i + 2;
  function swap(i, j) {
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
    steps.push({ type: "set", index: i, value: arr[i] });
    steps.push({ type: "set", index: j, value: arr[j] });
  }
  function heapify(i, size) {
    let largest = i;
    const l = left(i),
      r = right(i);
    if (l < size) {
      steps.push({ type: "highlight", indices: [i, l] });
      steps.push({ type: "unhighlight", indices: [i, l] });
      if (arr[l] > arr[largest]) largest = l;
    }
    if (r < size) {
      steps.push({ type: "highlight", indices: [largest, r] });
      steps.push({ type: "unhighlight", indices: [largest, r] });
      if (arr[r] > arr[largest]) largest = r;
    }
    if (largest !== i) {
      swap(i, largest);
      heapify(largest, size);
    }
  }
  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(i, n);
  // Extract elements
  for (let end = n - 1; end > 0; end--) {
    swap(0, end);
    heapify(0, end);
  }
  return steps;
}

// Shell Sort (gap insertion)
export function getShellSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  const n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        steps.push({ type: "highlight", indices: [j - gap, j] });
        steps.push({ type: "unhighlight", indices: [j - gap, j] });
        arr[j] = arr[j - gap];
        steps.push({ type: "set", index: j, value: arr[j] });
        j -= gap;
      }
      arr[j] = temp;
      steps.push({ type: "set", index: j, value: temp });
    }
  }
  return steps;
}

// Cocktail Shaker Sort
export function getCocktailSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  let start = 0;
  let end = arr.length - 1;
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = start; i < end; i++) {
      steps.push({ type: "highlight", indices: [i, i + 1] });
      steps.push({ type: "unhighlight", indices: [i, i + 1] });
      if (arr[i] > arr[i + 1]) {
        const a = arr[i + 1],
          b = arr[i];
        arr[i] = a;
        arr[i + 1] = b;
        steps.push({ type: "set", index: i, value: a });
        steps.push({ type: "set", index: i + 1, value: b });
        swapped = true;
      }
    }
    if (!swapped) break;
    swapped = false;
    end--;
    for (let i = end - 1; i >= start; i--) {
      steps.push({ type: "highlight", indices: [i, i + 1] });
      steps.push({ type: "unhighlight", indices: [i, i + 1] });
      if (arr[i] > arr[i + 1]) {
        const a = arr[i + 1],
          b = arr[i];
        arr[i] = a;
        arr[i + 1] = b;
        steps.push({ type: "set", index: i, value: a });
        steps.push({ type: "set", index: i + 1, value: b });
        swapped = true;
      }
    }
    start++;
  }
  return steps;
}

export const AlgorithmRegistry = {
  "Merge Sort": getMergeSortSteps,
  "Quick Sort": getQuickSortSteps,
  "Heap Sort": getHeapSortSteps,
  "Bubble Sort": getBubbleSortSteps,
  "Insertion Sort": getInsertionSortSteps,
  "Selection Sort": getSelectionSortSteps,
  "Shell Sort": getShellSortSteps,
  "Cocktail Sort": getCocktailSortSteps,
};
