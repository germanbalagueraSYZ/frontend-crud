import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    TextField, Button, Container, Box, Typography,
    Grid, Paper, Card, CardContent, CardActions, IconButton, List, ListItem, ListItemText
} from '@mui/material';
import { Edit, Delete, CenterFocusStrong } from '@mui/icons-material';

const PersonForm = () => {
    const [persons, setPersons] = useState([]);
    const [form, setForm] = useState({ first_name: '', last_name: '', age: '' });
    const [editingPerson, setEditingPerson] = useState(null);

    useEffect(() => {
        fetchPersons();
    }, []);

    const fetchPersons = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/persons/');
            setPersons(response.data);
        } catch (error) {
            console.error("There was an error fetching the persons!", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPerson) {
                await axios.put(`http://localhost:8000/api/persons/${editingPerson.id}/`, form);
                setEditingPerson(null);
            } else {
                await axios.post('http://localhost:8000/api/persons/', form);
            }
            setForm({ first_name: '', last_name: '', age: '' });
            fetchPersons();
        } catch (error) {
            console.error("There was an error submitting the form!", error);
        }
    };

    const handleEdit = (person) => {
        setForm({
            first_name: person.first_name,
            last_name: person.last_name,
            age: person.age
        });
        setEditingPerson(person);
    };

    const handleDelete = async (personId) => {
        try {
            await axios.delete(`http://localhost:8000/api/persons/${personId}/`);
            fetchPersons();
        } catch (error) {
            console.error("There was an error deleting the person!", error);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Card elevation={3} style={{ padding: '50px', marginTop: '20px' }}>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom textAlign={{textAlign:'center'}} textTransform={{textTransform:'uppercase'}}>
                        {editingPerson ? "Edit Person" : "Register Person"}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="first_name"
                                    label="First Name"
                                    variant="outlined"
                                    fullWidth
                                    value={form.first_name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="last_name"
                                    label="Last Name"
                                    variant="outlined"
                                    fullWidth
                                    value={form.last_name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="age"
                                    label="Age"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    value={form.age}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    {editingPerson ? "Update" : "Submit"}
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            <Typography variant="h6" component="h3" textAlign={{textAlign:'center'}} color={{color:'black'}} gutterBottom style={{ marginTop: '20px' }} textTransform={{textTransform:'uppercase'}}>
                Person List
            </Typography>
            <List>
                {persons.map(person => (
                    <ListItem key={person.id} secondaryAction={
                        <>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(person)}>
                                <Edit color='success'/>
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(person.id)}>
                                <Delete color='error'/>
                            </IconButton>
                        </>
                    }>
                        <ListItemText
                            primary={`${person.first_name} ${person.last_name}`}
                            secondary={`Age: ${person.age}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default PersonForm;
