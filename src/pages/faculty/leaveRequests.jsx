import { requireRole } from "@/lib/requireRole"
import { useState, useEffect } from "react"
import { Calendar, Clock, FileText, Loader2, Plus, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import FacultySidebar from "../../components/FacultySidebar"
import { 
  getFacultyLeaveRequests, 
  getCurrentFaculty, 
  submitLeaveRequest,
  getFacultyClassSections  // Add this import
} from "../../../utils/api/faculty"

export async function getServerSideProps(context) {
  return requireRole(context, "faculty")
}

export default function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    leaveDate: "", // Single date instead of start/end
    reason: "",
    departmentId: "",
    classId: "",
    sectionId: "",
    courseId: "" // Added courseId as needed by the schema
  })
  // Instead of string arrays, use objects with id and name
  const [departments, setDepartments] = useState([])
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [courses, setCourses] = useState([]) // Added courses for the selected section
  const [faculty, setFaculty] = useState(null)
  const [classSections, setClassSections] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get leave requests and faculty data
        const leaveData = await getFacultyLeaveRequests();
        const facultyData = await getCurrentFaculty();
        
        // Get class sections data
        const sectionsData = await getFacultyClassSections();
        
        setLeaveRequests(leaveData || []);
        setFaculty(facultyData || {});
        setClassSections(sectionsData || []);
        
        // Get unique departments
        const uniqueDepartments = [...new Set(sectionsData.map(item => item.department))];
        setDepartments(uniqueDepartments.map(dept => ({
          id: facultyData.departmentId,
          name: dept
        })));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Update classes when department changes
  useEffect(() => {
    if (formData.departmentId) {
      const filteredClasses = classSections
        .filter(item => item.department === departments.find(d => d.id === parseInt(formData.departmentId))?.name)
        .map(item => item.class_name);

      const uniqueClasses = [...new Set(filteredClasses)];
      
      // Create objects with ID (using index + 1 as mock ID for now)
      setClasses(uniqueClasses.map((className, index) => ({
        id: index + 1,
        name: className
      })));
      
      // Reset section and class in form data
      setFormData(prev => ({
        ...prev,
        classId: "",
        sectionId: "",
        courseId: ""
      }));
      
      setSections([]);
      setCourses([]);
    } else {
      setClasses([]);
      setSections([]);
      setCourses([]);
    }
  }, [formData.departmentId, classSections, departments]);

  // Update sections when class changes
  useEffect(() => {
    if (formData.departmentId && formData.classId) {
      const selectedDept = departments.find(d => d.id === parseInt(formData.departmentId))?.name;
      const selectedClass = classes.find(c => c.id === parseInt(formData.classId))?.name;
      
      const filteredSections = classSections
        .filter(item => 
          item.department === selectedDept && 
          item.class_name === selectedClass
        )
        .map(item => item.section_name);

      const uniqueSections = [...new Set(filteredSections)].sort();
      setSections(uniqueSections.map((sectionName, index) => ({
        id: index + 1,
        name: sectionName
      })));
      
      // Reset section in form data
      setFormData(prev => ({
        ...prev,
        sectionId: "",
        courseId: ""
      }));
      
      setCourses([]);
    } else {
      setSections([]);
      setCourses([]);
    }
  }, [formData.departmentId, formData.classId, classSections, departments, classes]);

  // Set courses when section is selected
  useEffect(() => {
  if (formData.departmentId && formData.classId && formData.sectionId) {
    const selectedDept = departments.find(d => d.id === parseInt(formData.departmentId))?.name;
    const selectedClass = classes.find(c => c.id === parseInt(formData.classId))?.name;
    const selectedSection = sections.find(s => s.id === parseInt(formData.sectionId))?.name;
    
    // Get matching sections with courses
    const matchingSections = classSections.filter(item => 
      item.department === selectedDept && 
      item.class_name === selectedClass &&
      item.section_name === selectedSection
    );
    
    // Extract unique courses with proper names
    const courseMap = new Map();
    matchingSections.forEach(item => {
      if (!courseMap.has(item.courseId)) {
        courseMap.set(item.courseId, {
          id: item.courseId,
          name: item.course_name // Use course_name instead of generating generic names
        });
      }
    });
    
    setCourses(Array.from(courseMap.values()));
  } else {
    setCourses([]);
  }
}, [formData.departmentId, formData.classId, formData.sectionId, classSections, departments, classes, sections]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      // Submit the leave request to the API
      const response = await submitLeaveRequest({
        leaveDate: formData.leaveDate,
        reason: formData.reason,
        departmentId: parseInt(formData.departmentId),
        classId: parseInt(formData.classId),
        sectionId: parseInt(formData.sectionId),
        courseId: parseInt(formData.courseId)
      });
      
      // Create a new leave request object with the response data
      const newLeaveRequest = {
        id: response.id || (leaveRequests.length + 1),
        faculty_id: faculty?.id || 1,
        start_date: new Date(formData.leaveDate).toISOString(),
        end_date: new Date(formData.leaveDate).toISOString(), // Same as start date since we removed end date
        reason: formData.reason,
        status: "Pending",
        submitted_at: new Date().toISOString(),
        approved_by: null,
        approved_at: null,
        comments: null,
        department: departments.find(d => d.id === parseInt(formData.departmentId))?.name || "Unknown",
        class: classes.find(c => c.id === parseInt(formData.classId))?.name || "Unknown",
        section: sections.find(s => s.id === parseInt(formData.sectionId))?.name || "Unknown",
        course: courses.find(c => c.id === parseInt(formData.courseId))?.name || "Unknown",
      };

      // Add to the list
      setLeaveRequests([newLeaveRequest, ...leaveRequests]);

      // Reset form
      setFormData({
        leaveDate: "",
        reason: "",
        departmentId: "",
        classId: "",
        sectionId: "",
        courseId: ""
      });

      // Hide form
      setShowForm(false);
    } catch (error) {
      console.error("Failed to submit leave request:", error);
      setError("Failed to submit leave request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Rest of your component...

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        )
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <FacultySidebar />

      <div className="flex-1">
        <main className="p-4 md:p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Leave Requests</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Cancel" : "New Leave Request"}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Submit New Leave Request</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="leaveDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Date
                  </label>
                  <input
                    type="date"
                    id="leaveDate"
                    name="leaveDate"
                    value={formData.leaveDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]} // Cannot select past dates
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      id="departmentId"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
                      Class
                    </label>
                    <select
                      id="classId"
                      name="classId"
                      value={formData.classId}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.departmentId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Class</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sectionId" className="block text-sm font-medium text-gray-700 mb-1">
                      Section
                    </label>
                    <select
                      id="sectionId"
                      name="sectionId"
                      value={formData.sectionId}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.classId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Section</option>
                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                      Course
                    </label>
                    <select
                      id="courseId"
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.sectionId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Leave
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please provide a detailed reason for your leave request..."
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-50 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col space-y-4">
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : leaveRequests.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date Range
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Class & Section
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Reason
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{formatDate(request.start_date)}</div>
                              <div className="text-sm text-gray-500">to {formatDate(request.end_date)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {request.class} - {request.section}
                          </div>
                          <div className="text-xs text-gray-500">{request.department}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{request.reason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(request.submitted_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No leave requests found</h3>
              <p className="text-gray-500 mb-4">You haven't submitted any leave requests yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create your first leave request
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
