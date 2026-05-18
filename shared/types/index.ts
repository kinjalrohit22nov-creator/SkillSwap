// User & Auth
export interface User {
  id: string
  email: string
  name: string
  university: string
  bio?: string
  avatar?: string
  joinedAt: Date
  updatedAt: Date
}

export interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  university: string
}

// Skills
export interface Skill {
  id: string
  name: string
  category: string
  description?: string
  embedding?: number[]
}

export interface UserSkill {
  userId: string
  skillId: string
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced'
  yearsOfExperience: number
}

// Matching
export interface MatchResult {
  matchedUserId: string
  matchScore: number
  commonSkills: Skill[]
  teachingSkills: Skill[]
  learningSkills: Skill[]
  lastInteracted?: Date
}

export interface MatchRequest {
  userId: string
  limit?: number
  offset?: number
}

// Sessions
export interface Session {
  id: string
  teacherId: string
  learnerId: string
  skillId: string
  startTime: Date
  endTime: Date
  duration: number // in minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  tokensCost: number
  notes?: string
  rating?: number
  review?: string
}

export interface SessionBookingRequest {
  matchedUserId: string
  skillId: string
  duration: number // 30, 60, or 90 minutes
  preferredTime: Date
}

// Tokens/Wallet
export interface Wallet {
  userId: string
  balance: number
  updatedAt: Date
}

export interface Transaction {
  id: string
  userId: string
  type: 'earned' | 'spent' | 'purchased'
  amount: number
  description: string
  sessionId?: string
  createdAt: Date
}

export interface TokenTopUpRequest {
  packageSize: 10 | 25 | 50 // token amounts
  paymentMethodId: string
}

// Roadmaps (AI-generated)
export interface LearningRoadmap {
  id: string
  userId: string
  skillId: string
  objective: string
  milestones: Milestone[]
  estimatedWeeks: number
  generatedAt: Date
}

export interface Milestone {
  id: string
  title: string
  description: string
  dueDate: Date
  status: 'pending' | 'in-progress' | 'completed'
  resources: string[]
}

// Reviews
export interface Review {
  id: string
  reviewerId: string
  revieweeId: string
  sessionId: string
  rating: number // 1-5
  comment: string
  createdAt: Date
}
