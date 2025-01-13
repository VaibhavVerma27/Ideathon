"use client";
import Navbar from "@/components/navbar/teachernavbar";
import { useModel } from "../../../../../hooks/user-model-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import DotsLoader from "../../../../../components/loading/dotLoader";

export default function GroupsPage() {
  const [groupName, setGroupName] = useState<string>("");
  const [studentId, setStudentId] = useState<string>(""); // For individual student ID input
  const [studentIds, setStudentIds] = useState<string[]>([]); // Array to store student IDs
  const [deleteGroupId, setDeleteGroupId] = useState<string>("");
  const [showDeletePopup, setShowDeletePopup] = useState<boolean>(false); // Delete confirmation popup
  const { groups, setGroups, isLoading, setLoading } = useModel();
  const router = useRouter();
  const params = useParams();
  const subjectId = params.subjectId?.[0];

  useEffect(() => {
    async function fetchData() {
      if (!subjectId) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/subjects/groups/${subjectId}`
        );
        if (res.status === 200) {
          setGroups(res.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router, setGroups, setLoading, subjectId]);

  const addStudentId = () => {
    if (!studentId.trim()) {
      alert("Student ID cannot be empty.");
      return;
    }

    if (studentIds.includes(studentId.trim())) {
      alert("This student ID is already added.");
      return;
    }

    setStudentIds((prev) => [...prev, studentId.trim()]);
    setStudentId(""); // Clear input field
  };

  const removeStudentId = (id: string) => {
    setStudentIds((prev) => prev.filter((student) => student !== id));
  };

  async function handleAddGroup() {
    if (!groupName.trim()) {
      alert("Group name cannot be empty.");
      return;
    }

    if (studentIds.length === 0) {
      alert("Please add at least one student to the group.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/subjects/groups/${subjectId}`,
        { groupName, students: studentIds }
      );
      if (res.status === 200) {
        setGroups([...groups, { _id: res.data._id, groupName: res.data.groupName }]);
        setGroupName("");
        setStudentIds([]); // Clear students list
      }
    } catch (error) {
      console.error("Error adding group:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteGroup() {
    if (!deleteGroupId) return;

    setLoading(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/teacher/subjects/groups/${deleteGroupId}`
      );

      if (res.status === 200) {
        setGroups(groups.filter((group) => group._id.toString() !== deleteGroupId));
        setShowDeletePopup(false);
        setDeleteGroupId("");
      } else {
        console.error("Failed to delete group");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!groups || isLoading) {
    return <DotsLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
       <div><Navbar/></div>
      <div className="w-full py-10 bg-gray-950 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-blue-500 tracking-wide">
          Groups for Subject: {subjectId}
        </h1>
      </div>

      {/* Add Group Section */}
      <div className="flex flex-col items-center mt-8 space-y-4">
        <div className="flex flex-col items-start w-full max-w-3xl space-y-4">
          {/* Group Name Input */}
          <div className="w-full">
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-300">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              className="bg-gray-800 text-white w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          {/* Student IDs Input */}
          <div className="w-full">
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-300">
              Add Student ID
            </label>
            <div className="flex space-x-4">
              <input
                type="text"
                id="studentId"
                className="bg-gray-800 text-white w-full px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
              <button
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                onClick={addStudentId}
              >
                Add
              </button>
            </div>
          </div>

          {/* Added Students List */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-300">
              Added Students
            </label>
            <ul className="space-y-2 mt-2">
              {studentIds.map((id) => (
                <li
                  key={id}
                  className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-lg border border-gray-600"
                >
                  <span>{id}</span>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => removeStudentId(id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
              {studentIds.length === 0 && (
                <li className="text-gray-400">No students added yet.</li>
              )}
            </ul>
          </div>

          {/* Add Group Button */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
            onClick={handleAddGroup}
          >
            Add Group
          </button>
        </div>
      </div>

      {/* Groups List */}
      <div className="flex flex-col items-center mt-10 px-4">
        {groups.length > 0 && (
          <div className="w-full max-w-5xl max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {groups.map((group) => (
              <div
                key={group._id.toString()}
                className="flex flex-col md:flex-row w-full bg-gray-800 rounded-lg shadow-xl items-center justify-between p-6 my-4 hover:scale-105 transform transition-transform duration-300"
              >
                {/* Group Info */}
                <div className="text-lg font-semibold text-white">
                  {group.groupName}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() =>
                      router.push(`/teacher/subjects/groups/attendance/${subjectId}/${group.groupName}`)
                    }
                  >
                    Take Attendance
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() =>
                      router.push(`/teacher/subjects/groups/attendance/show/${subjectId}/${group.groupName}`)
                    }
                  >
                    Show Attendance
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300"
                    onClick={() => {
                      setDeleteGroupId(group._id.toString());
                      setShowDeletePopup(true);
                    }}
                  >
                    Delete Group
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Group</h2>
            <p>Are you sure you want to delete this group?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300"
                onClick={handleDeleteGroup}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
