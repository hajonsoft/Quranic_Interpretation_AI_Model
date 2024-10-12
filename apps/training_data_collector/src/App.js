import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAprgwF4OF2ZyyAY1hgbcPRzwCrw2AFo3k",
  authDomain: "training-data-collector.firebaseapp.com",
  projectId: "training-data-collector",
  storageBucket: "training-data-collector.appspot.com",
  messagingSenderId: "92724339029",
  appId: "1:92724339029:web:b53d5c4fd3c3f31f104fdc",
  measurementId: "G-146FQ3N9Y9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const db = getFirestore(app);

function App() {
  const [question, setQuestion] = useState('');
  const [wrongResponse, setWrongResponse] = useState('');
  const [correctResponse, setCorrectResponse] = useState('');
  const [lastEntries, setLastEntries] = useState([]);

  // Fetch last 5 entries from Firestore
  const fetchLastEntries = async () => {
    const q = query(collection(db, 'responses'), orderBy('timestamp', 'desc'), limit(5));
    const querySnapshot = await getDocs(q);
    const entries = querySnapshot.docs.map(doc => doc.data());
    setLastEntries(entries);
  };

  // Add a new entry to Firestore
  const handleSubmit = async () => {
    if (question && wrongResponse && correctResponse) {
      try {
        await addDoc(collection(db, 'responses'), {
          question,
          wrongResponse,
          correctResponse,
          timestamp: new Date()
        });
        setQuestion('');
        setWrongResponse('');
        setCorrectResponse('');
        fetchLastEntries();  // Refresh the list after submission
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }
  };

  useEffect(() => {
    fetchLastEntries();  // Fetch the last entries on component mount
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Training Data Collector</Typography>
      
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

      <Typography variant="h5" gutterBottom>Last 5 Entries</Typography>
      <List>
        {lastEntries.map((entry, index) => (
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
