import React, { useState } from "react";

const Data = () => {
  const [tasks, setTasks] = useState("");
  const [newTask, setNewTask] = useState("");

  function inputChange(event) {
    setNewTask(event.target.value);
  }

  function addToList() {
    if (newTask.trim() !== "") {
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setNewTask("");
      console.log(updatedTasks);
    }
  }
  function deleteFromList(index) {
    const updateTasks = tasks.filter((_, i) => i !== index);
    setTasks(updateTasks);
  }

  function moveUp(index) {
    if (index > 0) {
      const updateTasks = [...tasks];
      [updateTasks[index], updateTasks[index - 1]] = [
        updateTasks[index - 1],
        updateTasks[index],
      ];
      setTasks(updateTasks)
    }
  }

  function moveDown(index) {
     if (index < tasks.length-1) {
      const updateTasks = [...tasks];
      [updateTasks[index], updateTasks[index + 1]] = [
        updateTasks[index + 1],
        updateTasks[index],
      ];
      setTasks(updateTasks)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          My Todo List
        </h1>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter a task"
              onChange={inputChange}
              value={newTask}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md"
              onClick={addToList}
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No tasks yet. Add one above!</p>
            </div>
          ) : (
            <ol className="divide-y divide-gray-100">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Task Number and Text */}
                    <div className="flex items-center flex-1 gap-3">
                      <span className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 text-lg wrap-break-words flex-1">
                        {task}
                      </span>
                    </div>

                    <div className="flex gap-2 sm:ml-auto">
                      <button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                        onClick={() => moveDown(index)}
                        disabled={index === tasks.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
                        onClick={() => deleteFromList(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

export default Data;
