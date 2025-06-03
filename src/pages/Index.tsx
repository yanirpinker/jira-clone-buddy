
import React, { useState } from 'react';
import Header from '@/components/Header';
import TaskImporter from '@/components/TaskImporter';
import TaskEditor from '@/components/TaskEditor';
import SuccessModal from '@/components/SuccessModal';
import { TaskData, CreateResponse } from '@/types/jira';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentTask, setCurrentTask] = useState<TaskData | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [successResponse, setSuccessResponse] = useState<CreateResponse | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { toast } = useToast();

  const handleTaskImported = async (task: TaskData) => {
    setIsImporting(true);
    try {
      // Simulate import processing
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentTask(task);
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateClone = async (cloneData: Partial<TaskData>) => {
    setIsCreating(true);
    console.log('Creating clone with data:', cloneData);

    try {
      // Simulate API call to n8n webhook for task creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful response
      const mockResponse: CreateResponse = {
        success: true,
        newTaskId: `${currentTask?.project}-${Math.floor(Math.random() * 90000) + 10000}`,
        url: `https://glassboxdigital.atlassian.net/browse/${currentTask?.project}-${Math.floor(Math.random() * 90000) + 10000}`,
        message: 'Task cloned successfully'
      };

      setSuccessResponse(mockResponse);
      setShowSuccessModal(true);

      toast({
        title: "Task Cloned Successfully",
        description: `New task ${mockResponse.newTaskId} has been created`,
      });

    } catch (error) {
      console.error('Clone creation error:', error);
      toast({
        title: "Clone Creation Failed",
        description: "Failed to create cloned task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateAnother = () => {
    setCurrentTask(null);
    setSuccessResponse(null);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Clone JIRA Tasks Efficiently
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Import existing JIRA tasks, customize them in our intuitive editor, 
              and create new cloned tasks with just a few clicks.
            </p>
          </div>

          <TaskImporter
            onTaskImported={handleTaskImported}
            isLoading={isImporting}
          />

          <TaskEditor
            originalTask={currentTask}
            onCreateClone={handleCreateClone}
            isCreating={isCreating}
          />
        </div>
      </main>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        response={successResponse}
        onCreateAnother={handleCreateAnother}
      />
    </div>
  );
};

export default Index;
