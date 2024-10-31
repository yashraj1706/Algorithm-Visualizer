import React, { useState, useEffect } from 'react';
import { getMergeSortAnimations,getBubbleSortAnimations, getInsertionSortAnimations, getSelectionSortAnimations } from './Algorithms.js';
import './SortComp.css';

const PRIMARY_COLOR = 'bisque';
const SECONDARY_COLOR = 'red';
const SortComp = () => {
  const [array, setArray] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [noOfElems, setNoOfElems] = useState(73);
  const [speed, setSpeed] = useState(20);
    const[disabledOrNot,setdisabledOrNot]=useState(false);

  useEffect(() => {
    resetArray();
    const handleResize = () => {
      setWidth(window.innerWidth);
      const calculatedNoOfElems = Math.floor((window.innerWidth - (window.innerWidth * 0.2)) / 14);
      setNoOfElems(calculatedNoOfElems);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const startAnimation = () => setdisabledOrNot(true);
const endAnimation = () => setdisabledOrNot(false);

  const resetArray = () => {
    
    const newArray = [];
    for (let i = 0; i < noOfElems; i++) {
      newArray.push(randomIntFromInterval(5, 430));
    }
    setArray(newArray);
   
  };

  const mergeSort = () => {
    startAnimation();
    const animations = getMergeSortAnimations(array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;

        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * speed);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * speed);
      }
    }
    endAnimation();
  };

  const bubbleSort = () => {
    startAnimation();
    const animations = getBubbleSortAnimations(array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 4 < 2; // Determine color change
  
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
  

  return (
    <div className="container">
      <div className='arr-container'>
        {array.map((value, idx) => (
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
        //   >{value}</div>
        ></div>

    ))}
      </div>

      <div className='slider-cont'>
        <div className="innerSlidCont">
          <input 
            type='range'
            min={8}
            max={Math.floor((width - (width * 0.2)) / 14)}
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
        <button onClick={resetArray} disabled={disabledOrNot}>Generate New Array</button>
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
