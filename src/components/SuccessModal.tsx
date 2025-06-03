
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ExternalLink, Copy, RotateCcw } from 'lucide-react';
import { CreateResponse } from '@/types/jira';
import { useToast } from '@/hooks/use-toast';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  response: CreateResponse | null;
  onCreateAnother: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  response,
  onCreateAnother
}) => {
  const { toast } = useToast();

  const handleCopyTaskId = () => {
    if (response?.newTaskId) {
      navigator.clipboard.writeText(response.newTaskId);
      toast({
        title: "Task ID Copied",
        description: `${response.newTaskId} copied to clipboard`,
      });
    }
  };

  const handleCopyUrl = () => {
    if (response?.url) {
      navigator.clipboard.writeText(response.url);
      toast({
        title: "URL Copied",
        description: "JIRA task URL copied to clipboard",
      });
    }
  };

  const handleViewInJira = () => {
    if (response?.url) {
      window.open(response.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCreateAnotherClick = () => {
    onCreateAnother();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Task Cloned Successfully!
          </DialogTitle>
          <DialogDescription>
            Your new JIRA task has been created and is ready for use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {response?.newTaskId && (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800">New Task ID</p>
                <Badge className="bg-green-100 text-green-800 mt-1">
                  {response.newTaskId}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyTaskId}
                className="text-green-600 hover:text-green-700"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}

          {response?.url && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-800">JIRA URL</p>
                <p className="text-xs text-blue-600 truncate mt-1">
                  {response.url}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewInJira}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="text-center py-2">
            <p className="text-sm text-gray-600">
              What would you like to do next?
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleCreateAnotherClick}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Create Another
          </Button>
          {response?.url && (
            <Button
              onClick={handleViewInJira}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View in JIRA
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
