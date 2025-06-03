
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, User, Calendar, ArrowRight } from 'lucide-react';
import { TaskData, Attachment } from '@/types/jira';
import AttachmentManager from './AttachmentManager';
import { useToast } from '@/hooks/use-toast';

interface TaskEditorProps {
  originalTask: TaskData | null;
  onCreateClone: (cloneData: Partial<TaskData>) => void;
  isCreating: boolean;
}

const TaskEditor: React.FC<TaskEditorProps> = ({ originalTask, onCreateClone, isCreating }) => {
  const [cloneSummary, setCloneSummary] = useState('');
  const [cloneDescription, setCloneDescription] = useState('');
  const [cloneAttachments, setCloneAttachments] = useState<Attachment[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (originalTask) {
      setCloneSummary(`Clone - ${originalTask.summary}`);
      setCloneDescription(originalTask.description);
      setCloneAttachments([...originalTask.attachments]);
    }
  }, [originalTask]);

  const handleCopySummary = () => {
    if (originalTask) {
      setCloneSummary(originalTask.summary);
      toast({
        title: "Summary Copied",
        description: "Original summary copied to clone",
      });
    }
  };

  const handleCopyDescription = () => {
    if (originalTask) {
      setCloneDescription(originalTask.description);
      toast({
        title: "Description Copied",
        description: "Original description copied to clone",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const draggedText = e.dataTransfer.getData('text/plain');
    if (draggedText && descriptionRef.current) {
      const cursorPosition = descriptionRef.current.selectionStart;
      const textBefore = cloneDescription.substring(0, cursorPosition);
      const textAfter = cloneDescription.substring(cursorPosition);
      setCloneDescription(textBefore + draggedText + textAfter);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setCloneAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleAddAttachment = (file: File) => {
    const newAttachment: Attachment = {
      id: `new-${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      mimeType: file.type
    };
    setCloneAttachments(prev => [...prev, newAttachment]);
    toast({
      title: "Attachment Added",
      description: `${file.name} will be uploaded with the cloned task`,
    });
  };

  const handleCreateClone = () => {
    if (!cloneSummary.trim()) {
      toast({
        title: "Summary Required",
        description: "Please enter a summary for the cloned task",
        variant: "destructive",
      });
      return;
    }

    const cloneData: Partial<TaskData> = {
      summary: cloneSummary,
      description: cloneDescription,
      attachments: cloneAttachments,
      project: originalTask?.project,
      issueType: originalTask?.issueType || 'Story',
      priority: originalTask?.priority || 'Medium'
    };

    onCreateClone(cloneData);
  };

  if (!originalTask) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="max-w-md mx-auto">
          <ArrowRight className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Import a Task to Get Started</h3>
          <p className="text-sm">Enter a JIRA task ID above to begin cloning tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Original Task Panel */}
      <div className="jira-panel">
        <div className="jira-panel-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Original Task</h3>
            <Badge className="task-badge">{originalTask.id}</Badge>
          </div>
        </div>
        <div className="jira-panel-content">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Summary</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopySummary}
                  className="text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="text-sm">{originalTask.summary}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Description</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyDescription}
                  className="text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-3 bg-gray-50 rounded-md border max-h-48 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {originalTask.description}
                </pre>
              </div>
            </div>

            <AttachmentManager
              attachments={originalTask.attachments}
              readonly={true}
            />

            <div className="flex items-center gap-4 pt-2 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                {originalTask.assignee}
              </div>
              <Badge variant="secondary">{originalTask.status}</Badge>
              <Badge variant="outline">{originalTask.priority}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Clone Task Panel */}
      <div className={`jira-panel clone-panel ${dragOver ? 'drag-over' : ''}`}>
        <div className="jira-panel-header">
          <h3 className="text-lg font-semibold text-gray-900">New Task (Clone)</h3>
        </div>
        <div className="jira-panel-content">
          <div className="space-y-4">
            <div>
              <Label htmlFor="clone-summary" className="text-sm font-medium">
                Summary *
              </Label>
              <Input
                id="clone-summary"
                value={cloneSummary}
                onChange={(e) => setCloneSummary(e.target.value)}
                placeholder="Enter task summary..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="clone-description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="clone-description"
                ref={descriptionRef}
                value={cloneDescription}
                onChange={(e) => setCloneDescription(e.target.value)}
                placeholder="Enter task description..."
                rows={8}
                className="mt-1 resize-none"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            </div>

            <AttachmentManager
              attachments={cloneAttachments}
              onRemoveAttachment={handleRemoveAttachment}
              onAddAttachment={handleAddAttachment}
              readonly={false}
            />
          </div>
        </div>
      </div>

      {/* Create Clone Button */}
      <div className="lg:col-span-2 flex justify-center pt-6">
        <Button
          onClick={handleCreateClone}
          disabled={isCreating || !cloneSummary.trim()}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          {isCreating ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating Clone...
            </>
          ) : (
            'Create Clone'
          )}
        </Button>
      </div>
    </div>
  );
};

export default TaskEditor;
