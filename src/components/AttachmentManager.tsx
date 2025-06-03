
import React from 'react';
import { Button } from '@/components/ui/button';
import { File, X, Upload } from 'lucide-react';
import { Attachment } from '@/types/jira';

interface AttachmentManagerProps {
  attachments: Attachment[];
  onRemoveAttachment?: (id: string) => void;
  onAddAttachment?: (file: File) => void;
  readonly?: boolean;
  className?: string;
}

const AttachmentManager: React.FC<AttachmentManagerProps> = ({
  attachments,
  onRemoveAttachment,
  onAddAttachment,
  readonly = false,
  className = ''
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAddAttachment) {
      onAddAttachment(file);
    }
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const getFileIcon = (mimeType?: string) => {
    return <File className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          Attachments ({attachments.length})
        </h4>
        {!readonly && (
          <div className="relative">
            <input
              type="file"
              id="attachment-upload"
              className="hidden"
              onChange={handleFileUpload}
              multiple={false}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('attachment-upload')?.click()}
            >
              <Upload className="w-3 h-3 mr-1" />
              Add File
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {attachments.length === 0 ? (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <File className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No attachments</p>
          </div>
        ) : (
          attachments.map((attachment, index) => (
            <div
              key={attachment.id || index}
              className="attachment-item group"
            >
              <div className="flex items-center gap-3 flex-1">
                {getFileIcon(attachment.mimeType)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.size)}
                    {attachment.author && ` • ${attachment.author}`}
                  </p>
                </div>
              </div>
              {!readonly && onRemoveAttachment && attachment.id && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveAttachment(attachment.id!)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttachmentManager;
