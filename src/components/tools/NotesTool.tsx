import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, FileText, Check, Search } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "devtools-notes";

const NotesTool = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaved, setIsSaved] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  // Load notes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotes(parsed);
      } catch {
        console.error("Failed to parse notes from storage");
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // Auto-save with debounce
  const saveNote = useCallback(() => {
    if (!selectedNote) return;

    const updatedNote: Note = {
      ...selectedNote,
      title: title || "Untitled Note",
      content,
      updatedAt: Date.now(),
    };

    setNotes((prev) =>
      prev.map((n) => (n.id === selectedNote.id ? updatedNote : n))
    );
    setSelectedNote(updatedNote);
    setIsSaved(true);
  }, [selectedNote, title, content]);

  // Auto-save effect with debounce
  useEffect(() => {
    if (!selectedNote) return;
    
    setIsSaved(false);
    const timer = setTimeout(() => {
      saveNote();
    }, 500);

    return () => clearTimeout(timer);
  }, [title, content]);

  const createNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNote(newNote);
    setTitle(newNote.title);
    setContent(newNote.content);
    setIsSaved(true);
    toast.success("New note created");
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsSaved(true);
  };

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setTitle("");
      setContent("");
    }
    toast.success("Note deleted");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 h-[500px]">
        {/* Notes List */}
        <div className="w-1/3 border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border bg-muted/30 space-y-2">
            <Button onClick={createNewNote} className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="h-8 pl-7 text-xs bg-background"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{notes.length === 0 ? "No notes yet" : "No matching notes"}</p>
                <p className="text-xs">{notes.length === 0 ? "Create your first note" : "Try a different search"}</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors group ${
                      selectedNote?.id === note.id ? "bg-primary/10 border-l-2 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {note.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {note.content || "Empty note"}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {formatDate(note.updatedAt)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="flex-1 border border-border rounded-lg overflow-hidden flex flex-col">
          {selectedNote ? (
            <>
              <div className="p-3 border-b border-border bg-muted/30 flex items-center gap-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title..."
                  className="flex-1 bg-background"
                />
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {isSaved ? (
                    <>
                      <Check className="w-3 h-3 text-green-500" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <span>Saving...</span>
                  )}
                </div>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your note..."
                className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 bg-background"
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select a note or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Notes are automatically saved to your browser's local storage
      </div>
    </div>
  );
};

export default NotesTool;
