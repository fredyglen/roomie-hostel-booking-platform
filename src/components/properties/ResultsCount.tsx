
import React from 'react';

interface ResultsCountProps {
  count: number;
}

const ResultsCount: React.FC<ResultsCountProps> = ({ count }) => {
  return (
    <div className="mb-4 px-0">
      <p className="text-gray-600">{count} properties found</p>
    </div>
  );
};

export default ResultsCount;
