import React, { useState, useEffect, useRef } from 'react';
import { getMergeSortAnimations, getBubbleSortAnimations, getInsertionSortAnimations, getSelectionSortAnimations } from './Algorithms.js';
import './SortComp.css';

const PRIMARY_COLOR = 'bisque';
const SECONDARY_COLOR = 'red';

const SortComp = () => {
  const [array, setArray] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [noOfElems, setNoOfElems] = useState(30);
  const [speed, setSpeed] = useState(20);
  const [disabledOrNot, setDisabledOrNot] = useState(false);
  
  // Store timeouts in a ref so they persist across renders
  const timeoutsRef = useRef([]);

  useEffect(() => {
    resetArray();
    const handleResize = () => {
      setWidth(window.innerWidth);
      const calculatedNoOfElems = Math.floor((width - (width * 0.2)) / 30);
      setNoOfElems(calculatedNoOfElems);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startAnimation = () => setDisabledOrNot(true);
  const endAnimation = () => setDisabledOrNot(false);

  const resetArray = () => {
    // Clear ongoing animations
    clearAllTimeouts();

    const newArray = [];
    for (let i = 0; i < noOfElems; i++) {
      newArray.push(randomIntFromInterval(5, 400));
    }
    setArray(newArray);
    endAnimation();
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = []; // Clear the list after clearing all timeouts
  };

  const mergeSort = () => {
    startAnimation();
    const animations = getMergeSortAnimations(array);
    animations.forEach((animation, i) => {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      
      const timeoutId = setTimeout(() => {
        if (isColorChange) {
          const [barOneIdx, barTwoIdx] = animation;
          const barOneStyle = arrayBars[barOneIdx].style;
          const barTwoStyle = arrayBars[barTwoIdx].style;
          const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        } else {
          const [barOneIdx, newHeight] = animation;
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
          arrayBars[barOneIdx].textContent = newHeight;
        }
      }, i * speed);
      timeoutsRef.current.push(timeoutId);
    });
    endAnimation();
  };

  // Similarly update bubbleSort and other sort functions with clearAllTimeouts and timeout tracking
  const bubbleSort = () => {
    startAnimation();
    const animations = getBubbleSortAnimations(array);
    animations.forEach((animation, i) => {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 4 < 2;

      const timeoutId = setTimeout(() => {
        if (isColorChange) {
          const [barOneIdx, barTwoIdx] = animation;
          const color = i % 4 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
          arrayBars[barOneIdx].style.backgroundColor = color;
          arrayBars[barTwoIdx].style.backgroundColor = color;
        } else {
          const [barIdx, newHeight] = animation;
          arrayBars[barIdx].style.height = `${newHeight}px`;
          arrayBars[barIdx].textContent = newHeight;
        }
      }, i * speed);
      timeoutsRef.current.push(timeoutId);
    });
    endAnimation();
  };
  
  const insertionSort = () => {
    const animations = getInsertionSortAnimations(array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 === 0;
  
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          arrayBars[barOneIdx].style.backgroundColor = color;
          arrayBars[barTwoIdx].style.backgroundColor = color;
        }, i * speed);
      } else {
        setTimeout(() => {
          const [barIdx, newHeight] = animations[i];
          arrayBars[barIdx].style.height = `${newHeight}px`;
        }, i * speed);
      }
    }
  };
  
  const selectionSort = () => {
    const animations = getSelectionSortAnimations(array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 4 < 2;
  
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const color = i % 4 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          arrayBars[barOneIdx].style.backgroundColor = color;
          arrayBars[barTwoIdx].style.backgroundColor = color;
        }, i * speed);
      } else {
        setTimeout(() => {
          const [barIdx, newHeight] = animations[i];
          arrayBars[barIdx].style.height = `${newHeight}px`;
        }, i * speed);
      }
    }
  };
  

  // returning the jsx component that displays all the code
  return (
    <div className="container">
      <div className='arr-container'>
        {/* //mapping array of elements to show them as indivisual components  */}
        {array.map((value, idx) => (
          // indivisual bars, the height is fixed based on the value of element
          <div
            className="array-bar"
            key={idx}
            style={{
              height: `${value}px`,
              fontSize:"9px",
              color:'black',
              fontWeight:"bold",
              writingMode:'vertical-rl'
            }}
          >{value}</div>
        // ></div>

    ))}
      </div>
      <div className='slider-cont'>
        <div className="innerSlidCont">
           {/* slider to control the input size */}
          <input 
            type='range'
            min={8}
            max={Math.floor((width - (width * 0.2)) / 30)}
            value={noOfElems}
            disabled={disabledOrNot}
            onChange={(e) => {
              const newValue = Math.max(8, Math.min(e.target.value, Math.floor((width - (width * 0.2)) / 14)));
              setNoOfElems(newValue);
              resetArray(); 
            }}
          />
          <label>Number of elements in Array: {noOfElems}</label>
        </div>
        <div className="innerSlidCont">
           {/* slider to control sorting speed */}
          <input 
            type='range'
            min={1}
            max={100}
            value={speed}
            disabled={disabledOrNot}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <label>Slow Motion: {speed}</label>
        </div>

        {/* //reset the dataset by clicking on the button */}
        <button onClick={resetArray} disabled={disabledOrNot}>Generate New Array</button>

        {/* below, the 2 buttons are to be used to perform execution of the merge and bubble sort indivisually */}
        <button onClick={mergeSort} disabled={disabledOrNot}>Merge Sort</button>
        <button onClick={bubbleSort} disabled={disabledOrNot}>Bubble Sort</button>
        {/* <button onClick={insertionSort}>Insertion Sort</button> */}
        {/* <button onClick={selectionSort}>Selection Sort</button> */}
      </div>

      <div className='button-container'>
        {/* Other sorting buttons can go here */}
      </div>
    </div>
  );
};


//Function to generate number of elements to sort.
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function arraysAreEqual(arrayOne, arrayTwo) {
  if (arrayOne.length !== arrayTwo.length) return false;
  for (let i = 0; i < arrayOne.length; i++) {
    if (arrayOne[i] !== arrayTwo[i]) {
      return false;
    }
  }
  return true;
}

export default SortComp;
