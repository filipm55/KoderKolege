const sendData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    // Check the response content type
    const contentType = response.headers.get('content-type');
    let responseData;
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json(); // Parse as JSON
    } else {
      responseData = await response.text(); // Parse as text
    }

    if (!response.ok) {
      // Use the message from JSON response or the text response as the error message
      throw new Error(responseData.message || responseData || 'Request failed');
    }

    // Return the JSON response or text response for successful requests
    return responseData;
  } catch (error) {
    throw error; // Re-throw the error for the calling function to handle
  }
};


export default sendData;
