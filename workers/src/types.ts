// Response types for API
export interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// Work types
export interface WorkResponse {
  id: number;
  title: string;
  description: string;
  imgUrl: string | null;
  imgLink: string | null;
  content: string | null;
  tags: string; // JSON string
  gitHubUrl: string | null;
  gitPageUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CreateWorkRequest {
  title: string;
  description: string;
  imgUrl?: string;
  imgLink?: string;
  content?: string;
  tags?: string[];
  gitHubUrl?: string;
  gitPageUrl?: string;
}

export interface UpdateWorkRequest extends Partial<CreateWorkRequest> {}

// Skill types
export interface SkillResponse {
  id: number;
  title: string;
  icon: string;
  details: string; // JSON string
  order: number | null;
}

// Social media types
export interface SocialResponse {
  id: number;
  name: string;
  link: string;
  order: number | null;
}

// Self content types
export interface SelfContentResponse {
  id: number;
  briefIntro: string | null;
  about: string | null;
  hashTags: string; // JSON string
}
