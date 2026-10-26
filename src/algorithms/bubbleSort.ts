import { SortStep } from '../types/sorting';

/**
 * Generate full step trace for Bubble Sort with educational annotations
 * Matches the logic and pedagogical steps of alg0.dev/bubble-sort
 */
export function generateBubbleSortSteps(initialArray: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let stepId = 0;
  const sortedIndices: number[] = [];

  // Pass loop
  for (let i = 0; i < n - 1; i++) {
    let swappedOnThisPass = false;

    for (let j = 0; j < n - i - 1; j++) {
      const valA = arr[j];
      const valB = arr[j + 1];

      // Compare step
      const willSwap = valA > valB;
      steps.push({
        id: stepId++,
        action: 'compare',
        indices: [j, j + 1],
        values: [valA, valB],
        description: willSwap
          ? `Compare arr[${j}] (${valA}) > arr[${j + 1}] (${valB}). Out of order! Swap needed.`
          : `Compare arr[${j}] (${valA}) ≤ arr[${j + 1}] (${valB}). In proper order, no swap.`,
        codeLine: 4, // if arr[j] > arr[j+1]
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });

      if (willSwap) {
        // Swap
        arr[j] = valB;
        arr[j + 1] = valA;
        swappedOnThisPass = true;

        steps.push({
          id: stepId++,
          action: 'swap',
          indices: [j, j + 1],
          values: [valB, valA],
          description: `Swap arr[${j}] (${valA}) with arr[${j + 1}] (${valB}). Element ${valA} bubbles rightward.`,
          codeLine: 5, // swap(arr[j], arr[j+1])
          arrayState: [...arr],
          sortedIndices: [...sortedIndices],
        });
      }
    }

    // Element at index n - 1 - i is now locked in its sorted position
    const lockedIndex = n - 1 - i;
    sortedIndices.push(lockedIndex);
    steps.push({
      id: stepId++,
      action: 'mark_sorted',
      indices: [lockedIndex],
      values: [arr[lockedIndex]],
      description: `Pass ${i + 1} complete: Element ${arr[lockedIndex]} at index ${lockedIndex} has bubbled to its final position!`,
      codeLine: 7, // pass finished / element fixed
      arrayState: [...arr],
      sortedIndices: [...sortedIndices],
    });

    // Early termination optimization
    if (!swappedOnThisPass) {
      // All remaining elements are already in sorted order
      for (let k = 0; k < n - 1 - i; k++) {
        if (!sortedIndices.includes(k)) {
          sortedIndices.push(k);
        }
      }
      steps.push({
        id: stepId++,
        action: 'finish',
        indices: [],
        values: [],
        description: `Early exit! No swaps were made in Pass ${i + 1}. The array is verified completely sorted!`,
        codeLine: 8, // break (early exit)
        arrayState: [...arr],
        sortedIndices: [...sortedIndices],
      });
      return steps;
    }
  }

  // Final 0th element is sorted
  if (!sortedIndices.includes(0)) {
    sortedIndices.push(0);
  }

  steps.push({
    id: stepId++,
    action: 'finish',
    indices: [],
    values: [],
    description: `Sorting complete! All ${n} elements are sorted in ascending order.`,
    codeLine: 9, // complete
    arrayState: [...arr],
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
  });

  return steps;
}
