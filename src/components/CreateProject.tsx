import React, { useEffect, useState } from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';
import {
    Form,
    Button,
    Row,
    Col,
    Container,
    Card
} from 'react-bootstrap';

interface Role {
    id: number;
    name: string;
}

type SelectOption = {
    value: number;
    label: string;
};

interface CreateProjectProps {
    onCancel: () => void;
    onProjectCreated: () => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onCancel, onProjectCreated }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const apiUrl: string = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<SelectOption[]>([]);

    const [movie, setMovie] = useState({
        title: '',
        description: '',
        releaseDate: '',
        genre: '',
        durationMinutes: 0,
        rating: 0.0,
        budget: 0.0,
        boxOffice: 0.0,
        posterUrl: '',
        trailerUrl: '',
        status: 'Ongoing',
        expectedStartDate: ''
    });

    const fetchUserRoles = async () => {
        try {
            if (!user.id || !token) {
                throw new Error("User is not authenticated");
            }

            const response = await fetch(`${apiUrl}/user-role/${user.id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log("API Response:", result);

            // Check status instead of success
            if (result.status === "success") {
                setRoles(result.data);
                console.log("Roles set:", result.data);
            } else {
                throw new Error(result.message || "Failed to fetch roles");
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setMovie(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = {
                ...movie,
                role_ids: selectedRoles.map((role) => role.value) // Include role IDs
            };

            const response = await fetch(`${apiUrl}/create-movie`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Project created successfully!');
                onProjectCreated();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Please try again.');
        }
    };

    const roleOptions: SelectOption[] = roles.map(role => ({ value: role.id, label: role.name }));

    const handleRoleSelect = (selected: MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => {
        setSelectedRoles(selected ? Array.from(selected) : []);
    };

    useEffect(() => {
        fetchUserRoles();
    }, []);

    return (
        <Container className="profile-form-container" fluid>
            <Card className="profile-form-box px-3 py-2">
                <Form onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold mb-4">Create Project</h1>
                    <Row className="mb-3">
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Title*</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={movie.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Status*</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={movie.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="Upcoming">Upcoming</option>
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Release Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="releaseDate"
                                value={movie.releaseDate}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Expected Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="expectedStartDate"
                                value={movie.expectedStartDate}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={movie.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Genre</Form.Label>
                            <Form.Control
                                type="text"
                                name="genre"
                                value={movie.genre}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Duration (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                name="durationMinutes"
                                value={movie.durationMinutes}
                                onChange={handleChange}
                                min="0"
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Rating (1.0 - 10.0)</Form.Label>
                            <Form.Control
                                type="number"
                                name="rating"
                                value={movie.rating}
                                onChange={handleChange}
                                step="0.1"
                                min="0.0"
                                max="10.0"
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Budget (₹)</Form.Label>
                            <Form.Control
                                type="number"
                                name="budget"
                                value={movie.budget}
                                onChange={handleChange}
                                step="0.01"
                                min="0.0"
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Box Office (₹)</Form.Label>
                            <Form.Control
                                type="number"
                                name="boxOffice"
                                value={movie.boxOffice}
                                onChange={handleChange}
                                step="0.01"
                                min="0.0"
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Poster URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="posterUrl"
                                value={movie.posterUrl}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md={6}>
                            <Form.Label>Trailer URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="trailerUrl"
                                value={movie.trailerUrl}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                            <Form.Label>My role</Form.Label>
                            <Select
                                options={roleOptions}
                                value={selectedRoles}
                                onChange={handleRoleSelect}
                                className="relative"
                                placeholder="Select roles..."
                                isMulti
                                isClearable
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Button variant="dark" type="submit" className="rounded-0">
                                Create Project
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="secondary" onClick={onCancel} className="rounded-0">
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
};

export default CreateProject;