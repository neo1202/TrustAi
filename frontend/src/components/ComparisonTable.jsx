import React from 'react';

const blockStyle = "border border-gray-300 p-2"

const ComparisonTable = ({ comparison }) => {

  const teacher = comparison.teacher
  const student = comparison.student

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className={blockStyle}></th> {/* the left-top block */}
            <th className={blockStyle}>Teacher</th>
            <th className={blockStyle}>Student</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={blockStyle}>Test Accuracy</td>
            <td className={blockStyle}>{teacher.acc}</td>
            <td className={blockStyle}>{student.acc}</td>
          </tr>
          <tr>
            <td className={blockStyle}>Number of Params</td>
            <td className={blockStyle}>{teacher.totalParams}</td>
            <td className={blockStyle}>{student.totalParams}</td>
          </tr>
          <tr>
            <td className={blockStyle}>Params Size(MB)</td>
            <td className={blockStyle}>{teacher.paramsSize}</td>
            <td className={blockStyle}>{student.paramsSize}</td>
          </tr>
          <tr>
            <td className={blockStyle}>Output Size(MB)</td>
            <td className={blockStyle}>{teacher.outputSize}</td>
            <td className={blockStyle}>{student.outputSize}</td>
          </tr>
          {/* Add more rows here */}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
