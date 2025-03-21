// TestComponent.js
import React, { useState, useEffect } from 'react';
import { fetchTestData } from '../lib/api';

const TestComponent = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTestData = async () => {
      try {
        setLoading(true);
        const data = await fetchTestData();
        setMessage(data.message);
      } catch (err) {
        setError('Failed to connect to the backend server');
      } finally {
        setLoading(false);
      }
    };

    getTestData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Backend Connection Test</h2>
      <p>{message}</p>
    </div>
  );
};

export default TestComponent;