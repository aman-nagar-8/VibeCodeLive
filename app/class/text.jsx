import React, { useEffect, useRef } from 'react';

const TwoMinuteTimer = () => {
  // Define the function that you want to run
  const runEveryTwoMinutes = () => {
    console.log('Function ran at:', new Date().toLocaleTimeString());
    // Add your desired logic here
  };

  // Use useRef to keep track of the function to ensure the interval always
  // calls the latest version of the function (optional, but a best practice)
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = runEveryTwoMinutes;
  }, []);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    // Set the interval to 2 minutes (120,000ms)
    const intervalId = setInterval(tick, 120000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return (
    <div>
      <p>A function is running every two minutes. Check the console for output.</p>
    </div>
  );
};

export default TwoMinuteTimer;
