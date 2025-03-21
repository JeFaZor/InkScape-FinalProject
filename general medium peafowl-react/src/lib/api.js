// api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchTestData = async () => {
  try {
    const response = await fetch(`${API_URL}/test`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching test data:', error);
    throw error;
  }
};

export const fetchArtists = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });
    
    const url = `${API_URL}/artists${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching artists:', error);
    throw error;
  }
};

// ===== Order Lines API Functions =====

export const fetchOrderLines = async () => {
  try {
    const response = await fetch(`${API_URL}/order-lines`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching order lines:', error);
    throw error;
  }
};

export const fetchOrderLine = async (id) => {
  try {
    const response = await fetch(`${API_URL}/order-lines/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching order line ${id}:`, error);
    throw error;
  }
};

export const createOrderLine = async (orderLineData) => {
  try {
    const response = await fetch(`${API_URL}/order-lines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderLineData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating order line:', error);
    throw error;
  }
};

export const updateOrderLine = async (id, orderLineData) => {
  try {
    const response = await fetch(`${API_URL}/order-lines/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderLineData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating order line ${id}:`, error);
    throw error;
  }
};

export const deleteOrderLine = async (id) => {
  try {
    const response = await fetch(`${API_URL}/order-lines/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting order line ${id}:`, error);
    throw error;
  }
};

// ===== Price Details API Functions =====

export const fetchPriceDetails = async () => {
  try {
    const response = await fetch(`${API_URL}/price-details`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching price details:', error);
    throw error;
  }
};

export const fetchPriceDetail = async (id) => {
  try {
    const response = await fetch(`${API_URL}/price-details/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching price detail ${id}:`, error);
    throw error;
  }
};

export const createPriceDetail = async (priceDetailData) => {
  try {
    const response = await fetch(`${API_URL}/price-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(priceDetailData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating price detail:', error);
    throw error;
  }
};

export const updatePriceDetail = async (id, priceDetailData) => {
  try {
    const response = await fetch(`${API_URL}/price-details/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(priceDetailData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating price detail ${id}:`, error);
    throw error;
  }
};

export const deletePriceDetail = async (id) => {
  try {
    const response = await fetch(`${API_URL}/price-details/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting price detail ${id}:`, error);
    throw error;
  }
};