import { AlgorithmType, SortStep } from '../types/sorting';
import { generateBubbleSortSteps } from './bubbleSort';

export function generateSortSteps(algorithm: AlgorithmType, initialArray: number[]): SortStep[] {
  switch (algorithm) {
    case 'bubble':
      return generateBubbleSortSteps(initialArray);
    case 'insertion':
      return generateInsertionSortSteps(initialArray);
    case 'selection':
      return generateSelectionSortSteps(initialArray);
    case 'quick':
      return generateQuickSortSteps(initialArray);
    case 'merge':
      return generateMergeSortSteps(initialArray);
    case 'heap':
      return generateHeapSortSteps(initialArray);
    case 'cocktail':
      return generateCocktailSortSteps(initialArray);
    default:
      return generateBubbleSortSteps(initialArray);
  }
}

/**
 * Insertion Sort step generator
 */
function generateInsertionSortSteps(initialArray: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let stepId = 0;
  const sortedIndices: number[] = [0];

  steps.push({
    id: stepId++,
    action: 'mark_sorted',
    indices: [0],
    values: [arr[0]],
    description: `Index 0 (${arr[0]}) is trivial sorted subarray of size 1.`,
    codeLine: 1,
    arrayState: [...arr],
    sortedIndices: [...sortedIndices],
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      id: stepId++,
      action: 'compare',
      indices: [i],
      values: [key],
      description: `Picking key element arr[${i}] = ${key} to insert into sorted prefix.`,
      codeLine: 2,
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        id: stepId++,
        action: 'compare',
        indices: [j, j + 1],
        values: [arr[j], key],
        description: `arr[${j}] (${arr[j]}) > key (${key}). Shifting arr[${j}] right to index ${j + 1}.`,
        codeLine: 4,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });

      arr[j + 1] = arr[j];
      steps.push({
        id: stepId++,
        action: 'overwrite',
        indices: [j + 1],
        values: [arr[j]],
        description: `Shifted element ${arr[j]} into index ${j + 1}.`,
        codeLine: 5,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });

      j--;
    }

    arr[j + 1] = key;
    sortedIndices.push(i);
    steps.push({
      id: stepId++,
      action: 'overwrite',
      indices: [j + 1],
      values: [key],
      description: `Inserted key ${key} into position ${j + 1}.`,
      codeLine: 6,
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
    });
  }

  steps.push({
    id: stepId++,
    action: 'finish',
    indices: [],
    values: [],
    description: 'Insertion Sort complete! Sorted sublist grew to cover full array.',
    codeLine: 7,
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
  });

  return steps;
}

/**
 * Selection Sort step generator
 */
function generateSelectionSortSteps(initialArray: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let stepId = 0;
  const sortedIndices: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      id: stepId++,
      action: 'set_pivot',
      indices: [i],
      values: [arr[i]],
      description: `Searching for minimum element starting from index ${i} (current candidate: ${arr[i]}).`,
      codeLine: 2,
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      pivotIndex: minIdx,
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        id: stepId++,
        action: 'compare',
        indices: [j, minIdx],
        values: [arr[j], arr[minIdx]],
        description: `Check arr[${j}] (${arr[j]}) vs current min arr[${minIdx}] (${arr[minIdx]}).`,
        codeLine: 3,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        pivotIndex: minIdx,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          id: stepId++,
          action: 'set_pivot',
          indices: [minIdx],
          values: [arr[minIdx]],
          description: `New minimum found: ${arr[minIdx]} at index ${minIdx}!`,
          codeLine: 4,
          arrayState: [...arr],
          sortedIndices: [...sortedIndices],
          pivotIndex: minIdx,
        });
      }
    }

    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      steps.push({
        id: stepId++,
        action: 'swap',
        indices: [i, minIdx],
        values: [arr[i], arr[minIdx]],
        description: `Swap minimum ${arr[i]} into its correct slot at index ${i}.`,
        codeLine: 5,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });
    }

    sortedIndices.push(i);
    steps.push({
      id: stepId++,
      action: 'mark_sorted',
      indices: [i],
      values: [arr[i]],
      description: `Index ${i} (${arr[i]}) is now sorted.`,
      codeLine: 6,
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
    });
  }

  sortedIndices.push(n - 1);
  steps.push({
    id: stepId++,
    action: 'finish',
    indices: [],
    values: [],
    description: 'Selection Sort finished! Array ordered by repeated minimum selection.',
    codeLine: 7,
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
  });

  return steps;
}

/**
 * Quick Sort step generator
 */
