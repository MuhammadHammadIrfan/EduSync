import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import FileUpload from './FileUpload';
import { getDepartments, getClasses, getSections, getFaculties } from '../utils/adminApi';

const ImportCoursesForm = ({ onFileSelect }) => {
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setDepartments(await getDepartments());
      setClasses(await getClasses());
      setSections(await getSections());
      setFaculties(await getFaculties());
    };
    fetchData();
  }, []);

  const handleFileSelect = (file) => {
    const metadata = {
      departments: selectedDepartments.map(d => d.value),
      classes: selectedClasses.map(c => c.value),
      sections: selectedSections.map(s => s.value),
      faculties: selectedFaculties.map(f => f.value),
    };
    onFileSelect(file, metadata);
  };

  const toOptions = (items) => items.map(item => ({ value: item.id, label: item.name }));

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Import Courses from CSV</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Departments</label>
          <Select
            isMulti
            options={toOptions(departments)}
            value={selectedDepartments}
            onChange={setSelectedDepartments}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Classes</label>
          <Select
            isMulti
            options={toOptions(classes)}
            value={selectedClasses}
            onChange={setSelectedClasses}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sections</label>
          <Select
            isMulti
            options={toOptions(sections)}
            value={selectedSections}
            onChange={setSelectedSections}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Faculties</label>
          <Select
            isMulti
            options={toOptions(faculties)}
            value={selectedFaculties}
            onChange={setSelectedFaculties}
          />
        </div>
      </div>

      <FileUpload
        onFileSelect={handleFileSelect}
        label="Upload Courses CSV"
        helpText="Upload a CSV file with 'name' and 'email' columns."
      />

      <div className="mt-4 text-sm text-gray-500">
        <p>Download sample CSV template:</p>
        <a href="#" className="text-blue-600 hover:text-blue-800">CoursesTemplate.csv</a>
      </div>
    </div>
  );
};

export default ImportCoursesForm;
