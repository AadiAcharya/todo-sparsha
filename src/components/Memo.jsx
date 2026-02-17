import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const Memo = () => {
  const [newTask, setNewTask] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("memos");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(tasks));
  }, [tasks]);

  function inputChange(event) {
    setNewTask(event.target.value);
  }

  function addToList() {
    if (newTask.trim() !== "") {
      const updatedTasks = [
        ...tasks,
        {
          text: newTask,
          description: newDesc,
          createdAt: dayjs().format("DD/MM/YYYY hh:mm A"),
        },
      ];
      setTasks(updatedTasks);
      setNewTask("");
      setNewDesc("");
    }
  }

  function deleteFromList(index) {
    const updateTasks = tasks.filter((_, i) => i !== index);
    setTasks(updateTasks);
  }

  function toggleNotes(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  function startEdit(index) {
    setEditIndex(index);
    setEditText(tasks[index].text);
    setEditDesc(tasks[index].description);
  }
  function saveEdit(index) {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, text: editText, description: editDesc } : task,
    );
    setTasks(updatedTasks);
    setEditIndex(null);
    setEditText("");
    setEditDesc("");
  }
  function cancelEdit() {
    setEditIndex(null);
    setEditText("");
    setEditDesc("");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Memo List</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {dayjs().format("dddd, MMMM D YYYY")}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="What did you work on?"
              onChange={inputChange}
              value={newTask}
              onKeyDown={(e) => e.key === "Enter" && addToList()}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <textarea
              placeholder="Add additional info"
              rows={3}
              onChange={(e) => setNewDesc(e.target.value)}
              value={newDesc}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm"
              onClick={addToList}
            >
              Add Memo
            </button>
          </div>
        </div>

        {tasks.length > 0 && (
          <p className="text-sm text-gray-500 mb-3 pl-1">
            {tasks.length} memo{tasks.length > 1 ? "s" : ""}
          </p>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {tasks.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-lg font-medium">No memos yet</p>
              <p className="text-sm mt-1">Add something you worked on today!</p>
            </div>
          ) : (
            <ol className="divide-y divide-gray-100">
              {tasks.map((task, index) => (
                <li key={index}>
                  {editIndex === index ? (
                    <div className="p-4 flex flex-col gap-3 bg-indigo-50">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                      <textarea
                        name=""
                        id=""
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                      ></textarea>
                      <div className="flex  justify-around gap-2">
                        <div>
                          <button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            onClick={() => saveEdit(index)}
                          >
                            save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm transition-colors"
                          >
                            cancel
                          </button>
                        </div>
                        <div>
                          <button
                            className="bg-red-100 hover:bg-red-500 hover:text-white text-red-500 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            onClick={() => deleteFromList(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                        <span className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </span>

                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 text-base font-medium">
                            {task.text}
                          </p>
                          <div className="flex items-center gap-1 mt-1 bg-indigo-50 w-fit px-2 py-0.5 rounded-md">
                            <span className="text-xs">🕐</span>
                            <span className="text-xs text-indigo-400 font-medium">
                              {task.createdAt}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {task.description && (
                            <button
                              onClick={() => toggleNotes(index)}
                              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                              Notes
                            </button>
                          )}

                          <button
                            onClick={() => startEdit(index)}
                            className="bg-indigo-300 hover:bg-indigo-200 text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {openIndex !== null && tasks[openIndex] && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50 px-4"
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-600 flex-1 pr-4">
                {tasks[openIndex].text}
              </h2>
              <button
                onClick={() => setOpenIndex(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
              >
                ✕
              </button>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                {tasks[openIndex].description}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1">
              <span className="text-xs">🕐</span>
              <span className="text-xs text-gray-400">
                {tasks[openIndex].createdAt}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memo;