function generateQuickSortSteps(initialArray: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let stepId = 0;
  const sortedIndices: number[] = [];

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const pivotIndex = partition(low, high);
      sortedIndices.push(pivotIndex);
      steps.push({
        id: stepId++,
        action: 'mark_sorted',
        indices: [pivotIndex],
        values: [arr[pivotIndex]],
        description: `Pivot element ${arr[pivotIndex]} is permanently in sorted position at index ${pivotIndex}!`,
        codeLine: 4,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });

      quickSortHelper(low, pivotIndex - 1);
      quickSortHelper(pivotIndex + 1, high);
    } else if (low === high) {
      if (!sortedIndices.includes(low)) {
        sortedIndices.push(low);
      }
    }
  }

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    steps.push({
      id: stepId++,
      action: 'set_pivot',
      indices: [high],
      values: [pivot],
      description: `Choosing arr[${high}] (${pivot}) as partition pivot.`,
      codeLine: 1,
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
      pivotIndex: high,
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({
        id: stepId++,
        action: 'compare',
        indices: [j, high],
        values: [arr[j], pivot],
        description: `Comparing arr[${j}] (${arr[j]}) with pivot ${pivot}.`,
        codeLine: 2,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
        pivotIndex: high,
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          steps.push({
            id: stepId++,
            action: 'swap',
            indices: [i, j],
            values: [arr[i], arr[j]],
            description: `Element ${arr[i]} < pivot, swap arr[${i}] with arr[${j}].`,
            codeLine: 3,
            arrayState: [...arr],
            sortedIndices: [...sortedIndices],
            pivotIndex: high,
          });
        }
      }
    }

    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    steps.push({
      id: stepId++,
      action: 'swap',
      indices: [i + 1, high],
      values: [arr[i + 1], arr[high]],
      description: `Place pivot ${arr[i + 1]} into its partitioning boundary at index ${i + 1}.`,
      codeLine: 4,
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
    });

    return i + 1;
  }

  quickSortHelper(0, n - 1);

  steps.push({
    id: stepId++,
    action: 'finish',
    indices: [],
    values: [],
    description: 'Quick Sort completed divide and conquer partitioning!',
    codeLine: 5,
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
  });

  return steps;
}

/**
 * Merge Sort step generator
 */
function generateMergeSortSteps(initialArray: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let stepId = 0;
  const sortedIndices: number[] = [];

  function mergeSortHelper(start: number, end: number) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);

    mergeSortHelper(start, mid);
    mergeSortHelper(mid + 1, end);
    merge(start, mid, end);
  }

  function merge(start: number, mid: number, end: number) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);

    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {
      steps.push({
        id: stepId++,
        action: 'compare',
        indices: [start + i, mid + 1 + j],
        values: [left[i], right[j]],
        description: `Comparing left sublist (${left[i]}) with right sublist (${right[j]}).`,
        codeLine: 3,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        steps.push({
          id: stepId++,
          action: 'overwrite',
          indices: [k],
          values: [left[i]],
          description: `Merging ${left[i]} into index ${k}.`,
          codeLine: 4,
          arrayState: [...arr],
          sortedIndices: [...sortedIndices],
        });
        i++;
      } else {
        arr[k] = right[j];
        steps.push({
          id: stepId++,
          action: 'overwrite',
          indices: [k],
          values: [right[j]],
          description: `Merging ${right[j]} into index ${k}.`,
          codeLine: 5,
          arrayState: [...arr],
          sortedIndices: [...sortedIndices],
        });
        j++;
      }
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        id: stepId++,
        action: 'overwrite',
        indices: [k],
        values: [left[i]],
        description: `Remaining left sublist element ${left[i]} into index ${k}.`,
        codeLine: 6,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        id: stepId++,
        action: 'overwrite',
        indices: [k],
        values: [right[j]],
        description: `Remaining right sublist element ${right[j]} into index ${k}.`,
        codeLine: 7,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });
      j++;
      k++;
    }

    if (start === 0 && end === n - 1) {
      for (let s = start; s <= end; s++) sortedIndices.push(s);
    }
  }

  mergeSortHelper(0, n - 1);

  steps.push({
    id: stepId++,
    action: 'finish',
    indices: [],
    values: [],
    description: 'Merge Sort complete! Sub-arrays recursively merged into sorted order.',
    codeLine: 8,
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
  });

  return steps;
}

/**
 * Heap Sort step generator
 */
