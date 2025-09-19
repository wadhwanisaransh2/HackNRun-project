# Profile Management Features

## Backend API Endpoints

### Authentication Required Endpoints

All profile endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### 1. Get User Profile
- **Endpoint**: `GET /api/profile`
- **Description**: Retrieves the current user's profile information
- **Response**: Profile object with avatar, bio, location, phone, social links, education, skills, badges, certifications, and stats

### 2. Update User Profile
- **Endpoint**: `PUT /api/profile`
- **Description**: Updates the current user's profile information
- **Body**: JSON object with profile fields to update
- **Response**: Success message and updated profile

### 3. Get Profile Completion
- **Endpoint**: `GET /api/profile/completion`
- **Description**: Calculates and returns the profile completion percentage
- **Response**: Object with completion percentage (0-100)

### 4. Get Current User
- **Endpoint**: `GET /api/me`
- **Description**: Gets current user information including profile data
- **Response**: User object with basic info and profile

## Profile Data Structure

```json
{
  "avatar": "https://example.com/avatar.jpg",
  "bio": "User's bio text",
  "location": "City, Country",
  "phone": "+1 (555) 123-4567",
  "socialLinks": {
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username",
    "twitter": "https://twitter.com/username"
  },
  "education": [],
  "skills": [],
  "badges": [],
  "certifications": [],
  "stats": {
    "projectsCompleted": 12,
    "hoursCoded": 247,
    "connections": 38
  },
  "joinDate": "2023-01-01T00:00:00.000Z"
}
```

## Frontend Features

### Profile Page (profile.html)

1. **Dynamic Data Loading**: Automatically fetches and displays user data from the backend
2. **Authentication Check**: Redirects to login if user is not authenticated
3. **Profile Editing Modal**: Beautiful modal with form to edit profile information
4. **Real-time Progress Tracking**: Shows profile completion percentage with animated progress circle
5. **Social Links Integration**: Displays and allows editing of social media profiles
6. **Stats Display**: Shows user statistics (projects, hours coded, connections)
7. **Responsive Design**: Works on all device sizes
8. **Notification System**: Shows success/error messages for user actions

### Key Features:
- **Edit Profile**: Click "Edit" button to open modal with all profile fields
- **Auto-save**: Changes are saved to backend immediately
- **Progress Tracking**: Visual progress circle shows profile completion
- **Social Integration**: Links to GitHub, LinkedIn, Twitter profiles
- **Stats Management**: Update project count, coding hours, connections
- **Avatar Support**: Upload avatar via URL
- **Bio Section**: Personal description field
- **Location & Contact**: Phone number and location fields

## Usage

1. **Start the server**: `npm start`
2. **Login**: Use existing login system to get JWT token
3. **Access Profile**: Navigate to profile.html
4. **Edit Profile**: Click "Edit" button to modify profile information
5. **View Progress**: See profile completion percentage in the progress circle

## Security

- All endpoints require valid JWT authentication
- User can only access and modify their own profile
- Input validation on both frontend and backend
- Secure token-based authentication

## Future Enhancements

- File upload for avatar images
- Skills management system
- Badge earning system
- Certification tracking
- Education history management
- Profile sharing features
