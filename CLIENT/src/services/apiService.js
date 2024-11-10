export const fetchData = async (endpoint) => {
    const token = localStorage.getItem('token');
  
    const response = await fetch(`http://localhost:5000${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) throw new Error('Failed to fetch data');
  
    return response.json();
  };
  