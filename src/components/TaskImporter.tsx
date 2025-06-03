
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, Download, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TaskData } from '@/types/jira';

interface TaskImporterProps {
  onTaskImported: (task: TaskData) => void;
  isLoading: boolean;
}

const TaskImporter: React.FC<TaskImporterProps> = ({ onTaskImported, isLoading }) => {
  const [taskId, setTaskId] = useState('');
  const [copyAttachments, setCopyAttachments] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!taskId.trim()) {
      toast({
        title: "Task ID Required",
        description: "Please enter a valid JIRA task ID (e.g., GLAS30-28922)",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Importing task:', taskId);
      
      // Simulate API call for now - replace with actual n8n webhook
      const mockTaskData: TaskData = {
        id: taskId,
        summary: `Example task: ${taskId}`,
        description: `This is a sample description for task ${taskId}.\n\nIt contains multiple lines and formatting that will be cloned.`,
        project: taskId.split('-')[0] || 'PROJECT',
        assignee: 'john.doe@example.com',
        status: 'In Progress',
        attachments: [
          {
            id: '1',
            name: 'requirements.pdf',
            size: '1.2 MB',
            url: '#',
            mimeType: 'application/pdf'
          },
          {
            id: '2',
            name: 'screenshot.png',
            size: '245 KB',
            url: '#',
            mimeType: 'image/png'
          }
        ],
        issueType: 'Story',
        priority: 'Medium',
        labels: ['frontend', 'react'],
        components: ['UI', 'Components']
      };

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onTaskImported(mockTaskData);
      
      toast({
        title: "Task Imported Successfully",
        description: `Task ${taskId} has been loaded and ready for cloning.`,
      });
      
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import task. Please check the task ID and try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleImport();
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          Import JIRA Task
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="taskId">Task ID</Label>
            <Input
              id="taskId"
              placeholder="Enter JIRA task ID (e.g., GLAS30-28922)"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={handleImport} 
            disabled={isLoading || !taskId.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              'Import Task'
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {showAdvanced && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="copyAttachments"
                checked={copyAttachments}
                onCheckedChange={(checked) => setCopyAttachments(checked as boolean)}
              />
              <Label htmlFor="copyAttachments" className="text-sm">
                Copy attachments to cloned task
              </Label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskImporter;
