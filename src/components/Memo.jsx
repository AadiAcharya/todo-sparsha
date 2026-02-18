import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Memo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchMemos = async () => {
      const memosRef = collection(db, "memos");
      const q = query(memosRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const loadedMemos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(loadedMemos);
    };

    fetchMemos();
  }, [user]);

  function inputChange(event) {
    setNewTask(event.target.value);
  }

  async function addToList() {
    if (newTask.trim() !== "" && user) {
      try {
        const newMemo = {
          text: newTask,
          description: newDesc,
          createdAt: dayjs().format("DD/MM/YYYY hh:mm A"),
          userId: user.uid,
        };

        const docRef = await addDoc(collection(db, "memos"), newMemo);
        setTasks([...tasks, { id: docRef.id, ...newMemo }]);
        setNewTask("");
        setNewDesc("");
      } catch (error) {
        console.error("Error adding memo:", error);
      }
    }
  }

  async function deleteFromList(index) {
    const filteredTasks = getFilteredTasks();
    const taskToDelete = filteredTasks[index];
    const originalIndex = tasks.findIndex(t => t.id === taskToDelete.id);
    
    try {
      await deleteDoc(doc(db, "memos", tasks[originalIndex].id));
      const updateTasks = tasks.filter((_, i) => i !== originalIndex);
      setTasks(updateTasks);
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  }

  function toggleNotes(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  function startEdit(index) {
    const filteredTasks = getFilteredTasks();
    const taskToEdit = filteredTasks[index];
    const originalIndex = tasks.findIndex(t => t.id === taskToEdit.id);
    
    setEditIndex(originalIndex);
    setEditText(tasks[originalIndex].text);
    setEditDesc(tasks[originalIndex].description);
  }

  async function saveEdit(index) {
    try {
      const memoRef = doc(db, "memos", tasks[index].id);
      await updateDoc(memoRef, {
        text: editText,
        description: editDesc,
      });

      const updatedTasks = tasks.map((task, i) =>
        i === index ? { ...task, text: editText, description: editDesc } : task
      );
      setTasks(updatedTasks);
      setEditIndex(null);
      setEditText("");
      setEditDesc("");
    } catch (error) {
      console.error("Error updating memo:", error);
    }
  }

  function cancelEdit() {
    setEditIndex(null);
    setEditText("");
    setEditDesc("");
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  function getFilteredTasks() {
    return tasks.filter((task) =>
      task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const filteredTasks = getFilteredTasks();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a8e6cf, #7ec8e3, #93c5fd)",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "16px",
            padding: "1rem 1.5rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#1e3a8a",
                margin: 0,
              }}
            >
              📓 My Memo List
            </h1>
            <p
              style={{
                color: "#3b82f6",
                fontSize: "0.85rem",
                margin: "0.25rem 0 0 0",
              }}
            >
              {dayjs().format("dddd, MMMM D YYYY")}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(239, 68, 68, 0.9)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.6rem 1.2rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "16px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="text"
              placeholder="What did you work on?"
              onChange={inputChange}
              value={newTask}
              onKeyDown={(e) => e.key === "Enter" && addToList()}
              style={{
                padding: "0.85rem 1rem",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "10px",
                fontSize: "0.95rem",
                outline: "none",
                background: "rgba(255,255,255,0.5)",
                color: "#1e3a8a",
              }}
            />
            <textarea
              placeholder="Add additional info"
              rows={3}
              onChange={(e) => setNewDesc(e.target.value)}
              value={newDesc}
              style={{
                padding: "0.85rem 1rem",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                borderRadius: "10px",
                fontSize: "0.95rem",
                outline: "none",
                resize: "none",
                background: "rgba(255,255,255,0.5)",
                color: "#1e3a8a",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={addToList}
              style={{
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "0.85rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Add Memo
            </button>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "16px",
            padding: "1rem 1.5rem",
            marginBottom: "1.5rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <input
            type="text"
            placeholder="🔍 Search memos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.85rem 1rem",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "10px",
              fontSize: "0.95rem",
              outline: "none",
              background: "rgba(255,255,255,0.5)",
              color: "#1e3a8a",
              boxSizing: "border-box",
            }}
          />
        </div>

        {filteredTasks.length > 0 && (
          <p style={{ color: "#3b82f6", fontSize: "0.9rem", marginBottom: "1rem", paddingLeft: "0.5rem" }}>
            {filteredTasks.length} memo{filteredTasks.length > 1 ? "s" : ""} {searchQuery && `matching "${searchQuery}"`}
          </p>
        )}

        <div
          style={{
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#3b82f6" }}>
              <p style={{ fontSize: "3rem", margin: "0 0 1rem 0" }}>
                {searchQuery ? "🔍" : "📝"}
              </p>
              <p style={{ fontSize: "1.1rem", fontWeight: "600", margin: "0 0 0.5rem 0" }}>
                {searchQuery ? "No matching memos" : "No memos yet"}
              </p>
              <p style={{ fontSize: "0.9rem", margin: 0 }}>
                {searchQuery ? "Try a different search term" : "Add something you worked on today!"}
              </p>
            </div>
          ) : (
            <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {filteredTasks.map((task, index) => (
                <li
                  key={task.id}
                  style={{
                    borderBottom: index !== filteredTasks.length - 1 ? "1px solid rgba(59, 130, 246, 0.2)" : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem 1.5rem",
                      cursor: "pointer",
                      background: "transparent",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span
                      style={{
                        minWidth: "32px",
                        height: "32px",
                        background: "#60a5fa",
                        color: "#fff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      {index + 1}
                    </span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#1e3a8a", fontSize: "1rem", fontWeight: "600", margin: "0 0 0.3rem 0" }}>
                        {task.text}
                      </p>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          background: "rgba(96, 165, 250, 0.2)",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "6px",
                        }}
                      >
                        <span style={{ fontSize: "0.75rem" }}>🕐</span>
                        <span style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: "500" }}>
                          {task.createdAt}
                        </span>
                      </div>
                    </div>

                    <span style={{ color: "#60a5fa", fontSize: "0.9rem" }}>
                      {openIndex === tasks.findIndex(t => t.id === task.id) ? "▲" : "▼"}
                    </span>

                    <div
                      style={{ display: "flex", gap: "0.5rem" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {task.description && (
                        <button
                          onClick={() => {
                            const originalIndex = tasks.findIndex(t => t.id === task.id);
                            toggleNotes(originalIndex);
                          }}
                          style={{
                            background: "#60a5fa",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "0.5rem 1rem",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "opacity 0.2s",
                          }}
                          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                          onMouseLeave={(e) => (e.target.style.opacity = "1")}
                        >
                          Notes
                        </button>
                      )}
                      <button
                        onClick={() => startEdit(index)}
                        style={{
                          background: "#10b981",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "0.5rem 1rem",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                        onMouseLeave={(e) => (e.target.style.opacity = "1")}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFromList(index)}
                        style={{
                          background: "rgba(239, 68, 68, 0.9)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "0.5rem 1rem",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
                        onMouseLeave={(e) => (e.target.style.opacity = "1")}
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

      {openIndex !== null && tasks[openIndex] && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "1rem",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setOpenIndex(null)}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "16px",
              padding: "2rem",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1.5rem" }}>
              <h2 style={{ color: "#1e3a8a", fontSize: "1.3rem", fontWeight: "bold", margin: 0, flex: 1, paddingRight: "1rem" }}>
                {tasks[openIndex].text}
              </h2>
              <button
                onClick={() => setOpenIndex(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#60a5fa",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: "rgba(96, 165, 250, 0.1)", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
              <p style={{ color: "#1e3a8a", fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
                {tasks[openIndex].description}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ fontSize: "0.8rem" }}>🕐</span>
              <span style={{ fontSize: "0.8rem", color: "#60a5fa" }}>{tasks[openIndex].createdAt}</span>
            </div>
          </div>
        </div>
      )}

      {editIndex !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "1rem",
            backdropFilter: "blur(4px)",
          }}
          onClick={cancelEdit}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "16px",
              padding: "2rem",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ color: "#1e3a8a", fontSize: "1.3rem", fontWeight: "bold", margin: 0 }}>Edit Memo</h2>
              <button
                onClick={cancelEdit}
                style={{
                  background: "none",
                  border: "none",
                  color: "#60a5fa",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={{
                  padding: "0.85rem 1rem",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  outline: "none",
                  background: "rgba(255,255,255,0.5)",
                  color: "#1e3a8a",
                }}
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={4}
                style={{
                  padding: "0.85rem 1rem",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  outline: "none",
                  resize: "none",
                  background: "rgba(255,255,255,0.5)",
                  color: "#1e3a8a",
                  fontFamily: "inherit",
                }}
              />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => saveEdit(editIndex)}
                  style={{
                    flex: 1,
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.85rem",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.target.style.opacity = "1")}
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  style={{
                    flex: 1,
                    background: "#94a3b8",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "0.85rem",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.target.style.opacity = "1")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Memo;