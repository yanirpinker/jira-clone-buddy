
export interface TaskData {
  id: string;
  summary: string;
  description: string;
  project: string;
  assignee: string;
  status: string;
  attachments: Attachment[];
  issueType?: string;
  priority?: string;
  labels?: string[];
  components?: string[];
  created?: string;
  updated?: string;
}

export interface Attachment {
  id?: string;
  name: string;
  size: string;
  url?: string;
  mimeType?: string;
  author?: string;
  created?: string;
}

export interface ImportTaskRequest {
  action: 'import_task';
  taskId: string;
}

export interface CreateTaskRequest {
  action: 'create_task';
  taskData: {
    project_key: string;
    summary: string;
    description: string;
    issue_type: string;
    assignee?: string;
    priority?: string;
    labels?: string[];
    components?: string[];
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ImportResponse extends ApiResponse {
  task?: TaskData;
}

export interface CreateResponse extends ApiResponse {
  newTaskId?: string;
  url?: string;
}

export interface CloneFormData {
  summary: string;
  description: string;
  assignee: string;
  priority: string;
  labels: string[];
  components: string[];
  copyAttachments: boolean;
}