function generateHeapSortSteps(initialArray: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let stepId = 0;
  const sortedIndices: number[] = [];

  function heapify(length: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < length) {
      steps.push({
        id: stepId++,
        action: 'compare',
        indices: [left, largest],
        values: [arr[left], arr[largest]],
        description: `Compare left child arr[${left}] (${arr[left]}) with largest candidate (${arr[largest]}).`,
        codeLine: 2,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < length) {
      steps.push({
        id: stepId++,
        action: 'compare',
        indices: [right, largest],
        values: [arr[right], arr[largest]],
        description: `Compare right child arr[${right}] (${arr[right]}) with largest candidate (${arr[largest]}).`,
        codeLine: 3,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      const temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;

      steps.push({
        id: stepId++,
        action: 'swap',
        indices: [i, largest],
        values: [arr[i], arr[largest]],
        description: `Swap node ${temp} down, bringing heap max ${arr[i]} up.`,
        codeLine: 4,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });

      heapify(length, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract from heap
  for (let i = n - 1; i > 0; i--) {
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    steps.push({
      id: stepId++,
      action: 'swap',
      indices: [0, i],
      values: [arr[0], arr[i]],
      description: `Extract heap root (maximum ${temp}) to end position ${i}.`,
      codeLine: 5,
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
    });

    sortedIndices.push(i);
    steps.push({
      id: stepId++,
      action: 'mark_sorted',
      indices: [i],
      values: [arr[i]],
      description: `Element ${arr[i]} at index ${i} is now permanently sorted!`,
      codeLine: 6,
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
    });

    heapify(i, 0);
  }

  sortedIndices.push(0);
  steps.push({
    id: stepId++,
    action: 'finish',
    indices: [],
    values: [],
    description: 'Heap Sort completed via Max-Heap extraction!',
    codeLine: 7,
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
  });

  return steps;
}

/**
 * Cocktail Shaker Sort (Bidirectional Bubble Sort)
 */
function generateCocktailSortSteps(initialArray: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let stepId = 0;
  const sortedIndices: number[] = [];

  let start = 0;
  let end = n - 1;
  let swapped = true;

  while (swapped) {
    swapped = false;

    // Forward pass
    for (let i = start; i < end; i++) {
      steps.push({
        id: stepId++,
        action: 'compare',
        indices: [i, i + 1],
        values: [arr[i], arr[i + 1]],
        description: `Forward pass: compare arr[${i}] (${arr[i]}) > arr[${i + 1}] (${arr[i + 1]}).`,
        codeLine: 3,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });

      if (arr[i] > arr[i + 1]) {
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;

        steps.push({
          id: stepId++,
          action: 'swap',
          indices: [i, i + 1],
          values: [arr[i], arr[i + 1]],
          description: `Forward swap: ${temp} bubbles right.`,
          codeLine: 4,
          arrayState: [...arr],
          sortedIndices: [...sortedIndices],
        });
      }
    }

    sortedIndices.push(end);
    steps.push({
      id: stepId++,
      action: 'mark_sorted',
      indices: [end],
      values: [arr[end]],
      description: `Right-end element ${arr[end]} at index ${end} locked!`,
      codeLine: 5,
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
    });

    if (!swapped) break;
    swapped = false;
    end--;

    // Backward pass
    for (let i = end - 1; i >= start; i--) {
      steps.push({
        id: stepId++,
        action: 'compare',
        indices: [i, i + 1],
        values: [arr[i], arr[i + 1]],
        description: `Backward pass: compare arr[${i}] (${arr[i]}) > arr[${i + 1}] (${arr[i + 1]}).`,
        codeLine: 7,
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });

      if (arr[i] > arr[i + 1]) {
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;

        steps.push({
          id: stepId++,
          action: 'swap',
          indices: [i, i + 1],
          values: [arr[i], arr[i + 1]],
          description: `Backward swap: ${arr[i]} shifts left.`,
          codeLine: 8,
          arrayState: [...arr],
          sortedIndices: [...sortedIndices],
        });
      }
    }

    sortedIndices.push(start);
    steps.push({
      id: stepId++,
      action: 'mark_sorted',
      indices: [start],
      values: [arr[start]],
      description: `Left-end element ${arr[start]} at index ${start} locked!`,
      codeLine: 9,
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
    });

    start++;
  }

  for (let i = 0; i < n; i++) {
    if (!sortedIndices.includes(i)) sortedIndices.push(i);
  }

  steps.push({
    id: stepId++,
    action: 'finish',
    indices: [],
    values: [],
    description: 'Cocktail Shaker Sort finished!',
    codeLine: 10,
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
  });

  return steps;
}
