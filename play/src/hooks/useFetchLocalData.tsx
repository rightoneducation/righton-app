import { useEffect } from 'react';
import { isNullOrUndefined } from '@righton/networking';
import { useNavigate } from 'react-router-dom';

export default function useFetchAndLocalData() {
  const navigate = useNavigate();
  const pregameModel = window.localStorage.getItem('rightOn');
  // useEffect here so that this only navigates if pregameModel updates
  useEffect(() => {
    // if user doesn't have prexisting game info stored locally (from either pregame or dropped game), redirect to pregame
    if (isNullOrUndefined(pregameModel)) {
      navigate('/');
    }
  }, [pregameModel, navigate]);
  // passes either pregameModel or empty object to GameInProgressContainer
  return JSON.parse(pregameModel ?? '{}');
}
