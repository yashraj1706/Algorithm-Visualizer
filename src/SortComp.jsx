import React, { useState, useEffect } from 'react';
import { getMergeSortAnimations } from './Algorithms.js';
import './SortComp.css';

const PRIMARY_COLOR = 'bisque';
const SECONDARY_COLOR = 'red';
const SortComp = () => {
  const [array, setArray] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [noOfElems, setNoOfElems] = useState(73);
  const [speed, setSpeed] = useState(20);

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

  const resetArray = () => {
    const newArray = [];
    for (let i = 0; i < noOfElems; i++) {
      newArray.push(randomIntFromInterval(5, 430));
    }
    setArray(newArray);
  };

  const mergeSort = () => {
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
            onChange={(e) => {
              const newValue = Math.max(8, Math.min(e.target.value, Math.floor((width - (width * 0.2)) / 14)));
              setNoOfElems(newValue);
              resetArray(); // Reset the array whenever the number of elements changes
            }}
          />
          <label>Number of elements in Array: {noOfElems}</label>
        </div>
        <div className="innerSlidCont">
          <input 
            type='range'
            min={20}
            max={100} // Set a maximum speed value
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <label>Slow Motion: {speed}</label>
        </div>
        <button onClick={resetArray}>Generate New Array</button>
        <button onClick={mergeSort}>Merge Sort</button>
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
