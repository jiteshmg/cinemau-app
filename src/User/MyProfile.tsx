import React, {useEffect, useState} from "react";
import {
    Card,
    Container,
    Row,
    Col,
    Dropdown,
    DropdownItem,
    Form,
    FormGroup,
    FormLabel,
    FormControl,
    Button
} from 'react-bootstrap';
import Select, {MultiValue, ActionMeta} from 'react-select';
import '../App.css';

interface Role {
    id : number;
    name : string;
}

type SelectOption = {
    value: number;
    label: string
};

interface RoleOption {
    value : number;
    label : string;
}

interface UserProfile {
    id : string;
    name : string;
    email : string;
    address?: string;
    mobile?: string;
    roles : Role[];
    image_path?: string;
    verified : boolean;
}

const MyProfile : React.FC < {
    onClose: () => void
} > = ({onClose}) => {
    const [user,
        setUser] = useState < UserProfile | null > (null);
    const [roles,
        setRoles] = useState < Role[] > ([]);
    const [selectedRoles,
        setSelectedRoles] = useState < Role[] > ([]);
    const [selectedRole,
        setSelectedRole] = useState < SelectOption[] > ([]);
    const [newRole,
        setNewRole] = useState("");
    const userVal = JSON.parse(localStorage.getItem('user') || '{}');
    const [selectedImage,
        setSelectedImage] = useState < File | null > (null);

    const fetchUserData = async(userId : string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/get-user/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const userData = await response.json();
            setUser(userData.data);
            console.log(userData.data);
            // Map roles into Select format
            if (userData.data.roles) {
                const formattedRoles = userData
                    .data
                    .roles
                    .map((role : Role) => ({value: role.id, label: role.name}));
                setSelectedRole(formattedRoles);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle error (e.g., display a message to the user)
        }
        console.log('Role', selectedRole);
    };

    const fetchRoles = async() => {
        try {
            const response = await fetch('http://localhost:8000/api/role', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Include authorization header if required 'Authorization': `Bearer
                    // ${yourToken}`
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

    const handleImageChange = (event : React.ChangeEvent < HTMLInputElement >) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedImage(file); // Set the image
        }
    };

    const handleImageUpload = async () => {
        if (!selectedImage || !user?.id) {
            console.error("No image selected or user ID missing.");
            return;
        }
    
        const formData = new FormData();
        formData.append("image", selectedImage);
    
        try {
            const response = await fetch(`http://localhost:8000/api/update-profile-image/${user.id}`, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                    // DO NOT set "Content-Type": "multipart/form-data"
                }
            });
    
            if (!response.ok) {
                throw new Error(`Image upload failed: ${response.status}`);
            }
    
            const result = await response.json();
            console.log("Image uploaded successfully:", result);
            
            // Update user state with new image path
            setUser(prevUser => prevUser ? { ...prevUser, image_path: result.image_path } : null);
            alert("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image.");
        }
    };
    

    const handleSelectChange = (newValue : MultiValue < SelectOption >, actionMeta : ActionMeta < SelectOption >) => {
        const selectedOptions = Array.isArray(newValue)
            ? newValue
            : [];
        setSelectedRole(selectedOptions);

        // Map SelectOption to Role
        const roles = selectedOptions.map(option => ({id: option.value, name: option.label}));
        setSelectedRoles(roles);
    };

    const handleSaveProfile = async() => {
        if (!user) 
            return;
        
        const profileData = {
            name: user.name,
            address: user.address || "",
            mobile: user.mobile || "",
            roles: selectedRoles.map(role => role.id),
            image_path: user.image_path // Use the updated image path
        };

        try {
            const response = await fetch(`http://localhost:8000/api/user-update/${user.id}`, {
                method: "PUT",
                body: JSON.stringify(profileData),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Profile update failed: ${response.status}`);
            }

            const result = await response.json();
            console.log("Profile updated successfully:", result);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile.");
        }
    };

    // Convert roles to Select options format
    const roleOptions : SelectOption[] = roles.map(role => ({value: role.id, label: role.name}));

    useEffect(() => {
        if (selectedImage) {
            handleImageUpload();
        }
    }, [selectedImage]);  // Runs when `selectedImage` is updated
    
    useEffect(() => {
        // Fetch user data from the database (replace with API call)
        fetchUserData(userVal.id);
        fetchRoles();
    }, []);
    return ( <> <Container className="profile-form-container" fluid>
        <Card className="profile-form-box">
            <Card.Body>
                <h1 className="text-2xl font-bold mb-4">My Profile</h1>
                {user
                    ? (
                        <Form>
                            <FormGroup controlId="formProfileImage">
                                <Row className="align-items-center mb-3">
                                    <Col xs="3">
                                        <FormLabel>Profile Image</FormLabel>
                                        <FormControl type="file" onChange={handleImageChange} accept="image/*"/>
                                    </Col>
                                    <Col xs="9">
                                        {user.image_path && (<img
                                            src={`http://localhost:8000${user.image_path}`}
                                            alt="Profile Image"
                                            className="profile-image"
                                            style={{
                                            width: 'auto%',
                                            height: '100px'
                                        }}/>)}
                                    </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup controlId="formBasicName">
                                <Row className="align-items-center">
                                    <Col xs="6">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl
                                            type="text"
                                            value={user.name}
                                            onChange={(e) => setUser({
                                            ...user,
                                            name: e.target.value
                                        })}/>
                                    </Col>
                                    <Col xs="6">
                                        <FormLabel>Email address</FormLabel>
                                        <FormControl type="email" value={user.email} disabled/>
                                    </Col>
                                </Row>
                            </FormGroup>
                            {/* Add more form fields as needed */}
                            <FormGroup controlId="formBasicAddress">
                                <Row className="align-items-center">
                                    <Col xs="6">
                                        <FormLabel>Address</FormLabel>
                                        <FormControl
                                            type="text"
                                            value={user.address}
                                            onChange={(e) => setUser({
                                            ...user,
                                            address: e.target.value
                                        })}/>
                                    </Col>
                                    <Col xs="6">
                                        <FormLabel>Mobile</FormLabel>
                                        <FormControl
                                            type="text"
                                            value={user.mobile}
                                            onChange={(e) => setUser({
                                            ...user,
                                            mobile: e.target.value
                                        })}/>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <Row className="mt-3">
                                <Col xs="6">
                                    <FormLabel>Roles</FormLabel>
                                    <Select
                                        options={roleOptions}
                                        value={selectedRole}
                                        onChange={handleSelectChange}
                                        className="relative"
                                        placeholder="Select a role..."
                                        isClearable
                                        isMulti/>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col xs="4">
                                    <Button variant="primary" onClick={handleSaveProfile}>
                                        Save Profile
                                    </Button>
                                </Col>
                                <Col xs="4" className="text-center">
                                    <Button variant="secondary" onClick={onClose}>
                                        Back to Dashboard
                                    </Button>
                                </Col>
                                <Col xs="4" className="text-end">
                                    <Button variant="danger">Change Password</Button>
                                </Col>
                            </Row>

                        </Form>
                    )
                    : (
                        <p>Loading profile...</p>
                    )}
            </Card.Body>
        </Card>
    </Container> </>
  );
};

export default MyProfile;