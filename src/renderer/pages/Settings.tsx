import React from 'react';
import { Link } from 'react-router-dom';

export default function Settings(): JSX.Element {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-white">Settings</h1>
      <p className="text-gray-300 mb-4">Placeholder settings page.</p>
      <Link to="/" className="text-blue-400 underline">
        Back to Home
      </Link>
    </div>
  );
}
