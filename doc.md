
# InvestEasy API Documentation

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Authentication](#authentication)
3. [Routes Utilisateurs](#routes-utilisateurs)
4. [Routes Vidéos](#routes-vidéos)
5. [Routes Recommandations](#routes-recommandations)
6. [Routes Forum/Commentaires](#routes-forumcommentaires)
7. [Routes Admin](#routes-admin)
8. [DTOs (Data Transfer Objects)](#dtos-data-transfer-objects)
9. [Codes d'erreur](#codes-derreur)
10. [Exemples d'utilisation](#exemples-dutilisation)

## Vue d'ensemble

**Base URL:** `http://localhost:8080/api`

**Format de réponse:** JSON
**Authentification:** Bearer Token (JWT)
**Content-Type:** application/json

### Headers requis
```
Content-Type: application/json
Authorization: Bearer <token> (pour les routes protégées)
```

## Authentication

### POST /auth/register
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

**Response 201:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "user",
    "createdAt": "datetime"
  },
  "token": "string"
}
```

### POST /auth/login
Connexion utilisateur

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response 200:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "user|admin",
    "createdAt": "datetime"
  },
  "token": "string"
}
```

### POST /auth/logout
Déconnexion utilisateur

**Headers:** Authorization required

**Response 200:**
```json
{
  "message": "Logged out successfully"
}
```

### POST /auth/refresh
Rafraîchir le token

**Headers:** Authorization required

**Response 200:**
```json
{
  "token": "string"
}
```

### POST /auth/forgot-password
Demande de réinitialisation de mot de passe

**Body:**
```json
{
  "email": "string"
}
```

**Response 200:**
```json
{
  "message": "Reset email sent"
}
```

### POST /auth/reset-password
Réinitialisation de mot de passe

**Body:**
```json
{
  "token": "string",
  "newPassword": "string"
}
```

**Response 200:**
```json
{
  "message": "Password reset successfully"
}
```

## Routes Utilisateurs

### GET /users/profile
Récupérer le profil utilisateur connecté

**Headers:** Authorization required

**Response 200:**
```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "user|admin",
  "preferences": {
    "language": "fr|en",
    "notifications": "boolean",
    "theme": "light|dark"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### PUT /users/profile
Mettre à jour le profil utilisateur

**Headers:** Authorization required

**Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "preferences": {
    "language": "fr|en",
    "notifications": "boolean",
    "theme": "light|dark"
  }
}
```

**Response 200:**
```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "user|admin",
  "preferences": {
    "language": "fr|en",
    "notifications": "boolean",
    "theme": "light|dark"
  },
  "updatedAt": "datetime"
}
```

### PUT /users/change-password
Changer le mot de passe

**Headers:** Authorization required

**Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response 200:**
```json
{
  "message": "Password changed successfully"
}
```

## Routes Vidéos

### GET /videos
Récupérer toutes les vidéos

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `category` (string, optional)
- `search` (string, optional)
- `sort` (string: 'newest'|'oldest'|'popular', default: 'newest')

**Response 200:**
```json
{
  "videos": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "url": "string",
      "thumbnail": "string",
      "category": "string",
      "duration": "number",
      "views": "number",
      "likes": "number",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number",
    "hasNext": "boolean",
    "hasPrev": "boolean"
  }
}
```

### GET /videos/:id
Récupérer une vidéo spécifique

**Response 200:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "url": "string",
  "thumbnail": "string",
  "category": "string",
  "duration": "number",
  "views": "number",
  "likes": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### POST /videos/:id/view
Enregistrer une vue sur une vidéo

**Headers:** Authorization required

**Response 200:**
```json
{
  "message": "View recorded",
  "views": "number"
}
```

### POST /videos/:id/like
Liker/déliker une vidéo

**Headers:** Authorization required

**Response 200:**
```json
{
  "message": "Like toggled",
  "likes": "number",
  "isLiked": "boolean"
}
```

### GET /videos/categories
Récupérer toutes les catégories

**Response 200:**
```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "videoCount": "number"
    }
  ]
}
```

## Routes Recommandations

### POST /recommendations
Générer une recommandation d'investissement

**Headers:** Authorization required

**Body:**
```json
{
  "budget": "number",
  "goal": "retirement|savings|growth|income",
  "riskTolerance": "low|medium|high",
  "timeHorizon": "short|medium|long",
  "age": "number",
  "currentInvestments": "string"
}
```

**Response 200:**
```json
{
  "id": "string",
  "userId": "string",
  "recommendation": {
    "portfolio": [
      {
        "type": "stocks|bonds|etf|crypto",
        "allocation": "number",
        "description": "string",
        "reasoning": "string"
      }
    ],
    "riskLevel": "low|medium|high",
    "expectedReturn": "number",
    "timeframe": "string",
    "nextSteps": ["string"]
  },
  "createdAt": "datetime"
}
```

### GET /recommendations
Récupérer l'historique des recommandations

**Headers:** Authorization required

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response 200:**
```json
{
  "recommendations": [
    {
      "id": "string",
      "recommendation": {
        "portfolio": [
          {
            "type": "stocks|bonds|etf|crypto",
            "allocation": "number",
            "description": "string",
            "reasoning": "string"
          }
        ],
        "riskLevel": "low|medium|high",
        "expectedReturn": "number",
        "timeframe": "string",
        "nextSteps": ["string"]
      },
      "createdAt": "datetime"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number"
  }
}
```

### GET /recommendations/:id
Récupérer une recommandation spécifique

**Headers:** Authorization required

**Response 200:**
```json
{
  "id": "string",
  "userId": "string",
  "recommendation": {
    "portfolio": [
      {
        "type": "stocks|bonds|etf|crypto",
        "allocation": "number",
        "description": "string",
        "reasoning": "string"
      }
    ],
    "riskLevel": "low|medium|high",
    "expectedReturn": "number",
    "timeframe": "string",
    "nextSteps": ["string"]
  },
  "createdAt": "datetime"
}
```

## Routes Forum/Commentaires

### GET /comments
Récupérer tous les commentaires

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `videoId` (string, optional)

**Response 200:**
```json
{
  "comments": [
    {
      "id": "string",
      "text": "string",
      "userId": "string",
      "user": {
        "firstName": "string",
        "lastName": "string"
      },
      "videoId": "string",
      "likes": "number",
      "replies": "number",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number"
  }
}
```

### POST /comments
Créer un nouveau commentaire

**Headers:** Authorization required

**Body:**
```json
{
  "text": "string",
  "videoId": "string",
  "parentId": "string" // optional pour les réponses
}
```

**Response 201:**
```json
{
  "id": "string",
  "text": "string",
  "userId": "string",
  "user": {
    "firstName": "string",
    "lastName": "string"
  },
  "videoId": "string",
  "parentId": "string",
  "likes": 0,
  "replies": 0,
  "createdAt": "datetime"
}
```

### PUT /comments/:id
Modifier un commentaire

**Headers:** Authorization required

**Body:**
```json
{
  "text": "string"
}
```

**Response 200:**
```json
{
  "id": "string",
  "text": "string",
  "userId": "string",
  "updatedAt": "datetime"
}
```

### DELETE /comments/:id
Supprimer un commentaire

**Headers:** Authorization required

**Response 200:**
```json
{
  "message": "Comment deleted successfully"
}
```

### POST /comments/:id/like
Liker/déliker un commentaire

**Headers:** Authorization required

**Response 200:**
```json
{
  "message": "Like toggled",
  "likes": "number",
  "isLiked": "boolean"
}
```

### GET /comments/:id/replies
Récupérer les réponses d'un commentaire

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response 200:**
```json
{
  "replies": [
    {
      "id": "string",
      "text": "string",
      "userId": "string",
      "user": {
        "firstName": "string",
        "lastName": "string"
      },
      "parentId": "string",
      "likes": "number",
      "createdAt": "datetime"
    }
  ]
}
```

## Routes Admin

### GET /admin/stats
Récupérer les statistiques générales

**Headers:** Authorization required (admin role)

**Response 200:**
```json
{
  "users": {
    "total": "number",
    "newThisMonth": "number",
    "growth": "number"
  },
  "videos": {
    "total": "number",
    "totalViews": "number",
    "newThisMonth": "number"
  },
  "comments": {
    "total": "number",
    "newThisMonth": "number"
  },
  "recommendations": {
    "total": "number",
    "newThisMonth": "number"
  }
}
```

### GET /admin/users
Récupérer tous les utilisateurs

**Headers:** Authorization required (admin role)

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `search` (string, optional)
- `role` (string, optional)

**Response 200:**
```json
{
  "users": [
    {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "user|admin",
      "isActive": "boolean",
      "lastLogin": "datetime",
      "createdAt": "datetime"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number"
  }
}
```

### PUT /admin/users/:id
Modifier un utilisateur

**Headers:** Authorization required (admin role)

**Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "role": "user|admin",
  "isActive": "boolean"
}
```

**Response 200:**
```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "user|admin",
  "isActive": "boolean",
  "updatedAt": "datetime"
}
```

### DELETE /admin/users/:id
Supprimer un utilisateur

**Headers:** Authorization required (admin role)

**Response 200:**
```json
{
  "message": "User deleted successfully"
}
```

### GET /admin/videos
Récupérer toutes les vidéos (admin)

**Headers:** Authorization required (admin role)

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `search` (string, optional)
- `category` (string, optional)

**Response 200:**
```json
{
  "videos": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "url": "string",
      "thumbnail": "string",
      "category": "string",
      "duration": "number",
      "views": "number",
      "likes": "number",
      "isPublished": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number"
  }
}
```

### POST /admin/videos
Créer une nouvelle vidéo

**Headers:** Authorization required (admin role)

**Body:**
```json
{
  "title": "string",
  "description": "string",
  "url": "string",
  "thumbnail": "string",
  "category": "string",
  "duration": "number",
  "isPublished": "boolean"
}
```

**Response 201:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "url": "string",
  "thumbnail": "string",
  "category": "string",
  "duration": "number",
  "views": 0,
  "likes": 0,
  "isPublished": "boolean",
  "createdAt": "datetime"
}
```

### PUT /admin/videos/:id
Modifier une vidéo

**Headers:** Authorization required (admin role)

**Body:**
```json
{
  "title": "string",
  "description": "string",
  "url": "string",
  "thumbnail": "string",
  "category": "string",
  "duration": "number",
  "isPublished": "boolean"
}
```

**Response 200:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "url": "string",
  "thumbnail": "string",
  "category": "string",
  "duration": "number",
  "views": "number",
  "likes": "number",
  "isPublished": "boolean",
  "updatedAt": "datetime"
}
```

### DELETE /admin/videos/:id
Supprimer une vidéo

**Headers:** Authorization required (admin role)

**Response 200:**
```json
{
  "message": "Video deleted successfully"
}
```

### GET /admin/comments
Récupérer tous les commentaires (admin)

**Headers:** Authorization required (admin role)

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `reported` (boolean, optional)

**Response 200:**
```json
{
  "comments": [
    {
      "id": "string",
      "text": "string",
      "userId": "string",
      "user": {
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      },
      "videoId": "string",
      "video": {
        "title": "string"
      },
      "isReported": "boolean",
      "reportCount": "number",
      "createdAt": "datetime"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number"
  }
}
```

### DELETE /admin/comments/:id
Supprimer un commentaire (admin)

**Headers:** Authorization required (admin role)

**Response 200:**
```json
{
  "message": "Comment deleted successfully"
}
```

## DTOs (Data Transfer Objects)

### UserRegistrationDTO
```typescript
interface UserRegistrationDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

### UserLoginDTO
```typescript
interface UserLoginDTO {
  email: string;
  password: string;
}
```

### UserUpdateDTO
```typescript
interface UserUpdateDTO {
  firstName?: string;
  lastName?: string;
  preferences?: {
    language?: 'fr' | 'en';
    notifications?: boolean;
    theme?: 'light' | 'dark';
  };
}
```

### PasswordChangeDTO
```typescript
interface PasswordChangeDTO {
  currentPassword: string;
  newPassword: string;
}
```

### VideoCreateDTO
```typescript
interface VideoCreateDTO {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  duration: number;
  isPublished?: boolean;
}
```

### VideoUpdateDTO
```typescript
interface VideoUpdateDTO {
  title?: string;
  description?: string;
  url?: string;
  thumbnail?: string;
  category?: string;
  duration?: number;
  isPublished?: boolean;
}
```

### CommentCreateDTO
```typescript
interface CommentCreateDTO {
  text: string;
  videoId?: string;
  parentId?: string;
}
```

### CommentUpdateDTO
```typescript
interface CommentUpdateDTO {
  text: string;
}
```

### RecommendationRequestDTO
```typescript
interface RecommendationRequestDTO {
  budget: number;
  goal: 'retirement' | 'savings' | 'growth' | 'income';
  riskTolerance: 'low' | 'medium' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
  age: number;
  currentInvestments?: string;
}
```

### PaginationDTO
```typescript
interface PaginationDTO {
  page?: number;
  limit?: number;
}
```

### SearchDTO
```typescript
interface SearchDTO extends PaginationDTO {
  search?: string;
  sort?: string;
}
```

## Codes d'erreur

### 400 - Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

### 401 - Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 - Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 - Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 409 - Conflict
```json
{
  "error": "Conflict",
  "message": "Email already exists"
}
```

### 422 - Unprocessable Entity
```json
{
  "error": "Unprocessable Entity",
  "message": "Validation failed",
  "details": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### 500 - Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Exemples d'utilisation

### Inscription et connexion
```javascript
// Inscription
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword',
    firstName: 'John',
    lastName: 'Doe'
  })
});

// Connexion
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword'
  })
});

const { token } = await loginResponse.json();
```

### Récupération des vidéos avec filtres
```javascript
const videosResponse = await fetch('/api/videos?page=1&limit=10&category=stocks&sort=popular', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Génération d'une recommandation
```javascript
const recommendationResponse = await fetch('/api/recommendations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    budget: 10000,
    goal: 'growth',
    riskTolerance: 'medium',
    timeHorizon: 'long',
    age: 30
  })
});
```

### Création d'un commentaire
```javascript
const commentResponse = await fetch('/api/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    text: 'Excellente vidéo, très instructive !',
    videoId: 'video-id-123'
  })
});
```

