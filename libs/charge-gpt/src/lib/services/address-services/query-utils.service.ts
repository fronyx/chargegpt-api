export const queryFallback = async (...queries) => {
  const allQueries = [...queries];
  const query = allQueries.shift();

  if (!query) {
    return [];
  }

  const results = await query();

  if (results.status === 200 && results.data.status === 'OK') {
    if (results.data.candidates && results.data.candidates.length > 0) {
      return results.data.candidates;
    }

    if (results.data.predictions && results.data.predictions.length > 0) {
      return results.data.predictions;
    }
  }

  if (results.length > 0) {
    return results;
  }

  if (allQueries.length > 0) {
    return queryFallback(...allQueries);
  }

  return [];
};
