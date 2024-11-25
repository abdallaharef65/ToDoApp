/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import Header from "./components/Header/Header"; // app title.
import AddItem from "./components/AddItem/AddItem"; // new tasks.
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CheckBox } from "react-native-elements"; // CheckBox component for marking tasks as completed.
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid"; // Generates unique IDs for tasks.

const App = () => {
  // State to store the list of tasks
  const [tasks, setTasks] = useState([]);

  // Function to save tasks to AsyncStorage
  const saveTasksToStorage = async (tasks) => {
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // Function to load tasks from AsyncStorage on app start
  const loadTasksFromStorage = async () => {
    const storedTasks = await AsyncStorage.getItem("tasks");
    setTasks(storedTasks ? JSON.parse(storedTasks) : []);
  };

  // Effect hook to load tasks when the app starts
  useEffect(() => {
    loadTasksFromStorage();
  }, []);

  // Function to add a new task
  const addTask = (value) => {
    if (!value.trim()) {
      alert("Task title cannot be empty!");
      return;
    }
    setTasks([...tasks, { id: uuidv4(), title: value, completed: false }]);
    saveTasksToStorage([
      ...tasks,
      { id: uuidv4(), title: value, completed: false },
    ]);
  };

  // Function to delete a task by its ID
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    saveTasksToStorage(tasks.filter((t) => t.id !== id));
  };

  // Function to toggle task completion
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((ele) =>
      ele.id === id ? { ...ele, completed: !ele.completed } : ele
    );
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  // Function to render each task row in the list
  const renderTaskRow = ({ item }) => (
    <View style={styles.row}>
      {/* CheckBox to mark the task as completed or pending */}
      <View style={{ width: 20 }}>
        <CheckBox
          checked={item.completed}
          onPress={() => toggleTaskCompletion(item.id)}
          checkedColor="#483D8B"
          uncheckedColor="#483D8B"
        />
      </View>
      {/* Task title */}
      <Text style={styles.rowText}>{item.title}</Text>
      {/* Delete button */}
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  // Header for the task table
  const TableHeaderSchedules = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Done</Text>
        <Text style={styles.headerText2}>Task</Text>
        <Text style={styles.headerText}>Action</Text>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* App title */}
        <Header title="To Do List" />
        {/* Input to add tasks */}
        <AddItem addTask={addTask} />
        {/* Section for pending tasks */}
        <Text style={styles.sectionTitle}>Pending Tasks</Text>
        <FlatList
          style={{ height: 150 }}
          data={tasks.filter((i) => i.completed == false)}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={TableHeaderSchedules}
          renderItem={renderTaskRow}
        />
        {/* Section for completed tasks */}
        <Text style={styles.sectionTitle}>Completed Tasks</Text>
        <FlatList
          style={{ height: 150 }}
          data={tasks.filter((i) => i.completed == true)}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={TableHeaderSchedules}
          renderItem={renderTaskRow}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", margin: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "#483D8B",
    height: 40,
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
  },
  headerText2: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 2,
    textAlign: "center",
    color: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#483D8B",
  },
  rowText: { textAlign: "center", fontSize: 16, minWidth: 200, maxWidth: 200 },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default App;
