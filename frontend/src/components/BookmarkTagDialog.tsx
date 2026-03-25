import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tag, Plus, Check, Folder } from 'lucide-react';

interface BookmarkTagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTag: (tagName: string) => void;
  existingTags: string[];
  expertName: string;
}

export function BookmarkTagDialog({ 
  isOpen, 
  onClose, 
  onSelectTag, 
  existingTags,
  expertName 
}: BookmarkTagDialogProps) {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleSelectExisting = (tagName: string) => {
    setSelectedTag(tagName);
  };

  const handleCreateNew = () => {
    if (newTagName.trim()) {
      onSelectTag(newTagName.trim());
      setNewTagName('');
      setIsCreatingNew(false);
      onClose();
    }
  };

  const handleConfirmSelection = () => {
    if (selectedTag) {
      onSelectTag(selectedTag);
      setSelectedTag(null);
      onClose();
    }
  };

  const handleCancel = () => {
    setIsCreatingNew(false);
    setNewTagName('');
    setSelectedTag(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1B1B1B] flex items-center gap-2">
            <Tag className="w-6 h-6 text-blue-600" />
            Save to Collection
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            Organize <span className="font-semibold">{expertName}</span> into a collection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Create New Tag Section */}
          {!isCreatingNew && (
            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#A8FF36] hover:bg-gray-50 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#A8FF36] bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                <Plus className="w-5 h-5 text-[#1B1B1B]" />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-[#1B1B1B]">
                Create new collection
              </span>
            </button>
          )}

          {isCreatingNew && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="e.g., UI/UX Experts, Branding for Indrajal"
                  className="flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateNew();
                    } else if (e.key === 'Escape') {
                      setIsCreatingNew(false);
                      setNewTagName('');
                    }
                  }}
                />
                <Button
                  onClick={handleCreateNew}
                  disabled={!newTagName.trim()}
                  className="bg-[#A8FF36] text-[#1B1B1B] hover:bg-[#98EF26]"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setNewTagName('');
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Existing Tags */}
          {existingTags.length > 0 && (
            <>
              <div className="flex items-center gap-2 mt-6">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Your Collections</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {existingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSelectExisting(tag)}
                    className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all ${
                      selectedTag === tag
                        ? 'border-[#A8FF36] bg-[#A8FF36] bg-opacity-10'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedTag === tag ? 'bg-[#A8FF36] bg-opacity-30' : 'bg-gray-100'
                      }`}>
                        <Folder className={`w-5 h-5 ${
                          selectedTag === tag ? 'text-[#1B1B1B]' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className={`font-semibold ${
                        selectedTag === tag ? 'text-[#1B1B1B]' : 'text-gray-700'
                      }`}>
                        {tag}
                      </span>
                    </div>
                    {selectedTag === tag && (
                      <Check className="w-5 h-5 text-[#1B1B1B]" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {existingTags.length === 0 && !isCreatingNew && (
            <div className="text-center py-6 text-gray-500 text-sm">
              Create your first collection to get started
            </div>
          )}
        </div>

        {selectedTag && (
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSelection}
              className="flex-1 bg-[#A8FF36] text-[#1B1B1B] hover:bg-[#98EF26]"
            >
              Save to "{selectedTag}"
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}