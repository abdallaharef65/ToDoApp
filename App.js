/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Header from "./components/Header/Header"; // app title.
import AddItem from "./components/AddItem/AddItem"; // new tasks.
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CheckBox } from "react-native-elements"; // CheckBox component for marking tasks as completed.
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid"; // Generates unique IDs for tasks.
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

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
    setTasks([
      ...tasks,
      { swipe: ">>", id: uuidv4(), title: value, completed: false },
    ]);
    saveTasksToStorage([
      ...tasks,
      { swipe: ">>", id: uuidv4(), title: value, completed: false },
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

  // Function to render each task row in the list with Reanimated Swipeable
  const renderTaskRow = ({ item }) => {
    const renderLeftActions = () => (
      <View style={styles.swipeActionContainer}>
        <Text style={styles.swipeActionText}>Swipe to Delete</Text>
      </View>
    );

    return (
      <Swipeable
        renderLeftActions={renderLeftActions}
        onSwipeableOpen={() => deleteTask(item.id)}
      >
        <View style={styles.row}>
          {/* <Text style={styles.rowTextSwipe}>{item.swipe}</Text> */}
          <CheckBox
            checked={item.completed}
            onPress={() => toggleTaskCompletion(item.id)}
            checkedColor="#483D8B"
            uncheckedColor="#483D8B"
          />
          <Text style={styles.rowText}>{item.title}</Text>
          {/* Delete button */}
          <TouchableOpacity onPress={() => deleteTask(item.id)}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  // Header for the task table
  const TableHeaderSchedules = () => {
    return (
      <View style={styles.header}>
        {/* <Text style={styles.headerText}>Swipe</Text> */}
        <Text style={styles.headerText}>Done</Text>
        <Text style={styles.headerText2}>Task</Text>
        <Text style={styles.headerText}>Action</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
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
            data={tasks.filter((task) => !task.completed)}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={TableHeaderSchedules}
            renderItem={renderTaskRow}
          />

          {/* Section for completed tasks */}
          <Text style={styles.sectionTitle}>Completed Tasks</Text>

          <FlatList
            style={{ height: 150 }}
            data={tasks.filter((task) => task.completed)}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={TableHeaderSchedules}
            renderItem={renderTaskRow}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", marginTop: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#dedede",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
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
    minWidth: 90,
    maxWidth: 90,
  },
  headerText2: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    left: -55,
    color: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#483D8B",
    backgroundColor: "#FFF",
  },
  rowText: {
    alignItems: "center",
    fontSize: 16,
    minWidth: 150,
    maxWidth: 150,
    left: -5,
  },
  deleteButton: {
    backgroundColor: "#2e2752",
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    left: -5,
    borderWidth: 1,
    borderColor: "#483D8B",
    borderRadius: 5,
    padding: 5,
  },

  swipeActionContainer: {
    backgroundColor: "#2e2752",
    justifyContent: "center",
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  swipeActionText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default App;
