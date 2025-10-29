import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../components/dropdown';

const colorOptions = [
  '#e74141',
  '#e77841ff',
  '#e7e441ff',
  '#54e741ff',
  '#41d4e7ff',
  '#415fe7ff',
  '#9141e7ff',
  '#d441e7ff',
  '#e741b0ff',
  '#FFFFFF',
];

const TimerColorOptionMenu = [
  colorOptions.map((colorOption) => {
    return <p style={{ color: colorOption }}>&#9711;</p>;
  }),
];

export default function Settings(): JSX.Element {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-white">Settings</h1>
      <p className="text-gray-300 mb-4">Placeholder settings page.</p>
      <Link to="/" className="text-blue-400 underline">
        Back to Home
      </Link>
      <div className="flex">
        <p className="setting-text">Timer 1 Color</p>
        <Dropdown menuButtonText="Color" allMenuItems={TimerColorOptionMenu} />
      </div>
    </div>
  );
}
