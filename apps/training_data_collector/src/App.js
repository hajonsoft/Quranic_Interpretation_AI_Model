import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { saveAs } from "file-saver";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAprgwF4OF2ZyyAY1hgbcPRzwCrw2AFo3k",
  authDomain: "training-data-collector.firebaseapp.com",
  projectId: "training-data-collector",
  storageBucket: "training-data-collector.appspot.com",
  messagingSenderId: "92724339029",
  appId: "1:92724339029:web:b53d5c4fd3c3f31f104fdc",
  measurementId: "G-146FQ3N9Y9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const db = getFirestore(app);

function App() {
  const [question, setQuestion] = useState("");
  const [wrongResponse, setWrongResponse] = useState("");
  const [correctResponse, setCorrectResponse] = useState("");
  const [entries, setEntries] = useState([]);

  // Fetch last 5 entries from Firebase
  useEffect(() => {
    const fetchEntries = async () => {
      const querySnapshot = await getDocs(collection(db, "responses"));
      const docs = querySnapshot.docs.map((doc) => doc.data());
      setEntries(docs.slice(-5)); // Show only the last 5 entries
    };

    fetchEntries();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || !wrongResponse || !correctResponse) {
      alert("Please fill in all fields");
      return;
    }

    // Save data to Firebase
    await addDoc(collection(db, "responses"), {
      question,
      wrong_response: wrongResponse,
      correct_response: correctResponse,
    });

    // Clear form fields
    setQuestion("");
    setWrongResponse("");
    setCorrectResponse("");

    // Fetch latest entries
    const querySnapshot = await getDocs(collection(db, "responses"));
    const docs = querySnapshot.docs.map((doc) => doc.data());
    setEntries(docs.slice(-5)); // Update displayed entries
  };

  // Function to export entries as JSON file
  const exportAsJson = () => {
    const jsonData = JSON.stringify(entries, null, 2); // Convert entries to JSON string
    const blob = new Blob([jsonData], { type: "application/json" });
    saveAs(blob, "training_data.json"); // Download JSON file
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Training Data Collector
      </Typography>

      <Box mb={3}>
        <TextField
          label="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Wrong Response"
          value={wrongResponse}
          onChange={(e) => setWrongResponse(e.target.value)}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Correct Response"
          value={correctResponse}
          onChange={(e) => setCorrectResponse(e.target.value)}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Submit
        </Button>
      </Box>
      <Button
        onClick={exportAsJson}
        variant="contained"
        color="secondary"
        sx={{ marginTop: 2 }}
      >
        Export as JSON
      </Button>
      <Typography variant="h5" gutterBottom>
        Last 5 Entries
      </Typography>
      <List>
        {entries.map((entry, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Q: ${entry.question}`}
              secondary={`Wrong: ${entry.wrongResponse}\nCorrect: ${entry.correctResponse}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;
