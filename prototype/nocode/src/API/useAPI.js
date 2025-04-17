import React, { useState, useEffect } from 'react';
import { API } from './API';

export const useAPI = () => {
  const [api, setApi] = useState(null);

  useEffect(() => {
    const fetchAPI = async () => {
      const apiInstance = await API.create();
      setApi(apiInstance);
    };

    fetchAPI();
  }, []);

  return api;
}