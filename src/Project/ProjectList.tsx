import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import CreateProject from '../components/CreateProject'; 
import Select, {MultiValue, ActionMeta} from 'react-select';
import {
    Navbar,
    Nav,
    Dropdown,
    Button,
    Row,
    Col,
    Card,
    Container
} from 'react-bootstrap';

interface Role {
    id : number;
    name : string;
}

interface Project {
    id : number;
    title : string;
}

interface User {
    id : number;
    name : string;
}

interface MovieCrew {
    id : number;
    movie_id : number;
    user_id : number;
    role_id : number;
    user : User;
    role : Role;
}

interface UserProject {
    id : number;
    title : string;
    description : string;
    release_date : string;
    genre?: string; // Optional if not always present
    duration_minutes?: number;
    rating?: number;
    budget?: number;
    box_office?: number;
    poster_url?: string;
    trailer_url?: string;
    status : string;
    expected_start_date?: string;
    created_at : string;
    updated_at : string;
    movie_crew : MovieCrew[]; // Array of movieCrew objects
}

type SelectOption = {
    value: number;
    label: string
};

type SelectProject = {
    value: number;
    label: string
};

const ProjectList : React.FC = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
   
    const [showInvite,
        setShowInvite] = useState(false);
    const [roles,
        setRoles] = useState < Role[] > ([]);
    
    const [selectedRole, setSelectedRole] = useState<SelectOption | null>(null);
    const [projects,
        setProjects] = useState < Project[] > ([]);
    
    const [selectedProject, setSelectedProject] = useState<SelectProject | null>(null);
    const [userProjects,
        setUserProjects] = useState < UserProject[] > ([]);
    const [usersByRole, setUsersByRole] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<SelectOption[]>([]);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
  
    const handleInviteClose = () => setShowInvite(false);
    const handleInviteShow = () => setShowInvite(true);
    const apiUrl : string = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    const fetchUserProjects = async() => {
        try {

            const response = await fetch(`${apiUrl}/movie-user/${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Attach the token
                }
            });
           
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status) {
                setUserProjects(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch user projects');
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            // Handle error state here if needed Example: setErrorState(error.message);
        }
    };

    const fetchRoles = async() => {
        try {

            const response = await fetch(`${apiUrl}/role`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Attach the token
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status) {
                setRoles(result.data);

            } else {
                throw new Error(result.message || 'Failed to fetch roles');
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            // Handle error state here if needed Example: setErrorState(error.message);
        }
    };

    const fetchProjects = async () => {
        try {
            let url = `${apiUrl}/movies`;
            if (user.id) {
                url += `?created_by=${user.id}`;
            }
    
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
            const result = await response.json();
            if (result.status) setProjects(result.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const fetchUsersByRole = async (roleId: number) => {
        try {
            const response = await fetch(`${apiUrl}/role-user/${roleId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            if (result.status) {
                setUsersByRole(result.data);
            } else {
                throw new Error(result.message || 'Failed to fetch users by role');
            }
        } catch (error) {
            console.error('Error fetching users by role:', error);
        }
    };

    const handleInviteSave = async () => {
        if (!selectedRole || !selectedProject || selectedUsers.length === 0) {
            alert("Please select a role, movie, and at least one user.");
            return;
        }
    
        const joinData = {
            user_ids: selectedUsers.map((user) => user.value),
            movie_id: selectedProject.value,
            role_id: selectedRole.value
        };
    
        try {
            const response = await fetch(`${apiUrl}/invite-movie`, {
                method: "POST",
                body: JSON.stringify(joinData),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error(`Invitation failed: ${response.status}`);
            }
    
            const result = await response.json();
            console.log(result.message || "Invitations sent successfully");
        } catch (error) {
            console.error("Error sending invitation:", error);
            alert("Error sending invitation.");
        }
    
        setShowInvite(false);
    };

    const handleUserSelectChange = (selected: MultiValue<SelectOption>) => {
        setSelectedUsers([...selected]); // Convert readonly to mutable array
    };
    const handleRoleSelect = (selectedRole: SelectOption | null) => {
        setSelectedRole(selectedRole);
        if (selectedRole) {
          fetchUsersByRole(selectedRole.value);
        }
    };

    const handleProjectSelect = (selectedProject: SelectProject | null) => {
        setSelectedProject(selectedProject);
    };

    const handleCreateProject = () => {
        setIsCreatingProject(true);
    };

    const handleCreateProjectCancel = () => {
        setIsCreatingProject(false);
      };

    // Convert roles to Select options format
    const roleOptions : SelectOption[] = roles.map(role => ({value: role.id, label: role.name}));
    const projectOptions : SelectProject[] = projects.map(project => ({value: project.id, label: project.title}));
    const userOptions = usersByRole.map((user) => ({
        value: user.id,
        label: user.name,
    }));

    // Format date to dd/mm/yy
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A"; // Handle missing or undefined dates
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of year
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        if (showInvite === true) {
            fetchRoles();
            fetchProjects();
        }
    }, [showInvite]);
    useEffect(() => {
        fetchUserProjects();
    }, []);

    return ( <> <Row className="mt-3">
        <Col xs="6"></Col>
        <Col xs="2">
            <Button variant="dark" onClick={handleCreateProject} >Create Project</Button>
        </Col>
        <Col xs="2">
            <Button variant="dark" onClick={handleInviteShow}>Invite</Button>
        </Col>
    </Row> < Container className = "profile-form-container" fluid > 
    {isCreatingProject ? (
          // Render Create Project component
          <CreateProject 
            onCancel={handleCreateProjectCancel} 
            onProjectCreated={() => {
              setIsCreatingProject(false);
              // Optionally refresh your project list
              fetchUserProjects();
            }}
          />
        ) : (
          // Render Project List
    <Card className="profile-form-box">
        <Card.Body>
            <h1 className="text-2xl font-bold mb-4">My Projects</h1>
            {userProjects && (
                <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Director</th>
                        <th>Producer</th>
                        <th>Cast</th>
                        <th>Release Date</th>
                        <th>Project Start Date</th>
                    </tr>
                </thead>
                <tbody>
                    {userProjects.map((movie, index) => {
                        // Filter movie_crew for Director, Producer, and Cast
                        const directors = movie.movie_crew
                            .filter(crew => crew.role.name === "Director")
                            .map(crew => crew.user.name)
                            .join(", ");
            
                        const producers = movie.movie_crew
                            .filter(crew => crew.role.name === "Producer")
                            .map(crew => crew.user.name)
                            .join(", ");
            
                        const cast = movie.movie_crew
                            .filter(crew => crew.role.name === "Actor")
                            .map(crew => crew.user.name)
                            .join(", ");
            
                        return (
                            <tr key={movie.id}>
                                <td>{index + 1}</td>
                                <td>{movie.title}</td>
                                <td>{directors || "N/A"}</td>
                                <td>{producers || "N/A"}</td>
                                <td>{cast || "N/A"}</td>
                                <td>{formatDate(movie.release_date)}</td>
                                <td>{formatDate(movie.expected_start_date)}</td>
                                <td></td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            )}
        </Card.Body>
    </Card>)} 
    </Container>
   
    <Modal show={showInvite} onHide={handleInviteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Invite to a project</Modal.Title > </Modal.Header> < Modal.Body > <Form>
        <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Select
                options={roleOptions}
                value={selectedRole}
                onChange={(selected) => handleRoleSelect(selected)}
                className="relative"
                placeholder="Select a role..."
                isClearable
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Users</Form.Label>
            <Select
                options={userOptions}
                value={selectedUsers}
                onChange={handleUserSelectChange}
                className="relative"
                placeholder="Select users..."
                isClearable
                isMulti
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>Project</Form.Label>
            <Select
                options={projectOptions}
                value={selectedProject}
                onChange={(selected) => handleProjectSelect(selected)}
                className="relative"
                placeholder="Select a project..."
                isClearable
            />
        </Form.Group>
    </Form> </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleInviteClose}>
            Close
          </Button > <Button variant="primary" onClick={handleInviteSave}>
        Send Invitation
    </Button> </Modal.Footer>
    </Modal >
      </>);

};

export default ProjectList;